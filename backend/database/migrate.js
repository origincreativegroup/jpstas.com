#!/usr/bin/env node

/**
 * Database Migration Runner for Neon PostgreSQL
 * 
 * This script runs database migrations in order.
 * Usage: node migrate.js [up|down] [migration_number]
 */

import { Client } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function getMigrations() {
  const files = await fs.readdir(MIGRATIONS_DIR);
  return files
    .filter(file => file.endsWith('.sql'))
    .sort()
    .map(file => ({
      name: file,
      path: path.join(MIGRATIONS_DIR, file)
    }));
}

async function runMigration(migration) {
  console.log(`Running migration: ${migration.name}`);
  const sql = await fs.readFile(migration.path, 'utf8');
  await client.query(sql);
  console.log(`✅ Migration ${migration.name} completed`);
}

async function migrateUp(targetMigration = null) {
  try {
    await client.connect();
    console.log('Connected to database');

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
    const migrations = await getMigrations();
    
    // Filter migrations to run
    let migrationsToRun = migrations.filter(m => !executedMigrations.has(m.name));
    
    if (targetMigration) {
      const targetIndex = migrations.findIndex(m => m.name === targetMigration);
      if (targetIndex === -1) {
        throw new Error(`Migration ${targetMigration} not found`);
      }
      migrationsToRun = migrationsToRun.slice(0, targetIndex + 1);
    }

    if (migrationsToRun.length === 0) {
      console.log('No migrations to run');
      return;
    }

    console.log(`Running ${migrationsToRun.length} migrations...`);

    for (const migration of migrationsToRun) {
      await runMigration(migration);
      await client.query('INSERT INTO migrations (name) VALUES ($1)', [migration.name]);
    }

    console.log('✅ All migrations completed successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

async function migrateDown(targetMigration) {
  try {
    await client.connect();
    console.log('Connected to database');

    if (!targetMigration) {
      throw new Error('Target migration required for rollback');
    }

    // Get executed migrations
    const executedResult = await client.query('SELECT name FROM migrations ORDER BY id DESC');
    const executedMigrations = executedResult.rows.map(row => row.name);

    const targetIndex = executedMigrations.indexOf(targetMigration);
    if (targetIndex === -1) {
      throw new Error(`Migration ${targetMigration} not found in executed migrations`);
    }

    // Rollback migrations (in reverse order)
    const migrationsToRollback = executedMigrations.slice(0, targetIndex + 1);
    
    console.log(`Rolling back ${migrationsToRollback.length} migrations...`);

    for (const migrationName of migrationsToRollback) {
      console.log(`Rolling back: ${migrationName}`);
      // Note: This is a simple rollback - in production you'd want proper down migrations
      await client.query('DELETE FROM migrations WHERE name = $1', [migrationName]);
      console.log(`✅ Rolled back ${migrationName}`);
    }

    console.log('✅ Rollback completed successfully');

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Main execution
const command = process.argv[2];
const target = process.argv[3];

if (command === 'up') {
  migrateUp(target);
} else if (command === 'down') {
  migrateDown(target);
} else {
  console.log('Usage: node migrate.js [up|down] [migration_name]');
  console.log('Examples:');
  console.log('  node migrate.js up                    # Run all pending migrations');
  console.log('  node migrate.js up 001_initial_schema.sql  # Run up to specific migration');
  console.log('  node migrate.js down 001_initial_schema.sql # Rollback to specific migration');
  process.exit(1);
}
