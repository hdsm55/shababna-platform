import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

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
    const result = await query(`
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.bio,
        u.is_admin,
        u.is_active,
        u.created_at,
        u.updated_at,
        COUNT(DISTINCT er.event_id) as events_attended,
        COUNT(DISTINCT d.program_id) as programs_participated,
        COALESCE(SUM(d.amount), 0) as total_donations
      FROM users u
      LEFT JOIN event_registrations er ON u.id = er.user_id
      LEFT JOIN donations d ON u.id = d.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json({
      success: true,
      data: {
        items: result.rows,
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المستخدمين'
    });
  }
});

// إضافة مستخدم جديد
router.post('/', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      bio,
      password,
      is_admin = false,
      is_active = true
    } = req.body;

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(`
      INSERT INTO users (first_name, last_name, email, phone, bio, password, is_admin, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, first_name, last_name, email, phone, bio, is_admin, is_active, created_at
    `, [first_name, last_name, email, phone, bio, hashedPassword, is_admin, is_active]);

    res.json({
      success: true,
      data: result.rows[0],
      message: 'تم إضافة المستخدم بنجاح'
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إضافة المستخدم'
    });
  }
});

// تحديث مستخدم
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone,
      bio,
      is_admin,
      is_active
    } = req.body;

    const result = await query(`
      UPDATE users
      SET first_name = $1, last_name = $2, email = $3, phone = $4,
        bio = $5, is_admin = $6, is_active = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING id, first_name, last_name, email, phone, bio, is_admin, is_active, created_at, updated_at
    `, [first_name, last_name, email, phone, bio, is_admin, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'تم تحديث المستخدم بنجاح'
    });
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث المستخدم'
    });
  }
});

// حذف مستخدم
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    });
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف المستخدم'
    });
  }
});

export default router;