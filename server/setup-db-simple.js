import { getDatabase } from './config/database.js';

async function setupDatabase() {
    try {
        console.log('🚀 بدء إعداد قاعدة البيانات...');

        const database = await getDatabase();
        console.log('✅ تم الاتصال بقاعدة البيانات');

        // إنشاء جدول المستخدمين
        await database.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ تم إنشاء جدول المستخدمين');

        // إنشاء جدول الفعاليات
        await database.exec(`
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                start_date DATE,
                end_date DATE,
                location TEXT,
                max_attendees INTEGER,
                attendees INTEGER DEFAULT 0,
                category TEXT,
                image_url TEXT,
                status TEXT DEFAULT 'upcoming',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ تم إنشاء جدول الفعاليات');

        // إنشاء جدول البرامج
        await database.exec(`
            CREATE TABLE IF NOT EXISTS programs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                start_date DATE,
                end_date DATE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ تم إنشاء جدول البرامج');

        // إنشاء جدول المقالات
        await database.exec(`
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
        console.log('✅ تم إنشاء جدول المقالات');

        // إضافة بيانات تجريبية للفعاليات
        await database.run(`
            INSERT INTO events (title, description, start_date, end_date, location, max_attendees, category)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            'ورشة تطوير المهارات القيادية',
            'ورشة تفاعلية لتعلم المهارات القيادية الأساسية',
            '2024-02-15',
            '2024-02-15',
            'مركز الشباب - الرياض',
            30,
            'workshop'
        ]);
        console.log('✅ تم إضافة فعالية تجريبية');

        // إضافة بيانات تجريبية للبرامج
        await database.run(`
            INSERT INTO programs (title, description, start_date, end_date)
            VALUES (?, ?, ?, ?)
        `, [
            'برنامج تطوير المهارات التقنية',
            'برنامج شامل لتعليم الشباب المهارات التقنية المطلوبة في سوق العمل',
            '2024-02-01',
            '2024-12-31'
        ]);
        console.log('✅ تم إضافة برنامج تجريبي');

        // إضافة بيانات تجريبية للمقالات
        await database.run(`
            INSERT INTO blogs (title, content, author)
            VALUES (?, ?, ?)
        `, [
            'أهمية العمل التطوعي للشباب',
            'مقال عن أثر العمل التطوعي في بناء شخصية الشباب المسلم وتنمية المجتمع.',
            'فريق شبابنا'
        ]);
        console.log('✅ تم إضافة مقال تجريبي');

        // اختبار عدد السجلات
        const usersCount = await database.get('SELECT COUNT(*) as count FROM users');
        const eventsCount = await database.get('SELECT COUNT(*) as count FROM events');
        const programsCount = await database.get('SELECT COUNT(*) as count FROM programs');
        const blogsCount = await database.get('SELECT COUNT(*) as count FROM blogs');

        console.log(`👥 عدد المستخدمين: ${usersCount.count}`);
        console.log(`📅 عدد الفعاليات: ${eventsCount.count}`);
        console.log(`📊 عدد البرامج: ${programsCount.count}`);
        console.log(`📝 عدد المقالات: ${blogsCount.count}`);

        console.log('🎉 تم إعداد قاعدة البيانات بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
    }
}

setupDatabase();