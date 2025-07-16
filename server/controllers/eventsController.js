import { validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get all events (public)
export const getAllEvents = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 10
        } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        let sql = 'SELECT id, title, description, event_date, location, created_at FROM events WHERE 1=1';
        const params = [];
        let paramIndex = 1;
        if (search) {
            sql += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR location ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }
        const countSql = sql.replace('SELECT id, title, description, event_date, location, created_at', 'SELECT COUNT(*)');
        const countResult = await query(countSql, params);
        const total = parseInt(countResult.rows[0].count);
        sql += ` ORDER BY event_date ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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
        }, 'تم جلب الفعاليات بنجاح');
    } catch (error) {
        console.error('Get events error:', error);
        return errorResponse(res, 'خطأ في جلب الفعاليات', 500, error);
    }
};

// Get single event by ID (public)
export const getEventById = async (req, res) => {
    try {
        const result = await query('SELECT * FROM events WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return errorResponse(res, 'الفعالية غير موجودة', 404);
        }
        return successResponse(res, result.rows[0], 'تم جلب الفعالية بنجاح');
    } catch (error) {
        console.error('Get event error:', error);
        return errorResponse(res, 'خطأ في جلب الفعالية', 500, error);
    }
};

// Create new event (admin only)
export const createEvent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'بيانات غير صالحة', 400, errors.array());
        }
        const {
            title,
            description,
            location,
            start_date,
            end_date,
            category,
            max_attendees,
            status = 'upcoming'
        } = req.body;
        if (new Date(end_date) <= new Date(start_date)) {
            return errorResponse(res, 'يجب أن يكون تاريخ النهاية بعد تاريخ البداية', 400);
        }
        const result = await query(
            `INSERT INTO events (title, description, location, start_date, end_date, category, max_attendees, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [title, description, location, start_date, end_date, category, max_attendees, status]
        );
        return successResponse(res, result.rows[0], 'تم إنشاء الفعالية بنجاح', 201);
    } catch (error) {
        console.error('Create event error:', error);
        return errorResponse(res, 'خطأ في إنشاء الفعالية', 500, error);
    }
};

// Update event (admin only)
export const updateEvent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'بيانات غير صالحة', 400, errors.array());
        }
        // Check if event exists
        const existingEvent = await query('SELECT * FROM events WHERE id = $1', [req.params.id]);
        if (existingEvent.rows.length === 0) {
            return errorResponse(res, 'الفعالية غير موجودة', 404);
        }
        // Build update query dynamically
        const updateFields = [];
        const values = [];
        let paramIndex = 1;
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                updateFields.push(`${key} = $${paramIndex}`);
                values.push(req.body[key]);
                paramIndex++;
            }
        });
        if (updateFields.length === 0) {
            return errorResponse(res, 'لا توجد بيانات لتحديثها', 400);
        }
        updateFields.push(`updated_at = NOW()`);
        values.push(req.params.id);
        const result = await query(
            `UPDATE events SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );
        return successResponse(res, result.rows[0], 'تم تحديث الفعالية بنجاح');
    } catch (error) {
        console.error('Update event error:', error);
        return errorResponse(res, 'خطأ في تحديث الفعالية', 500, error);
    }
};

// Delete event (admin only)
export const deleteEvent = async (req, res) => {
    try {
        const result = await query('DELETE FROM events WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return errorResponse(res, 'الفعالية غير موجودة', 404);
        }
        return successResponse(res, {}, 'تم حذف الفعالية بنجاح');
    } catch (error) {
        console.error('Delete event error:', error);
        return errorResponse(res, 'خطأ في حذف الفعالية', 500, error);
    }
};

// تسجيل مستخدم في فعالية
export const registerForEvent = async (req, res) => {
    try {
        console.log('BODY:', req.body); // طباعة محتوى البيانات القادمة
        const { id } = req.params; // event_id
        const { first_name, last_name, email, phone } = req.body;
        if (!first_name || !last_name || !email) {
            console.log('❌ بيانات ناقصة: ', { first_name, last_name, email });
            return res.status(400).json({ success: false, message: 'الاسم والبريد الإلكتروني مطلوبان' });
        }
        const result = await query(
            `INSERT INTO event_registrations (event_id, first_name, last_name, email, phone, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
            [id, first_name, last_name, email, phone || null]
        );
        return res.json({ success: true, data: result.rows[0], message: 'تم التسجيل في الفعالية بنجاح' });
    } catch (error) {
        console.error('Event registration error:', error);
        console.log('BODY عند الخطأ:', req.body);
        return res.status(500).json({ success: false, message: 'خطأ في التسجيل في الفعالية' });
    }
};