import { query } from './config/database.js';
import fs from 'fs';
import path from 'path';

async function setupNewsletterTable() {
    try {
        console.log('🚀 إعداد جدول مشتركي النشرة الإخبارية...');

        // قراءة ملف SQL
        const sqlPath = path.join(process.cwd(), 'create-newsletter-table.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // تنفيذ الأوامر SQL
        const commands = sqlContent.split(';').filter(cmd => cmd.trim());

        for (const command of commands) {
            if (command.trim()) {
                await query(command.trim());
            }
        }

        console.log('✅ تم إعداد جدول مشتركي النشرة الإخبارية بنجاح!');

        // التحقق من البيانات
        const result = await query('SELECT COUNT(*) as count FROM newsletter_subscribers');
        console.log(`📊 عدد المشتركين: ${result.rows[0].count}`);

    } catch (error) {
        console.error('❌ خطأ في إعداد جدول مشتركي النشرة الإخبارية:', error);
    }
}

setupNewsletterTable();