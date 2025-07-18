import { validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get all programs (public)
export const getAllPrograms = async (req, res) => {
    try {
        const result = await query(`
      SELECT
        id,
        title,
        description,
        start_date,
        end_date,
        created_at
        FROM programs
        ORDER BY created_at DESC
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

// Add a new program (admin only)
export const createProgram = async (req, res) => {
    try {
        const {
            title,
            description,
            start_date,
            end_date
        } = req.body;
        const result = await query(`
      INSERT INTO programs (title, description, start_date, end_date)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, description, start_date, end_date, created_at
    `, [title, description, start_date, end_date]);
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
            start_date,
            end_date
        } = req.body;
        const result = await query(`
      UPDATE programs
      SET title = $1, description = $2, start_date = $3, end_date = $4
      WHERE id = $5
      RETURNING id, title, description, start_date, end_date, created_at
    `, [title, description, start_date, end_date, id]);
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