import express from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { contactForm, getUserProfile, getAllUsers } from '../controllers/usersController.js';

const router = express.Router();

// Contact form
router.post('/contact', contactForm);

// Get user profile (authenticated user)
router.get('/profile', authMiddleware, getUserProfile);

// Update user profile (authenticated user)
router.put('/profile', authMiddleware, [
    body('first_name').optional().isString().trim().isLength({ min: 2 }).withMessage('الاسم الأول يجب أن يكون على الأقل حرفين'),
    body('last_name').optional().isString().trim().isLength({ min: 2 }).withMessage('الاسم الأخير يجب أن يكون على الأقل حرفين'),
    body('email').optional().isEmail().withMessage('البريد الإلكتروني غير صحيح'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'بيانات غير صحيحة',
                errors: errors.array(),
            });
        }

        const { first_name, last_name, email } = req.body;
        const userId = req.user.id;

        // التحقق من أن البريد الإلكتروني غير مستخدم من قبل مستخدم آخر
        if (email) {
            const existingUser = await query(
                'SELECT id FROM users WHERE email = $1 AND id != $2',
                [email, userId]
            );

            if (existingUser.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'البريد الإلكتروني مستخدم من قبل',
                });
            }
        }

        // تحديث البيانات
        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;

        if (first_name) {
            updateFields.push(`first_name = $${paramIndex}`);
            updateValues.push(first_name);
            paramIndex++;
        }

        if (last_name) {
            updateFields.push(`last_name = $${paramIndex}`);
            updateValues.push(last_name);
            paramIndex++;
        }

        if (email) {
            updateFields.push(`email = $${paramIndex}`);
            updateValues.push(email);
            paramIndex++;
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'لا توجد بيانات للتحديث',
            });
        }

        updateValues.push(userId);
        const result = await query(
            `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING id, first_name, last_name, email, role, created_at`,
            updateValues
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المستخدم غير موجود',
            });
        }

        res.json({
            success: true,
            message: 'تم تحديث الملف الشخصي بنجاح',
            user: result.rows[0],
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
});

// Change password (authenticated user)
router.put('/change-password', authMiddleware, [
    body('currentPassword').isString().isLength({ min: 6 }).withMessage('كلمة المرور الحالية مطلوبة'),
    body('newPassword').isString().isLength({ min: 6 }).withMessage('كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('كلمة المرور الجديدة غير متطابقة');
        }
        return true;
    }),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'بيانات غير صحيحة',
                errors: errors.array(),
            });
        }

        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // الحصول على كلمة المرور الحالية
        const userResult = await query(
            'SELECT password FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المستخدم غير موجود',
            });
        }

        // التحقق من كلمة المرور الحالية
        const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: 'كلمة المرور الحالية غير صحيحة',
            });
        }

        // تشفير كلمة المرور الجديدة
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // تحديث كلمة المرور
        await query(
            'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
            [hashedPassword, userId]
        );

        res.json({
            success: true,
            message: 'تم تغيير كلمة المرور بنجاح',
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
});

// Get user activity (authenticated user)
router.get('/activity', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        // الحصول على نشاطات المستخدم
        const activityResult = await query(`
      SELECT
        'donation' as type,
        amount as value,
        donated_at as date,
        'تبرع' as description
      FROM donations
      WHERE user_id = $1
      UNION ALL
      SELECT
        'event_registration' as type,
        NULL as value,
        created_at as date,
        'تسجيل في فعالية' as description
      FROM event_registrations
      WHERE user_id = $1
      UNION ALL
      SELECT
        'program_registration' as type,
        NULL as value,
        created_at as date,
        'تسجيل في برنامج' as description
      FROM program_registrations
      WHERE user_id = $1
      ORDER BY date DESC
      LIMIT 20
    `, [userId]);

        res.json({
            success: true,
            activity: activityResult.rows,
        });
    } catch (error) {
        console.error('Get user activity error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
});

// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

export default router;