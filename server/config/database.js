import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// إعداد اتصال PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'shababna_db',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// دالة لإنشاء/فتح قاعدة البيانات
export const initDatabase = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ تم الاتصال بقاعدة البيانات PostgreSQL بنجاح');
        return client;
    } catch (error) {
        console.error('❌ فشل الاتصال بقاعدة البيانات:', error);
        throw error;
    }
};

// دالة لتنفيذ الاستعلامات
export const query = async (text, params = []) => {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } finally {
        client.release();
    }
};

// دالة لتنفيذ استعلام واحد
export const queryOne = async (text, params = []) => {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result.rows[0];
    } finally {
        client.release();
    }
};

// دالة لتنفيذ استعلام تعديل
export const run = async (text, params = []) => {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } finally {
        client.release();
    }
};

// دالة للحصول على العميل للعمليات المعقدة
export const getClient = () => pool.connect();

// دالة لإغلاق الاتصال
export const closePool = async () => {
    await pool.end();
};

// دالة لاختبار الاتصال
export const testConnection = async () => {
    try {
        const result = await query('SELECT NOW() as now');
        console.log('✅ اختبار الاتصال نجح:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('❌ فشل اختبار الاتصال:', error.message);
        return false;
    }
};

// دالة لإنشاء الجداول
export const createTables = async () => {
    const client = await pool.connect();

    try {
        // جدول المستخدمين
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // جدول الفعاليات
        await client.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                start_date DATE,
                end_date DATE,
                location VARCHAR(255),
                max_attendees INTEGER,
                attendees INTEGER DEFAULT 0,
                category VARCHAR(100),
                image_url VARCHAR(500),
                status VARCHAR(50) DEFAULT 'upcoming',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // جدول البرامج
        await client.query(`
            CREATE TABLE IF NOT EXISTS programs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100) DEFAULT 'عام',
                goal_amount NUMERIC(10,2) DEFAULT 0,
                current_amount NUMERIC(10,2) DEFAULT 0,
                participants_count INTEGER DEFAULT 0,
                status VARCHAR(50) DEFAULT 'active',
                image_url VARCHAR(500),
                start_date DATE,
                end_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // جدول التبرعات
        await client.query(`
            CREATE TABLE IF NOT EXISTS donations (
                id SERIAL PRIMARY KEY,
                donor_name VARCHAR(255) NOT NULL,
                amount NUMERIC(10,2) NOT NULL,
                program_id INTEGER,
                payment_method VARCHAR(100),
                status VARCHAR(50) DEFAULT 'completed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (program_id) REFERENCES programs (id)
            )
        `);

        console.log('✅ تم إنشاء الجداول بنجاح');
    } finally {
        client.release();
    }
};

export default { initDatabase, query, queryOne, run, testConnection, createTables };