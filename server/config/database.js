import { Pool } from 'pg';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// إعدادات قاعدة البيانات المحلية للتطوير
const isDevelopment = process.env.NODE_ENV === 'development';

const dbConfig = isDevelopment ? {
    // إعدادات قاعدة البيانات المحلية
    host: 'localhost',
    port: 5432,
    database: 'shababna_dev',
    user: 'postgres',
    password: 'postgres',
    ssl: false
} : {
    // إعدادات قاعدة البيانات على Render للإنتاج
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
    max: 20, // زيادة الحد الأقصى لعدد الاتصالات
    min: 5, // زيادة الحد الأدنى لعدد الاتصالات
    idleTimeoutMillis: 30000000, // 5 دقائق - زيادة وقت الانتظار قبل إغلاق الاتصال
    connectionTimeoutMillis: 6000000, // دقيقة واحدة - زيادة وقت الانتظار للاتصال
    // إعدادات إضافية لتحسين الاستقرار
    keepAlive: true,
    keepAliveInitialDelayMillis: 30000, // 30 ثانية
    // إعدادات إضافية لتحسين الاستقرار
    statement_timeout: 300000, // 5 دقائق للاستعلامات
    query_timeout: 300000, // 5 دقائق للاستعلامات
    // إعدادات إضافية للاستقرار
    application_name: 'shababna-platform',
    // إعدادات إضافية للاتصال
    tcp_keepalives_idle: 300, // 5 دقائق
    tcp_keepalives_interval: 60, // دقيقة واحدة
    tcp_keepalives_count: 3
});

// دالة لاختبار الاتصال
export const testConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('✅ تم الاتصال بقاعدة البيانات PostgreSQL بنجاح:', result.rows[0]);
        console.log(`🌐 البيئة: ${isDevelopment ? 'تطوير محلي' : 'إنتاج'}`);
        return true;
    } catch (error) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات PostgreSQL:', error.message);
        console.log(`💡 النصيحة: تأكد من تشغيل قاعدة البيانات المحلية أو تحديث إعدادات Render`);
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