import express from 'express';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Create admin user endpoint (should be protected in production)
router.post('/create-admin', async (req, res) => {
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
