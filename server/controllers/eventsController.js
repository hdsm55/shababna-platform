import { validationResult } from 'express-validator';
import { query } from '../config/database-sqlite.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Cache for events data
const eventsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all events (public) - Optimized with caching and better indexing
export const getAllEvents = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 10,
            category,
            status
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Create cache key
        const cacheKey = `events-${JSON.stringify({ search, page, limit, category, status })}`;
        const cached = eventsCache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return successResponse(res, cached.data, 'تم جلب الفعاليات بنجاح');
        }

        // Optimized query with proper indexing
        let sql = `
            SELECT
                id, title, description, start_date, end_date,
                location, max_attendees, attendees, category,
                image_url, status, created_at, updated_at
            FROM events
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (search) {
            sql += ` AND (
                title LIKE ? OR
                description LIKE ? OR
                location LIKE ?
            )`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (category) {
            sql += ` AND category = ?`;
            params.push(category);
        }

        if (status) {
            sql += ` AND status = ?`;
            params.push(status);
        }

        // Get total count with same conditions
        const countSql = sql.replace(
            'SELECT id, title, description, start_date, end_date, location, max_attendees, attendees, category, image_url, status, created_at, updated_at',
            'SELECT COUNT(*)'
        );

        const countResult = await query(countSql, params);
        const total = parseInt(countResult.rows[0].count);

        // Add ordering and pagination
        sql += ` ORDER BY start_date DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), offset);

        const result = await query(sql, params);
        const totalPages = Math.ceil(total / parseInt(limit));

        const responseData = {
            items: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        };

        // Cache the result
        eventsCache.set(cacheKey, {
            data: responseData,
            timestamp: Date.now(),
        });

        return successResponse(res, responseData, 'تم جلب الفعاليات بنجاح');
    } catch (error) {
        console.error('Get events error:', error);
        return errorResponse(res, 'حدث خطأ أثناء جلب الفعاليات. يرجى المحاولة لاحقًا.', 500, error);
    }
};

// Get single event by ID (public) - Optimized with caching
export const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Check cache first
        const cacheKey = `event-${eventId}`;
        const cached = eventsCache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return successResponse(res, cached.data, 'تم جلب الفعالية بنجاح');
        }

        const result = await query(
            'SELECT id, title, description, start_date, end_date, location, max_attendees, attendees, category, image_url, status, created_at, updated_at FROM events WHERE id = ?',
            [eventId]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, 'الفعالية غير موجودة', 404);
        }

        const eventData = result.rows[0];

        // Cache the result
        eventsCache.set(cacheKey, {
            data: eventData,
            timestamp: Date.now(),
        });

        return successResponse(res, eventData, 'تم جلب الفعالية بنجاح');
    } catch (error) {
        console.error('Get event error:', error);
        return errorResponse(res, 'حدث خطأ أثناء جلب الفعالية. يرجى المحاولة لاحقًا.', 500, error);
    }
};

// Clear events cache
const clearEventsCache = () => {
    eventsCache.clear();
};

// Clear specific event cache
const clearEventCache = (eventId) => {
    eventsCache.delete(`event-${eventId}`);
    // Clear list cache as well
    for (const key of eventsCache.keys()) {
        if (key.startsWith('events-')) {
            eventsCache.delete(key);
        }
    }
};

// Create new event (admin only) - Optimized
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
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [title, description, start_date, end_date, location, max_attendees, attendees, category, finalImageUrl, status]
        );

        // Clear cache after creating new event
        clearEventsCache();

        return successResponse(res, result.rows[0], 'تم إنشاء الفعالية بنجاح', 201);
    } catch (error) {
        console.error('Create event error:', error);
        return errorResponse(res, 'حدث خطأ أثناء إنشاء الفعالية. يرجى المحاولة لاحقًا.', 500, error);
    }
};

// Update event (admin only) - Optimized
export const updateEvent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'بيانات غير صالحة', 400, errors.array());
        }

        const eventId = req.params.id;
        const {
            title,
            description,
            location,
            start_date,
            end_date,
            category,
            max_attendees,
            attendees,
            image_url,
            status
        } = req.body;

        if (end_date && start_date && new Date(end_date) < new Date(start_date)) {
            return errorResponse(res, 'يجب أن يكون تاريخ النهاية بعد تاريخ البداية', 400);
        }

        const result = await query(
            `UPDATE events
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 location = COALESCE($3, location),
                 start_date = COALESCE($4, start_date),
                 end_date = COALESCE($5, end_date),
                 category = COALESCE($6, category),
                 max_attendees = COALESCE($7, max_attendees),
                 attendees = COALESCE($8, attendees),
                 image_url = COALESCE($9, image_url),
                 status = COALESCE($10, status),
                 updated_at = NOW()
             WHERE id = $11
             RETURNING id, title, description, start_date, end_date, location, max_attendees, attendees, category, image_url, status, created_at, updated_at`,
            [title, description, location, start_date, end_date, category, max_attendees, attendees, image_url, status, eventId]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, 'الفعالية غير موجودة', 404);
        }

        // Clear cache after update
        clearEventCache(eventId);

        return successResponse(res, result.rows[0], 'تم تحديث الفعالية بنجاح');
    } catch (error) {
        console.error('Update event error:', error);
        return errorResponse(res, 'حدث خطأ أثناء تحديث الفعالية. يرجى المحاولة لاحقًا.', 500, error);
    }
};

// Delete event (admin only) - Optimized
export const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        const result = await query('DELETE FROM events WHERE id = ?', [eventId]);

        if (result.rows.length === 0) {
            return errorResponse(res, 'الفعالية غير موجودة', 404);
        }

        // Clear cache after deletion
        clearEventCache(eventId);

        return successResponse(res, null, 'تم حذف الفعالية بنجاح');
    } catch (error) {
        console.error('Delete event error:', error);
        return errorResponse(res, 'حدث خطأ أثناء حذف الفعالية. يرجى المحاولة لاحقًا.', 500, error);
    }
};

// Register for an event - Optimized
export const registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { first_name, last_name, email, phone } = req.body;

        // Check if event exists and has available spots
        const eventResult = await query(
            'SELECT id, title, max_attendees, attendees FROM events WHERE id = ?',
            [eventId]
        );

        if (eventResult.rows.length === 0) {
            return errorResponse(res, 'الفعالية غير موجودة', 404);
        }

        const event = eventResult.rows[0];

        if (event.attendees >= event.max_attendees) {
            return errorResponse(res, 'الفعالية ممتلئة', 400);
        }

        // Check if user already registered
        const existingRegistration = await query(
            'SELECT id FROM event_registrations WHERE event_id = ? AND email = ?',
            [eventId, email]
        );

        if (existingRegistration.rows.length > 0) {
            return errorResponse(res, 'أنت مسجل بالفعل في هذه الفعالية', 400);
        }

        // Register user
        await query(
            'INSERT INTO event_registrations (event_id, first_name, last_name, email, phone, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))',
            [eventId, first_name, last_name, email, phone]
        );

        // Update attendees count
        await query(
            'UPDATE events SET attendees = attendees + 1 WHERE id = ?',
            [eventId]
        );

        // Clear cache
        clearEventCache(eventId);

        return successResponse(res, { message: 'تم التسجيل في الفعالية بنجاح' }, 'تم التسجيل في الفعالية بنجاح');
    } catch (error) {
        console.error('Register for event error:', error);
        return errorResponse(res, 'حدث خطأ أثناء التسجيل في الفعالية. يرجى المحاولة لاحقًا.', 500, error);
    }
};