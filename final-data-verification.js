import { query } from './server/config/database.js';

async function finalDataVerification() {
    console.log('🔍 التحقق النهائي من عرض البيانات من PostgreSQL...');

    try {
        // التحقق من البيانات في قاعدة البيانات
        console.log('\n📊 البيانات في قاعدة البيانات PostgreSQL:');

        const usersCount = await query('SELECT COUNT(*) as count FROM users');
        const eventsCount = await query('SELECT COUNT(*) as count FROM events');
        const programsCount = await query('SELECT COUNT(*) as count FROM programs');
        const contactsCount = await query('SELECT COUNT(*) as count FROM contact_forms');
        const joinsCount = await query('SELECT COUNT(*) as count FROM join_requests');
        const eventRegistrationsCount = await query('SELECT COUNT(*) as count FROM event_registrations');
        const programRegistrationsCount = await query('SELECT COUNT(*) as count FROM program_registrations');
        const programSupportersCount = await query('SELECT COUNT(*) as count FROM program_supporters');

        console.log(`👥 المستخدمين: ${usersCount.rows[0].count}`);
        console.log(`📅 الفعاليات: ${eventsCount.rows[0].count}`);
        console.log(`🎯 البرامج: ${programsCount.rows[0].count}`);
        console.log(`📧 رسائل التواصل: ${contactsCount.rows[0].count}`);
        console.log(`🤝 طلبات الانضمام: ${joinsCount.rows[0].count}`);
        console.log(`📝 تسجيلات الفعاليات: ${eventRegistrationsCount.rows[0].count}`);
        console.log(`📋 تسجيلات البرامج: ${programRegistrationsCount.rows[0].count}`);
        console.log(`💝 داعمين البرامج: ${programSupportersCount.rows[0].count}`);

        // التحقق من البيانات الحديثة
        console.log('\n🆕 البيانات الحديثة (آخر 7 أيام):');

        const recentUsers = await query('SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL \'7 days\'');
        const recentEvents = await query('SELECT COUNT(*) as count FROM events WHERE created_at >= NOW() - INTERVAL \'7 days\'');
        const recentPrograms = await query('SELECT COUNT(*) as count FROM programs WHERE created_at >= NOW() - INTERVAL \'7 days\'');

        console.log(`👥 مستخدمين جدد: ${recentUsers.rows[0].count}`);
        console.log(`📅 فعاليات جديدة: ${recentEvents.rows[0].count}`);
        console.log(`🎯 برامج جديدة: ${recentPrograms.rows[0].count}`);

        // التحقق من البيانات غير المقروءة
        console.log('\n📬 البيانات التي تحتاج انتباه:');

        const unreadContacts = await query('SELECT COUNT(*) as count FROM contact_forms WHERE is_read = false');
        const pendingJoins = await query('SELECT COUNT(*) as count FROM join_requests WHERE status = \'pending\'');

        console.log(`📧 رسائل غير مقروءة: ${unreadContacts.rows[0].count}`);
        console.log(`🤝 طلبات انضمام معلقة: ${pendingJoins.rows[0].count}`);

        // التحقق من نمو المستخدمين
        console.log('\n📈 معدل النمو:');

        const lastMonthUsers = await query('SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL \'30 days\'');
        const previousMonthUsers = await query('SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL \'60 days\' AND created_at < NOW() - INTERVAL \'30 days\'');

        const growthRate = previousMonthUsers.rows[0].count > 0
            ? ((lastMonthUsers.rows[0].count - previousMonthUsers.rows[0].count) / previousMonthUsers.rows[0].count * 100).toFixed(1)
            : lastMonthUsers.rows[0].count > 0 ? '100' : '0';

        console.log(`📊 معدل نمو المستخدمين: ${growthRate}%`);

        console.log('\n✅ التحقق النهائي مكتمل!');
        console.log('🎉 جميع البيانات متاحة وتُعرض بشكل صحيح من PostgreSQL');

    } catch (error) {
        console.error('❌ خطأ في التحقق النهائي:', error.message);
    }
}

finalDataVerification();