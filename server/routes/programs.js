import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';

const router = express.Router();

// Get all programs
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT
        p.*,
        COALESCE(SUM(d.amount), 0) as current_amount,
        COUNT(DISTINCT d.user_id) as participants_count
      FROM programs p
      LEFT JOIN donations d ON p.id = d.program_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      data: {
        items: result.rows,
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Programs fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب البرامج'
    });
  }
});

// Get single program
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM programs WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json({
      success: true,
      message: 'Program retrieved successfully',
      data: result.rows[0]
    });
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

// Add a new program
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      goal_amount,
      start_date,
      end_date
    } = req.body;

    const result = await query(`
      INSERT INTO programs (title, description, category, goal_amount, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description, category, goal_amount, start_date, end_date]);

    res.json({
      success: true,
      data: result.rows[0],
      message: 'تم إضافة البرنامج بنجاح'
    });
  } catch (error) {
    console.error('Program creation error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إضافة البرنامج'
    });
  }
});

// Update a program
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      goal_amount,
      start_date,
      end_date
    } = req.body;

    const result = await query(`
      UPDATE programs
      SET title = $1, description = $2, category = $3, goal_amount = $4,
          start_date = $5, end_date = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `, [title, description, category, goal_amount, start_date, end_date, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'البرنامج غير موجود'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'تم تحديث البرنامج بنجاح'
    });
  } catch (error) {
    console.error('Program update error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث البرنامج'
    });
  }
});

// Delete a program
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'البرنامج غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف البرنامج بنجاح'
    });
  } catch (error) {
    console.error('Program deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف البرنامج'
    });
  }
});

export default router;