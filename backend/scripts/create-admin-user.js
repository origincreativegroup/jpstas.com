#!/usr/bin/env node

/**
 * Create admin user with specific credentials
 */

import { Client } from 'pg';
import bcrypt from 'bcryptjs';

// Load environment variables
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createAdminUser() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Get credentials from environment variables
    const email = process.env.ADMIN_EMAIL || 'johnpstas@jpstas.com';
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || 'John P Stas';

    if (!password) {
      console.error('❌ ADMIN_PASSWORD environment variable is required');
      process.exit(1);
    }

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
    } else {
      // Create new user
      await client.query(
        'INSERT INTO users (email, password_hash, name, role, provider, is_active) VALUES ($1, $2, $3, $4, $5, $6)',
        [email, passwordHash, name, 'admin', 'local', true]
      );
      console.log(`✅ Created new admin user: ${email}`);
    }

    console.log('🎉 Admin user setup complete');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: admin`);

  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAdminUser();
