import express from 'express';
import { query } from '../config/database.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// جلب جميع المتطوعين
router.get('/', async (req, res) => {
    try {
        const result = await query(`
      SELECT v.*, u.name as user_name, u.email as user_email,
             COUNT(vh.id) as total_hours,
             COUNT(vc.id) as total_certificates
      FROM volunteers v
      LEFT JOIN users u ON v.user_id = u.id
      LEFT JOIN volunteer_hours vh ON v.id = vh.volunteer_id
      LEFT JOIN volunteer_certificates vc ON v.id = vc.volunteer_id
      GROUP BY v.id, u.name, u.email
      ORDER BY v.created_at DESC
    `);

        res.json({
            success: true,
            data: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        console.error('Get volunteers error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب المتطوعين'
        });
    }
});

// جلب متطوع واحد
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(`
      SELECT v.*, u.name as user_name, u.email as user_email
      FROM volunteers v
      LEFT JOIN users u ON v.user_id = u.id
      WHERE v.id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المتطوع غير موجود'
            });
        }

        // جلب ساعات التطوع
        const hoursResult = await query(`
      SELECT vh.*, e.title as event_title, p.title as program_title
      FROM volunteer_hours vh
      LEFT JOIN events e ON vh.event_id = e.id
      LEFT JOIN programs p ON vh.program_id = p.id
      WHERE vh.volunteer_id = $1
      ORDER BY vh.date DESC
    `, [id]);

        // جلب الشهادات
        const certificatesResult = await query(`
      SELECT vc.*, u.name as issued_by_name
      FROM volunteer_certificates vc
      LEFT JOIN users u ON vc.issued_by = u.id
      WHERE vc.volunteer_id = $1
      ORDER BY vc.issue_date DESC
    `, [id]);

        res.json({
            success: true,
            data: {
                ...result.rows[0],
                hours: hoursResult.rows,
                certificates: certificatesResult.rows
            }
        });
    } catch (error) {
        console.error('Get volunteer error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب بيانات المتطوع'
        });
    }
});

// إضافة متطوع جديد
router.post('/', [
    body('first_name').notEmpty().withMessage('الاسم الأول مطلوب'),
    body('last_name').notEmpty().withMessage('الاسم الأخير مطلوب'),
    body('email').isEmail().withMessage('البريد الإلكتروني غير صحيح'),
    body('phone').optional(),
    body('date_of_birth').optional(),
    body('gender').optional(),
    body('address').optional(),
    body('city').optional(),
    body('country').notEmpty().withMessage('البلد مطلوب'),
    body('skills').optional(),
    body('interests').optional(),
    body('availability').optional(),
    body('emergency_contact_name').optional(),
    body('emergency_contact_phone').optional(),
    body('emergency_contact_relationship').optional(),
    body('medical_conditions').optional(),
    body('allergies').optional(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'بيانات غير صحيحة',
                errors: errors.array()
            });
        }

        const {
            user_id,
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            gender,
            address,
            city,
            country,
            skills,
            interests,
            availability,
            emergency_contact_name,
            emergency_contact_phone,
            emergency_contact_relationship,
            medical_conditions,
            allergies
        } = req.body;

        const result = await query(`
      INSERT INTO volunteers (
        user_id, first_name, last_name, email, phone, date_of_birth,
        gender, address, city, country, skills, interests, availability,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        medical_conditions, allergies, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'pending', NOW())
      RETURNING *
    `, [
            user_id, first_name, last_name, email, phone, date_of_birth,
            gender, address, city, country, skills, interests, availability,
            emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
            medical_conditions, allergies
        ]);

        res.json({
            success: true,
            message: 'تم إضافة المتطوع بنجاح',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Add volunteer error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إضافة المتطوع'
        });
    }
});

// تحديث حالة المتطوع
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'حالة غير صحيحة'
            });
        }

        const result = await query(`
      UPDATE volunteers
      SET status = $1, notes = $2, approved_by = $3, approved_at = NOW(), updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [status, notes, req.user?.id || null, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المتطوع غير موجود'
            });
        }

        res.json({
            success: true,
            message: 'تم تحديث حالة المتطوع بنجاح',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Update volunteer status error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تحديث حالة المتطوع'
        });
    }
});

// إضافة ساعات تطوع
router.post('/:id/hours', [
    body('date').isDate().withMessage('التاريخ مطلوب'),
    body('start_time').optional(),
    body('end_time').optional(),
    body('total_hours').isNumeric().withMessage('عدد الساعات مطلوب'),
    body('activity_description').notEmpty().withMessage('وصف النشاط مطلوب'),
    body('supervisor_name').optional(),
    body('supervisor_notes').optional(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'بيانات غير صحيحة',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const {
            event_id,
            program_id,
            date,
            start_time,
            end_time,
            total_hours,
            activity_description,
            supervisor_name,
            supervisor_notes
        } = req.body;

        const result = await query(`
      INSERT INTO volunteer_hours (
        volunteer_id, event_id, program_id, date, start_time, end_time,
        total_hours, activity_description, supervisor_name, supervisor_notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'completed')
      RETURNING *
    `, [
            id, event_id, program_id, date, start_time, end_time,
            total_hours, activity_description, supervisor_name, supervisor_notes
        ]);

        res.json({
            success: true,
            message: 'تم إضافة ساعات التطوع بنجاح',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Add volunteer hours error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إضافة ساعات التطوع'
        });
    }
});

// إضافة شهادة تطوع
router.post('/:id/certificates', [
    body('title').notEmpty().withMessage('عنوان الشهادة مطلوب'),
    body('description').optional(),
    body('total_hours').isNumeric().withMessage('إجمالي الساعات مطلوب'),
    body('issue_date').isDate().withMessage('تاريخ الإصدار مطلوب'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'بيانات غير صحيحة',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const {
            title,
            description,
            total_hours,
            issue_date,
            expiry_date
        } = req.body;

        // إنشاء رقم الشهادة
        const certificateNumber = `CERT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

        const result = await query(`
      INSERT INTO volunteer_certificates (
        volunteer_id, certificate_number, title, description,
        total_hours, issue_date, expiry_date, issued_by, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
      RETURNING *
    `, [
            id, certificateNumber, title, description,
            total_hours, issue_date, expiry_date, req.user?.id || null
        ]);

        res.json({
            success: true,
            message: 'تم إضافة الشهادة بنجاح',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Add volunteer certificate error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إضافة الشهادة'
        });
    }
});

// إحصائيات المتطوعين
router.get('/stats/overview', async (req, res) => {
    try {
        const stats = await query(`
      SELECT
        COUNT(*) as total_volunteers,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_volunteers,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_volunteers,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_volunteers,
        SUM(COALESCE(total_hours, 0)) as total_hours,
        COUNT(DISTINCT vc.id) as total_certificates
      FROM volunteers v
      LEFT JOIN (
        SELECT volunteer_id, SUM(total_hours) as total_hours
        FROM volunteer_hours
        GROUP BY volunteer_id
      ) vh ON v.id = vh.volunteer_id
      LEFT JOIN volunteer_certificates vc ON v.id = vc.volunteer_id
    `);

        res.json({
            success: true,
            data: stats.rows[0]
        });
    } catch (error) {
        console.error('Get volunteer stats error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب الإحصائيات'
        });
    }
});

export default router;