import { pool } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    try {
        console.log('🔄 بدء إعداد قاعدة البيانات...');

        // قراءة ملف المخطط
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        // قراءة ملف البيانات الأولية
        const seedPath = path.join(__dirname, 'seed.sql');
        const seedSQL = fs.readFileSync(seedPath, 'utf8');

        console.log('📋 إنشاء الجداول...');
        await pool.query(schemaSQL);

        console.log('🌱 إدخال البيانات الأولية...');
        await pool.query(seedSQL);

        console.log('✅ تم إعداد قاعدة البيانات بنجاح!');

        // اختبار الاتصال
        const result = await pool.query('SELECT COUNT(*) as total_users FROM users');
        console.log(`👥 عدد المستخدمين: ${result.rows[0].total_users}`);

        const eventsResult = await pool.query('SELECT COUNT(*) as total_events FROM events');
        console.log(`📅 عدد الفعاليات: ${eventsResult.rows[0].total_events}`);

        const programsResult = await pool.query('SELECT COUNT(*) as total_programs FROM programs');
        console.log(`📊 عدد البرامج: ${programsResult.rows[0].total_programs}`);

        const donationsResult = await pool.query('SELECT COUNT(*) as total_donations FROM donations');
        console.log(`💰 عدد التبرعات: ${donationsResult.rows[0].total_donations}`);

    } catch (error) {
        console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// تشغيل الإعداد إذا تم استدعاء الملف مباشرة
if (import.meta.url === `file://${process.argv[1]}`) {
    setupDatabase()
        .then(() => {
            console.log('🎉 تم إكمال إعداد قاعدة البيانات');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 فشل في إعداد قاعدة البيانات:', error);
            process.exit(1);
        });
}

export default setupDatabase;