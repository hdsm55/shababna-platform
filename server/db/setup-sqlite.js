import { getDatabase } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    console.log('🚀 بدء تشغيل إعداد قاعدة البيانات...');
    try {
        console.log('🔄 بدء إعداد قاعدة البيانات SQLite...');

        // قراءة ملف المخطط
        const schemaPath = path.join(__dirname, 'schema.sqlite');
        console.log('📁 مسار ملف المخطط:', schemaPath);

        if (!fs.existsSync(schemaPath)) {
            throw new Error(`ملف المخطط غير موجود: ${schemaPath}`);
        }

        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        console.log('✅ تم قراءة ملف المخطط');

        // قراءة ملف البيانات الأولية
        const seedPath = path.join(__dirname, 'seed.sql');
        console.log('📁 مسار ملف البيانات الأولية:', seedPath);

        if (!fs.existsSync(seedPath)) {
            throw new Error(`ملف البيانات الأولية غير موجود: ${seedPath}`);
        }

        const seedSQL = fs.readFileSync(seedPath, 'utf8');
        console.log('✅ تم قراءة ملف البيانات الأولية');

        const database = await getDatabase();
        console.log('✅ تم الاتصال بقاعدة البيانات');

        console.log('📋 إنشاء الجداول...');

        // تنفيذ أوامر SQL بشكل منفصل
        const schemaCommands = schemaSQL.split(';').filter(cmd => cmd.trim());

        for (const command of schemaCommands) {
            if (command.trim()) {
                await database.exec(command.trim());
            }
        }

        console.log('🌱 إدخال البيانات الأولية...');

        // تنفيذ أوامر البيانات الأولية بشكل منفصل
        const seedCommands = seedSQL.split(';').filter(cmd => cmd.trim());

        for (const command of seedCommands) {
            if (command.trim()) {
                await database.exec(command.trim());
            }
        }

        console.log('✅ تم إعداد قاعدة البيانات بنجاح!');

        // اختبار الاتصال
        const usersResult = await database.get('SELECT COUNT(*) as total_users FROM users');
        console.log(`👥 عدد المستخدمين: ${usersResult.total_users}`);

        const eventsResult = await database.get('SELECT COUNT(*) as total_events FROM events');
        console.log(`📅 عدد الفعاليات: ${eventsResult.total_events}`);

        const programsResult = await database.get('SELECT COUNT(*) as total_programs FROM programs');
        console.log(`📊 عدد البرامج: ${programsResult.total_programs}`);

        const blogsResult = await database.get('SELECT COUNT(*) as total_blogs FROM blogs');
        console.log(`📝 عدد المقالات: ${blogsResult.total_blogs}`);

    } catch (error) {
        console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
        throw error;
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