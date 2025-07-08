import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lazy import payment service to avoid initialization errors
let paymentService = null;
const getPaymentService = async () => {
  if (!paymentService) {
    const module = await import('../services/paymentService.js');
    paymentService = module.default;
  }
  return paymentService;
};

// Create donation intent
router.post('/create-intent', [
  body('amount').isFloat({ min: 1 }),
  body('currency').isIn(['USD', 'EUR', 'TRY', 'SAR']),
  body('programId').isInt(),
  body('donorName').trim().isLength({ min: 1 }),
  body('donorEmail').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { amount, currency, programId, donorName, donorEmail } = req.body;

    // Verify program exists
    const programResult = await query('SELECT * FROM programs WHERE id = $1', [programId]);
    if (programResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    const program = programResult.rows[0];

    // Create payment intent
    const paymentService = await getPaymentService();
    const paymentResult = await paymentService.createPaymentIntent(amount, currency, {
      programId,
      donorName,
      donorEmail,
      programTitle: program.title
    });

    if (!paymentResult.success) {
      return res.status(500).json({
        success: false,
        message: paymentResult.error
      });
    }

    res.json({
      success: true,
      message: 'Donation intent created successfully',
      data: {
        paymentIntent: paymentResult.paymentIntent,
        program: {
          id: program.id,
          title: program.title,
          goalAmount: program.goal_amount,
          currentAmount: program.current_amount
        }
      }
    });
  } catch (error) {
    console.error('Create donation intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Confirm donation
router.post('/confirm/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentIntentId, amount, programId } = req.body;

    // Verify payment intent exists and is valid
    // In a real implementation, you'd verify with Stripe/Iyzico
    if (!paymentIntentId || !amount || !programId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment information'
      });
    }

    // Save donation to database
    const paymentService = await getPaymentService();
    const donationResult = await paymentService.saveDonation({
      userId: req.user.id,
      programId: parseInt(programId),
      amount: parseFloat(amount),
      paymentMethod: 'stripe', // or 'iyzico'
      paymentStatus: 'completed',
      transactionId: paymentIntentId
    });

    if (!donationResult.success) {
      return res.status(500).json({
        success: false,
        message: donationResult.error
      });
    }

    res.json({
      success: true,
      message: 'Donation confirmed successfully',
      data: {
        donation: donationResult.donation
      }
    });
  } catch (error) {
    console.error('Confirm donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get donations (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { limit = 10, offset = 0 } = req.query;

    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM donations');
    const total = parseInt(countResult.rows[0].count);

    // Get paginated donations with user and program info
    const result = await query(`
      SELECT d.*, u.first_name, u.last_name, u.email as donor_email, p.title as program_title
      FROM donations d
      JOIN users u ON d.user_id = u.id
      JOIN programs p ON d.program_id = p.id
      ORDER BY d.donated_at DESC
      LIMIT $1 OFFSET $2
    `, [parseInt(limit), parseInt(offset)]);

    res.json({
      success: true,
      data: {
        donations: result.rows,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < total
        }
      }
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user's donation history
router.get('/my-donations', authMiddleware, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const paymentService = await getPaymentService();
    const donationResult = await paymentService.getDonationHistory(
      req.user.id,
      parseInt(limit),
      parseInt(offset)
    );

    if (!donationResult.success) {
      return res.status(500).json({
        success: false,
        message: donationResult.error
      });
    }

    res.json({
      success: true,
      data: {
        donations: donationResult.donations
      }
    });
  } catch (error) {
    console.error('Get user donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// جلب جميع التبرعات
router.get('/', async (req, res) => {
  try {
    const result = await query(`
            SELECT
                d.*,
                u.first_name || ' ' || u.last_name as donor_name,
                u.email as donor_email,
                p.title as program_title
            FROM donations d
            LEFT JOIN users u ON d.user_id = u.id
            LEFT JOIN programs p ON d.program_id = p.id
            ORDER BY d.donated_at DESC
        `);

    res.json({
      success: true,
      data: {
        items: result.rows,
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Donations fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب التبرعات'
    });
  }
});

// إضافة تبرع جديد
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      program_id,
      amount,
      notes
    } = req.body;

    const result = await query(`
            INSERT INTO donations (user_id, program_id, amount, notes)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [user_id, program_id, amount, notes]);

    res.json({
      success: true,
      data: result.rows[0],
      message: 'تم إضافة التبرع بنجاح'
    });
  } catch (error) {
    console.error('Donation creation error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إضافة التبرع'
    });
  }
});

// تحديث تبرع
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id,
      program_id,
      amount,
      notes
    } = req.body;

    const result = await query(`
            UPDATE donations
            SET user_id = $1, program_id = $2, amount = $3, notes = $4
            WHERE id = $5
            RETURNING *
        `, [user_id, program_id, amount, notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'التبرع غير موجود'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'تم تحديث التبرع بنجاح'
    });
  } catch (error) {
    console.error('Donation update error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث التبرع'
    });
  }
});

// حذف تبرع
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM donations WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'التبرع غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف التبرع بنجاح'
    });
  } catch (error) {
    console.error('Donation deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف التبرع'
    });
  }
});

export default router;