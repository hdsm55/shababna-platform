import { query } from './config/database.js';

async function testEventRegistrations() {
    try {
        console.log('🔍 فحص تسجيلات الفعاليات...');

        const result = await query('SELECT * FROM event_registrations ORDER BY created_at DESC LIMIT 5');

        console.log('📊 عدد التسجيلات:', result.rows.length);
        console.log('📋 البيانات:', JSON.stringify(result.rows, null, 2));

        if (result.rows.length === 0) {
            console.log('⚠️  لا توجد تسجيلات فعاليات في قاعدة البيانات');
        }

    } catch (error) {
        console.error('❌ خطأ:', error);
    }
}

testEventRegistrations();