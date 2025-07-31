import { query } from './config/database.js';

async function checkContactForms() {
    try {
        console.log('🔍 التحقق من رسائل التواصل...');

        // التحقق من وجود الجدول
        const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'contact_forms'
      );
    `);

        console.log('📋 جدول رسائل التواصل موجود:', tableCheck.rows[0].exists);

        if (tableCheck.rows[0].exists) {
            // عدد الرسائل
            const countResult = await query('SELECT COUNT(*) as count FROM contact_forms');
            console.log('📊 عدد رسائل التواصل:', countResult.rows[0].count);

            // آخر 5 رسائل
            const formsResult = await query(`
        SELECT id, name, email, subject, message, created_at, is_read
        FROM contact_forms
        ORDER BY created_at DESC
        LIMIT 5
      `);

            console.log('📋 آخر 5 رسائل:');
            formsResult.rows.forEach((form, index) => {
                console.log(`${index + 1}. ${form.name} (${form.email})`);
                console.log(`   الموضوع: ${form.subject}`);
                console.log(`   الرسالة: ${form.message?.substring(0, 50)}...`);
                console.log(`   التاريخ: ${form.created_at}`);
                console.log(`   مقروءة: ${form.is_read ? 'نعم' : 'لا'}`);
                console.log('---');
            });
        }
    } catch (error) {
        console.error('❌ خطأ في التحقق من رسائل التواصل:', error);
    }
}

checkContactForms();