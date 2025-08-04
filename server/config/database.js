import { Pool } from 'pg';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// إنشاء pool للاتصال بقاعدة البيانات
const pool = new Pool({
    host: process.env.DB_HOST || 'dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'shaababna_db',
    user: process.env.DB_USER || 'shaababna_db_user',
    password: process.env.DB_PASSWORD || 'vqvaeTyJS1qD1NVwurk8knW1GnUoRCna',
    max: 20, // زيادة الحد الأقصى لعدد الاتصالات
    min: 5, // زيادة الحد الأدنى لعدد الاتصالات
    idleTimeoutMillis: 30000000, // 5 دقائق - زيادة وقت الانتظار قبل إغلاق الاتصال
    connectionTimeoutMillis: 6000000, // دقيقة واحدة - زيادة وقت الانتظار للاتصال
    ssl: {
        rejectUnauthorized: false,
        require: true
    },
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
        return true;
    } catch (error) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات PostgreSQL:', error.message);
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