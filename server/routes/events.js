import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, registerForEvent } from '../controllers/eventsController.js';

const router = express.Router();

// Get all events (public)
router.get('/', getAllEvents);

// Get single event (public)
router.get('/:id', getEventById);

// Create new event (admin only)
router.post('/', authMiddleware, adminMiddleware, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('location').trim().isLength({ min: 1 }).withMessage('Location is required'),
  body('start_date').isISO8601().withMessage('Start date must be a valid date'),
  body('end_date').isISO8601().withMessage('End date must be a valid date'),
  body('category').isIn(['workshop', 'conference', 'networking']).withMessage('Invalid category'),
  body('max_attendees').optional().isInt({ min: 1 }).withMessage('Max attendees must be a positive number')
], createEvent);

// Update event (admin only)
router.put('/:id', authMiddleware, adminMiddleware, [
  body('title').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('location').optional().trim().isLength({ min: 1 }),
  body('start_date').optional().isISO8601(),
  body('end_date').optional().isISO8601(),
  body('category').optional().isIn(['workshop', 'conference', 'networking']),
  body('max_attendees').optional().isInt({ min: 1 }),
  body('status').optional().isIn(['upcoming', 'active', 'completed', 'cancelled'])
], updateEvent);

// Delete event (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent);

// Register for event
router.post('/:id/register', registerForEvent);

// Get user's event registrations
router.get('/user/registrations', [
  authMiddleware
], async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT e.*, er.registered_at
       FROM events e
       INNER JOIN event_registrations er ON e.id = er.event_id
       WHERE er.user_id = $1
       ORDER BY e.start_date ASC`,
      [userId]
    );

    res.json({
      success: true,
      message: 'User registrations retrieved successfully',
      data: result.rows
    });
  } catch (error) {
    console.error('Get user registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user registrations'
    });
  }
});

// Cancel event registration
router.delete('/:id/register', [
  authMiddleware
], async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if registration exists
    const registration = await query(
      'SELECT * FROM event_registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );

    if (registration.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Delete registration
    await query(
      'DELETE FROM event_registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );

    // Update event attendees count
    await query(
      'UPDATE events SET attendees = attendees - 1 WHERE id = $1',
      [eventId]
    );

    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling registration'
    });
  }
});

// جلب جميع الفعاليات
router.get('/all', async (req, res) => {
  try {
    const result = await query(`
            SELECT
                e.*,
                COUNT(er.user_id) as registered_count
            FROM events e
            LEFT JOIN event_registrations er ON e.id = er.event_id
            GROUP BY e.id
            ORDER BY e.created_at DESC
        `);

    res.json({
      success: true,
      data: {
        items: result.rows,
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Events fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الفعاليات'
    });
  }
});

// إضافة فعالية جديدة
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      start_date,
      end_date,
      max_attendees,
      category,
      status = 'upcoming'
    } = req.body;

    const result = await query(`
            INSERT INTO events (title, description, location, start_date, end_date, max_attendees, category, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [title, description, location, start_date, end_date, max_attendees, category, status]);

    res.json({
      success: true,
      data: result.rows[0],
      message: 'تم إضافة الفعالية بنجاح'
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إضافة الفعالية'
    });
  }
});

// تحديث فعالية
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      event_date
    } = req.body;

    const result = await query(`
            UPDATE events
            SET title = $1, description = $2, location = $3, event_date = $4
            WHERE id = $5
            RETURNING id, title, description, event_date, location, created_at
        `, [title, description, location, event_date, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الفعالية غير موجودة'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'تم تحديث الفعالية بنجاح'
    });
  } catch (error) {
    console.error('Event update error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الفعالية'
    });
  }
});

// حذف فعالية
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الفعالية غير موجودة'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف الفعالية بنجاح'
    });
  } catch (error) {
    console.error('Event deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الفعالية'
    });
  }
});

export default router;