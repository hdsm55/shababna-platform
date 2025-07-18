import { validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get all programs (public)
export const getAllPrograms = async (req, res) => {
    try {
        const {
            search,
            category,
            page = 1,
            limit = 10
        } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        let sql = 'SELECT id, title, description, category, image_url, start_date, end_date, created_at, updated_at FROM programs WHERE 1=1';
        const params = [];
        let paramIndex = 1;
        if (search) {
            sql += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }
        if (category) {
            sql += ` AND category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }
        const countSql = sql.replace('SELECT id, title, description, category, image_url, start_date, end_date, created_at, updated_at', 'SELECT COUNT(*)');
        const countResult = await query(countSql, params);
        const total = parseInt(countResult.rows[0].count);
        sql += ` ORDER BY start_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(parseInt(limit), offset);
        const result = await query(sql, params);
        const totalPages = Math.ceil(total / parseInt(limit));
        return successResponse(res, {
            items: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        }, 'تم جلب البرامج بنجاح');
    } catch (error) {
        console.error('Programs fetch error:', error);
        return errorResponse(res, 'حدث خطأ أثناء جلب البرامج. يرجى المحاولة لاحقًا.', 500, error);
    }
};

// Get single program (public)
export const getProgramById = async (req, res) => {
    try {
        const result = await query('SELECT id, title, description, category, image_url, start_date, end_date, created_at, updated_at FROM programs WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return errorResponse(res, 'البرنامج غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم جلب البرنامج بنجاح');
    } catch (error) {
        console.error('Get program error:', error);
        return errorResponse(res, 'حدث خطأ أثناء جلب البرنامج. يرجى المحاولة لاحقًا.', 500, error);
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
            `INSERT INTO program_registrations (program_id, first_name, last_name, email, phone, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
            [id, firstName, lastName, email, phone || null]
        );
        return successResponse(res, result.rows[0], 'تم التسجيل في البرنامج بنجاح');
    } catch (error) {
        console.error('Program registration error:', error);
        return errorResponse(res, 'خطأ في التسجيل في البرنامج', 500, error);
    }
};

// دعم/تبرع لبرنامج
export const supportProgram = async (req, res) => {
    try {
        const { id } = req.params; // program_id
        const { name, email, amount } = req.body;
        if (!name || !email || !amount) {
            return errorResponse(res, 'جميع الحقول مطلوبة (الاسم، البريد، المبلغ)', 400);
        }
        const result = await query(
            `INSERT INTO program_supporters (program_id, name, email, amount, payment_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [id, name, email, amount, 'pending']
        );
        return successResponse(res, result.rows[0], 'تم تسجيل الدعم بنجاح');
    } catch (error) {
        console.error('Program support error:', error);
        return errorResponse(res, 'خطأ في تسجيل الدعم', 500, error);
    }
};

// Add a new program (admin only)
export const createProgram = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            image_url = '',
            start_date,
            end_date
        } = req.body;
        const result = await query(`
      INSERT INTO programs (title, description, category, image_url, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, description, category, image_url, start_date, end_date, created_at, updated_at
    `, [title, description, category, image_url, start_date, end_date]);
        return successResponse(res, result.rows[0], 'تم إضافة البرنامج بنجاح');
    } catch (error) {
        console.error('Program creation error:', error);
        return errorResponse(res, 'حدث خطأ أثناء إضافة البرنامج. يرجى المحاولة لاحقًا.', 500, error);
    }
};

// Update a program (admin only)
export const updateProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const allowedFields = ['title', 'description', 'category', 'image_url', 'start_date', 'end_date'];
        const updateFields = [];
        const values = [];
        let paramIndex = 1;
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key) && req.body[key] !== undefined) {
                updateFields.push(`${key} = $${paramIndex}`);
                values.push(req.body[key]);
                paramIndex++;
            }
        });
        if (updateFields.length === 0) {
            return errorResponse(res, 'لا توجد بيانات لتحديثها', 400);
        }
        updateFields.push(`updated_at = NOW()`);
        values.push(id);
        const result = await query(
            `UPDATE programs SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING id, title, description, category, image_url, start_date, end_date, created_at, updated_at`,
            values
        );
        if (result.rows.length === 0) {
            return errorResponse(res, 'البرنامج غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم تحديث البرنامج بنجاح');
    } catch (error) {
        console.error('Program update error:', error);
        return errorResponse(res, 'حدث خطأ أثناء تحديث البرنامج. يرجى المحاولة لاحقًا.', 500, error);
    }
};

// Delete a program (admin only)
export const deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return errorResponse(res, 'البرنامج غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم حذف البرنامج بنجاح');
    } catch (error) {
        console.error('Program deletion error:', error);
        return errorResponse(res, 'خطأ في حذف البرنامج', 500, error);
    }
};