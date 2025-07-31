import { query } from './config/database.js';

async function checkBlogs() {
    try {
        console.log('🔍 التحقق من قاعدة البيانات للمدونات...');

        // التحقق من وجود جدول المدونات
        const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'blogs'
      );
    `);

        console.log('📋 جدول المدونات موجود:', tableCheck.rows[0].exists);

        if (tableCheck.rows[0].exists) {
            // التحقق من عدد المدونات
            const countResult = await query('SELECT COUNT(*) as count FROM blogs');
            console.log('📊 عدد المدونات في قاعدة البيانات:', countResult.rows[0].count);

            // عرض المدونات الموجودة
            const blogsResult = await query('SELECT id, title, created_at FROM blogs ORDER BY created_at DESC LIMIT 5');
            console.log('📋 المدونات الموجودة:');
            blogsResult.rows.forEach(blog => {
                console.log(`  - ID: ${blog.id}, العنوان: ${blog.title}`);
            });
        }

    } catch (error) {
        console.error('❌ خطأ في التحقق من قاعدة البيانات:', error);
    }
}

checkBlogs();