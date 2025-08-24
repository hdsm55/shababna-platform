import { validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get all programs (public) - محسن لدعم التصفية والتحديد
export const getAllPrograms = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search } = req.query;
        const offset = (page - 1) * limit;

        // بناء الاستعلام الديناميكي
        let whereClause = '';
        const params = [];
        let paramIndex = 1;

        if (category) {
            whereClause += ` WHERE category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }

        if (search) {
            const searchCondition = ` ${whereClause ? 'AND' : 'WHERE'} (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
            whereClause += searchCondition;
            params.push(`%${search}%`);
            paramIndex++;
        }

        // استعلام العد
        const countQuery = `SELECT COUNT(*) FROM programs${whereClause}`;
        const countResult = await query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);

        // استعلام البيانات
        const dataQuery = `
            SELECT
                id,
                title,
                description,
                start_date,
                end_date,
                category,
                image_url,
                status,
                created_at
            FROM programs
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
            programs: result.rows,
            pagination
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
                id,
                title,
                description,
                start_date,
                end_date,
                category,
                image_url,
                status,
                created_at,
                updated_at
            FROM programs
            WHERE id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return errorResponse(res, 'البرنامج غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم جلب البرنامج بنجاح');
    } catch (error) {
        console.error('Get program error:', error);

        // معالجة خاصة لأخطاء الاتصال
        if (error.message.includes('Connection terminated') || error.message.includes('timeout')) {
            return errorResponse(res, 'خطأ في الاتصال بقاعدة البيانات، يرجى المحاولة مرة أخرى', 503);
        }

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
            end_date,
            category,
            goal_amount,
            current_amount = 0,
            participants_count = 0
        } = req.body;

        // معالجة الصورة المرفوعة
        let image_url = null;
        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
            console.log('📸 تم رفع الصورة:', image_url);
        }

        const result = await query(`
      INSERT INTO programs (title, description, start_date, end_date, category, goal_amount, current_amount, participants_count, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, title, description, start_date, end_date, category, goal_amount, current_amount, participants_count, image_url, created_at
    `, [title, description, start_date, end_date, category, goal_amount, current_amount, participants_count, image_url]);

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
            end_date,
            category,
            goal_amount,
            current_amount,
            participants_count
        } = req.body;

        // معالجة الصورة المرفوعة
        let image_url = null;
        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
            console.log('📸 تم رفع الصورة الجديدة:', image_url);
        }

        // بناء استعلام التحديث
        let updateQuery = `
            UPDATE programs
            SET title = $1, description = $2, start_date = $3, end_date = $4,
                category = $5, goal_amount = $6, current_amount = $7, participants_count = $8
        `;
        let queryParams = [title, description, start_date, end_date, category, goal_amount, current_amount, participants_count];

        // إضافة الصورة إذا كانت موجودة
        if (image_url) {
            updateQuery += `, image_url = $${queryParams.length + 1}`;
            queryParams.push(image_url);
        }

        updateQuery += ` WHERE id = $${queryParams.length + 1} RETURNING *`;
        queryParams.push(id);

        const result = await query(updateQuery, queryParams);

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

export const supportProgram = async (req, res) => {
    try {
        const { id } = req.params; // program_id
        const { supporter_name, supporter_email, supporter_phone, support_type, message, amount } = req.body;

        console.log('🚀 استلام طلب التبرع:', {
            id,
            supporter_name,
            supporter_email,
            supporter_phone,
            support_type,
            message,
            amount
        });

        console.log('📄 Request body:', req.body);
        console.log('📄 Request headers:', req.headers);

        // التحقق من البيانات المطلوبة
        if (!supporter_name || !supporter_email) {
            console.log('❌ بيانات غير مكتملة:', { supporter_name, supporter_email });
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({
                success: false,
                message: 'الاسم والبريد الإلكتروني مطلوبان'
            });
        }

        // التحقق من وجود البرنامج
        console.log('🔍 التحقق من وجود البرنامج:', id);
        const programCheck = await query('SELECT id FROM programs WHERE id = $1', [id]);
        if (programCheck.rows.length === 0) {
            console.log('❌ البرنامج غير موجود:', id);
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({
                success: false,
                message: 'البرنامج غير موجود'
            });
        }

        console.log('✅ البرنامج موجود، إدراج البيانات...');

        // إدراج البيانات
        const result = await query(
            `INSERT INTO program_supporters (program_id, supporter_name, supporter_email, supporter_phone, support_type, message, amount, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
            [id, supporter_name, supporter_email, supporter_phone || null, support_type || 'donation', message || null, amount || null]
        );

        console.log('✅ تم تسجيل الدعم بنجاح:', result.rows[0]);

        // تأكد من إرسال JSON صحيح
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'تم تسجيل الدعم بنجاح'
        });
    } catch (error) {
        console.error('❌ Support program error:', error);

        // تأكد من إرسال JSON صحيح حتى في حالة الخطأ
        res.setHeader('Content-Type', 'application/json');

        // معالجة خاصة لأخطاء قاعدة البيانات
        if (error.message.includes('Connection terminated') || error.message.includes('timeout')) {
            res.status(503).json({
                success: false,
                message: 'خطأ في الاتصال بقاعدة البيانات، يرجى المحاولة مرة أخرى'
            });
            return;
        }

        // معالجة أخطاء قاعدة البيانات الأخرى
        if (error.code === '23505') { // unique constraint violation
            res.status(400).json({
                success: false,
                message: 'تم التسجيل مسبقاً بهذا البريد الإلكتروني'
            });
            return;
        }

        if (error.code === '23503') { // foreign key constraint violation
            res.status(400).json({
                success: false,
                message: 'البرنامج غير موجود'
            });
            return;
        }

        // معالجة أخطاء أخرى
        if (error.message && error.message.includes('pool')) {
            res.status(503).json({
                success: false,
                message: 'خطأ في الاتصال بقاعدة البيانات، يرجى المحاولة مرة أخرى'
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تسجيل الدعم'
        });
    }
};

// جلب بيانات الداعمين للبرامج
export const getProgramSupporters = async (req, res) => {
    try {
        const { page = 1, limit = 50, program_id } = req.query;
        const offset = (page - 1) * limit;

        let queryText = `
            SELECT
                ps.*,
                p.title as program_title
            FROM program_supporters ps
            LEFT JOIN programs p ON ps.program_id = p.id
        `;

        const queryParams = [];

        if (program_id) {
            queryText += ' WHERE ps.program_id = $1';
            queryParams.push(program_id);
        }

        queryText += ' ORDER BY ps.created_at DESC';

        if (limit) {
            queryText += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
            queryParams.push(limit, offset);
        }

        const result = await query(queryText, queryParams);

        // جلب العدد الإجمالي
        let countQuery = 'SELECT COUNT(*) FROM program_supporters';
        if (program_id) {
            countQuery += ' WHERE program_id = $1';
        }
        const countResult = await query(countQuery, program_id ? [program_id] : []);
        const total = parseInt(countResult.rows[0].count);

        return res.json({
            success: true,
            data: {
                supporters: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            },
            message: 'تم جلب بيانات الداعمين بنجاح'
        });
    } catch (error) {
        console.error('Get program supporters error:', error);
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب بيانات الداعمين'
        });
    }
};