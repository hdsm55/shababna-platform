import { validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get all programs (public)
export const getAllPrograms = async (req, res) => {
    try {
        const result = await query(`
      SELECT
        p.*,
        COALESCE(SUM(d.amount), 0) as current_amount,
        COUNT(DISTINCT d.user_id) as participants_count
      FROM programs p
      LEFT JOIN donations d ON p.id = d.program_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
        return successResponse(res, { items: result.rows, total: result.rows.length }, 'تم جلب البرامج بنجاح');
    } catch (error) {
        console.error('Programs fetch error:', error);
        return errorResponse(res, 'خطأ في جلب البرامج', 500, error);
    }
};

// Get single program (public)
export const getProgramById = async (req, res) => {
    try {
        const result = await query('SELECT * FROM programs WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return errorResponse(res, 'البرنامج غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم جلب البرنامج بنجاح');
    } catch (error) {
        console.error('Get program error:', error);
        return errorResponse(res, 'خطأ في جلب البرنامج', 500, error);
    }
};

// Support program (public)
export const supportProgram = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'بيانات غير صالحة', 400, errors.array());
        }
        // في تطبيق حقيقي، يتم حفظ الطلب في قاعدة البيانات
        return successResponse(res, {}, 'تم إرسال طلب الدعم بنجاح');
    } catch (error) {
        console.error('Program support error:', error);
        return errorResponse(res, 'خطأ في دعم البرنامج', 500, error);
    }
};

// Add a new program (admin only)
export const createProgram = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            goal_amount,
            start_date,
            end_date
        } = req.body;
        // معالجة الصورة إذا وجدت
        let image_url = null;
        if (req.file) {
            // يمكن تعديل الرابط حسب إعدادات السيرفر/النطاق لاحقًا
            image_url = `/uploads/${req.file.filename}`;
        }
        const result = await query(`
      INSERT INTO programs (title, description, category, goal_amount, start_date, end_date, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, description, category, goal_amount, start_date, end_date, image_url]);
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
            start_date,
            end_date
        } = req.body;
        const result = await query(`
      UPDATE programs
      SET title = $1, description = $2, category = $3, goal_amount = $4,
          start_date = $5, end_date = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `, [title, description, category, goal_amount, start_date, end_date, id]);
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