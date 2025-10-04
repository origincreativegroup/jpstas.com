import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get all media files
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const { project_id, type, limit = 50, offset = 0 } = req.query;

  let whereConditions = ['m.user_id = $1'];
  let values = [req.user.id];
  let paramCount = 1;

  if (project_id) {
    paramCount++;
    whereConditions.push(`m.project_id = $${paramCount}`);
    values.push(project_id);
  }

  if (type) {
    paramCount++;
    whereConditions.push(`m.type = $${paramCount}`);
    values.push(type);
  }

  paramCount++;
  values.push(parseInt(limit));
  paramCount++;
  values.push(parseInt(offset));

  const sql = `
    SELECT 
      m.*,
      p.title as project_title,
      p.slug as project_slug
    FROM media m
    LEFT JOIN projects p ON m.project_id = p.id
    WHERE ${whereConditions.join(' AND ')}
    ORDER BY m.created_at DESC
    LIMIT $${paramCount - 1} OFFSET $${paramCount}
  `;

  const result = await query(sql, values);

  // Get total count
  const countSql = `
    SELECT COUNT(*) as total
    FROM media m
    WHERE ${whereConditions.join(' AND ')}
  `;
  const countResult = await query(countSql, values.slice(0, -2));

  res.json({
    media: result.rows,
    pagination: {
      total: parseInt(countResult.rows[0].total),
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < parseInt(countResult.rows[0].total)
    }
  });
}));

// Get single media file
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query(
    'SELECT * FROM media WHERE id = $1 AND user_id = $2',
    [id, req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Media file not found' });
  }

  res.json({ media: result.rows[0] });
}));

// Upload media file
router.post('/upload', authenticateToken, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { project_id, alt_text, caption } = req.body;
  const file = req.file;

  // Generate unique filename
  const fileExtension = path.extname(file.originalname);
  const filename = `${uuidv4()}${fileExtension}`;
  const uploadDir = process.env.UPLOAD_DIR || './uploads';
  const filePath = path.join(uploadDir, filename);

  // Ensure upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  let processedFile = file.buffer;
  let metadata = {};

  // Process image files
  if (file.mimetype.startsWith('image/')) {
    try {
      const imageInfo = await sharp(file.buffer).metadata();
      metadata = {
        width: imageInfo.width,
        height: imageInfo.height,
        format: imageInfo.format,
        size: imageInfo.size
      };

      // Resize large images
      if (imageInfo.width > 1920 || imageInfo.height > 1080) {
        processedFile = await sharp(file.buffer)
          .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
      }
    } catch (error) {
      console.error('Image processing error:', error);
    }
  }

  // Save file
  await fs.writeFile(filePath, processedFile);

  // Determine file type
  let fileType = 'document';
  if (file.mimetype.startsWith('image/')) {
    fileType = 'image';
  } else if (file.mimetype.startsWith('video/')) {
    fileType = 'video';
  } else if (file.mimetype.startsWith('audio/')) {
    fileType = 'audio';
  }

  // Save to database
  const result = await query(
    `INSERT INTO media (
      user_id, project_id, filename, original_filename, file_path, file_url, 
      file_size, mime_type, width, height, alt_text, caption, type, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *`,
    [
      req.user.id,
      project_id || null,
      filename,
      file.originalname,
      filePath,
      `/uploads/${filename}`,
      processedFile.length,
      file.mimetype,
      metadata.width || null,
      metadata.height || null,
      alt_text || null,
      caption || null,
      fileType,
      JSON.stringify(metadata)
    ]
  );

  res.status(201).json({
    message: 'File uploaded successfully',
    media: result.rows[0]
  });
}));

// Update media file metadata
router.patch('/:id', authenticateToken, [
  body('alt_text').optional().trim().isLength({ max: 500 }),
  body('caption').optional().trim().isLength({ max: 1000 }),
  body('project_id').optional().isUUID()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { alt_text, caption, project_id } = req.body;

  // Check if media exists and user has permission
  const mediaResult = await query('SELECT user_id FROM media WHERE id = $1', [id]);
  if (mediaResult.rows.length === 0) {
    return res.status(404).json({ error: 'Media file not found' });
  }

  if (mediaResult.rows[0].user_id !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  const updates = [];
  const values = [];
  let paramCount = 1;

  if (alt_text !== undefined) {
    updates.push(`alt_text = $${paramCount++}`);
    values.push(alt_text);
  }

  if (caption !== undefined) {
    updates.push(`caption = $${paramCount++}`);
    values.push(caption);
  }

  if (project_id !== undefined) {
    updates.push(`project_id = $${paramCount++}`);
    values.push(project_id);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  values.push(id);

  const result = await query(
    `UPDATE media SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
    values
  );

  res.json({
    message: 'Media updated successfully',
    media: result.rows[0]
  });
}));

// Delete media file
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get media file info
  const mediaResult = await query('SELECT * FROM media WHERE id = $1 AND user_id = $2', [id, req.user.id]);
  if (mediaResult.rows.length === 0) {
    return res.status(404).json({ error: 'Media file not found' });
  }

  const media = mediaResult.rows[0];

  // Delete file from filesystem
  try {
    await fs.unlink(media.file_path);
  } catch (error) {
    console.error('Error deleting file:', error);
  }

  // Delete from database
  await query('DELETE FROM media WHERE id = $1', [id]);

  res.json({ message: 'Media file deleted successfully' });
}));

// Associate media with project
router.post('/:id/associate', authenticateToken, [
  body('project_id').isUUID(),
  body('order_index').optional().isInt({ min: 0 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { project_id, order_index = 0 } = req.body;

  // Check if media exists and user has permission
  const mediaResult = await query('SELECT user_id FROM media WHERE id = $1', [id]);
  if (mediaResult.rows.length === 0) {
    return res.status(404).json({ error: 'Media file not found' });
  }

  if (mediaResult.rows[0].user_id !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  // Check if project exists and user has permission
  const projectResult = await query('SELECT user_id FROM projects WHERE id = $1', [project_id]);
  if (projectResult.rows.length === 0) {
    return res.status(404).json({ error: 'Project not found' });
  }

  if (projectResult.rows[0].user_id !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  // Create association
  const result = await query(
    `INSERT INTO project_media (project_id, media_id, order_index)
     VALUES ($1, $2, $3)
     ON CONFLICT (project_id, media_id) 
     DO UPDATE SET order_index = $3
     RETURNING *`,
    [project_id, id, order_index]
  );

  res.json({
    message: 'Media associated with project successfully',
    association: result.rows[0]
  });
}));

// Remove media from project
router.delete('/:id/associate/:project_id', authenticateToken, asyncHandler(async (req, res) => {
  const { id, project_id } = req.params;

  // Check permissions
  const mediaResult = await query('SELECT user_id FROM media WHERE id = $1', [id]);
  const projectResult = await query('SELECT user_id FROM projects WHERE id = $1', [project_id]);

  if (mediaResult.rows.length === 0 || projectResult.rows.length === 0) {
    return res.status(404).json({ error: 'Media or project not found' });
  }

  if (mediaResult.rows[0].user_id !== req.user.id || projectResult.rows[0].user_id !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  await query('DELETE FROM project_media WHERE project_id = $1 AND media_id = $2', [project_id, id]);

  res.json({ message: 'Media removed from project successfully' });
}));

export default router;
