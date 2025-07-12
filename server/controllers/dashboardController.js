import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Dashboard stats (admin only)
export const getDashboardStats = async (req, res) => {
    try {
        const eventsResult = await query('SELECT COUNT(*) as count FROM events');
        const totalEvents = parseInt(eventsResult.rows[0].count) || 0;
        const programsResult = await query('SELECT COUNT(*) as count FROM programs');
        const totalPrograms = parseInt(programsResult.rows[0].count) || 0;
        const usersResult = await query('SELECT COUNT(*) as count FROM users');
        const totalUsers = parseInt(usersResult.rows[0].count) || 0;
        const donationsResult = await query('SELECT COALESCE(SUM(amount),0) as total FROM donations');
        const totalDonations = parseInt(donationsResult.rows[0].total || 0);
        return successResponse(res, [
            { title: 'إجمالي الفعاليات', value: totalEvents, icon: 'Calendar', color: 'primary' },
            { title: 'البرامج النشطة', value: totalPrograms, icon: 'TrendingUp', color: 'success' },
            { title: 'إجمالي الأعضاء', value: totalUsers, icon: 'Users', color: 'info' },
            { title: 'إجمالي التبرعات', value: totalDonations, icon: 'DollarSign', color: 'warning' }
        ], 'تم جلب إحصائيات الداشبورد بنجاح');
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return errorResponse(res, 'خطأ في جلب إحصائيات الداشبورد', 500, error);
    }
};

// Dashboard activities (admin only)
export const getDashboardActivities = async (req, res) => {
    try {
        const activities = [
            { id: 1, type: 'event', message: 'تم إضافة فعالية جديدة: ورشة عمل الشباب', date: 'منذ ساعتين', status: 'completed', icon: 'Calendar' },
            { id: 2, type: 'donation', message: 'تم استلام تبرع جديد بقيمة 500 ريال', date: 'منذ 3 ساعات', status: 'completed', icon: 'DollarSign' },
            { id: 3, type: 'program', message: 'تم تحديث برنامج التوعية الصحية', date: 'منذ 5 ساعات', status: 'pending', icon: 'TrendingUp' },
            { id: 4, type: 'user', message: 'انضم 3 أعضاء جدد للمنظمة', date: 'منذ يوم واحد', status: 'completed', icon: 'Users' },
            { id: 5, type: 'alert', message: 'فعالية "ملتقى الشباب" تحتاج إلى تحديث', date: 'منذ يومين', status: 'warning', icon: 'AlertCircle' }
        ];
        return successResponse(res, activities, 'تم جلب الأنشطة بنجاح');
    } catch (error) {
        return errorResponse(res, 'خطأ في جلب الأنشطة', 500, error);
    }
};

// Delete event (admin only)
export const deleteDashboardEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return errorResponse(res, 'الفعالية غير موجودة', 404);
        }
        return successResponse(res, result.rows[0], 'تم حذف الفعالية بنجاح');
    } catch (error) {
        console.error('Delete event error:', error);
        return errorResponse(res, 'خطأ في حذف الفعالية', 500, error);
    }
};

// Delete program (admin only)
export const deleteDashboardProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return errorResponse(res, 'البرنامج غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم حذف البرنامج بنجاح');
    } catch (error) {
        console.error('Delete program error:', error);
        return errorResponse(res, 'خطأ في حذف البرنامج', 500, error);
    }
};

// Delete user (admin only)
export const deleteDashboardUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return errorResponse(res, 'المستخدم غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم حذف المستخدم بنجاح');
    } catch (error) {
        console.error('Delete user error:', error);
        return errorResponse(res, 'خطأ في حذف المستخدم', 500, error);
    }
};

// Delete donation (admin only)
export const deleteDashboardDonation = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM donations WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return errorResponse(res, 'التبرع غير موجود', 404);
        }
        return successResponse(res, result.rows[0], 'تم حذف التبرع بنجاح');
    } catch (error) {
        console.error('Delete donation error:', error);
        return errorResponse(res, 'خطأ في حذف التبرع', 500, error);
    }
};