import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';

const router = express.Router();

// Get all programs
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 10, offset = 0 } = req.query;

    let sql = 'SELECT * FROM programs WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (category && category !== 'all') {
      sql += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      sql += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await query(countSql, params);
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sql, params);

    res.json({
      success: true,
      message: 'Programs retrieved successfully',
      data: {
        items: result.rows,
        pagination: {
          page: parseInt(req.query.page) || 1,
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single program
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM programs WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get program error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Support program
router.post('/:id/support', [
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('email').isEmail().normalizeEmail(),
  body('supportType').isIn(['volunteer', 'donate', 'sponsor']),
  body('message').optional().trim()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const program = programs.find(p => p.id === parseInt(req.params.id));
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // In a real app, you'd save the support request to database
    res.json({
      message: 'Support request submitted successfully',
      program: {
        id: program.id,
        title: program.title
      }
    });
  } catch (error) {
    console.error('Program support error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;