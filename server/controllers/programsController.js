import { validationResult } from 'express-validator';
import { query } from '../config/database-sqlite.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get all programs (public)
export const getAllPrograms = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = '';
        const params = [];
        let paramIndex = 1;

        if (category && category !== 'all') {
            whereClause += ` WHERE category = ?`;
            params.push(category);
        }

        if (search) {
            const searchCondition = ` WHERE (title LIKE ? OR description LIKE ?)`;
            if (whereClause) {
                whereClause += ` AND (title LIKE ? OR description LIKE ?)`;
            } else {
                whereClause = searchCondition;
            }
            params.push(`%${search}%`, `%${search}%`);
        }

        // Get total count
        const countQuery = `SELECT COUNT(*) FROM programs${whereClause}`;
        const countResult = await query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);

        // Get programs with pagination
        const programsQuery = `
            SELECT
                id,
                title,
                description,
                category,
                goal_amount,
                current_amount,
                start_date,
                end_date,
                participants_count,
                status,
                image_url,
                created_at,
                updated_at
            FROM programs
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;

        const programsParams = [...params, limit, offset];
        const result = await query(programsQuery, programsParams);

        return successResponse(res, {
            items: result.rows,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        }, 'تم جلب البرامج بنجاح');
    } catch (error) {
        console.error('Programs fetch error:', error);
        return errorResponse(res, 'خطأ في جلب البرامج', 500, error);
    }
};

// Get single program (public)
export const getProgramById = async (req, res) => {
    try {
        const result = await query(`
            SELECT
                id, title, description, category, goal_amount, current_amount,
                participants_count, status, image_url, start_date, end_date,
                created_at, updated_at
            FROM programs
            WHERE id = ?
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return errorResponse(res, 'البرنامج غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم جلب البرنامج بنجاح');
    } catch (error) {
        console.error('Get program error:', error);
        return errorResponse(res, 'خطأ في جلب البرنامج', 500, error);
    }
};

// تسجيل مستخدم في برنامج
export const registerForProgram = async (req, res) => {
    try {
        const { id } = req.params; // program_id
        const { firstName, lastName, email, phone } = req.body;
        if (!firstName || !lastName || !email) {
            return errorResponse(res, 'الاسم والبريد الإلكتروني مطلوبان', 400);
        }
        const result = await query(
            `INSERT INTO program_registrations (program_id, first_name, last_name, email, phone, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
            [id, firstName, lastName, email, phone || null]
        );
        return successResponse(res, result.rows[0], 'تم التسجيل في البرنامج بنجاح');
    } catch (error) {
        console.error('Program registration error:', error);
        return errorResponse(res, 'خطأ في التسجيل في البرنامج', 500, error);
    }
};

// Add a new program (admin only)
export const createProgram = async (req, res) => {
    try {
        const {
            title,
            description,
            category = 'عام',
            goal_amount = 0,
            current_amount = 0,
            participants_count = 0,
            status = 'active',
            start_date,
            end_date
        } = req.body;

        const result = await query(`
            INSERT INTO programs (
                title, description, category, goal_amount, current_amount,
                participants_count, status, start_date, end_date, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `, [title, description, category, goal_amount, current_amount, participants_count, status, start_date, end_date]);

        return successResponse(res, result.rows[0], 'تم إضافة البرنامج بنجاح');
    } catch (error) {
        console.error('Program creation error:', error);
        return errorResponse(res, 'خطأ في إضافة البرنامج', 500, error);
    }
};

// Update a program (admin only)
export const updateProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            category,
            goal_amount,
            current_amount,
            participants_count,
            status,
            start_date,
            end_date
        } = req.body;

        const result = await query(`
            UPDATE programs
            SET title = ?, description = ?, category = ?, goal_amount = ?,
                current_amount = ?, participants_count = ?, status = ?,
                start_date = ?, end_date = ?, updated_at = datetime('now')
            WHERE id = ?
        `, [title, description, category, goal_amount, current_amount, participants_count, status, start_date, end_date, id]);

        if (result.rows.length === 0) {
            return errorResponse(res, 'البرنامج غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم تحديث البرنامج بنجاح');
    } catch (error) {
        console.error('Program update error:', error);
        return errorResponse(res, 'خطأ في تحديث البرنامج', 500, error);
    }
};

// Delete a program (admin only)
export const deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM programs WHERE id = ?', [id]);
        if (result.rows.length === 0) {
            return errorResponse(res, 'البرنامج غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم حذف البرنامج بنجاح');
    } catch (error) {
        console.error('Program deletion error:', error);
        return errorResponse(res, 'خطأ في حذف البرنامج', 500, error);
    }
};

export const supportProgram = async (req, res) => {
    try {
        const { id } = req.params; // program_id
        const { supporter_name, supporter_email, phone, amount, note } = req.body;
        if (!supporter_name || !supporter_email || !amount) {
            return res.status(400).json({ success: false, message: 'الاسم والبريد والمبلغ مطلوبة' });
        }
        const result = await query(
            `INSERT INTO program_supporters (program_id, supporter_name, supporter_email, phone, amount, note, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
            [id, supporter_name, supporter_email, phone || null, amount, note || null]
        );
        return res.json({ success: true, data: result.rows[0], message: 'تم تسجيل الدعم بنجاح' });
    } catch (error) {
        console.error('Support program error:', error);
        return res.status(500).json({ success: false, message: 'حدث خطأ أثناء تسجيل الدعم' });
    }
};