import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;

  // Check if user already exists
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Hash password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Create user
  const result = await query(
    'INSERT INTO users (email, password_hash, name, provider) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
    [email, passwordHash, name, 'local']
  );

  const user = result.rows[0];
  const token = generateToken(user.id);

  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  });
}));

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Find user
  const result = await query(
    'SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = result.rows[0];

  if (!user.is_active) {
    return res.status(401).json({ error: 'Account is deactivated' });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Update last login
  await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

  const token = generateToken(user.id);

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  });
}));

// Get current user profile
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const result = await query(
    'SELECT id, email, name, role, avatar_url, created_at, last_login FROM users WHERE id = $1',
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user: result.rows[0] });
}));

// Update user profile
router.patch('/me', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('avatar_url').optional().isURL()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, avatar_url } = req.body;
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (name) {
    updates.push(`name = $${paramCount++}`);
    values.push(name);
  }

  if (avatar_url) {
    updates.push(`avatar_url = $${paramCount++}`);
    values.push(avatar_url);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  values.push(req.user.id);

  const result = await query(
    `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING id, email, name, role, avatar_url, updated_at`,
    values
  );

  res.json({
    message: 'Profile updated successfully',
    user: result.rows[0]
  });
}));

// Change password
router.patch('/password', authenticateToken, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  // Get current password hash
  const result = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  // Hash new password
  const saltRounds = 12;
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  await query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newPasswordHash, req.user.id]
  );

  res.json({ message: 'Password updated successfully' });
}));

// Refresh token
router.post('/refresh', authenticateToken, asyncHandler(async (req, res) => {
  const newToken = generateToken(req.user.id);
  
  res.json({
    message: 'Token refreshed successfully',
    token: newToken
  });
}));

// Verify token endpoint
router.get('/verify', authenticateToken, asyncHandler(async (req, res) => {
  // If we got here, token is valid
  res.json({
    valid: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    },
  });
}));

export default router;
