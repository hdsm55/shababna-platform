import { query } from './config/database-sqlite.js';

async function testBlogs() {
    try {
        console.log('🧪 بدء اختبار المدونة...\n');

        // 1. اختبار عدد المقالات
        console.log('1. اختبار عدد المقالات...');
        const countResult = await query('SELECT COUNT(*) as count FROM blogs');
        console.log(`✅ عدد المقالات في المدونة: ${countResult.rows[0].count}`);

        // 2. اختبار جلب جميع المقالات
        console.log('\n2. اختبار جلب جميع المقالات...');
        const blogsResult = await query('SELECT * FROM blogs ORDER BY created_at DESC');
        console.log(`✅ تم جلب ${blogsResult.rows.length} مقالة`);

        if (blogsResult.rows.length > 0) {
            console.log('📋 المقالات المتاحة:');
            blogsResult.rows.forEach((blog, index) => {
                console.log(`   ${index + 1}. ${blog.title} (${blog.author})`);
            });
        } else {
            console.log('⚠️ لا توجد مقالات في المدونة');
        }

        // 3. اختبار API المدونة
        console.log('\n3. اختبار API المدونة...');
        const response = await fetch('http://localhost:5001/api/blogs');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API المدونة يعمل:', data);
        } else {
            console.log('❌ API المدونة لا يعمل');
        }

    } catch (error) {
        console.error('❌ خطأ في اختبار المدونة:', error);
    }
}

testBlogs();