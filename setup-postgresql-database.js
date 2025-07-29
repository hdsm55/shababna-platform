import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// إعداد اتصال PostgreSQL للإنشاء الأولي
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'shababna', // قاعدة البيانات الافتراضية
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
    const client = await pool.connect();

    try {
        console.log('🔧 بدء إعداد قاعدة البيانات PostgreSQL...');

        // إنشاء قاعدة البيانات
        try {
            await client.query('CREATE DATABASE shababna_db');
            console.log('✅ تم إنشاء قاعدة البيانات shababna_db');
        } catch (error) {
            if (error.code === '42P04') {
                console.log('ℹ️ قاعدة البيانات موجودة بالفعل');
            } else {
                console.error('❌ خطأ في إنشاء قاعدة البيانات:', error.message);
                return;
            }
        }

    } finally {
        client.release();
    }

    // إغلاق الاتصال وإعادة الاتصال بقاعدة البيانات الجديدة
    await pool.end();

    // إنشاء اتصال جديد بقاعدة البيانات الجديدة
    const newPool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'shababna_db',
        password: process.env.DB_PASSWORD || 'password',
        port: process.env.DB_PORT || 5432,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    const newClient = await newPool.connect();

    try {
        console.log('📋 إنشاء الجداول...');

        // جدول المستخدمين
        await newClient.query(`
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
        console.log('✅ جدول المستخدمين');

        // جدول الفعاليات
        await newClient.query(`
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
        console.log('✅ جدول الفعاليات');

        // جدول البرامج
        await newClient.query(`
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
        console.log('✅ جدول البرامج');

        // جدول التبرعات
        await newClient.query(`
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
        console.log('✅ جدول التبرعات');

        // جدول رسائل التواصل
        await newClient.query(`
            CREATE TABLE IF NOT EXISTS contact_forms (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ جدول رسائل التواصل');

        // جدول طلبات الانضمام
        await newClient.query(`
            CREATE TABLE IF NOT EXISTS join_requests (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                message TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ جدول طلبات الانضمام');

        // جدول تسجيل الفعاليات
        await newClient.query(`
            CREATE TABLE IF NOT EXISTS event_registrations (
                id SERIAL PRIMARY KEY,
                event_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (event_id) REFERENCES events (id)
            )
        `);
        console.log('✅ جدول تسجيل الفعاليات');

        // جدول تسجيل البرامج
        await newClient.query(`
            CREATE TABLE IF NOT EXISTS program_registrations (
                id SERIAL PRIMARY KEY,
                program_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (program_id) REFERENCES programs (id)
            )
        `);
        console.log('✅ جدول تسجيل البرامج');

        // جدول دعم البرامج
        await newClient.query(`
            CREATE TABLE IF NOT EXISTS program_supporters (
                id SERIAL PRIMARY KEY,
                program_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                support_type VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (program_id) REFERENCES programs (id)
            )
        `);
        console.log('✅ جدول دعم البرامج');

        console.log('\n🎉 تم إعداد قاعدة البيانات بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في إنشاء الجداول:', error.message);
    } finally {
        newClient.release();
        await newPool.end();
    }
}

setupDatabase();