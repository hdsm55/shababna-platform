import { validationResult } from 'express-validator';
import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../utils/response.js';

// Join organization
export const joinOrganization = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'بيانات غير صالحة', 400, errors.array());
        }
        const membershipApplication = {
            id: Date.now().toString(),
            ...req.body,
            status: 'pending',
            submittedAt: new Date()
        };
        // In a real app, you'd save to database
        // users.push(membershipApplication);
        return successResponse(res, { applicationId: membershipApplication.id }, 'تم إرسال طلب العضوية بنجاح', 201);
    } catch (error) {
        console.error('Join organization error:', error);
        return errorResponse(res, 'خطأ في الخادم', 500, error);
    }
};

// Contact form
export const contactForm = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'بيانات غير صالحة', 400, errors.array());
        }
        const contactMessage = {
            id: Date.now().toString(),
            ...req.body,
            status: 'new',
            submittedAt: new Date()
        };
        // In a real app, you'd save to database and possibly send email
        console.log('Contact message received:', contactMessage);
        return successResponse(res, { messageId: contactMessage.id }, 'تم إرسال الرسالة بنجاح');
    } catch (error) {
        console.error('Contact form error:', error);
        return errorResponse(res, 'خطأ في الخادم', 500, error);
    }
};

// Get user profile (authenticated user)
export const getUserProfile = async (req, res) => {
    try {
        // This would be implemented with auth middleware
        // For now, we'll return a placeholder
        return successResponse(res, {}, 'نقطة نهاية ملف المستخدم - تتطلب تسجيل الدخول');
    } catch (error) {
        console.error('Get user profile error:', error);
        return errorResponse(res, 'خطأ في الخادم', 500, error);
    }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const result = await query(`
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.role,
        u.created_at
      FROM users u
      ORDER BY u.created_at DESC
    `);
        return successResponse(res, { items: result.rows, total: result.rows.length }, 'تم جلب المستخدمين بنجاح');
    } catch (error) {
        console.error('Users fetch error:', error);
        return errorResponse(res, 'خطأ في جلب المستخدمين', 500, error);
    }
};

// Add new user (admin only)
export const createUser = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            role = 'user'
        } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await query(`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name, last_name, email, role, created_at
    `, [first_name, last_name, email, hashedPassword, role]);
        return successResponse(res, result.rows[0], 'تم إضافة المستخدم بنجاح');
    } catch (error) {
        console.error('User creation error:', error);
        return errorResponse(res, 'خطأ في إضافة المستخدم', 500, error);
    }
};

// Update user (admin only)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            first_name,
            last_name,
            email,
            password,
            role
        } = req.body;
        let updateFields = [first_name, last_name, email, role, id];
        let queryStr = `
      UPDATE users
      SET first_name = $1, last_name = $2, email = $3, role = $4
      WHERE id = $5
      RETURNING id, first_name, last_name, email, role, created_at
    `;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields = [first_name, last_name, email, hashedPassword, role, id];
            queryStr = `
        UPDATE users
        SET first_name = $1, last_name = $2, email = $3, password = $4, role = $5
        WHERE id = $6
        RETURNING id, first_name, last_name, email, role, created_at
      `;
        }
        const result = await query(queryStr, updateFields);
        if (result.rows.length === 0) {
            return errorResponse(res, 'المستخدم غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم تحديث المستخدم بنجاح');
    } catch (error) {
        console.error('User update error:', error);
        return errorResponse(res, 'خطأ في تحديث المستخدم', 500, error);
    }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return errorResponse(res, 'المستخدم غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم حذف المستخدم بنجاح');
    } catch (error) {
        console.error('User deletion error:', error);
        return errorResponse(res, 'خطأ في حذف المستخدم', 500, error);
    }
};