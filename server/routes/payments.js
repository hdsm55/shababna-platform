const express = require('express');
const router = express.Router();
const PaymentService = require('../services/paymentService');
const { query } = require('../config/database');

// إنشاء جلسة دفع Stripe
router.post('/stripe/create-session', async (req, res) => {
    try {
        const {
            amount,
            currency = 'usd',
            donorName,
            donorEmail,
            programId,
            programName,
            message,
            phone
        } = req.body;

        if (!amount || !donorName || !donorEmail) {
            return res.status(400).json({
                success: false,
                message: 'المبلغ واسم المتبرع والبريد الإلكتروني مطلوبة'
            });
        }

        const session = await PaymentService.createStripeSession({
            amount: parseFloat(amount),
            currency,
            donorName,
            donorEmail,
            programId,
            programName,
            message,
            phone
        });

        if (session.success) {
            res.json({
                success: true,
                sessionId: session.sessionId,
                url: session.url
            });
        } else {
            res.status(400).json({
                success: false,
                message: session.error
            });
        }
    } catch (error) {
        console.error('Stripe session creation error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إنشاء جلسة الدفع'
        });
    }
});

// إنشاء جلسة دفع Iyzico
router.post('/iyzico/create-session', async (req, res) => {
    try {
        const {
            amount,
            currency = 'TRY',
            donorName,
            donorEmail,
            programId,
            programName,
            message,
            phone
        } = req.body;

        if (!amount || !donorName || !donorEmail) {
            return res.status(400).json({
                success: false,
                message: 'المبلغ واسم المتبرع والبريد الإلكتروني مطلوبة'
            });
        }

        const session = await PaymentService.createIyzicoSession({
            amount: parseFloat(amount),
            currency,
            donorName,
            donorEmail,
            programId,
            programName,
            message,
            phone
        });

        if (session.success) {
            res.json({
                success: true,
                token: session.token,
                checkoutFormContent: session.checkoutFormContent
            });
        } else {
            res.status(400).json({
                success: false,
                message: session.error
            });
        }
    } catch (error) {
        console.error('Iyzico session creation error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إنشاء جلسة الدفع'
        });
    }
});

// التحقق من حالة الدفع Stripe
router.post('/stripe/verify', async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'معرف الجلسة مطلوب'
            });
        }

        const verification = await PaymentService.verifyStripePayment(sessionId);

        if (verification.success) {
            // حفظ التبرع في قاعدة البيانات
            const result = await query(
                `INSERT INTO donations (donor_name, amount, program_id, payment_method, status, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
                [
                    verification.metadata.donor_name,
                    verification.amount,
                    verification.metadata.program_id || null,
                    'stripe',
                    'completed'
                ]
            );

            res.json({
                success: true,
                message: 'تم الدفع بنجاح',
                donation: result.rows[0]
            });
        } else {
            res.status(400).json({
                success: false,
                message: verification.error || 'فشل في التحقق من الدفع'
            });
        }
    } catch (error) {
        console.error('Stripe verification error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء التحقق من الدفع'
        });
    }
});

// التحقق من حالة الدفع Iyzico
router.post('/iyzico/verify', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'رمز الجلسة مطلوب'
            });
        }

        const verification = await PaymentService.verifyIyzicoPayment(token);

        if (verification.success) {
            // حفظ التبرع في قاعدة البيانات
            const result = await query(
                `INSERT INTO donations (donor_name, amount, program_id, payment_method, status, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
                [
                    'مجهول', // سيتم تحديثه من البيانات الفعلية
                    verification.amount,
                    null, // سيتم تحديثه من البيانات الفعلية
                    'iyzico',
                    'completed'
                ]
            );

            res.json({
                success: true,
                message: 'تم الدفع بنجاح',
                donation: result.rows[0]
            });
        } else {
            res.status(400).json({
                success: false,
                message: verification.error || 'فشل في التحقق من الدفع'
            });
        }
    } catch (error) {
        console.error('Iyzico verification error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء التحقق من الدفع'
        });
    }
});

// استرداد المدفوعات
router.post('/refund', async (req, res) => {
    try {
        const { paymentId, amount, reason } = req.body;

        if (!paymentId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'معرف الدفع والمبلغ مطلوبان'
            });
        }

        const refund = await PaymentService.refundPayment(paymentId, amount, reason);

        if (refund.success) {
            res.json({
                success: true,
                message: 'تم الاسترداد بنجاح',
                refundId: refund.refundId
            });
        } else {
            res.status(400).json({
                success: false,
                message: refund.error
            });
        }
    } catch (error) {
        console.error('Refund error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء الاسترداد'
        });
    }
});

// الحصول على إعدادات المدفوعات
router.get('/settings', (req, res) => {
    res.json({
        success: true,
        settings: {
            stripe: {
                enabled: !!process.env.STRIPE_SECRET_KEY,
                publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
            },
            iyzico: {
                enabled: !!process.env.IYZICO_API_KEY
            },
            currencies: ['USD', 'EUR', 'SAR', 'AED', 'TRY'],
            paymentMethods: ['card', 'bank', 'wallet']
        }
    });
});

module.exports = router;