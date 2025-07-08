import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Get all events with filters and pagination
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 10,
      status = 'upcoming'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let sql = 'SELECT * FROM events WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    // Filter by category
    if (category && category !== 'all') {
      sql += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Filter by status
    if (status && status !== 'all') {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Search functionality
    if (search) {
      sql += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR location ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count for pagination
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await query(countSql, params);
    const total = parseInt(countResult.rows[0].count);

    // Add pagination and ordering
    sql += ` ORDER BY start_date ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), offset);

    const result = await query(sql, params);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      message: 'Events retrieved successfully',
      data: {
        items: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
});

// Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM events WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event retrieved successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event'
    });
  }
});

// Create new event (admin only)
router.post('/', [
  authMiddleware,
  adminMiddleware,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('location').trim().isLength({ min: 1 }).withMessage('Location is required'),
  body('start_date').isISO8601().withMessage('Start date must be a valid date'),
  body('end_date').isISO8601().withMessage('End date must be a valid date'),
  body('category').isIn(['workshop', 'conference', 'networking']).withMessage('Invalid category'),
  body('max_attendees').optional().isInt({ min: 1 }).withMessage('Max attendees must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      location,
      start_date,
      end_date,
      category,
      max_attendees,
      status = 'upcoming'
    } = req.body;

    // Validate that end_date is after start_date
    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const result = await query(
      `INSERT INTO events (title, description, location, start_date, end_date, category, max_attendees, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, description, location, start_date, end_date, category, max_attendees, status]
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating event'
    });
  }
});

// Update event (admin only)
router.put('/:id', [
  authMiddleware,
  adminMiddleware,
  body('title').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('location').optional().trim().isLength({ min: 1 }),
  body('start_date').optional().isISO8601(),
  body('end_date').optional().isISO8601(),
  body('category').optional().isIn(['workshop', 'conference', 'networking']),
  body('max_attendees').optional().isInt({ min: 1 }),
  body('status').optional().isIn(['upcoming', 'active', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if event exists
    const existingEvent = await query(
      'SELECT * FROM events WHERE id = $1',
      [req.params.id]
    );

    if (existingEvent.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Build update query dynamically
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        updateFields.push(`${key} = $${paramIndex}`);
        values.push(req.body[key]);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    // Add updated_at timestamp
    updateFields.push(`updated_at = NOW()`);

    values.push(req.params.id);
    const result = await query(
      `UPDATE events SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating event'
    });
  }
});

// Delete event (admin only)
router.delete('/:id', [
  authMiddleware,
  adminMiddleware
], async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM events WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event'
    });
  }
});

// Register for event
router.post('/:id/register', [
  authMiddleware,
  body('user_id').isInt().withMessage('User ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const eventId = parseInt(req.params.id);
    const userId = parseInt(req.body.user_id);

    // Check if event exists and has available spots
    const eventResult = await query(
      'SELECT * FROM events WHERE id = $1',
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const event = eventResult.rows[0];

    // Check if event is full
    if (event.max_attendees && event.attendees >= event.max_attendees) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Check if user is already registered
    const existingRegistration = await query(
      'SELECT * FROM event_registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );

    if (existingRegistration.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered for this event'
      });
    }

    // Register user for event
    await query(
      'INSERT INTO event_registrations (user_id, event_id) VALUES ($1, $2)',
      [userId, eventId]
    );

    // Update event attendees count
    await query(
      'UPDATE events SET attendees = attendees + 1 WHERE id = $1',
      [eventId]
    );

    res.json({
      success: true,
      message: 'Registration successful',
      data: {
        event_id: eventId,
        user_id: userId,
        event_title: event.title,
        event_date: event.start_date
      }
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while registering for event'
    });
  }
});

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
      start_date,
      end_date,
      max_attendees,
      category,
      status
    } = req.body;

    const result = await query(`
            UPDATE events
            SET title = $1, description = $2, location = $3, start_date = $4,
                end_date = $5, max_attendees = $6, category = $7, status = $8,
                updated_at = NOW()
            WHERE id = $9
            RETURNING *
        `, [title, description, location, start_date, end_date, max_attendees, category, status, id]);

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