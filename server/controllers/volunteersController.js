import { query } from '../config/database.js';

// تسجيل متطوع جديد
export const registerVolunteer = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            country,
            city,
            age,
            skills,
            interests,
            availability,
            motivation,
            experience,
        } = req.body;

        // التحقق من وجود المتطوع مسبقاً
        const existingVolunteer = await query(
            'SELECT id FROM volunteers WHERE email = $1',
            [email]
        );

        if (existingVolunteer.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني مسجل مسبقاً كمتطوع',
            });
        }

        // إضافة المتطوع
        const result = await query(
            `INSERT INTO volunteers (
        user_id, first_name, last_name, email, phone, country, city, age,
        skills, interests, availability, motivation, experience
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
            [
                req.user?.id || null,
                first_name,
                last_name,
                email,
                phone,
                country,
                city,
                age,
                skills,
                interests,
                availability,
                motivation,
                experience,
            ]
        );

        res.status(201).json({
            success: true,
            message: 'تم تسجيل طلب التطوع بنجاح',
            volunteer: result.rows[0],
        });
    } catch (error) {
        console.error('Register volunteer error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
};

// الحصول على جميع المتطوعين (للمديرين)
export const getAllVolunteers = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = '';
        let queryParams = [];
        let paramIndex = 1;

        if (status) {
            whereClause = `WHERE status = $${paramIndex}`;
            queryParams.push(status);
            paramIndex++;
        }

        const result = await query(
            `SELECT * FROM volunteers ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...queryParams, limit, offset]
        );

        const countResult = await query(
            `SELECT COUNT(*) as total FROM volunteers ${whereClause}`,
            queryParams
        );

        res.json({
            success: true,
            volunteers: result.rows,
            pagination: {
                total: parseInt(countResult.rows[0].total),
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
            },
        });
    } catch (error) {
        console.error('Get all volunteers error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
};

// الحصول على متطوع واحد
export const getVolunteerById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            'SELECT * FROM volunteers WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المتطوع غير موجود',
            });
        }

        res.json({
            success: true,
            volunteer: result.rows[0],
        });
    } catch (error) {
        console.error('Get volunteer error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
};

// الموافقة على متطوع
export const approveVolunteer = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        const result = await query(
            `UPDATE volunteers
       SET status = 'approved', approved_by = $1, approved_at = NOW(), updated_at = NOW()
       WHERE id = $2 RETURNING *`,
            [adminId, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المتطوع غير موجود',
            });
        }

        res.json({
            success: true,
            message: 'تم الموافقة على المتطوع بنجاح',
            volunteer: result.rows[0],
        });
    } catch (error) {
        console.error('Approve volunteer error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
};

// رفض متطوع
export const rejectVolunteer = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const result = await query(
            `UPDATE volunteers
       SET status = 'rejected', updated_at = NOW()
       WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المتطوع غير موجود',
            });
        }

        res.json({
            success: true,
            message: 'تم رفض المتطوع',
            volunteer: result.rows[0],
        });
    } catch (error) {
        console.error('Reject volunteer error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
};

// إضافة ساعات تطوع
export const addVolunteerHours = async (req, res) => {
    try {
        const {
            volunteer_id,
            event_id,
            program_id,
            hours_worked,
            date_worked,
            description,
        } = req.body;

        const result = await query(
            `INSERT INTO volunteer_hours (
        volunteer_id, event_id, program_id, hours_worked, date_worked, description
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [volunteer_id, event_id, program_id, hours_worked, date_worked, description]
        );

        res.status(201).json({
            success: true,
            message: 'تم إضافة ساعات التطوع بنجاح',
            volunteerHours: result.rows[0],
        });
    } catch (error) {
        console.error('Add volunteer hours error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
};

// التحقق من ساعات التطوع
export const verifyVolunteerHours = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        const result = await query(
            `UPDATE volunteer_hours
       SET status = 'verified', verified_by = $1, verified_at = NOW()
       WHERE id = $2 RETURNING *`,
            [adminId, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ساعات التطوع غير موجودة',
            });
        }

        res.json({
            success: true,
            message: 'تم التحقق من ساعات التطوع بنجاح',
            volunteerHours: result.rows[0],
        });
    } catch (error) {
        console.error('Verify volunteer hours error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
};

// الحصول على ساعات التطوع لمتطوع
export const getVolunteerHours = async (req, res) => {
    try {
        const { volunteer_id } = req.params;

        const result = await query(
            `SELECT vh.*, e.title as event_title, p.title as program_title
       FROM volunteer_hours vh
       LEFT JOIN events e ON vh.event_id = e.id
       LEFT JOIN programs p ON vh.program_id = p.id
       WHERE vh.volunteer_id = $1
       ORDER BY vh.date_worked DESC`,
            [volunteer_id]
        );

        res.json({
            success: true,
            volunteerHours: result.rows,
        });
    } catch (error) {
        console.error('Get volunteer hours error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
};

// الحصول على إحصائيات المتطوعين
export const getVolunteerStats = async (req, res) => {
    try {
        const statsResult = await query(`
      SELECT
        COUNT(*) as total_volunteers,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_volunteers,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_volunteers,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_volunteers
      FROM volunteers
    `);

        const hoursResult = await query(`
      SELECT
        SUM(hours_worked) as total_hours,
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN status = 'verified' THEN 1 END) as verified_sessions
      FROM volunteer_hours
    `);

        res.json({
            success: true,
            stats: {
                ...statsResult.rows[0],
                ...hoursResult.rows[0],
            },
        });
    } catch (error) {
        console.error('Get volunteer stats error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
};