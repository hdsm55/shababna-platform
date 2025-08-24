import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables (server/index.js already loads env.* if present)
dotenv.config();

// Prefer DATABASE_URL when provided; fall back to discrete env vars
const useConnectionString = !!process.env.DATABASE_URL;
const baseConfig = useConnectionString
  ? {
      connectionString: process.env.DATABASE_URL,
    }
  : {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    };

// Create pool
const pool = new Pool({
    ...baseConfig,
    max: process.env.PG_MAX ? Number(process.env.PG_MAX) : 20,
    min: process.env.PG_MIN ? Number(process.env.PG_MIN) : 0,
    idleTimeoutMillis: process.env.PG_IDLE_TIMEOUT ? Number(process.env.PG_IDLE_TIMEOUT) : 30000,
    connectionTimeoutMillis: process.env.PG_CONN_TIMEOUT ? Number(process.env.PG_CONN_TIMEOUT) : 20000,
    ssl: (process.env.PGSSL === 'disable' || process.env.PGSSL === 'false')
      ? false
      : { rejectUnauthorized: false },
    keepAlive: true,
    keepAliveInitialDelayMillis: 30000,
    statement_timeout: process.env.PG_STATEMENT_TIMEOUT ? Number(process.env.PG_STATEMENT_TIMEOUT) : 30000,
    query_timeout: process.env.PG_QUERY_TIMEOUT ? Number(process.env.PG_QUERY_TIMEOUT) : 30000,
    application_name: process.env.PG_APP_NAME || 'shababna-platform',
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