import { query, run } from './config/database-sqlite.js';

async function setupBlogs() {
    try {
        console.log('🔧 بدء إعداد المدونة...\n');

        // 1. إنشاء جدول المدونة
        console.log('1. إنشاء جدول المدونة...');
        await run(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                author TEXT,
                image_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ تم إنشاء جدول المدونة');

        // 2. إضافة بيانات تجريبية للمدونة
        console.log('\n2. إضافة بيانات تجريبية للمدونة...');

        const sampleBlogs = [
            {
                title: 'أهمية التطوع في المجتمع',
                content: 'التطوع هو أحد أهم الأنشطة التي تساهم في بناء المجتمع وتطويره. من خلال التطوع، يمكن للأفراد المساهمة في خدمة المجتمع وتحسين حياة الآخرين. التطوع يساعد في بناء الروابط الاجتماعية وتقوية العلاقات بين أفراد المجتمع.',
                author: 'أحمد محمد',
                image_url: '/images/blog-1.jpg'
            },
            {
                title: 'دور الشباب في التنمية المستدامة',
                content: 'يلعب الشباب دوراً محورياً في تحقيق التنمية المستدامة. فهم القادة المستقبليون الذين سيقودون التغيير الإيجابي في المجتمع. من خلال المبادرات الشبابية والابتكار، يمكن تحقيق أهداف التنمية المستدامة.',
                author: 'سارة علي',
                image_url: '/images/blog-2.jpg'
            },
            {
                title: 'التكنولوجيا والابتكار في العمل الخيري',
                content: 'أصبحت التكنولوجيا أداة أساسية في العمل الخيري والتطوعي. من خلال استخدام التطبيقات والمنصات الرقمية، يمكن تسهيل عملية التطوع وجعلها أكثر فعالية وكفاءة.',
                author: 'عمر خالد',
                image_url: '/images/blog-3.jpg'
            },
            {
                title: 'بناء مهارات القيادة من خلال التطوع',
                content: 'التطوع يوفر فرصة ممتازة لبناء مهارات القيادة والتواصل. من خلال العمل مع فريق متنوع، يمكن تطوير مهارات حل المشكلات والعمل الجماعي.',
                author: 'نور حسن',
                image_url: '/images/blog-4.jpg'
            },
            {
                title: 'التأثير الإيجابي للتطوع على الصحة النفسية',
                content: 'أثبتت الدراسات أن التطوع له تأثير إيجابي على الصحة النفسية. يساعد في تقليل التوتر والاكتئاب وزيادة الشعور بالسعادة والرضا عن الحياة.',
                author: 'يوسف عبدالله',
                image_url: '/images/blog-5.jpg'
            }
        ];

        for (const blog of sampleBlogs) {
            await run(`
                INSERT INTO blogs (title, content, author, image_url)
                VALUES (?, ?, ?, ?)
            `, [blog.title, blog.content, blog.author, blog.image_url]);
        }

        console.log(`✅ تم إضافة ${sampleBlogs.length} مقالة تجريبية`);

        // 3. التحقق من البيانات
        console.log('\n3. التحقق من البيانات...');
        const countResult = await query('SELECT COUNT(*) as count FROM blogs');
        console.log(`✅ عدد المقالات في المدونة: ${countResult.rows[0].count}`);

        const blogsResult = await query('SELECT * FROM blogs ORDER BY created_at DESC');
        console.log('📋 المقالات المتاحة:');
        blogsResult.rows.forEach((blog, index) => {
            console.log(`   ${index + 1}. ${blog.title} (${blog.author})`);
        });

        console.log('\n✅ تم إعداد المدونة بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في إعداد المدونة:', error);
    }
}

setupBlogs();