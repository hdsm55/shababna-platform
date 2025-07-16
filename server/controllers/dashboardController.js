import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Dashboard stats (admin only)
export const getDashboardStats = async (req, res) => {
    try {
        // إحصائيات الفعاليات
        const eventsResult = await query('SELECT COUNT(*) as count FROM events');
        const totalEvents = parseInt(eventsResult.rows[0].count) || 0;

        // لا يوجد عمود status في جدول events
        // const activeEventsResult = await query('SELECT COUNT(*) as count FROM events WHERE status = \'active\'');
        // const activeEvents = parseInt(activeEventsResult.rows[0].count) || 0;
        // const upcomingEventsResult = await query('SELECT COUNT(*) as count FROM events WHERE status = \'upcoming\'');
        // const upcomingEvents = parseInt(upcomingEventsResult.rows[0].count) || 0;

        // إحصائيات البرامج
        const programsResult = await query('SELECT COUNT(*) as count FROM programs');
        const totalPrograms = parseInt(programsResult.rows[0].count) || 0;

        // لا يوجد عمود status في جدول programs
        // const activeProgramsResult = await query('SELECT COUNT(*) as count FROM programs WHERE status = \'active\'');
        // const activePrograms = parseInt(activeProgramsResult.rows[0].count) || 0;

        // إحصائيات المستخدمين
        const usersResult = await query('SELECT COUNT(*) as count FROM users');
        const totalUsers = parseInt(usersResult.rows[0].count) || 0;

        const newUsersResult = await query('SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL \'30 days\'');
        const newUsers = parseInt(newUsersResult.rows[0].count) || 0;

        // إحصائيات التبرعات
        const donationsResult = await query('SELECT COALESCE(SUM(amount), 0) as total FROM donations');
        const totalDonations = parseInt(donationsResult.rows[0].total || 0);

        const monthlyDonationsResult = await query("SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE donated_at >= NOW() - INTERVAL '30 days'");
        const monthlyDonations = parseInt(monthlyDonationsResult.rows[0].total || 0);

        // إحصائيات التسجيل في البرامج
        const programRegistrationsResult = await query('SELECT COUNT(*) as count FROM program_registrations');
        const totalProgramRegistrations = parseInt(programRegistrationsResult.rows[0].count) || 0;

        // إحصائيات دعم البرامج
        const programSupportersResult = await query('SELECT COUNT(*) as count FROM program_supporters');
        const totalProgramSupporters = parseInt(programSupportersResult.rows[0].count) || 0;

        // إحصائيات التسجيل في الفعاليات
        const eventRegistrationsResult = await query('SELECT COUNT(*) as count FROM event_registrations');
        const totalEventRegistrations = parseInt(eventRegistrationsResult.rows[0].count) || 0;

        // إحصائيات التواصل
        const contactFormsResult = await query('SELECT COUNT(*) as count FROM contact_forms');
        const totalContactForms = parseInt(contactFormsResult.rows[0].count) || 0;

        const unreadContactFormsResult = await query('SELECT COUNT(*) as count FROM contact_forms WHERE is_read = false');
        const unreadContactForms = parseInt(unreadContactFormsResult.rows[0].count) || 0;

        // حساب النمو
        const previousMonthUsersResult = await query('SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL \'60 days\' AND created_at < NOW() - INTERVAL \'30 days\'');
        const previousMonthUsers = parseInt(previousMonthUsersResult.rows[0].count) || 0;

        const userGrowth = previousMonthUsers > 0 ? ((newUsers - previousMonthUsers) / previousMonthUsers * 100).toFixed(1) : newUsers > 0 ? '100' : '0';

        const previousMonthDonationsResult = await query("SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE donated_at >= NOW() - INTERVAL '60 days' AND donated_at < NOW() - INTERVAL '30 days'");
        const previousMonthDonations = parseInt(previousMonthDonationsResult.rows[0].total || 0);

        const donationGrowth = previousMonthDonations > 0 ? ((monthlyDonations - previousMonthDonations) / previousMonthDonations * 100).toFixed(1) : monthlyDonations > 0 ? '100' : '0';

        return successResponse(res, {
            overview: [
                {
                    title: 'إجمالي الفعاليات',
                    value: totalEvents,
                    change: '',
                    changeType: 'increase',
                    icon: 'Calendar',
                    color: 'primary',
                    details: {
                        total: totalEvents
                    }
                },
                {
                    title: 'البرامج',
                    value: totalPrograms,
                    change: '',
                    changeType: 'increase',
                    icon: 'TrendingUp',
                    color: 'success',
                    details: {
                        total: totalPrograms
                    }
                },
                {
                    title: 'إجمالي الأعضاء',
                    value: totalUsers,
                    change: `+${userGrowth}%`,
                    changeType: userGrowth >= 0 ? 'increase' : 'decrease',
                    icon: 'Users',
                    color: 'info',
                    details: {
                        new: newUsers,
                        total: totalUsers
                    }
                },
                {
                    title: 'إجمالي التبرعات',
                    value: `$${totalDonations.toLocaleString()}`,
                    change: `+${donationGrowth}%`,
                    changeType: donationGrowth >= 0 ? 'increase' : 'decrease',
                    icon: 'DollarSign',
                    color: 'warning',
                    details: {
                        monthly: monthlyDonations,
                        total: totalDonations
                    }
                }
            ],
            engagement: [
                {
                    title: 'تسجيل البرامج',
                    value: totalProgramRegistrations,
                    icon: 'Users',
                    color: 'primary'
                },
                {
                    title: 'دعم البرامج',
                    value: totalProgramSupporters,
                    icon: 'Heart',
                    color: 'success'
                },
                {
                    title: 'تسجيل الفعاليات',
                    value: totalEventRegistrations,
                    icon: 'Calendar',
                    color: 'info'
                },
                {
                    title: 'رسائل التواصل',
                    value: totalContactForms,
                    icon: 'MessageCircle',
                    color: 'warning',
                    alert: unreadContactForms > 0 ? `${unreadContactForms} غير مقروءة` : null
                }
            ]
        }, 'تم جلب إحصائيات الداشبورد بنجاح');
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return errorResponse(res, 'خطأ في جلب إحصائيات الداشبورد', 500, error);
    }
};

// Dashboard activities (admin only)
export const getDashboardActivities = async (req, res) => {
    try {
        const activities = [];

        // جلب آخر الفعاليات المضافة
        const recentEvents = await query(`
            SELECT id, title, created_at
            FROM events
            ORDER BY created_at DESC
            LIMIT 5
        `);

        recentEvents.rows.forEach((event, index) => {
            activities.push({
                id: `event_${event.id}`,
                type: 'event',
                message: `تم إضافة فعالية جديدة: ${event.title}`,
                date: getTimeAgo(event.created_at),
                status: 'completed',
                icon: 'Calendar',
                priority: 'medium',
                user: 'النظام',
                details: `فعالية جديدة`
            });
        });

        // جلب آخر البرامج المضافة
        const recentPrograms = await query(`
            SELECT id, title, created_at
            FROM programs
            ORDER BY created_at DESC
            LIMIT 5
        `);

        recentPrograms.rows.forEach((program, index) => {
            activities.push({
                id: `program_${program.id}`,
                type: 'program',
                message: `تم إضافة برنامج جديد: ${program.title}`,
                date: getTimeAgo(program.created_at),
                status: 'completed',
                icon: 'TrendingUp',
                priority: 'medium',
                user: 'النظام',
                details: `برنامج جديد`
            });
        });

        // جلب آخر التبرعات
        const recentDonations = await query(`
            SELECT d.id, d.amount, CONCAT(u.first_name, ' ', u.last_name) as donor_name, d.donated_at
            FROM donations d
            JOIN users u ON d.user_id = u.id
            ORDER BY d.donated_at DESC
            LIMIT 5
        `);

        recentDonations.rows.forEach((donation, index) => {
            activities.push({
                id: `donation_${donation.id}`,
                type: 'donation',
                message: `تم استلام تبرع جديد بقيمة $${donation.amount} من ${donation.donor_name || 'مجهول'}`,
                date: getTimeAgo(donation.donated_at),
                status: 'completed',
                icon: 'DollarSign',
                priority: 'high',
                user: donation.donor_name || 'مجهول',
                details: `تبرع نقدي - ${donation.amount} ريال`
            });
        });

        // جلب آخر المستخدمين المسجلين
        const recentUsers = await query(`
            SELECT id, CONCAT(first_name, ' ', last_name) AS name, email, created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT 5
        `);

        recentUsers.rows.forEach((user, index) => {
            activities.push({
                id: `user_${user.id}`,
                type: 'user',
                message: `انضم عضو جديد: ${user.name}`,
                date: getTimeAgo(user.created_at),
                status: 'completed',
                icon: 'Users',
                priority: 'medium',
                user: user.name,
                details: `البريد الإلكتروني: ${user.email}`
            });
        });

        // جلب آخر رسائل التواصل
        const recentContacts = await query(`
            SELECT id, name, email, subject, created_at, is_read
            FROM contact_forms
            ORDER BY created_at DESC
            LIMIT 5
        `);

        recentContacts.rows.forEach((contact, index) => {
            activities.push({
                id: `contact_${contact.id}`,
                type: 'contact',
                message: `رسالة جديدة من ${contact.name}: ${contact.subject}`,
                date: getTimeAgo(contact.created_at),
                status: contact.is_read ? 'completed' : 'pending',
                icon: 'MessageCircle',
                priority: contact.is_read ? 'low' : 'high',
                user: contact.name,
                details: `البريد: ${contact.email}`
            });
        });

        // جلب آخر التسجيلات في البرامج
        const recentProgramRegistrations = await query(`
            SELECT pr.id, pr.created_at, p.title as program_title, CONCAT(u.first_name, ' ', u.last_name) as user_name
            FROM program_registrations pr
            JOIN programs p ON pr.program_id = p.id
            JOIN users u ON u.id = pr.user_id
            ORDER BY pr.created_at DESC
            LIMIT 5
        `);

        recentProgramRegistrations.rows.forEach((registration, index) => {
            activities.push({
                id: `program_reg_${registration.id}`,
                type: 'program_registration',
                message: `تسجيل جديد في برنامج: ${registration.program_title}`,
                date: getTimeAgo(registration.created_at),
                status: 'completed',
                icon: 'Users',
                priority: 'medium',
                user: registration.user_name,
                details: `المستخدم: ${registration.user_name}`
            });
        });

        // جلب آخر التسجيلات في الفعاليات
        const recentEventRegistrations = await query(`
            SELECT er.id, er.created_at, e.title as event_title, CONCAT(u.first_name, ' ', u.last_name) as user_name
            FROM event_registrations er
            JOIN events e ON er.event_id = e.id
            JOIN users u ON u.id = er.user_id
            ORDER BY er.created_at DESC
            LIMIT 5
        `);

        recentEventRegistrations.rows.forEach((registration, index) => {
            activities.push({
                id: `event_reg_${registration.id}`,
                type: 'event_registration',
                message: `تسجيل جديد في فعالية: ${registration.event_title}`,
                date: getTimeAgo(registration.created_at),
                status: 'completed',
                icon: 'Calendar',
                priority: 'medium',
                user: registration.user_name,
                details: `المستخدم: ${registration.user_name}`
            });
        });

        // ترتيب الأنشطة حسب التاريخ
        activities.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });

        return successResponse(res, activities.slice(0, 20), 'تم جلب الأنشطة بنجاح');
    } catch (error) {
        console.error('Dashboard activities error:', error);
        return errorResponse(res, 'خطأ في جلب الأنشطة', 500, error);
    }
};

// دالة مساعدة لحساب الوقت المنقضي
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return 'منذ لحظات';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `منذ ${minutes} دقيقة`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `منذ ${hours} ساعة`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `منذ ${days} يوم`;
    } else {
        const months = Math.floor(diffInSeconds / 2592000);
        return `منذ ${months} شهر`;
    }
}

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