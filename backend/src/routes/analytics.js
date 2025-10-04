import express from 'express';
import { body, validationResult, query as queryValidator } from 'express-validator';
import { query } from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Track analytics event
router.post('/track', [
  body('event_type').isString().isLength({ min: 1, max: 100 }),
  body('event_data').optional().isObject(),
  body('page_url').optional().isURL(),
  body('project_id').optional().isUUID()
], optionalAuth, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    event_type,
    event_data,
    page_url,
    project_id
  } = req.body;

  // Extract client info
  const user_agent = req.get('User-Agent');
  const ip_address = req.ip || req.connection.remoteAddress;
  const referrer = req.get('Referer');
  const session_id = req.sessionID || req.get('X-Session-ID');

  // Insert analytics event
  const result = await query(
    `INSERT INTO analytics_events (
      user_id, project_id, event_type, event_data, page_url, referrer, 
      user_agent, ip_address, session_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id`,
    [
      req.user?.id || null,
      project_id || null,
      event_type,
      JSON.stringify(event_data || {}),
      page_url || null,
      referrer || null,
      user_agent || null,
      ip_address || null,
      session_id || null
    ]
  );

  res.status(201).json({
    message: 'Event tracked successfully',
    event_id: result.rows[0].id
  });
}));

// Get analytics dashboard data
router.get('/dashboard', authenticateToken, [
  queryValidator('start_date').optional().isISO8601(),
  queryValidator('end_date').optional().isISO8601(),
  queryValidator('project_id').optional().isUUID()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    start_date,
    end_date,
    project_id
  } = req.query;

  // Build date filter
  let dateFilter = '';
  let values = [req.user.id];
  let paramCount = 1;

  if (start_date) {
    paramCount++;
    dateFilter += ` AND created_at >= $${paramCount}`;
    values.push(start_date);
  }

  if (end_date) {
    paramCount++;
    dateFilter += ` AND created_at <= $${paramCount}`;
    values.push(end_date);
  }

  if (project_id) {
    paramCount++;
    dateFilter += ` AND project_id = $${paramCount}`;
    values.push(project_id);
  }

  // Get event counts by type
  const eventTypesResult = await query(
    `SELECT 
      event_type,
      COUNT(*) as count
    FROM analytics_events 
    WHERE user_id = $1 ${dateFilter}
    GROUP BY event_type
    ORDER BY count DESC`,
    values
  );

  // Get daily event counts
  const dailyEventsResult = await query(
    `SELECT 
      DATE(created_at) as date,
      COUNT(*) as count
    FROM analytics_events 
    WHERE user_id = $1 ${dateFilter}
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT 30`,
    values
  );

  // Get top pages
  const topPagesResult = await query(
    `SELECT 
      page_url,
      COUNT(*) as count
    FROM analytics_events 
    WHERE user_id = $1 AND page_url IS NOT NULL ${dateFilter}
    GROUP BY page_url
    ORDER BY count DESC
    LIMIT 10`,
    values
  );

  // Get project analytics
  const projectAnalyticsResult = await query(
    `SELECT 
      p.title as project_title,
      p.slug as project_slug,
      COUNT(ae.id) as view_count,
      COUNT(DISTINCT ae.session_id) as unique_sessions
    FROM projects p
    LEFT JOIN analytics_events ae ON p.id = ae.project_id 
      AND ae.event_type = 'page_view' ${dateFilter.replace('user_id = $1', 'ae.user_id = $1')}
    WHERE p.user_id = $1
    GROUP BY p.id, p.title, p.slug
    ORDER BY view_count DESC`,
    values
  );

  // Get total stats
  const totalStatsResult = await query(
    `SELECT 
      COUNT(*) as total_events,
      COUNT(DISTINCT session_id) as unique_sessions,
      COUNT(DISTINCT DATE(created_at)) as active_days
    FROM analytics_events 
    WHERE user_id = $1 ${dateFilter}`,
    values
  );

  res.json({
    event_types: eventTypesResult.rows,
    daily_events: dailyEventsResult.rows,
    top_pages: topPagesResult.rows,
    project_analytics: projectAnalyticsResult.rows,
    total_stats: totalStatsResult.rows[0]
  });
}));

// Get project-specific analytics
router.get('/projects/:id', authenticateToken, [
  queryValidator('start_date').optional().isISO8601(),
  queryValidator('end_date').optional().isISO8601()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { start_date, end_date } = req.query;

  // Verify project ownership
  const projectResult = await query(
    'SELECT id, title FROM projects WHERE id = $1 AND user_id = $2',
    [id, req.user.id]
  );

  if (projectResult.rows.length === 0) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Build date filter
  let dateFilter = '';
  let values = [id];
  let paramCount = 1;

  if (start_date) {
    paramCount++;
    dateFilter += ` AND created_at >= $${paramCount}`;
    values.push(start_date);
  }

  if (end_date) {
    paramCount++;
    dateFilter += ` AND created_at <= $${paramCount}`;
    values.push(end_date);
  }

  // Get project analytics
  const analyticsResult = await query(
    `SELECT 
      event_type,
      COUNT(*) as count,
      COUNT(DISTINCT session_id) as unique_sessions,
      DATE(created_at) as date
    FROM analytics_events 
    WHERE project_id = $1 ${dateFilter}
    GROUP BY event_type, DATE(created_at)
    ORDER BY date DESC, count DESC`,
    values
  );

  // Get referrer data
  const referrerResult = await query(
    `SELECT 
      referrer,
      COUNT(*) as count
    FROM analytics_events 
    WHERE project_id = $1 AND referrer IS NOT NULL ${dateFilter}
    GROUP BY referrer
    ORDER BY count DESC
    LIMIT 10`,
    values
  );

  res.json({
    project: projectResult.rows[0],
    analytics: analyticsResult.rows,
    referrers: referrerResult.rows
  });
}));

// Get real-time analytics (last 24 hours)
router.get('/realtime', authenticateToken, asyncHandler(async (req, res) => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Get recent events
  const recentEventsResult = await query(
    `SELECT 
      ae.*,
      p.title as project_title,
      p.slug as project_slug
    FROM analytics_events ae
    LEFT JOIN projects p ON ae.project_id = p.id
    WHERE ae.user_id = $1 AND ae.created_at >= $2
    ORDER BY ae.created_at DESC
    LIMIT 50`,
    [req.user.id, last24Hours]
  );

  // Get hourly breakdown
  const hourlyResult = await query(
    `SELECT 
      EXTRACT(HOUR FROM created_at) as hour,
      COUNT(*) as count
    FROM analytics_events 
    WHERE user_id = $1 AND created_at >= $2
    GROUP BY EXTRACT(HOUR FROM created_at)
    ORDER BY hour`,
    [req.user.id, last24Hours]
  );

  // Get current active sessions (approximate)
  const activeSessionsResult = await query(
    `SELECT 
      COUNT(DISTINCT session_id) as active_sessions
    FROM analytics_events 
    WHERE user_id = $1 AND created_at >= $2`,
    [req.user.id, new Date(Date.now() - 30 * 60 * 1000).toISOString()] // Last 30 minutes
  );

  res.json({
    recent_events: recentEventsResult.rows,
    hourly_breakdown: hourlyResult.rows,
    active_sessions: activeSessionsResult.rows[0].active_sessions
  });
}));

export default router;
