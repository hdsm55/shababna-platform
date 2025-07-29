import { getDatabase } from './config/database.js';

async function testDatabase() {
    try {
        console.log('🚀 بدء اختبار قاعدة البيانات...');

        const database = await getDatabase();
        console.log('✅ تم الاتصال بقاعدة البيانات');

        // إنشاء جدول بسيط للاختبار
        await database.exec(`
            CREATE TABLE IF NOT EXISTS test_table (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ تم إنشاء جدول الاختبار');

        // إدخال بيانات اختبار
        const result = await database.run(
            'INSERT INTO test_table (name) VALUES (?)',
            ['test user']
        );
        console.log('✅ تم إدخال بيانات الاختبار، ID:', result.lastID);

        // قراءة البيانات
        const rows = await database.all('SELECT * FROM test_table');
        console.log('✅ تم قراءة البيانات:', rows);

        console.log('🎉 تم اختبار قاعدة البيانات بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في اختبار قاعدة البيانات:', error);
    }
}

testDatabase();