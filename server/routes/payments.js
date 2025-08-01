import express from 'express';
import { body, validationResult } from 'express-validator';
import { paymentService } from '../services/paymentService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// إنشاء جلسة دفع Stripe
router.post('/stripe/create-session', [
    body('amount').isFloat({ min: 1 }).withMessage('المبلغ يجب أن يكون أكبر من 0'),
    body('currency').optional().isIn(['usd', 'eur', 'gbp']).withMessage('العملة غير مدعومة'),
    body('description').optional().isString().withMessage('الوصف يجب أن يكون نص'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'بيانات غير صحيحة',
                errors: errors.array(),
            });
        }

        const { amount, currency = 'usd', description, metadata = {} } = req.body;
        const userId = req.user?.id;

        const result = await paymentService.createStripeSession(
            amount,
            currency,
            description,
            { ...metadata, userId }
        );

        if (result.success) {
            res.json({
                success: true,
                sessionId: result.sessionId,
                url: result.url,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'فشل في إنشاء جلسة الدفع',
                error: result.error,
            });
        }
    } catch (error) {
        console.error('Stripe session creation error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
});

// إنشاء جلسة دفع Iyzico
router.post('/iyzico/create-session', [
    body('amount').isFloat({ min: 1 }).withMessage('المبلغ يجب أن يكون أكبر من 0'),
    body('currency').optional().isIn(['TRY', 'USD', 'EUR']).withMessage('العملة غير مدعومة'),
    body('description').optional().isString().withMessage('الوصف يجب أن يكون نص'),
    body('buyerInfo').isObject().withMessage('معلومات المشتري مطلوبة'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'بيانات غير صحيحة',
                errors: errors.array(),
            });
        }

        const { amount, currency = 'TRY', description, buyerInfo, metadata = {} } = req.body;
        const userId = req.user?.id;

        const result = await paymentService.createIyzicoSession(
            amount,
            currency,
            description,
            buyerInfo,
            { ...metadata, userId }
        );

        if (result.success) {
            res.json({
                success: true,
                formContent: result.formContent,
                token: result.token,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'فشل في إنشاء جلسة الدفع',
                error: result.error,
            });
        }
    } catch (error) {
        console.error('Iyzico session creation error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
});

// التحقق من نجاح الدفع Stripe
router.post('/stripe/verify', [
    body('sessionId').isString().withMessage('معرف الجلسة مطلوب'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'بيانات غير صحيحة',
                errors: errors.array(),
            });
        }

        const { sessionId } = req.body;
        const result = await paymentService.verifyStripePayment(sessionId);

        if (result.success) {
            // حفظ التبرع في قاعدة البيانات
            const donationResult = await paymentService.saveDonation(
                req.user?.id,
                result.session.amount_total / 100, // تحويل من السنتات
                'stripe',
                sessionId
            );

            if (donationResult.success) {
                res.json({
                    success: true,
                    message: 'تم الدفع بنجاح',
                    donation: donationResult.donation,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'فشل في حفظ التبرع',
                    error: donationResult.error,
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'فشل في التحقق من الدفع',
                error: result.error,
            });
        }
    } catch (error) {
        console.error('Stripe payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
});

// التحقق من نجاح الدفع Iyzico
router.post('/iyzico/verify', [
    body('token').isString().withMessage('الرمز المميز مطلوب'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'بيانات غير صحيحة',
                errors: errors.array(),
            });
        }

        const { token } = req.body;
        const result = await paymentService.verifyIyzicoPayment(token);

        if (result.success) {
            // حفظ التبرع في قاعدة البيانات
            const donationResult = await paymentService.saveDonation(
                req.user?.id,
                parseFloat(result.result.price),
                'iyzico',
                token
            );

            if (donationResult.success) {
                res.json({
                    success: true,
                    message: 'تم الدفع بنجاح',
                    donation: donationResult.donation,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'فشل في حفظ التبرع',
                    error: donationResult.error,
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'فشل في التحقق من الدفع',
                error: result.error,
            });
        }
    } catch (error) {
        console.error('Iyzico payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
});

// إحصائيات المدفوعات (للمديرين فقط)
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'غير مصرح بالوصول',
            });
        }

        const result = await paymentService.getPaymentStats();

        if (result.success) {
            res.json({
                success: true,
                stats: result.stats,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'فشل في جلب الإحصائيات',
                error: result.error,
            });
        }
    } catch (error) {
        console.error('Payment stats error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
});

// callback لـ Iyzico
router.post('/iyzico/callback', async (req, res) => {
    try {
        const { token, status } = req.body;

        if (status === 'SUCCESS') {
            const result = await paymentService.verifyIyzicoPayment(token);

            if (result.success) {
                // يمكن إضافة إشعارات هنا
                console.log('Iyzico payment successful:', result.result);
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Iyzico callback error:', error);
        res.status(500).json({ success: false });
    }
});

export default router;