const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Iyzipay = require('iyzipay');

// إعداد Iyzico
const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com'
});

class PaymentService {
    // إنشاء جلسة دفع Stripe
    static async createStripeSession(donationData) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: donationData.currency || 'usd',
                        product_data: {
                            name: `تبرع لبرنامج: ${donationData.programName || 'عام'}`,
                            description: donationData.message || 'تبرع خيري',
                        },
                        unit_amount: Math.round(donationData.amount * 100), // تحويل إلى سنتات
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/donation/cancel`,
                metadata: {
                    donor_name: donationData.donorName,
                    donor_email: donationData.donorEmail,
                    program_id: donationData.programId,
                    message: donationData.message || '',
                },
            });

            return {
                success: true,
                sessionId: session.id,
                url: session.url,
            };
        } catch (error) {
            console.error('Stripe session creation error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // إنشاء جلسة دفع Iyzico
    static async createIyzicoSession(donationData) {
        return new Promise((resolve) => {
            const request = {
                locale: 'tr',
                conversationId: `donation_${Date.now()}`,
                price: donationData.amount.toString(),
                paidPrice: donationData.amount.toString(),
                currency: donationData.currency || 'TRY',
                basketId: `basket_${Date.now()}`,
                paymentGroup: 'PRODUCT',
                callbackUrl: `${process.env.BACKEND_URL}/api/payments/iyzico/callback`,
                enabledInstallments: [1, 2, 3, 6, 9],
                buyer: {
                    id: `buyer_${Date.now()}`,
                    name: donationData.donorName.split(' ')[0] || 'مجهول',
                    surname: donationData.donorName.split(' ').slice(1).join(' ') || 'مجهول',
                    gsmNumber: donationData.phone || '+905350000000',
                    email: donationData.donorEmail,
                    identityNumber: '74300864791',
                    lastLoginDate: new Date().toISOString(),
                    registrationDate: new Date().toISOString(),
                    registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                    ip: '85.34.78.112',
                    city: 'Istanbul',
                    country: 'Turkey',
                    zipCode: '34732'
                },
                shippingAddress: {
                    contactName: donationData.donorName,
                    city: 'Istanbul',
                    country: 'Turkey',
                    address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                    zipCode: '34742'
                },
                billingAddress: {
                    contactName: donationData.donorName,
                    city: 'Istanbul',
                    country: 'Turkey',
                    address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                    zipCode: '34742'
                },
                basketItems: [{
                    id: donationData.programId || 'general',
                    name: donationData.programName || 'تبرع عام',
                    category1: 'تبرعات',
                    category2: 'خيرية',
                    itemType: 'VIRTUAL',
                    price: donationData.amount.toString()
                }]
            };

            iyzipay.checkoutFormInitialize.create(request, (err, result) => {
                if (err) {
                    console.error('Iyzico session creation error:', err);
                    resolve({
                        success: false,
                        error: err.message,
                    });
                } else {
                    resolve({
                        success: true,
                        token: result.token,
                        checkoutFormContent: result.checkoutFormContent,
                    });
                }
            });
        });
    }

    // التحقق من حالة الدفع Stripe
    static async verifyStripePayment(sessionId) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            return {
                success: session.payment_status === 'paid',
                amount: session.amount_total / 100,
                currency: session.currency,
                metadata: session.metadata,
            };
        } catch (error) {
            console.error('Stripe verification error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // التحقق من حالة الدفع Iyzico
    static async verifyIyzicoPayment(token) {
        return new Promise((resolve) => {
            iyzipay.checkoutForm.retrieve({
                token: token
            }, (err, result) => {
                if (err) {
                    console.error('Iyzico verification error:', err);
                    resolve({
                        success: false,
                        error: err.message,
                    });
                } else {
                    resolve({
                        success: result.status === 'SUCCESS',
                        amount: result.price,
                        currency: result.currency,
                        paymentId: result.paymentId,
                    });
                }
            });
        });
    }

    // استرداد المدفوعات
    static async refundPayment(paymentId, amount, reason = 'طلب العميل') {
        try {
            const refund = await stripe.refunds.create({
                payment_intent: paymentId,
                amount: Math.round(amount * 100),
                reason: 'requested_by_customer',
                metadata: {
                    reason: reason,
                },
            });

            return {
                success: true,
                refundId: refund.id,
                status: refund.status,
            };
        } catch (error) {
            console.error('Refund error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}

module.exports = PaymentService;