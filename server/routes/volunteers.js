import express from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import {
    registerVolunteer,
    getAllVolunteers,
    getVolunteerById,
    approveVolunteer,
    rejectVolunteer,
    addVolunteerHours,
    verifyVolunteerHours,
    getVolunteerHours,
    getVolunteerStats,
} from '../controllers/volunteersController.js';

const router = express.Router();

// تسجيل متطوع جديد (عام)
router.post('/register', [
    body('first_name').isString().trim().isLength({ min: 2 }).withMessage('الاسم الأول يجب أن يكون على الأقل حرفين'),
    body('last_name').isString().trim().isLength({ min: 2 }).withMessage('الاسم الأخير يجب أن يكون على الأقل حرفين'),
    body('email').isEmail().withMessage('البريد الإلكتروني غير صحيح'),
    body('phone').optional().isString().withMessage('رقم الهاتف يجب أن يكون نص'),
    body('country').isString().trim().isLength({ min: 2 }).withMessage('الدولة مطلوبة'),
    body('city').optional().isString().trim().withMessage('المدينة يجب أن تكون نص'),
    body('age').optional().isInt({ min: 16, max: 100 }).withMessage('العمر يجب أن يكون بين 16 و 100'),
    body('skills').optional().isString().withMessage('المهارات يجب أن تكون نص'),
    body('interests').optional().isString().withMessage('الاهتمامات يجب أن تكون نص'),
    body('availability').optional().isString().withMessage('التوفر يجب أن يكون نص'),
    body('motivation').optional().isString().withMessage('الدافع يجب أن يكون نص'),
    body('experience').optional().isString().withMessage('الخبرة يجب أن تكون نص'),
], registerVolunteer);

// الحصول على جميع المتطوعين (للمديرين فقط)
router.get('/', authMiddleware, adminMiddleware, getAllVolunteers);

// الحصول على متطوع واحد (للمديرين فقط)
router.get('/:id', authMiddleware, adminMiddleware, getVolunteerById);

// الموافقة على متطوع (للمديرين فقط)
router.put('/:id/approve', authMiddleware, adminMiddleware, approveVolunteer);

// رفض متطوع (للمديرين فقط)
router.put('/:id/reject', authMiddleware, adminMiddleware, [
    body('reason').optional().isString().withMessage('سبب الرفض يجب أن يكون نص'),
], rejectVolunteer);

// إضافة ساعات تطوع (للمديرين فقط)
router.post('/hours', authMiddleware, adminMiddleware, [
    body('volunteer_id').isInt().withMessage('معرف المتطوع مطلوب'),
    body('event_id').optional().isInt().withMessage('معرف الفعالية يجب أن يكون رقم'),
    body('program_id').optional().isInt().withMessage('معرف البرنامج يجب أن يكون رقم'),
    body('hours_worked').isFloat({ min: 0.5, max: 24 }).withMessage('ساعات العمل يجب أن تكون بين 0.5 و 24'),
    body('date_worked').isISO8601().withMessage('تاريخ العمل يجب أن يكون تاريخ صحيح'),
    body('description').optional().isString().withMessage('الوصف يجب أن يكون نص'),
], addVolunteerHours);

// التحقق من ساعات التطوع (للمديرين فقط)
router.put('/hours/:id/verify', authMiddleware, adminMiddleware, verifyVolunteerHours);

// الحصول على ساعات التطوع لمتطوع (للمديرين والمتطوع نفسه)
router.get('/:volunteer_id/hours', authMiddleware, getVolunteerHours);

// الحصول على إحصائيات المتطوعين (للمديرين فقط)
router.get('/stats/overview', authMiddleware, adminMiddleware, getVolunteerStats);

export default router;