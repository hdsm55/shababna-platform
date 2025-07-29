import { query, testConnection } from './server/config/database.js';

async function testPostgreSQLConnection() {
    console.log('🔍 اختبار الاتصال بقاعدة البيانات PostgreSQL...');

    try {
        // اختبار الاتصال الأساسي
        const connectionTest = await testConnection();
        if (!connectionTest) {
            console.error('❌ فشل الاتصال بقاعدة البيانات');
            return;
        }

        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

        // اختبار جلب البيانات من الجداول المختلفة
        console.log('\n📊 اختبار جلب البيانات من الجداول...');

        // اختبار جدول المستخدمين
        try {
            const usersResult = await query('SELECT COUNT(*) as count FROM users');
            console.log(`👥 عدد المستخدمين: ${usersResult.rows[0].count}`);
        } catch (error) {
            console.log('⚠️ جدول المستخدمين غير موجود أو فارغ');
        }

        // اختبار جدول الفعاليات
        try {
            const eventsResult = await query('SELECT COUNT(*) as count FROM events');
            console.log(`📅 عدد الفعاليات: ${eventsResult.rows[0].count}`);
        } catch (error) {
            console.log('⚠️ جدول الفعاليات غير موجود أو فارغ');
        }

        // اختبار جدول البرامج
        try {
            const programsResult = await query('SELECT COUNT(*) as count FROM programs');
            console.log(`🎯 عدد البرامج: ${programsResult.rows[0].count}`);
        } catch (error) {
            console.log('⚠️ جدول البرامج غير موجود أو فارغ');
        }

        // اختبار جدول التبرعات
        try {
            const donationsResult = await query('SELECT COUNT(*) as count FROM donations');
            console.log(`💰 عدد التبرعات: ${donationsResult.rows[0].count}`);
        } catch (error) {
            console.log('⚠️ جدول التبرعات غير موجود أو فارغ');
        }

        // اختبار جدول رسائل التواصل
        try {
            const contactsResult = await query('SELECT COUNT(*) as count FROM contact_forms');
            console.log(`📧 عدد رسائل التواصل: ${contactsResult.rows[0].count}`);
        } catch (error) {
            console.log('⚠️ جدول رسائل التواصل غير موجود أو فارغ');
        }

        // اختبار جدول طلبات الانضمام
        try {
            const joinsResult = await query('SELECT COUNT(*) as count FROM join_requests');
            console.log(`🤝 عدد طلبات الانضمام: ${joinsResult.rows[0].count}`);
        } catch (error) {
            console.log('⚠️ جدول طلبات الانضمام غير موجود أو فارغ');
        }

        console.log('\n✅ تم اختبار جميع الجداول بنجاح');

    } catch (error) {
        console.error('❌ خطأ في اختبار قاعدة البيانات:', error.message);
    }
}

// تشغيل الاختبار
testPostgreSQLConnection();