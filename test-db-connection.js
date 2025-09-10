import dotenv from 'dotenv';
import { Pool } from 'pg';

// تحميل متغيرات البيئة
dotenv.config();

// إعدادات قاعدة البيانات
const dbConfig = {
    host: 'dpg-d2lhhgh5pdvs73anravg-a.oregon-postgres.render.com',
    port: 5432,
    database: 'shababna',
    user: 'shababna_user',
    password: 'mWiirXAZ4L7jZNoG1TQOGePRaVkEZgL8',
    ssl: {
        rejectUnauthorized: false,
        require: true
    }
};

console.log('🔄 اختبار الاتصال بقاعدة البيانات...');
console.log('📍 إعدادات الاتصال:', {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    ssl: dbConfig.ssl
});

const pool = new Pool(dbConfig);

async function testConnection() {
    try {
        console.log('🔄 محاولة الاتصال...');
        const client = await pool.connect();
        console.log('✅ تم الاتصال بنجاح!');

        const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
        console.log('📊 معلومات قاعدة البيانات:');
        console.log('   الوقت الحالي:', result.rows[0].current_time);
        console.log('   إصدار PostgreSQL:', result.rows[0].postgres_version);

        client.release();
        await pool.end();
        console.log('✅ تم إغلاق الاتصال بنجاح');

    } catch (error) {
        console.error('❌ فشل الاتصال:', error.message);
        console.error('🔍 تفاصيل الخطأ:', error);

        if (error.code) {
            console.error('📋 كود الخطأ:', error.code);
        }

        await pool.end();
        process.exit(1);
    }
}

testConnection();
