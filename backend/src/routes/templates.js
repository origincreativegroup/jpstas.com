import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * Portfolio Templates Routes
 * Manages portfolio templates for creating case studies and projects
 */

// Get all templates (public + user's custom templates)
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { category, custom_only } = req.query;
  const userId = req.user?.id;

  let whereConditions = ['(is_public = true'];
  let values = [];
  let paramCount = 0;

  // Include user's custom templates if authenticated
  if (userId) {
    paramCount++;
    whereConditions[0] += ` OR user_id = $${paramCount}`;
    values.push(userId);
  }

  whereConditions[0] += ')';

  // Filter by category
  if (category) {
    paramCount++;
    whereConditions.push(`category = $${paramCount}`);
    values.push(category);
  }

  // Filter custom only
  if (custom_only === 'true') {
    whereConditions.push('is_custom = true');
  }

  const sql = `
    SELECT 
      id, name, description, category, thumbnail, sections, 
      default_settings, is_custom, is_public, usage_count,
      created_at, updated_at
    FROM templates
    WHERE ${whereConditions.join(' AND ')}
    ORDER BY is_public DESC, usage_count DESC, created_at DESC
  `;

  const result = await query(sql, values);

  res.json({
    templates: result.rows.map(row => ({
      ...row,
      sections: typeof row.sections === 'string' ? JSON.parse(row.sections) : row.sections,
      defaultSettings: typeof row.default_settings === 'string' ? JSON.parse(row.default_settings) : row.default_settings,
    })),
  });
}));

// Get single template
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const result = await query(
    `SELECT * FROM templates 
     WHERE id = $1 AND (is_public = true OR user_id = $2)`,
    [id, userId || null]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Template not found' });
  }

  const template = result.rows[0];
  res.json({
    template: {
      ...template,
      sections: typeof template.sections === 'string' ? JSON.parse(template.sections) : template.sections,
      defaultSettings: typeof template.default_settings === 'string' ? JSON.parse(template.default_settings) : template.default_settings,
    },
  });
}));

// Create custom template (authenticated)
router.post('/', authenticateToken, [
  body('name').trim().isLength({ min: 1, max: 255 }),
  body('description').trim().isLength({ max: 1000 }),
  body('category').isIn(['case-study', 'project-showcase', 'experiment', 'blog-post', 'landing-page']),
  body('sections').isArray(),
  body('thumbnail').optional().trim().isURL(),
  body('is_public').optional().isBoolean(),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    description,
    category,
    sections,
    thumbnail,
    default_settings,
    is_public = false,
  } = req.body;

  // Only admins can create public templates
  if (is_public && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can create public templates' });
  }

  const result = await query(
    `INSERT INTO templates (
      user_id, name, description, category, thumbnail, sections,
      default_settings, is_custom, is_public
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8)
    RETURNING *`,
    [
      req.user.id,
      name,
      description,
      category,
      thumbnail || null,
      JSON.stringify(sections),
      JSON.stringify(default_settings || {}),
      is_public,
    ]
  );

  res.status(201).json({
    message: 'Template created successfully',
    template: result.rows[0],
  });
}));

// Update custom template (authenticated, owner only)
router.patch('/:id', authenticateToken, [
  body('name').optional().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('sections').optional().isArray(),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const updates = req.body;

  // Check if template exists and user has permission
  const templateResult = await query(
    'SELECT user_id, is_custom FROM templates WHERE id = $1',
    [id]
  );

  if (templateResult.rows.length === 0) {
    return res.status(404).json({ error: 'Template not found' });
  }

  if (!templateResult.rows[0].is_custom) {
    return res.status(403).json({ error: 'Cannot modify system templates' });
  }

  if (templateResult.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permission denied' });
  }

  // Build update query
  const updateFields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updates).forEach(key => {
    if (key === 'sections' || key === 'default_settings') {
      updateFields.push(`${key} = $${paramCount++}`);
      values.push(JSON.stringify(updates[key]));
    } else if (['name', 'description', 'category', 'thumbnail'].includes(key)) {
      updateFields.push(`${key} = $${paramCount++}`);
      values.push(updates[key]);
    }
  });

  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  values.push(id);

  const result = await query(
    `UPDATE templates 
     SET ${updateFields.join(', ')}, updated_at = NOW() 
     WHERE id = $${paramCount}
     RETURNING *`,
    values
  );

  res.json({
    message: 'Template updated successfully',
    template: result.rows[0],
  });
}));

// Delete custom template (authenticated, owner only)
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if template exists and user has permission
  const templateResult = await query(
    'SELECT user_id, is_custom FROM templates WHERE id = $1',
    [id]
  );

  if (templateResult.rows.length === 0) {
    return res.status(404).json({ error: 'Template not found' });
  }

  if (!templateResult.rows[0].is_custom) {
    return res.status(403).json({ error: 'Cannot delete system templates' });
  }

  if (templateResult.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permission denied' });
  }

  await query('DELETE FROM templates WHERE id = $1', [id]);

  res.json({ message: 'Template deleted successfully' });
}));

// Increment template usage count
router.post('/:id/use', asyncHandler(async (req, res) => {
  const { id } = req.params;

  await query(
    'UPDATE templates SET usage_count = usage_count + 1 WHERE id = $1',
    [id]
  );

  res.json({ message: 'Usage count updated' });
}));

export default router;

