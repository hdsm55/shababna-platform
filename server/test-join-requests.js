import { query } from './config/database.js';

async function testJoinRequests() {
    try {
        console.log('🔍 فحص طلبات الانضمام...');

        const result = await query('SELECT * FROM join_requests ORDER BY created_at DESC LIMIT 5');

        console.log('📊 عدد الطلبات:', result.rows.length);
        console.log('📋 البيانات:', JSON.stringify(result.rows, null, 2));

        if (result.rows.length === 0) {
            console.log('⚠️  لا توجد طلبات انضمام في قاعدة البيانات');
        }

    } catch (error) {
        console.error('❌ خطأ:', error);
    }
}

testJoinRequests();