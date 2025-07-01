import { Pool } from 'pg';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// إعداد اتصال قاعدة البيانات
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'shababna',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 20, // الحد الأقصى لعدد الاتصالات في المجمع
    idleTimeoutMillis: 30000, // وقت الانتظار قبل إغلاق الاتصال غير المستخدم
    connectionTimeoutMillis: 2000, // وقت الانتظار للاتصال
});

// اختبار الاتصال
pool.on('connect', () => {
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
});

pool.on('error', (err) => {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err);
});

// دالة لتنفيذ الاستعلامات
export const query = (text, params) => pool.query(text, params);

// دالة للحصول على العميل للعمليات المعقدة
export const getClient = () => pool.connect();

// دالة لإغلاق الاتصال
export const closePool = () => pool.end();

// دالة لاختبار الاتصال
export const testConnection = async () => {
    try {
        const result = await query('SELECT NOW()');
        console.log('✅ اختبار الاتصال نجح:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('❌ فشل اختبار الاتصال:', error.message);
        return false;
    }
};

export default pool;