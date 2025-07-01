import Stripe from 'stripe';
import { query } from '../config/database.js';

// Initialize Stripe (only if key exists)
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-12-18.acacia',
    });
}

// Initialize Iyzico (only if keys exist)
let iyzipay = null;
if (process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY &&
    process.env.IYZICO_API_KEY.trim() !== '' && process.env.IYZICO_SECRET_KEY.trim() !== '') {
    try {
        const Iyzipay = (await import('iyzipay')).default;
        iyzipay = new Iyzipay({
            apiKey: process.env.IYZICO_API_KEY,
            secretKey: process.env.IYZICO_SECRET_KEY,
            uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com'
        });
    } catch (error) {
        console.warn('Failed to initialize Iyzico:', error.message);
        iyzipay = null;
    }
}

class PaymentService {
    // Create payment intent
    async createPaymentIntent(amount, currency, metadata) {
        try {
            // Check if payment providers are configured
            if (!stripe && !iyzipay) {
                // Fallback to mock payment for development
                const paymentIntent = {
                    id: `pi_${Date.now()}`,
                    amount: amount,
                    currency: currency,
                    metadata: metadata,
                    status: 'requires_payment_method'
                };

                return {
                    success: true,
                    paymentIntent: paymentIntent,
                    provider: 'mock'
                };
            }

            // Use Stripe for USD/EUR payments
            if (stripe && ['USD', 'EUR'].includes(currency)) {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: Math.round(amount * 100), // Convert to cents
                    currency: currency.toLowerCase(),
                    metadata: metadata
                });

                return {
                    success: true,
                    paymentIntent: paymentIntent,
                    provider: 'stripe'
                };
            }

            // Use Iyzico for TRY payments
            if (iyzipay && currency === 'TRY') {
                // Iyzico implementation would go here
                const paymentIntent = {
                    id: `iyz_${Date.now()}`,
                    amount: amount,
                    currency: currency,
                    metadata: metadata,
                    status: 'requires_payment_method'
                };

                return {
                    success: true,
                    paymentIntent: paymentIntent,
                    provider: 'iyzico'
                };
            }

            return {
                success: false,
                error: 'No suitable payment provider configured for this currency'
            };
        } catch (error) {
            console.error('Create payment intent error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Save donation to database
    async saveDonation(donationData) {
        try {
            const result = await query(`
        INSERT INTO donations (user_id, program_id, amount, donated_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `, [
                donationData.userId,
                donationData.programId,
                donationData.amount
            ]);

            // Update program current amount
            await query(`
        UPDATE programs
        SET current_amount = current_amount + $1, updated_at = NOW()
        WHERE id = $2
      `, [donationData.amount, donationData.programId]);

            return {
                success: true,
                donation: result.rows[0]
            };
        } catch (error) {
            console.error('Save donation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get donation history
    async getDonationHistory(userId, limit = 10, offset = 0) {
        try {
            const result = await query(`
        SELECT d.*, p.title as program_title, p.category as program_category
        FROM donations d
        JOIN programs p ON d.program_id = p.id
        WHERE d.user_id = $1
        ORDER BY d.donated_at DESC
        LIMIT $2 OFFSET $3
      `, [userId, limit, offset]);

            return {
                success: true,
                donations: result.rows
            };
        } catch (error) {
            console.error('Get donation history error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Format amount
    formatAmount(amount, currency) {
        const currencies = {
            USD: { symbol: '$', decimals: 2 },
            EUR: { symbol: '€', decimals: 2 },
            TRY: { symbol: '₺', decimals: 2 },
            SAR: { symbol: 'ر.س', decimals: 2 }
        };

        const config = currencies[currency] || currencies.USD;
        return `${config.symbol}${amount.toFixed(config.decimals)}`;
    }
}

export default new PaymentService();
