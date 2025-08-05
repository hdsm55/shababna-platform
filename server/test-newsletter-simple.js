import { query } from './config/database.js';

async function testNewsletterDatabase() {
    try {
        console.log('🧪 اختبار قاعدة بيانات النشرة الإخبارية...\n');

        // اختبار جلب المشتركين
        console.log('1. اختبار جلب المشتركين...');
        const subscribers = await query('SELECT * FROM newsletter_subscribers LIMIT 5');
        console.log('✅ عدد المشتركين:', subscribers.rows.length);
        console.log('📋 المشتركين:', subscribers.rows);

        // اختبار إضافة مشترك جديد
        console.log('\n2. اختبار إضافة مشترك جديد...');
        const testEmail = `test-${Date.now()}@example.com`;
        const newSubscriber = await query(
            'INSERT INTO newsletter_subscribers (email, first_name, last_name) VALUES ($1, $2, $3) RETURNING *',
            [testEmail, 'أحمد', 'محمد']
        );
        console.log('✅ تم إضافة مشترك جديد:', newSubscriber.rows[0]);

        // اختبار تحديث حالة المشترك
        console.log('\n3. اختبار تحديث حالة المشترك...');
        const updateResult = await query(
            'UPDATE newsletter_subscribers SET status = $1 WHERE email = $2 RETURNING *',
            ['unsubscribed', testEmail]
        );
        console.log('✅ تم تحديث حالة المشترك:', updateResult.rows[0]);

        console.log('\n🎉 اختبار قاعدة بيانات النشرة الإخبارية مكتمل!');

    } catch (error) {
        console.error('❌ خطأ في اختبار قاعدة البيانات:', error.message);
    }
}

testNewsletterDatabase();