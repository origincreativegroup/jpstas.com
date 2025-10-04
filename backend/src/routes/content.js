import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get all content sections
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { published } = req.query;
  
  let whereCondition = '';
  let values = [];
  
  if (published === 'true' || !req.user) {
    whereCondition = 'WHERE is_published = true';
  } else if (req.user) {
    whereCondition = 'WHERE user_id = $1';
    values = [req.user.id];
  }

  const sql = `
    SELECT 
      cs.*,
      u.name as author_name
    FROM content_sections cs
    LEFT JOIN users u ON cs.user_id = u.id
    ${whereCondition}
    ORDER BY cs.section_key
  `;

  const result = await query(sql, values);

  // Transform to object format
  const sections = {};
  result.rows.forEach(row => {
    sections[row.section_key] = {
      id: row.id,
      title: row.title,
      content: row.content,
      is_published: row.is_published,
      version: row.version,
      updated_at: row.updated_at,
      author_name: row.author_name
    };
  });

  res.json({ sections });
}));

// Get single content section
router.get('/:key', optionalAuth, asyncHandler(async (req, res) => {
  const { key } = req.params;
  
  let whereCondition = 'WHERE section_key = $1';
  let values = [key];
  
  if (!req.user) {
    whereCondition += ' AND is_published = true';
  } else {
    whereCondition += ' AND user_id = $2';
    values.push(req.user.id);
  }

  const result = await query(
    `SELECT * FROM content_sections ${whereCondition}`,
    values
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Content section not found' });
  }

  res.json({ section: result.rows[0] });
}));

// Create or update content section
router.put('/:key', authenticateToken, [
  body('title').optional().trim().isLength({ max: 255 }),
  body('content').isObject(),
  body('is_published').optional().isBoolean()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { key } = req.params;
  const { title, content, is_published = false } = req.body;

  // Check if section exists
  const existingResult = await query(
    'SELECT id, version FROM content_sections WHERE section_key = $1 AND user_id = $2',
    [key, req.user.id]
  );

  if (existingResult.rows.length > 0) {
    // Update existing section
    const newVersion = existingResult.rows[0].version + 1;
    
    const result = await query(
      `UPDATE content_sections 
       SET title = $1, content = $2, is_published = $3, version = $4, updated_at = NOW()
       WHERE section_key = $5 AND user_id = $6
       RETURNING *`,
      [title, JSON.stringify(content), is_published, newVersion, key, req.user.id]
    );

    res.json({
      message: 'Content section updated successfully',
      section: result.rows[0]
    });
  } else {
    // Create new section
    const result = await query(
      `INSERT INTO content_sections (user_id, section_key, title, content, is_published)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, key, title, JSON.stringify(content), is_published]
    );

    res.status(201).json({
      message: 'Content section created successfully',
      section: result.rows[0]
    });
  }
}));

// Publish content section
router.patch('/:key/publish', authenticateToken, asyncHandler(async (req, res) => {
  const { key } = req.params;

  const result = await query(
    `UPDATE content_sections 
     SET is_published = true, updated_at = NOW()
     WHERE section_key = $1 AND user_id = $2
     RETURNING *`,
    [key, req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Content section not found' });
  }

  res.json({
    message: 'Content section published successfully',
    section: result.rows[0]
  });
}));

// Unpublish content section
router.patch('/:key/unpublish', authenticateToken, asyncHandler(async (req, res) => {
  const { key } = req.params;

  const result = await query(
    `UPDATE content_sections 
     SET is_published = false, updated_at = NOW()
     WHERE section_key = $1 AND user_id = $2
     RETURNING *`,
    [key, req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Content section not found' });
  }

  res.json({
    message: 'Content section unpublished successfully',
    section: result.rows[0]
  });
}));

// Delete content section
router.delete('/:key', authenticateToken, asyncHandler(async (req, res) => {
  const { key } = req.params;

  const result = await query(
    'DELETE FROM content_sections WHERE section_key = $1 AND user_id = $2 RETURNING *',
    [key, req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Content section not found' });
  }

  res.json({ message: 'Content section deleted successfully' });
}));

// Bulk update content sections
router.put('/bulk', authenticateToken, [
  body('sections').isArray(),
  body('sections.*.key').isString(),
  body('sections.*.title').optional().isString(),
  body('sections.*.content').isObject(),
  body('sections.*.is_published').optional().isBoolean()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { sections } = req.body;
  const results = [];

  for (const section of sections) {
    const { key, title, content, is_published = false } = section;

    // Check if section exists
    const existingResult = await query(
      'SELECT id, version FROM content_sections WHERE section_key = $1 AND user_id = $2',
      [key, req.user.id]
    );

    if (existingResult.rows.length > 0) {
      // Update existing
      const newVersion = existingResult.rows[0].version + 1;
      const result = await query(
        `UPDATE content_sections 
         SET title = $1, content = $2, is_published = $3, version = $4, updated_at = NOW()
         WHERE section_key = $5 AND user_id = $6
         RETURNING *`,
        [title, JSON.stringify(content), is_published, newVersion, key, req.user.id]
      );
      results.push(result.rows[0]);
    } else {
      // Create new
      const result = await query(
        `INSERT INTO content_sections (user_id, section_key, title, content, is_published)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [req.user.id, key, title, JSON.stringify(content), is_published]
      );
      results.push(result.rows[0]);
    }
  }

  res.json({
    message: 'Content sections updated successfully',
    sections: results
  });
}));

export default router;
