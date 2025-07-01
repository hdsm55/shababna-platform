import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';

const router = express.Router();

// Join organization
router.post('/join', [
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 1 }),
  body('country').trim().isLength({ min: 1 }),
  body('age').isInt({ min: 16, max: 35 }),
  body('interests').isArray({ min: 1 }),
  body('motivation').trim().isLength({ min: 10 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const membershipApplication = {
      id: Date.now().toString(),
      ...req.body,
      status: 'pending',
      submittedAt: new Date()
    };

    // In a real app, you'd save to database
    users.push(membershipApplication);

    res.status(201).json({
      message: 'Membership application submitted successfully',
      applicationId: membershipApplication.id
    });
  } catch (error) {
    console.error('Join organization error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Contact form
router.post('/contact', [
  body('name').trim().isLength({ min: 1 }),
  body('email').isEmail().normalizeEmail(),
  body('subject').trim().isLength({ min: 1 }),
  body('message').trim().isLength({ min: 10 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contactMessage = {
      id: Date.now().toString(),
      ...req.body,
      status: 'new',
      submittedAt: new Date()
    };

    // In a real app, you'd save to database and possibly send email
    console.log('Contact message received:', contactMessage);

    res.json({
      message: 'Message sent successfully',
      messageId: contactMessage.id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile (authenticated user)
router.get('/profile', async (req, res) => {
  try {
    // This would be implemented with auth middleware
    // For now, we'll return a placeholder
    res.json({
      message: 'User profile endpoint - requires authentication'
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    // Get paginated users (excluding passwords)
    const result = await query(`
      SELECT id, email, first_name, last_name, phone, bio, is_active, is_admin, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [parseInt(limit), parseInt(offset)]);

    res.json({
      users: result.rows,
      total,
      hasMore: parseInt(offset) + parseInt(limit) < total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;