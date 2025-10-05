#!/usr/bin/env node

/**
 * Run database migrations on production
 */

import { Client } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigrations() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

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
    const migrationsDir = path.join(__dirname, '../database/migrations');
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
      console.log('✅ No migrations to run');
      return;
    }

    console.log(`🔄 Running ${migrationsToRun.length} migrations...`);

    for (const migration of migrationsToRun) {
      console.log(`Running migration: ${migration.name}`);
      const sql = await fs.readFile(migration.path, 'utf8');
      await client.query(sql);
      await client.query('INSERT INTO migrations (name) VALUES ($1)', [migration.name]);
      console.log(`✅ Migration ${migration.name} completed`);
    }

    console.log('🎉 All migrations completed successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
