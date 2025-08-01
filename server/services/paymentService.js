import Stripe from 'stripe';
import Iyzipay from 'iyzipay';
import { query } from '../config/database.js';

// إعداد Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
});

// إعداد Iyzico (اختياري)
let iyzipay = null;
if (process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY) {
    iyzipay = new Iyzipay({
        apiKey: process.env.IYZICO_API_KEY,
        secretKey: process.env.IYZICO_SECRET_KEY,
        uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com',
    });
}

export const paymentService = {
    // إنشاء جلسة دفع Stripe
    async createStripeSession(amount, currency, description, metadata = {}) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: currency || 'usd',
                            product_data: {
                                name: description || 'تبرع لشبابنا',
                            },
                            unit_amount: Math.round(amount * 100), // Stripe يتعامل بالسنتات
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
                metadata,
            });

            return { success: true, sessionId: session.id, url: session.url };
        } catch (error) {
            console.error('Stripe session creation error:', error);
            return { success: false, error: error.message };
        }
    },

    // إنشاء جلسة دفع Iyzico
    async createIyzicoSession(amount, currency, description, buyerInfo, metadata = {}) {
        if (!iyzipay) {
            return { success: false, error: 'Iyzico payment is not configured' };
        }

        return new Promise((resolve) => {
            const request = {
                locale: 'tr',
                conversationId: `conv_${Date.now()}`,
                price: amount.toString(),
                paidPrice: amount.toString(),
                currency: currency || 'TRY',
                basketId: `basket_${Date.now()}`,
                paymentGroup: 'PRODUCT',
                callbackUrl: `${process.env.BACKEND_URL}/api/payments/iyzico/callback`,
                buyer: {
                    id: buyerInfo.id || 'BY789',
                    name: buyerInfo.name || 'John',
                    surname: buyerInfo.surname || 'Doe',
                    gsmNumber: buyerInfo.phone || '+905350000000',
                    email: buyerInfo.email || 'email@email.com',
                    identityNumber: '74300864791',
                    lastLoginDate: '2015-10-05 12:43:35',
                    registrationDate: '2013-04-21 15:12:09',
                    registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                    ip: '85.34.78.112',
                    city: 'Istanbul',
                    country: 'Turkey',
                    zipCode: '34732',
                },
                shippingAddress: {
                    contactName: buyerInfo.name || 'Jane Doe',
                    city: 'Istanbul',
                    country: 'Turkey',
                    address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                    zipCode: '34742',
                },
                billingAddress: {
                    contactName: buyerInfo.name || 'Jane Doe',
                    city: 'Istanbul',
                    country: 'Turkey',
                    address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                    zipCode: '34742',
                },
                basketItems: [
                    {
                        id: 'BI101',
                        name: description || 'تبرع لشبابنا',
                        category1: 'تبرعات',
                        itemType: 'VIRTUAL',
                        price: amount.toString(),
                    },
                ],
            };

            iyzipay.checkoutFormInitialize.create(request, (err, result) => {
                if (err) {
                    console.error('Iyzico session creation error:', err);
                    resolve({ success: false, error: err.message });
                } else {
                    resolve({
                        success: true,
                        formContent: result.checkoutFormContent,
                        token: result.token,
                    });
                }
            });
        });
    },

    // التحقق من نجاح الدفع Stripe
    async verifyStripePayment(sessionId) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            if (session.payment_status === 'paid') {
                return { success: true, session };
            }
            return { success: false, error: 'Payment not completed' };
        } catch (error) {
            console.error('Stripe payment verification error:', error);
            return { success: false, error: error.message };
        }
    },

    // التحقق من نجاح الدفع Iyzico
    async verifyIyzicoPayment(token) {
        if (!iyzipay) {
            return { success: false, error: 'Iyzico payment is not configured' };
        }

        return new Promise((resolve) => {
            const request = {
                locale: 'tr',
                conversationId: `conv_${Date.now()}`,
                token: token,
            };

            iyzipay.checkoutForm.retrieve(request, (err, result) => {
                if (err) {
                    console.error('Iyzico payment verification error:', err);
                    resolve({ success: false, error: err.message });
                } else if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
                    resolve({ success: true, result });
                } else {
                    resolve({ success: false, error: 'Payment not completed' });
                }
            });
        });
    },

    // حفظ التبرع في قاعدة البيانات
    async saveDonation(userId, amount, paymentMethod, paymentId, status = 'completed') {
        try {
            const result = await query(
                'INSERT INTO donations (user_id, amount, payment_method, payment_id, status, donated_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
                [userId, amount, paymentMethod, paymentId, status]
            );
            return { success: true, donation: result.rows[0] };
        } catch (error) {
            console.error('Save donation error:', error);
            return { success: false, error: error.message };
        }
    },

    // الحصول على إحصائيات المدفوعات
    async getPaymentStats() {
        try {
            const result = await query(`
        SELECT
          COUNT(*) as total_donations,
          SUM(amount) as total_amount,
          payment_method,
          DATE(donated_at) as donation_date
        FROM donations
        WHERE status = 'completed'
        GROUP BY payment_method, DATE(donated_at)
        ORDER BY donation_date DESC
      `);
            return { success: true, stats: result.rows };
        } catch (error) {
            console.error('Get payment stats error:', error);
            return { success: false, error: error.message };
        }
    },
};