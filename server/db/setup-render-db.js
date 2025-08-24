import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

console.log('🚀 بدء تشغيل ملف إعداد قاعدة البيانات...');

// تحميل متغيرات البيئة من render.env
dotenv.config({ path: './render.env' });

console.log('📋 متغيرات البيئة المحملة:', {
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    NODE_ENV: process.env.NODE_ENV
});

// إنشاء pool للاتصال بقاعدة البيانات
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }, // مطلوب لـ Render.com
});

// دالة لاختبار الاتصال
const testConnection = async () => {
    try {
        console.log('🔍 اختبار الاتصال بقاعدة البيانات...');
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error.message);
        return false;
    }
};

// دالة لتنفيذ ملف SQL
const executeSQLFile = async (filePath) => {
    try {
        console.log(`📄 تنفيذ ملف: ${filePath}`);
        const sqlContent = fs.readFileSync(filePath, 'utf8');
        const client = await pool.connect();
        await client.query(sqlContent);
        client.release();
        console.log(`✅ تم تنفيذ ملف ${path.basename(filePath)} بنجاح`);
    } catch (error) {
        console.error(`❌ خطأ في تنفيذ ملف ${path.basename(filePath)}:`, error.message);
        throw error;
    }
};

// دالة لإعداد قاعدة البيانات
const setupDatabase = async () => {
    console.log('🚀 بدء إعداد قاعدة البيانات على Render.com...');

    try {
        // اختبار الاتصال
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('❌ فشل في الاتصال بقاعدة البيانات');
            process.exit(1);
        }

        // تنفيذ schema (غير مدمّر)
        const safeSchema = existsSync('./server/db/schema.safe.sql') ? './server/db/schema.safe.sql' : './server/db/schema.sql';
        await executeSQLFile(safeSchema);

        // إدخال البيانات التجريبية
        await executeSQLFile('./server/db/seed-render.sql');

        console.log('🎉 تم إعداد قاعدة البيانات على Render.com بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في إعداد قاعدة البيانات:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

// تشغيل الإعداد
console.log('🔄 بدء تشغيل setupDatabase...');
setupDatabase().catch(error => {
    console.error('❌ خطأ في تشغيل setupDatabase:', error);
    process.exit(1);
});