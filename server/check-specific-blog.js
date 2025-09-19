import { query } from './config/database.js';

async function checkSpecificBlog() {
    try {
        console.log('🔍 فحص المقال رقم 5...');
        const result = await query('SELECT id, title, content, author, created_at FROM blogs WHERE id = 5');

        if (result.rows.length > 0) {
            const blog = result.rows[0];
            console.log('📋 تفاصيل المقال:');
            console.log('ID:', blog.id);
            console.log('العنوان:', blog.title);
            console.log('المؤلف:', blog.author);
            console.log('تاريخ الإنشاء:', blog.created_at);
            console.log('المحتوى موجود:', !!blog.content);
            console.log('طول المحتوى:', blog.content ? blog.content.length : 0);
            console.log('');
            console.log('المحتوى (أول 200 حرف):');
            console.log(blog.content ? blog.content.substring(0, 200) + '...' : 'لا يوجد محتوى');
        } else {
            console.log('❌ لم يتم العثور على المقال رقم 5');
        }

        // فحص جميع المقالات
        console.log('\n🔍 فحص جميع المقالات:');
        const allBlogs = await query('SELECT id, title, content FROM blogs ORDER BY id');
        allBlogs.rows.forEach(blog => {
            console.log(`ID ${blog.id}: ${blog.title} - المحتوى: ${blog.content ? blog.content.length + ' حرف' : 'فارغ'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ خطأ:', error);
        process.exit(1);
    }
}

checkSpecificBlog();
