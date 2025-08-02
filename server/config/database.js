import { Pool } from 'pg';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// إنشاء pool للاتصال بقاعدة البيانات مع إعدادات محسنة
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'shababna',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 25, // زيادة الحد الأقصى لعدد الاتصالات
    min: 2, // إضافة حد أدنى للاتصالات
    idleTimeoutMillis: 60000, // زيادة وقت الانتظار قبل إغلاق الاتصال
    connectionTimeoutMillis: 15000, // زيادة وقت الانتظار للاتصال
    acquireTimeoutMillis: 30000, // وقت انتظار للحصول على اتصال
    ssl: {
        rejectUnauthorized: false,
        require: true
    }
});

// إضافة مستمع للأخطاء
pool.on('error', (err) => {
    console.error('❌ خطأ في pool الاتصال:', err);
});

// إضافة مستمع للاتصال
pool.on('connect', (client) => {
    console.log('🔗 تم إنشاء اتصال جديد بقاعدة البيانات');
});

// إضافة مستمع لإغلاق الاتصال
pool.on('remove', (client) => {
    console.log('🔌 تم إغلاق اتصال بقاعدة البيانات');
});

// دالة لاختبار الاتصال مع إعادة المحاولة المحسنة
export const testConnection = async (retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT NOW()');
            client.release();
            console.log('✅ تم الاتصال بقاعدة البيانات PostgreSQL بنجاح:', result.rows[0]);
            return true;
        } catch (error) {
            console.error(`❌ محاولة ${i + 1}/${retries} - خطأ في الاتصال بقاعدة البيانات PostgreSQL:`, error.message);
            if (i === retries - 1) return false;
            // انتظار متزايد قبل المحاولة التالية
            const waitTime = Math.min(1000 * Math.pow(2, i), 5000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
    return false;
};

// دالة لتنفيذ الاستعلامات مع إعادة المحاولة المحسنة
export const query = async (text, params = [], retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await pool.query(text, params);
            return result;
        } catch (error) {
            console.error(`❌ محاولة ${i + 1}/${retries} - خطأ في تنفيذ الاستعلام:`, error.message);
            if (i === retries - 1) throw error;
            // انتظار متزايد قبل المحاولة التالية
            const waitTime = Math.min(1000 * Math.pow(2, i), 3000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
};

// دالة للحصول على البيانات مع إعادة المحاولة المحسنة
export const getRows = async (text, params = [], retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await pool.query(text, params);
            return result.rows;
        } catch (error) {
            console.error(`❌ محاولة ${i + 1}/${retries} - خطأ في جلب البيانات:`, error.message);
            if (i === retries - 1) throw error;
            // انتظار متزايد قبل المحاولة التالية
            const waitTime = Math.min(1000 * Math.pow(2, i), 3000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
};

// دالة للحصول على صف واحد مع إعادة المحاولة المحسنة
export const getRow = async (text, params = [], retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await pool.query(text, params);
            return result.rows[0] || null;
        } catch (error) {
            console.error(`❌ محاولة ${i + 1}/${retries} - خطأ في جلب الصف:`, error.message);
            if (i === retries - 1) throw error;
            // انتظار متزايد قبل المحاولة التالية
            const waitTime = Math.min(1000 * Math.pow(2, i), 3000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
};

// دالة لإغلاق الاتصال
export const closePool = async () => {
    await pool.end();
};

// دالة للحصول على client
export const getClient = () => pool.connect();

// دالة للحصول على إحصائيات Pool
export const getPoolStats = () => {
    return {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
    };
};

export { pool };
export default pool;