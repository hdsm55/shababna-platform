import { validationResult } from 'express-validator';
import { getRow, getRows, query } from '../config/database.js';
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
        let sql = 'SELECT id, title, description, start_date, end_date, location, max_attendees, attendees, category, image_url, status, created_at, updated_at FROM events WHERE 1=1';
        const params = [];
        let paramIndex = 1;
        if (search) {
            sql += ` AND (title LIKE $${paramIndex} OR description LIKE $${paramIndex + 1} OR location LIKE $${paramIndex + 2})`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
            paramIndex += 3;
        }
        const countSql = sql.replace('SELECT id, title, description, start_date, end_date, location, max_attendees, attendees, category, image_url, status, created_at, updated_at', 'SELECT COUNT(*) as count');
        const countResult = await getRow(countSql, params);
        const total = parseInt(countResult.count);
        sql += ` ORDER BY start_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(parseInt(limit), offset);
        const result = await getRows(sql, params);
        const totalPages = Math.ceil(total / parseInt(limit));
        return successResponse(res, {
            items: result,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        }, 'تم جلب الفعاليات بنجاح');
    } catch (error) {
        console.error('Get events error:', error);
        return errorResponse(res, 'حدث خطأ أثناء جلب الفعاليات. يرجى المحاولة لاحقًا.', 500, error);
    }
};

// Get single event by ID (public)
export const getEventById = async (req, res) => {
    try {
        const result = await getRow('SELECT id, title, description, start_date, end_date, location, max_attendees, attendees, category, image_url, status, created_at, updated_at FROM events WHERE id = ?', [req.params.id]);
        if (!result) {
            return errorResponse(res, 'الفعالية غير موجودة', 404);
        }
        return successResponse(res, result, 'تم جلب الفعالية بنجاح');
    } catch (error) {
        console.error('Get event error:', error);
        return errorResponse(res, 'حدث خطأ أثناء جلب الفعالية. يرجى المحاولة لاحقًا.', 500, error);
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
            attendees = 0,
            image_url = '',
            status = 'upcoming'
        } = req.body;
        if (new Date(end_date) < new Date(start_date)) {
            return errorResponse(res, 'يجب أن يكون تاريخ النهاية بعد تاريخ البداية', 400);
        }
        const finalImageUrl = image_url && image_url.trim() !== '' ? image_url : null;
        const result = await query(
            `INSERT INTO events (title, description, start_date, end_date, location, max_attendees, attendees, category, image_url, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
       RETURNING id`,
            [title, description, start_date, end_date, location, max_attendees, attendees, category, finalImageUrl, status]
        );
        const newEvent = await getRow('SELECT * FROM events WHERE id = $1', [result.rows[0].id]);
        return successResponse(res, newEvent, 'تم إنشاء الفعالية بنجاح', 201);
    } catch (error) {
        console.error('Create event error:', error);
        return errorResponse(res, 'حدث خطأ أثناء إنشاء الفعالية. يرجى المحاولة لاحقًا.', 500, error);
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
        const existingEvent = await getRow('SELECT id FROM events WHERE id = $1', [req.params.id]);
        if (!existingEvent) {
            return errorResponse(res, 'الفعالية غير موجودة', 404);
        }
        // Build update query dynamically (يسمح فقط بالحقول الفعلية)
        const allowedFields = ['title', 'description', 'start_date', 'end_date', 'location', 'max_attendees', 'attendees', 'category', 'image_url', 'status'];
        const updateFields = [];
        const values = [];
        let paramIndex = 1;
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key) && req.body[key] !== undefined) {
                updateFields.push(`${key} = ?`);
                values.push(req.body[key]);
                paramIndex++;
            }
        });
        if (updateFields.length === 0) {
            return errorResponse(res, 'لا توجد بيانات لتحديثها', 400);
        }
        updateFields.push(`updated_at = NOW()`);
        values.push(req.params.id);
        await query(
            `UPDATE events SET ${updateFields.join(', ')} WHERE id = $${values.length}`,
            values
        );
        const updatedEvent = await getRow('SELECT * FROM events WHERE id = $1', [req.params.id]);
        return successResponse(res, updatedEvent, 'تم تحديث الفعالية بنجاح');
    } catch (error) {
        console.error('Update event error:', error);
        return errorResponse(res, 'حدث خطأ أثناء تحديث الفعالية. يرجى المحاولة لاحقًا.', 500, error);
    }
};

// Delete event (admin only)
export const deleteEvent = async (req, res) => {
    try {
        const result = await query('DELETE FROM events WHERE id = $1', [req.params.id]);
        if (result.rowCount === 0) {
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
        // Log payload for debugging
        console.log('registerForEvent payload:', req.body, 'event_id:', req.params.id);
        const { id } = req.params; // event_id
        const { user_id, first_name, last_name, email, phone } = req.body;
        // يجب أن يكون إما user_id أو (first_name و last_name و email)
        if (!user_id && (!first_name || !last_name || !email)) {
            return res.status(400).json({ success: false, message: 'يجب إدخال بيانات العضو أو بيانات شخصية (الاسم والبريد الإلكتروني)' });
        }
        const result = await query(
            `INSERT INTO event_registrations (event_id, user_id, first_name, last_name, email, phone, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             RETURNING id`,
            [id, user_id || null, first_name || null, last_name || null, email || null, phone || null]
        );
        const newRegistration = await getRow('SELECT * FROM event_registrations WHERE id = $1', [result.rows[0].id]);
        return res.json({ success: true, data: newRegistration, message: 'تم التسجيل في الفعالية بنجاح' });
    } catch (error) {
        console.error('Event registration error:', error);
        return res.status(500).json({ success: false, message: 'حدث خطأ أثناء التسجيل في الفعالية. يرجى المحاولة لاحقًا.' });
    }
};