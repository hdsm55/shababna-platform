import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get all contact forms (admin only)
export const getAllContactForms = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        // بناء الاستعلام الديناميكي
        let whereClause = '';
        const params = [];
        let paramIndex = 1;

        if (status) {
            if (status === 'read') {
                whereClause += ` WHERE is_read = true`;
            } else if (status === 'unread') {
                whereClause += ` WHERE is_read = false`;
            }
        }

        // استعلام العد
        const countQuery = `SELECT COUNT(*) FROM contact_forms${whereClause}`;
        const countResult = await query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);

        // استعلام البيانات
        const dataQuery = `
            SELECT
                id,
                name,
                email,
                subject,
                message,
                is_read,
                created_at,
                updated_at
            FROM contact_forms
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        params.push(parseInt(limit), offset);
        const result = await query(dataQuery, params);

        const totalPages = Math.ceil(total / limit);
        const pagination = {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages
        };

        return successResponse(res, {
            forms: result.rows,
            pagination
        }, 'تم جلب رسائل التواصل بنجاح');
    } catch (error) {
        console.error('Contact forms fetch error:', error);
        return errorResponse(res, 'خطأ في جلب رسائل التواصل', 500, error);
    }
};

// Get single contact form (admin only)
export const getContactFormById = async (req, res) => {
    try {
        const result = await query(`
            SELECT
                id,
                name,
                email,
                subject,
                message,
                is_read,
                created_at,
                updated_at
            FROM contact_forms
            WHERE id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return errorResponse(res, 'رسالة التواصل غير موجودة', 404);
        }
        return successResponse(res, result.rows[0], 'تم جلب رسالة التواصل بنجاح');
    } catch (error) {
        console.error('Get contact form error:', error);
        return errorResponse(res, 'خطأ في جلب رسالة التواصل', 500, error);
    }
};

// Update read status (admin only)
export const updateContactFormReadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_read } = req.body;

        const result = await query(`
            UPDATE contact_forms
            SET is_read = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id, name, email, subject, message, is_read, created_at, updated_at
        `, [is_read, id]);

        if (result.rows.length === 0) {
            return errorResponse(res, 'رسالة التواصل غير موجودة', 404);
        }

        return successResponse(res, result.rows[0], 'تم تحديث حالة الرسالة بنجاح');
    } catch (error) {
        console.error('Update contact form read status error:', error);
        return errorResponse(res, 'خطأ في تحديث حالة الرسالة', 500, error);
    }
};

// Delete contact form (admin only)
export const deleteContactForm = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM contact_forms WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return errorResponse(res, 'رسالة التواصل غير موجودة', 404);
        }

        return successResponse(res, result.rows[0], 'تم حذف رسالة التواصل بنجاح');
    } catch (error) {
        console.error('Contact form deletion error:', error);
        return errorResponse(res, 'خطأ في حذف رسالة التواصل', 500, error);
    }
};
