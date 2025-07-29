import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

let db = null;

// دالة لإنشاء/فتح قاعدة البيانات
export const initDatabase = async () => {
    if (!db) {
        db = await open({
            filename: './shababna.db',
            driver: sqlite3.Database
        });
        console.log('✅ تم الاتصال بقاعدة البيانات SQLite بنجاح');
    }
    return db;
};

// دالة لتنفيذ الاستعلامات
export const query = async (text, params = []) => {
    const database = await initDatabase();
    const result = await database.all(text, params);
    return { rows: result, rowCount: result.length };
};

// دالة لتنفيذ استعلام واحد
export const queryOne = async (text, params = []) => {
    const database = await initDatabase();
    const result = await database.get(text, params);
    return result;
};

// دالة لتنفيذ استعلام تعديل
export const run = async (text, params = []) => {
    const database = await initDatabase();
    const result = await database.run(text, params);
    return { rows: [], rowCount: result.changes };
};

// دالة للحصول على العميل للعمليات المعقدة
export const getClient = () => initDatabase();

// دالة لإغلاق الاتصال
export const closePool = async () => {
    if (db) {
        await db.close();
        db = null;
    }
};

// دالة لاختبار الاتصال
export const testConnection = async () => {
    try {
        const result = await query('SELECT datetime("now") as now');
        console.log('✅ اختبار الاتصال نجح:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('❌ فشل اختبار الاتصال:', error.message);
        return false;
    }
};

// دالة لإنشاء الجداول
export const createTables = async () => {
    const database = await initDatabase();

    // جدول المستخدمين
    await database.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // جدول الفعاليات
    await database.exec(`
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            start_date DATE,
            end_date DATE,
            location TEXT,
            max_attendees INTEGER,
            attendees INTEGER DEFAULT 0,
            category TEXT,
            image_url TEXT,
            status TEXT DEFAULT 'upcoming',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // جدول البرامج
    await database.exec(`
        CREATE TABLE IF NOT EXISTS programs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT DEFAULT 'عام',
            goal_amount REAL DEFAULT 0,
            current_amount REAL DEFAULT 0,
            participants_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            image_url TEXT,
            start_date DATE,
            end_date DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // جدول التبرعات
    await database.exec(`
        CREATE TABLE IF NOT EXISTS donations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            donor_name TEXT NOT NULL,
            amount REAL NOT NULL,
            program_id INTEGER,
            payment_method TEXT,
            status TEXT DEFAULT 'completed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (program_id) REFERENCES programs (id)
        )
    `);

    console.log('✅ تم إنشاء الجداول بنجاح');
};

export default { initDatabase, query, queryOne, run, testConnection, createTables };