import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get all skills
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { category, featured } = req.query;

  let whereCondition = '';
  let values = [];
  let paramCount = 0;

  if (req.user) {
    whereCondition = 'WHERE user_id = $1';
    values.push(req.user.id);
    paramCount = 1;
  } else {
    // For public access, get skills from the default user (admin)
    whereCondition = 'WHERE user_id = (SELECT id FROM users WHERE role = \'admin\' LIMIT 1)';
  }

  if (category) {
    paramCount++;
    whereCondition += ` AND category = $${paramCount}`;
    values.push(category);
  }

  if (featured === 'true') {
    paramCount++;
    whereCondition += ` AND is_featured = $${paramCount}`;
    values.push(true);
  }

  const result = await query(
    `SELECT * FROM skills ${whereCondition} ORDER BY order_index ASC, name ASC`,
    values
  );

  res.json({ skills: result.rows });
}));

// Get single skill
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;

  let whereCondition = 'WHERE id = $1';
  let values = [id];

  if (req.user) {
    whereCondition += ' AND user_id = $2';
    values.push(req.user.id);
  } else {
    whereCondition += ' AND user_id = (SELECT id FROM users WHERE role = \'admin\' LIMIT 1)';
  }

  const result = await query(
    `SELECT * FROM skills ${whereCondition}`,
    values
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Skill not found' });
  }

  res.json({ skill: result.rows[0] });
}));

// Create new skill
router.post('/', authenticateToken, [
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('category').optional().trim().isLength({ max: 50 }),
  body('proficiency').optional().isInt({ min: 1, max: 5 }),
  body('order_index').optional().isInt({ min: 0 }),
  body('is_featured').optional().isBoolean()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    category,
    proficiency = 1,
    order_index = 0,
    is_featured = false
  } = req.body;

  // Check if skill already exists for this user
  const existingSkill = await query(
    'SELECT id FROM skills WHERE name = $1 AND user_id = $2',
    [name, req.user.id]
  );

  if (existingSkill.rows.length > 0) {
    return res.status(409).json({ error: 'Skill already exists' });
  }

  const result = await query(
    `INSERT INTO skills (user_id, name, category, proficiency, order_index, is_featured)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [req.user.id, name, category, proficiency, order_index, is_featured]
  );

  res.status(201).json({
    message: 'Skill created successfully',
    skill: result.rows[0]
  });
}));

// Update skill
router.patch('/:id', authenticateToken, [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('category').optional().trim().isLength({ max: 50 }),
  body('proficiency').optional().isInt({ min: 1, max: 5 }),
  body('order_index').optional().isInt({ min: 0 }),
  body('is_featured').optional().isBoolean()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const updates = req.body;

  // Check if skill exists and user has permission
  const skillResult = await query('SELECT user_id FROM skills WHERE id = $1', [id]);
  if (skillResult.rows.length === 0) {
    return res.status(404).json({ error: 'Skill not found' });
  }

  if (skillResult.rows[0].user_id !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  // Check name uniqueness if being updated
  if (updates.name) {
    const existingSkill = await query(
      'SELECT id FROM skills WHERE name = $1 AND user_id = $2 AND id != $3',
      [updates.name, req.user.id, id]
    );
    if (existingSkill.rows.length > 0) {
      return res.status(409).json({ error: 'Skill with this name already exists' });
    }
  }

  // Build update query
  const updateFields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updates).forEach(key => {
    updateFields.push(`${key} = $${paramCount++}`);
    values.push(updates[key]);
  });

  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  values.push(id);

  const result = await query(
    `UPDATE skills SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
    values
  );

  res.json({
    message: 'Skill updated successfully',
    skill: result.rows[0]
  });
}));

// Delete skill
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if skill exists and user has permission
  const skillResult = await query('SELECT user_id FROM skills WHERE id = $1', [id]);
  if (skillResult.rows.length === 0) {
    return res.status(404).json({ error: 'Skill not found' });
  }

  if (skillResult.rows[0].user_id !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  await query('DELETE FROM skills WHERE id = $1', [id]);

  res.json({ message: 'Skill deleted successfully' });
}));

// Bulk update skills
router.put('/bulk', authenticateToken, [
  body('skills').isArray(),
  body('skills.*.id').optional().isUUID(),
  body('skills.*.name').isString().isLength({ min: 1, max: 100 }),
  body('skills.*.category').optional().isString().isLength({ max: 50 }),
  body('skills.*.proficiency').optional().isInt({ min: 1, max: 5 }),
  body('skills.*.order_index').optional().isInt({ min: 0 }),
  body('skills.*.is_featured').optional().isBoolean()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { skills } = req.body;
  const results = [];

  // Delete existing skills for this user
  await query('DELETE FROM skills WHERE user_id = $1', [req.user.id]);

  // Insert new skills
  for (const skill of skills) {
    const {
      name,
      category,
      proficiency = 1,
      order_index = 0,
      is_featured = false
    } = skill;

    const result = await query(
      `INSERT INTO skills (user_id, name, category, proficiency, order_index, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, name, category, proficiency, order_index, is_featured]
    );

    results.push(result.rows[0]);
  }

  res.json({
    message: 'Skills updated successfully',
    skills: results
  });
}));

// Get skill categories
router.get('/categories/list', optionalAuth, asyncHandler(async (req, res) => {
  let whereCondition = '';
  let values = [];

  if (req.user) {
    whereCondition = 'WHERE user_id = $1';
    values.push(req.user.id);
  } else {
    whereCondition = 'WHERE user_id = (SELECT id FROM users WHERE role = \'admin\' LIMIT 1)';
  }

  const result = await query(
    `SELECT DISTINCT category FROM skills ${whereCondition} AND category IS NOT NULL ORDER BY category`,
    values
  );

  const categories = result.rows.map(row => row.category);

  res.json({ categories });
}));

export default router;
