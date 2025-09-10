import { Pool } from 'pg';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// استخدام قاعدة البيانات على Render للتطوير والإنتاج
const dbConfig = {
    // إعدادات قاعدة البيانات على Render
    host: process.env.DB_HOST || 'dpg-d2lhhgh5pdvs73anravg-a.oregon-postgres.render.com',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'shababna',
    user: process.env.DB_USER || 'shababna_user',
    password: process.env.DB_PASSWORD || 'mWiirXAZ4L7jZNoG1TQOGePRaVkEZgL8',
    ssl: {
        rejectUnauthorized: false,
        require: true
    }
};

// إنشاء pool للاتصال بقاعدة البيانات
const pool = new Pool({
    ...dbConfig,
    max: 10, // تقليل الحد الأقصى لعدد الاتصالات
    min: 2, // تقليل الحد الأدنى لعدد الاتصالات
    idleTimeoutMillis: 30000, // 30 ثانية
    connectionTimeoutMillis: 10000, // 10 ثواني
    // إعدادات إضافية لتحسين الاستقرار
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000, // 10 ثواني
    // إعدادات إضافية للاستقرار
    application_name: 'shababna-platform'
});

// دالة لاختبار الاتصال
export const testConnection = async () => {
    try {
        console.log('🔄 محاولة الاتصال بقاعدة البيانات...');
        console.log(`📍 Host: ${dbConfig.host}`);
        console.log(`📍 Port: ${dbConfig.port}`);
        console.log(`📍 Database: ${dbConfig.database}`);
        console.log(`📍 User: ${dbConfig.user}`);
        console.log(`📍 SSL: ${dbConfig.ssl ? 'مفعل' : 'معطل'}`);

        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('✅ تم الاتصال بقاعدة البيانات PostgreSQL بنجاح:', result.rows[0]);
        console.log(`🌐 البيئة: ${process.env.NODE_ENV || 'development'}`);
        return true;
    } catch (error) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات PostgreSQL:', error.message);
        console.error('🔍 تفاصيل الخطأ:', error);
        console.log(`💡 النصيحة: تأكد من صحة بيانات الاتصال أو تحقق من حالة قاعدة البيانات على Render`);
        return false;
    }
};

// دالة لتنفيذ الاستعلامات
export const query = async (text, params = []) => {
    try {
        const result = await pool.query(text, params);
        return result;
    } catch (error) {
        console.error('❌ خطأ في تنفيذ الاستعلام:', error);
        throw error;
    }
};

// دالة للحصول على البيانات
export const getRows = async (text, params = []) => {
    try {
        const result = await pool.query(text, params);
        return result.rows;
    } catch (error) {
        console.error('❌ خطأ في جلب البيانات:', error);
        throw error;
    }
};

// دالة للحصول على صف واحد
export const getRow = async (text, params = []) => {
    try {
        const result = await pool.query(text, params);
        return result.rows[0] || null;
    } catch (error) {
        console.error('❌ خطأ في جلب الصف:', error);
        throw error;
    }
};

// دالة لإغلاق الاتصال
export const closePool = async () => {
    await pool.end();
};

// دالة للحصول على client
export const getClient = () => pool.connect();

export { pool };
export default pool;