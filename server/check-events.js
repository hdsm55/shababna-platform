import { query } from './config/database.js';

async function checkEvents() {
    try {
        console.log('🔍 التحقق من قاعدة البيانات...');

        // التحقق من وجود جدول الفعاليات
        const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'events'
      );
    `);

        console.log('📋 جدول الفعاليات موجود:', tableCheck.rows[0].exists);

        if (tableCheck.rows[0].exists) {
            // التحقق من عدد الفعاليات
            const countResult = await query('SELECT COUNT(*) as count FROM events');
            console.log('📊 عدد الفعاليات في قاعدة البيانات:', countResult.rows[0].count);

            // عرض الفعاليات الموجودة
            const eventsResult = await query('SELECT id, title, status, created_at FROM events ORDER BY created_at DESC LIMIT 5');
            console.log('📋 الفعاليات الموجودة:');
            eventsResult.rows.forEach(event => {
                console.log(`  - ID: ${event.id}, العنوان: ${event.title}, الحالة: ${event.status}`);
            });
        }

    } catch (error) {
        console.error('❌ خطأ في التحقق من قاعدة البيانات:', error);
    }
}

checkEvents();
