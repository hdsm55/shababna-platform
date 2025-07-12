import { validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Lazy import payment service to avoid initialization errors
let paymentService = null;
const getPaymentService = async () => {
    if (!paymentService) {
        const module = await import('../services/paymentService.js');
        paymentService = module.default;
    }
    return paymentService;
};

// Create donation intent (public)
export const createDonationIntent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'بيانات غير صالحة', 400, errors.array());
        }
        const { amount, currency, programId, donorName, donorEmail } = req.body;
        // Verify program exists
        const programResult = await query('SELECT * FROM programs WHERE id = $1', [programId]);
        if (programResult.rows.length === 0) {
            return errorResponse(res, 'البرنامج غير موجود', 404);
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
            return errorResponse(res, paymentResult.error, 500);
        }
        return successResponse(res, {
            paymentIntent: paymentResult.paymentIntent,
            program: {
                id: program.id,
                title: program.title,
                goalAmount: program.goal_amount,
                currentAmount: program.current_amount
            }
        }, 'تم إنشاء نية التبرع بنجاح');
    } catch (error) {
        console.error('Create donation intent error:', error);
        return errorResponse(res, 'خطأ في إنشاء نية التبرع', 500, error);
    }
};

// Confirm donation (authenticated)
export const confirmDonation = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentIntentId, amount, programId } = req.body;
        if (!paymentIntentId || !amount || !programId) {
            return errorResponse(res, 'معلومات الدفع ناقصة', 400);
        }
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
            return errorResponse(res, donationResult.error, 500);
        }
        return successResponse(res, { donation: donationResult.donation }, 'تم تأكيد التبرع بنجاح');
    } catch (error) {
        console.error('Confirm donation error:', error);
        return errorResponse(res, 'خطأ في تأكيد التبرع', 500, error);
    }
};

// Get all donations (admin only)
export const getAllDonations = async (req, res) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const countResult = await query('SELECT COUNT(*) FROM donations');
        const total = parseInt(countResult.rows[0].count);
        const result = await query(`
      SELECT d.*, u.first_name, u.last_name, u.email as donor_email, p.title as program_title
      FROM donations d
      JOIN users u ON d.user_id = u.id
      JOIN programs p ON d.program_id = p.id
      ORDER BY d.donated_at DESC
      LIMIT $1 OFFSET $2
    `, [parseInt(limit), parseInt(offset)]);
        return successResponse(res, {
            donations: result.rows,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: parseInt(offset) + parseInt(limit) < total
            }
        }, 'تم جلب جميع التبرعات بنجاح');
    } catch (error) {
        console.error('Get donations error:', error);
        return errorResponse(res, 'خطأ في جلب التبرعات', 500, error);
    }
};

// Get user's donation history (authenticated)
export const getMyDonations = async (req, res) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const paymentService = await getPaymentService();
        const donationResult = await paymentService.getDonationHistory(
            req.user.id,
            parseInt(limit),
            parseInt(offset)
        );
        if (!donationResult.success) {
            return errorResponse(res, donationResult.error, 500);
        }
        return successResponse(res, { donations: donationResult.donations }, 'تم جلب سجل تبرعاتك بنجاح');
    } catch (error) {
        console.error('Get user donations error:', error);
        return errorResponse(res, 'خطأ في جلب سجل التبرعات', 500, error);
    }
};