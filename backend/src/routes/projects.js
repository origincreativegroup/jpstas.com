import express from 'express';
import { body, validationResult, query as queryValidator } from 'express-validator';
import { query } from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get all projects (public)
router.get('/', [
  queryValidator('status').optional().isIn(['draft', 'published', 'archived']),
  queryValidator('featured').optional().isBoolean(),
  queryValidator('type').optional().isIn(['case-study', 'project', 'experiment']),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 }),
  queryValidator('offset').optional().isInt({ min: 0 })
], optionalAuth, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    status = 'published',
    featured,
    type,
    limit = 20,
    offset = 0,
    search
  } = req.query;

  let whereConditions = ['p.status = $1'];
  let values = [status];
  let paramCount = 1;

  // Only show published projects to non-authenticated users
  if (!req.user) {
    whereConditions.push('p.status = $1');
    values[0] = 'published';
  }

  if (featured !== undefined) {
    paramCount++;
    whereConditions.push(`p.featured = $${paramCount}`);
    values.push(featured === 'true');
  }

  if (type) {
    paramCount++;
    whereConditions.push(`p.type = $${paramCount}`);
    values.push(type);
  }

  if (search) {
    paramCount++;
    whereConditions.push(`(
      p.title ILIKE $${paramCount} OR 
      p.summary ILIKE $${paramCount} OR 
      p.description ILIKE $${paramCount}
    )`);
    values.push(`%${search}%`);
  }

  paramCount++;
  values.push(parseInt(limit));
  paramCount++;
  values.push(parseInt(offset));

  const sql = `
    SELECT 
      p.id,
      p.title,
      p.slug,
      p.role,
      p.summary,
      p.description,
      p.content,
      p.tags,
      p.type,
      p.status,
      p.featured,
      p.order_index,
      p.published_at,
      p.created_at,
      p.updated_at,
      u.name as author_name,
      COALESCE(
        json_agg(
          json_build_object(
            'id', m.id,
            'url', m.file_url,
            'alt', m.alt_text,
            'caption', m.caption,
            'type', m.type,
            'order_index', pm.order_index
          ) ORDER BY pm.order_index
        ) FILTER (WHERE m.id IS NOT NULL), 
        '[]'
      ) as images
    FROM projects p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN project_media pm ON p.id = pm.project_id
    LEFT JOIN media m ON pm.media_id = m.id
    WHERE ${whereConditions.join(' AND ')}
    GROUP BY p.id, u.name
    ORDER BY p.order_index ASC, p.published_at DESC
    LIMIT $${paramCount - 1} OFFSET $${paramCount}
  `;

  const result = await query(sql, values);

  // Get total count for pagination
  const countSql = `
    SELECT COUNT(*) as total
    FROM projects p
    WHERE ${whereConditions.join(' AND ')}
  `;
  const countResult = await query(countSql, values.slice(0, -2));

  res.json({
    projects: result.rows,
    pagination: {
      total: parseInt(countResult.rows[0].total),
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < parseInt(countResult.rows[0].total)
    }
  });
}));

// Get single project by slug
router.get('/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const sql = `
    SELECT 
      p.*,
      u.name as author_name,
      COALESCE(
        json_agg(
          json_build_object(
            'id', m.id,
            'url', m.file_url,
            'alt', m.alt_text,
            'caption', m.caption,
            'type', m.type,
            'order_index', pm.order_index
          ) ORDER BY pm.order_index
        ) FILTER (WHERE m.id IS NOT NULL), 
        '[]'
      ) as images
    FROM projects p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN project_media pm ON p.id = pm.project_id
    LEFT JOIN media m ON pm.media_id = m.id
    WHERE p.slug = $1 ${!req.user ? "AND p.status = 'published'" : ''}
    GROUP BY p.id, u.name
  `;

  const result = await query(sql, [slug]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.json({ project: result.rows[0] });
}));

// Create new project (authenticated)
router.post('/', authenticateToken, [
  body('title').trim().isLength({ min: 1, max: 255 }),
  body('slug').trim().isLength({ min: 1, max: 255 }).matches(/^[a-z0-9-]+$/),
  body('role').optional().trim().isLength({ max: 255 }),
  body('summary').optional().trim().isLength({ max: 500 }),
  body('description').optional().trim(),
  body('content').optional().isObject(),
  body('tags').optional().isArray(),
  body('type').optional().isIn(['case-study', 'project', 'experiment']),
  body('featured').optional().isBoolean(),
  body('order_index').optional().isInt({ min: 0 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    slug,
    role,
    summary,
    description,
    content,
    tags,
    type = 'case-study',
    featured = false,
    order_index = 0
  } = req.body;

  // Check if slug already exists
  const existingProject = await query('SELECT id FROM projects WHERE slug = $1', [slug]);
  if (existingProject.rows.length > 0) {
    return res.status(409).json({ error: 'Project with this slug already exists' });
  }

  const result = await query(
    `INSERT INTO projects (
      user_id, title, slug, role, summary, description, content, tags, type, featured, order_index
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [req.user.id, title, slug, role, summary, description, JSON.stringify(content), tags, type, featured, order_index]
  );

  res.status(201).json({
    message: 'Project created successfully',
    project: result.rows[0]
  });
}));

// Update project (authenticated, owner or admin)
router.patch('/:id', authenticateToken, [
  body('title').optional().trim().isLength({ min: 1, max: 255 }),
  body('slug').optional().trim().isLength({ min: 1, max: 255 }).matches(/^[a-z0-9-]+$/),
  body('role').optional().trim().isLength({ max: 255 }),
  body('summary').optional().trim().isLength({ max: 500 }),
  body('description').optional().trim(),
  body('content').optional().isObject(),
  body('tags').optional().isArray(),
  body('type').optional().isIn(['case-study', 'project', 'experiment']),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('featured').optional().isBoolean(),
  body('order_index').optional().isInt({ min: 0 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const updates = req.body;

  // Check if project exists and user has permission
  const projectResult = await query('SELECT user_id FROM projects WHERE id = $1', [id]);
  if (projectResult.rows.length === 0) {
    return res.status(404).json({ error: 'Project not found' });
  }

  if (projectResult.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permission denied' });
  }

  // Check slug uniqueness if being updated
  if (updates.slug) {
    const existingProject = await query('SELECT id FROM projects WHERE slug = $1 AND id != $2', [updates.slug, id]);
    if (existingProject.rows.length > 0) {
      return res.status(409).json({ error: 'Project with this slug already exists' });
    }
  }

  // Build update query
  const updateFields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updates).forEach(key => {
    if (key === 'content') {
      updateFields.push(`${key} = $${paramCount++}`);
      values.push(JSON.stringify(updates[key]));
    } else {
      updateFields.push(`${key} = $${paramCount++}`);
      values.push(updates[key]);
    }
  });

  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  values.push(id);

  const result = await query(
    `UPDATE projects SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
    values
  );

  res.json({
    message: 'Project updated successfully',
    project: result.rows[0]
  });
}));

// Delete project (authenticated, owner or admin)
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if project exists and user has permission
  const projectResult = await query('SELECT user_id FROM projects WHERE id = $1', [id]);
  if (projectResult.rows.length === 0) {
    return res.status(404).json({ error: 'Project not found' });
  }

  if (projectResult.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permission denied' });
  }

  await query('DELETE FROM projects WHERE id = $1', [id]);

  res.json({ message: 'Project deleted successfully' });
}));

export default router;
