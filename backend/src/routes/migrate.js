import express from 'express';
import { Client } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Simple migration endpoint (should be protected in production)
router.post('/run', authenticateToken, requireAdmin, async (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Connected to database for migrations');

    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Get executed migrations
    const executedResult = await client.query('SELECT name FROM migrations ORDER BY id');
    const executedMigrations = new Set(executedResult.rows.map(row => row.name));

    // Get all migrations
    const migrationsDir = path.join(__dirname, '../../database/migrations');
    const files = await fs.readdir(migrationsDir);
    const migrations = files
      .filter(file => file.endsWith('.sql'))
      .sort()
      .map(file => ({
        name: file,
        path: path.join(migrationsDir, file)
      }));

    // Filter migrations to run
    const migrationsToRun = migrations.filter(m => !executedMigrations.has(m.name));

    if (migrationsToRun.length === 0) {
      return res.json({ 
        success: true, 
        message: 'No migrations to run',
        executed: executedMigrations.size
      });
    }

    console.log(`🔄 Running ${migrationsToRun.length} migrations...`);

    const results = [];
    for (const migration of migrationsToRun) {
      console.log(`Running migration: ${migration.name}`);
      const sql = await fs.readFile(migration.path, 'utf8');
      await client.query(sql);
      await client.query('INSERT INTO migrations (name) VALUES ($1)', [migration.name]);
      results.push(migration.name);
      console.log(`✅ Migration ${migration.name} completed`);
    }

    console.log('🎉 All migrations completed successfully');

    res.json({ 
      success: true, 
      message: `Successfully ran ${results.length} migrations`,
      migrations: results,
      executed: executedMigrations.size + results.length
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    await client.end();
  }
});

export default router;
