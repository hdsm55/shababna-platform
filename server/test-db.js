import { query } from './config/database.js';

async function testDatabase() {
    try {
        console.log('🔍 اختبار قاعدة البيانات...');

        // اختبار الاتصال
        const connectionTest = await query('SELECT NOW() as current_time');
        console.log('✅ الاتصال بقاعدة البيانات:', connectionTest.rows[0].current_time);

        // اختبار عدد الفعاليات
        const eventsCount = await query('SELECT COUNT(*) as count FROM events');
        console.log('📊 عدد الفعاليات:', eventsCount.rows[0].count);

        // عرض الفعاليات
        const events = await query('SELECT id, title, status FROM events LIMIT 5');
        console.log('📋 الفعاليات الموجودة:');
        events.rows.forEach(event => {
            console.log(`  - ${event.id}: ${event.title} (${event.status})`);
        });

        // اختبار جدول التسجيلات
        const registrationsCount = await query('SELECT COUNT(*) as count FROM event_registrations');
        console.log('📝 عدد التسجيلات:', registrationsCount.rows[0].count);

    } catch (error) {
        console.error('❌ خطأ في اختبار قاعدة البيانات:', error);
    }
}

testDatabase();