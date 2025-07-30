import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// الاشتراك في النشرة البريدية
export const subscribeToNewsletter = async (req, res) => {
    try {
        const { email, first_name, last_name } = req.body;

        if (!email) {
            return errorResponse(res, 'البريد الإلكتروني مطلوب', 400);
        }

        // التحقق من صحة البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return errorResponse(res, 'البريد الإلكتروني غير صحيح', 400);
        }

        // التحقق من وجود البريد الإلكتروني مسبقاً
        const existingSubscriber = await query(
            'SELECT id, status FROM newsletter_subscribers WHERE email = $1',
            [email]
        );

        if (existingSubscriber.rows.length > 0) {
            const subscriber = existingSubscriber.rows[0];

            if (subscriber.status === 'active') {
                return errorResponse(res, 'أنت مشترك بالفعل في النشرة البريدية', 400);
            } else {
                // إعادة تفعيل الاشتراك
                await query(
                    'UPDATE newsletter_subscribers SET status = \'active\', updated_at = NOW() WHERE id = $1',
                    [subscriber.id]
                );
                return successResponse(res, { email }, 'تم إعادة تفعيل اشتراكك بنجاح');
            }
        }

        // إضافة مشترك جديد
        const result = await query(
            `INSERT INTO newsletter_subscribers (email, first_name, last_name, subscribed_at, updated_at)
             VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, email`,
            [email, first_name || null, last_name || null]
        );

        return successResponse(res, result.rows[0], 'تم الاشتراك في النشرة البريدية بنجاح');
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return errorResponse(res, 'حدث خطأ أثناء الاشتراك في النشرة البريدية', 500, error);
    }
};

// إلغاء الاشتراك من النشرة البريدية
export const unsubscribeFromNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return errorResponse(res, 'البريد الإلكتروني مطلوب', 400);
        }

        const result = await query(
            'UPDATE newsletter_subscribers SET status = \'unsubscribed\', updated_at = NOW() WHERE email = $1 RETURNING id',
            [email]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, 'البريد الإلكتروني غير موجود في قائمة المشتركين', 404);
        }

        return successResponse(res, { email }, 'تم إلغاء الاشتراك بنجاح');
    } catch (error) {
        console.error('Newsletter unsubscribe error:', error);
        return errorResponse(res, 'حدث خطأ أثناء إلغاء الاشتراك', 500, error);
    }
};

// جلب قائمة المشتركين (للمديرين فقط)
export const getNewsletterSubscribers = async (req, res) => {
    try {
        const { page = 1, limit = 50, status } = req.query;
        const offset = (page - 1) * limit;

        let queryText = 'SELECT * FROM newsletter_subscribers';
        const queryParams = [];

        if (status) {
            queryText += ' WHERE status = $1';
            queryParams.push(status);
        }

        queryText += ' ORDER BY subscribed_at DESC';

        if (limit) {
            queryText += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
            queryParams.push(limit, offset);
        }

        const result = await query(queryText, queryParams);

        // جلب العدد الإجمالي
        let countQuery = 'SELECT COUNT(*) FROM newsletter_subscribers';
        if (status) {
            countQuery += ' WHERE status = $1';
        }
        const countResult = await query(countQuery, status ? [status] : []);
        const total = parseInt(countResult.rows[0].count);

        return successResponse(res, {
            subscribers: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        }, 'تم جلب قائمة المشتركين بنجاح');
    } catch (error) {
        console.error('Get newsletter subscribers error:', error);
        return errorResponse(res, 'حدث خطأ أثناء جلب قائمة المشتركين', 500, error);
    }
};