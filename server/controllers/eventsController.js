import { validationResult } from 'express-validator';
import { getRow, getRows, query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { sendAdminNotification } from '../services/emailService.js';

// Get all events (public)
export const getAllEvents = async (req, res) => {
    try {
        const {
            search,
            category,
            status,
            page = 1,
            limit = 10
        } = req.query;

        console.log('🔍 Events Controller Query Params:', {
            search,
            category,
            status,
            page,
            limit
        });

        const offset = (parseInt(page) - 1) * parseInt(limit);
        let sql = `
            SELECT
                e.id,
                e.title,
                e.description,
                e.start_date,
                e.end_date,
                e.location,
                e.max_attendees,
                COALESCE(COUNT(er.id), 0) as attendees,
                e.category,
                e.image_url,
                e.status,
                e.created_at,
                e.updated_at
            FROM events e
            LEFT JOIN event_registrations er ON e.id = er.event_id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (search) {
            sql += ` AND (e.title LIKE $${paramIndex} OR e.description LIKE $${paramIndex + 1} OR e.location LIKE $${paramIndex + 2})`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
            paramIndex += 3;
        }

        if (category && category !== 'all') {
            sql += ` AND e.category = $${paramIndex}`;
            params.push(category);
            paramIndex += 1;
        }

        if (status && status !== 'all') {
            sql += ` AND e.status = $${paramIndex}`;
            params.push(status);
            paramIndex += 1;
        }

        sql += ` GROUP BY e.id, e.title, e.description, e.start_date, e.end_date, e.location, e.max_attendees, e.category, e.image_url, e.status, e.created_at, e.updated_at`;

        console.log('🔍 SQL Query:', sql);
        console.log('🔍 SQL Params:', params);

        let countSql = `SELECT COUNT(DISTINCT e.id) as count FROM events e WHERE 1=1`;
        const countParams = [];
        let countParamIndex = 1;

        if (search) {
            countSql += ` AND (e.title LIKE $${countParamIndex} OR e.description LIKE $${countParamIndex + 1} OR e.location LIKE $${countParamIndex + 2})`;
            countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
            countParamIndex += 3;
        }

        if (category && category !== 'all') {
            countSql += ` AND e.category = $${countParamIndex}`;
            countParams.push(category);
            countParamIndex += 1;
        }

        if (status && status !== 'all') {
            countSql += ` AND e.status = $${countParamIndex}`;
            countParams.push(status);
            countParamIndex += 1;
        }

        const countResult = await getRow(countSql, countParams);
        const total = parseInt(countResult.count);
        const finalSql = sql + ` ORDER BY e.start_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        const finalParams = [...params, parseInt(limit), offset];
        const result = await getRows(finalSql, finalParams);
        const totalPages = Math.ceil(total / parseInt(limit));

        console.log('📊 Events Result:', {
            total,
            totalPages,
            itemsCount: result.length,
            categories: [...new Set(result.map(item => item.category))]
        });

        return successResponse(res, {
            events: result,
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
        console.log('🔍 Getting event by ID:', req.params.id);
        const result = await getRow(`
            SELECT
                e.id,
                e.title,
                e.description,
                e.start_date,
                e.end_date,
                e.location,
                e.max_attendees,
                COALESCE(COUNT(er.id), 0) as attendees,
                e.category,
                e.image_url,
                e.status,
                e.created_at,
                e.updated_at
            FROM events e
            LEFT JOIN event_registrations er ON e.id = er.event_id
            WHERE e.id = $1
            GROUP BY e.id, e.title, e.description, e.start_date, e.end_date, e.location, e.max_attendees, e.category, e.image_url, e.status, e.created_at, e.updated_at
        `, [req.params.id]);
        console.log('📊 Event result:', result);
        if (!result) {
            console.log('❌ Event not found');
            return errorResponse(res, 'الفعالية غير موجودة', 404);
        }
        console.log('✅ Event found successfully');
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
        const finalImageUrl = image_url && image_url.trim() !== '' ? image_url : '/images/events-default.jpg';
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
        console.log('🔧 تحديث الفعالية:', req.params.id);
        console.log('📋 البيانات المرسلة:', req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ أخطاء التحقق:', errors.array());
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
                updateFields.push(`${key} = $${paramIndex}`);
                // استخدام الصورة الافتراضية إذا لم يتم توفير صورة
                if (key === 'image_url' && (!req.body[key] || req.body[key].trim() === '')) {
                    values.push('/images/events-default.jpg');
                } else {
                    values.push(req.body[key]);
                }
                paramIndex++;
            }
        });
        if (updateFields.length === 0) {
            return errorResponse(res, 'لا توجد بيانات لتحديثها', 400);
        }
        updateFields.push(`updated_at = NOW()`);
        values.push(req.params.id);
        const updateQuery = `UPDATE events SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`;
        console.log('🔧 SQL Query:', updateQuery);
        console.log('📋 Values:', values);

        await query(updateQuery, values);
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

        // التحقق من وجود الفعالية وحالتها
        const event = await getRow('SELECT * FROM events WHERE id = $1', [id]);
        if (!event) {
            return res.status(404).json({ success: false, message: 'الفعالية غير موجودة' });
        }

        // التحقق من حالة الفعالية
        if (event.status === 'completed') {
            return res.status(400).json({ success: false, message: 'لا يمكن التسجيل في فعالية مكتملة' });
        }

        // التحقق من عدد المسجلين
        if (event.max_attendees && event.attendees >= event.max_attendees) {
            return res.status(400).json({ success: false, message: 'الفعالية ممتلئة ولا يمكن التسجيل فيها' });
        }

        // التحقق من عدم التسجيل مسبقاً
        const existingRegistration = await getRow(
            'SELECT * FROM event_registrations WHERE event_id = $1 AND email = $2',
            [id, email]
        );
        if (existingRegistration) {
            return res.status(409).json({
                success: false,
                message: 'أنت مسجل مسبقاً في هذه الفعالية',
                alreadyRegistered: true
            });
        }

        // بدء المعاملة
        await query('BEGIN');

        try {
            // إضافة التسجيل
            const result = await query(
                `INSERT INTO event_registrations (event_id, user_id, first_name, last_name, email, phone, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, NOW())
                 RETURNING id`,
                [id, user_id || null, first_name || null, last_name || null, email || null, phone || null]
            );

            // تحديث عدد المسجلين في الفعالية
            await query(
                'UPDATE events SET attendees = attendees + 1, updated_at = NOW() WHERE id = $1',
                [id]
            );

            // تأكيد المعاملة
            await query('COMMIT');

            // جلب البيانات المحدثة
            const updatedEvent = await getRow('SELECT * FROM events WHERE id = $1', [id]);
            const newRegistration = await getRow('SELECT * FROM event_registrations WHERE id = $1', [result.rows[0].id]);

            // إرسال إشعار للإدارة عند التسجيل في فعالية
            try {
                const adminNotificationData = {
                    form_type: 'event_registration',
                    name: `${first_name || 'غير محدد'} ${last_name || 'غير محدد'}`,
                    email: email || 'غير محدد',
                    phone: phone || 'غير محدد',
                    subject: 'تسجيل جديد في فعالية',
                    message: `تم تسجيل جديد في فعالية:\n\nاسم الفعالية: ${event.title}\nالمكان: ${event.location}\nالتاريخ: ${new Date(event.start_date).toLocaleString('ar-SA')}\n\nالمسجل:\nالاسم: ${first_name || 'غير محدد'} ${last_name || 'غير محدد'}\nالبريد الإلكتروني: ${email || 'غير محدد'}\nالهاتف: ${phone || 'غير محدد'}\n\nتاريخ التسجيل: ${new Date().toLocaleString('ar-SA')}`
                };
                await sendAdminNotification(adminNotificationData);
                console.log('✅ تم إرسال إشعار تسجيل فعالية للإدارة');
            } catch (emailError) {
                console.error('❌ خطأ في إرسال إشعار تسجيل فعالية:', emailError);
                // لا نعيد خطأ للمستخدم لأن التسجيل تم بنجاح
            }

            return res.json({
                success: true,
                data: {
                    registration: newRegistration,
                    event: updatedEvent
                },
                message: 'تم التسجيل في الفعالية بنجاح'
            });
        } catch (error) {
            // التراجع عن المعاملة في حالة الخطأ
            await query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Event registration error:', error);
        return res.status(500).json({ success: false, message: 'حدث خطأ أثناء التسجيل في الفعالية. يرجى المحاولة لاحقًا.' });
    }
};