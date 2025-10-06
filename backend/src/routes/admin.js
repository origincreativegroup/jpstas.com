import express from 'express';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create admin user endpoint (should be protected in production)
router.post('/create-admin', authenticateToken, requireAdmin, async (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Connected to database for admin user creation');

    const email = 'johnpstas@jpstas.com';
    const password = 'qidban-wyzcAr-6wawjo';
    const name = 'John P Stas';

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      // Update existing user
      await client.query(
        'UPDATE users SET password_hash = $1, name = $2, role = $3, is_active = $4 WHERE email = $5',
        [passwordHash, name, 'admin', true, email]
      );
      console.log(`✅ Updated existing admin user: ${email}`);
      
      res.json({ 
        success: true, 
        message: 'Admin user updated successfully',
        email: email,
        role: 'admin'
      });
    } else {
      // Create new user
      await client.query(
        'INSERT INTO users (email, password_hash, name, role, provider, is_active) VALUES ($1, $2, $3, $4, $5, $6)',
        [email, passwordHash, name, 'admin', 'local', true]
      );
      console.log(`✅ Created new admin user: ${email}`);
      
      res.json({ 
        success: true, 
        message: 'Admin user created successfully',
        email: email,
        role: 'admin'
      });
    }

  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    await client.end();
  }
});

export default router;
// Diagnostics route: returns environment and connectivity details (admin-only)
router.get('/diagnostics', authenticateToken, requireAdmin, async (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  const startedAt = Date.now();
  let dbOk = false;
  let dbLatencyMs = 0;
  let nowRow = null;

  try {
    await client.connect();
    const t0 = Date.now();
    const result = await client.query('SELECT NOW() as now');
    dbLatencyMs = Date.now() - t0;
    dbOk = true;
    nowRow = result.rows[0]?.now || null;
  } catch (error) {
    dbOk = false;
  } finally {
    try { await client.end(); } catch {}
  }

  res.setHeader('X-Request-Id', req.requestId || '');
  res.json({
    requestId: req.requestId,
    uptimeSeconds: Math.round(process.uptime()),
    nodeVersion: process.version,
    env: process.env.NODE_ENV,
    corsOrigins: (process.env.CORS_ORIGIN || '').split(',').filter(Boolean),
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
    },
    database: {
      ok: dbOk,
      latencyMs: dbLatencyMs,
      now: nowRow,
    },
    process: {
      pid: process.pid,
      memory: process.memoryUsage(),
      startedAt: new Date(Date.now() - Math.round(process.uptime() * 1000)).toISOString(),
      checkedAt: new Date().toISOString(),
      totalHandlingMs: Date.now() - startedAt
    }
  });
});
