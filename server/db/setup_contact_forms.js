import { query } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupContactForms() {
    try {
        console.log('🚀 بدء إعداد جداول التواصل...');

        // قراءة ملف SQL
        const sqlFile = path.join(__dirname, 'contact_forms.sql');
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');

        // تقسيم الـ SQL إلى أوامر منفصلة
        const commands = sqlContent
            .split(';')
            .map(cmd => cmd.trim())
            .filter(cmd => cmd.length > 0);

        // تنفيذ كل أمر
        for (const command of commands) {
            if (command.trim()) {
                await query(command);
                console.log('✅ تم تنفيذ الأمر:', command.substring(0, 50) + '...');
            }
        }

        console.log('✅ تم إعداد جداول التواصل بنجاح!');
        console.log('📊 الجداول المضافة:');
        console.log('   - contact_forms (رسائل التواصل)');
        console.log('   - join_requests (طلبات الانضمام)');
        console.log('   - program_registrations (تسجيل البرامج)');
        console.log('   - event_registrations (تسجيل الفعاليات)');
        console.log('   - program_supporters (دعم البرامج)');

    } catch (error) {
        console.error('❌ خطأ في إعداد جداول التواصل:', error);
        throw error;
    }
}

// تشغيل الإعداد إذا تم استدعاء الملف مباشرة
if (import.meta.url === `file://${process.argv[1]}`) {
    setupContactForms()
        .then(() => {
            console.log('🎉 تم إكمال إعداد جداول التواصل!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 فشل في إعداد جداول التواصل:', error);
            process.exit(1);
        });
}

export default setupContactForms;