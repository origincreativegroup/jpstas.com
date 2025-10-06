import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * Verify authentication token
 * Simple endpoint to check if token is valid
 */
router.get('/verify', authenticateToken, asyncHandler(async (req, res) => {
  // If we got here, token is valid (authenticateToken middleware passed)
  res.json({
    valid: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
}));

export default router;

