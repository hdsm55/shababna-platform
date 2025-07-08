import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// إحصائيات الداشبورد الرئيسية
router.get('/stats', async (req, res) => {
    try {
        // إجمالي الفعاليات
        const eventsResult = await query('SELECT COUNT(*) as count FROM events');
        const totalEvents = parseInt(eventsResult.rows[0].count) || 0;

        // إجمالي البرامج
        const programsResult = await query('SELECT COUNT(*) as count FROM programs');
        const totalPrograms = parseInt(programsResult.rows[0].count) || 0;

        // إجمالي الأعضاء
        const usersResult = await query('SELECT COUNT(*) as count FROM users');
        const totalUsers = parseInt(usersResult.rows[0].count) || 0;

        // إجمالي التبرعات
        const donationsResult = await query('SELECT COALESCE(SUM(amount),0) as total FROM donations');
        const totalDonations = parseInt(donationsResult.rows[0].total || 0);

        res.json({
            success: true,
            data: [
                {
                    title: 'إجمالي الفعاليات',
                    value: totalEvents,
                    icon: 'Calendar',
                    color: 'primary',
                },
                {
                    title: 'البرامج النشطة',
                    value: totalPrograms,
                    icon: 'TrendingUp',
                    color: 'success',
                },
                {
                    title: 'إجمالي الأعضاء',
                    value: totalUsers,
                    icon: 'Users',
                    color: 'info',
                },
                {
                    title: 'إجمالي التبرعات',
                    value: totalDonations,
                    icon: 'DollarSign',
                    color: 'warning',
                },
            ],
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب إحصائيات الداشبورد',
            error: process.env.NODE_ENV === 'development' ? error.message : 'خطأ في الخادم'
        });
    }
});

// الأنشطة الحديثة (بيانات وهمية)
router.get('/activities', async (req, res) => {
    try {
        const activities = [
            {
                id: 1,
                type: 'event',
                message: 'تم إضافة فعالية جديدة: ورشة عمل الشباب',
                date: 'منذ ساعتين',
                status: 'completed',
                icon: 'Calendar',
            },
            {
                id: 2,
                type: 'donation',
                message: 'تم استلام تبرع جديد بقيمة 500 ريال',
                date: 'منذ 3 ساعات',
                status: 'completed',
                icon: 'DollarSign',
            },
            {
                id: 3,
                type: 'program',
                message: 'تم تحديث برنامج التوعية الصحية',
                date: 'منذ 5 ساعات',
                status: 'pending',
                icon: 'TrendingUp',
            },
            {
                id: 4,
                type: 'user',
                message: 'انضم 3 أعضاء جدد للمنظمة',
                date: 'منذ يوم واحد',
                status: 'completed',
                icon: 'Users',
            },
            {
                id: 5,
                type: 'alert',
                message: 'فعالية "ملتقى الشباب" تحتاج إلى تحديث',
                date: 'منذ يومين',
                status: 'warning',
                icon: 'AlertCircle',
            },
        ];
        res.json({ success: true, data: activities });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// حذف فعالية
router.delete('/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'الفعالية غير موجودة'
            });
        }

        res.json({
            success: true,
            message: 'تم حذف الفعالية بنجاح',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في حذف الفعالية',
            error: process.env.NODE_ENV === 'development' ? error.message : 'خطأ في الخادم'
        });
    }
});

// حذف برنامج
router.delete('/programs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'البرنامج غير موجود'
            });
        }

        res.json({
            success: true,
            message: 'تم حذف البرنامج بنجاح',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Delete program error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في حذف البرنامج',
            error: process.env.NODE_ENV === 'development' ? error.message : 'خطأ في الخادم'
        });
    }
});

// حذف مستخدم
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }

        res.json({
            success: true,
            message: 'تم حذف المستخدم بنجاح',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في حذف المستخدم',
            error: process.env.NODE_ENV === 'development' ? error.message : 'خطأ في الخادم'
        });
    }
});

// حذف تبرع
router.delete('/donations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM donations WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'التبرع غير موجود'
            });
        }

        res.json({
            success: true,
            message: 'تم حذف التبرع بنجاح',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Delete donation error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في حذف التبرع',
            error: process.env.NODE_ENV === 'development' ? error.message : 'خطأ في الخادم'
        });
    }
});

export default router;