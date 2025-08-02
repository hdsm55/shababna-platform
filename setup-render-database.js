#!/usr/bin/env node

/**
 * إعداد قاعدة البيانات PostgreSQL على Render.com
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'shaababna_db',
    user: process.env.DB_USER || 'shaababna_db_user',
    password: process.env.DB_PASSWORD || 'vqvaeTyJS1qD1NVwurk8knW1GnUoRCna',
    ssl: {
        rejectUnauthorized: false
    }
});

console.log('🗄️ إعداد قاعدة البيانات PostgreSQL على Render.com...\n');

async function setupDatabase() {
    try {
        // فحص الاتصال
        const client = await pool.connect();
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

        // إنشاء الجداول
        await createTables(client);

        // إدخال البيانات التجريبية
        await insertSampleData(client);

        client.release();
        console.log('\n🎉 تم إعداد قاعدة البيانات بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في إعداد قاعدة البيانات:', error.message);
    } finally {
        await pool.end();
    }
}

async function createTables(client) {
    console.log('\n📋 إنشاء الجداول...');

    const tables = [
        // جدول المستخدمين
        `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // جدول الأحداث
        `CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            date DATE NOT NULL,
            time TIME,
            location VARCHAR(200),
            image_url VARCHAR(500),
            max_participants INTEGER,
            current_participants INTEGER DEFAULT 0,
            status VARCHAR(20) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // جدول البرامج
        `CREATE TABLE IF NOT EXISTS programs (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            duration VARCHAR(100),
            category VARCHAR(100),
            image_url VARCHAR(500),
            status VARCHAR(20) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // جدول المدونات
        `CREATE TABLE IF NOT EXISTS blogs (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            content TEXT NOT NULL,
            author VARCHAR(100),
            image_url VARCHAR(500),
            status VARCHAR(20) DEFAULT 'published',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // جدول نماذج الاتصال
        `CREATE TABLE IF NOT EXISTS contact_forms (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            subject VARCHAR(200),
            message TEXT NOT NULL,
            status VARCHAR(20) DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // جدول طلبات الانضمام
        `CREATE TABLE IF NOT EXISTS join_requests (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            message TEXT,
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    for (const table of tables) {
        try {
            await client.query(table);
            console.log('✅ تم إنشاء الجدول بنجاح');
        } catch (error) {
            console.log('⚠️ الجدول موجود بالفعل أو خطأ:', error.message);
        }
    }
}

async function insertSampleData(client) {
    console.log('\n📝 إدخال البيانات التجريبية...');

    // إدخال مستخدم تجريبي
    try {
        await client.query(`
            INSERT INTO users (username, email, password, role)
            VALUES ('admin', 'admin@shababna.org', '$2a$10$example', 'admin')
            ON CONFLICT (email) DO NOTHING
        `);
        console.log('✅ تم إدخال المستخدم التجريبي');
    } catch (error) {
        console.log('⚠️ المستخدم موجود بالفعل');
    }

    // إدخال أحداث تجريبية
    const sampleEvents = [
        {
            title: 'مؤتمر الشباب العربي',
            description: 'مؤتمر سنوي يجمع الشباب العربي لمناقشة القضايا المعاصرة',
            date: '2024-12-15',
            time: '09:00:00',
            location: 'القاهرة، مصر',
            max_participants: 200
        },
        {
            title: 'ورشة العمل التطوعية',
            description: 'ورشة عمل لتعزيز روح التطوع لدى الشباب',
            date: '2024-12-20',
            time: '14:00:00',
            location: 'عمان، الأردن',
            max_participants: 50
        }
    ];

    for (const event of sampleEvents) {
        try {
            await client.query(`
                INSERT INTO events (title, description, date, time, location, max_participants)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [event.title, event.description, event.date, event.time, event.location, event.max_participants]);
            console.log(`✅ تم إدخال الحدث: ${event.title}`);
        } catch (error) {
            console.log(`⚠️ الحدث موجود بالفعل: ${event.title}`);
        }
    }

    // إدخال برامج تجريبية
    const samplePrograms = [
        {
            title: 'برنامج القيادة الشبابية',
            description: 'برنامج متكامل لتنمية مهارات القيادة لدى الشباب',
            duration: '6 أشهر',
            category: 'القيادة'
        },
        {
            title: 'برنامج التطوع المجتمعي',
            description: 'برنامج لتعزيز روح التطوع والمشاركة المجتمعية',
            duration: '3 أشهر',
            category: 'التطوع'
        }
    ];

    for (const program of samplePrograms) {
        try {
            await client.query(`
                INSERT INTO programs (title, description, duration, category)
                VALUES ($1, $2, $3, $4)
            `, [program.title, program.description, program.duration, program.category]);
            console.log(`✅ تم إدخال البرنامج: ${program.title}`);
        } catch (error) {
            console.log(`⚠️ البرنامج موجود بالفعل: ${program.title}`);
        }
    }

    // إدخال مدونات تجريبية
    const sampleBlogs = [
        {
            title: 'أهمية العمل التطوعي في المجتمع',
            content: 'العمل التطوعي يلعب دوراً مهماً في بناء المجتمعات...',
            author: 'فريق شبابنا'
        },
        {
            title: 'كيف تصبح قائداً فعالاً',
            content: 'القيادة الفعالة تتطلب مجموعة من المهارات والصفات...',
            author: 'فريق شبابنا'
        }
    ];

    for (const blog of sampleBlogs) {
        try {
            await client.query(`
                INSERT INTO blogs (title, content, author)
                VALUES ($1, $2, $3)
            `, [blog.title, blog.content, blog.author]);
            console.log(`✅ تم إدخال المدونة: ${blog.title}`);
        } catch (error) {
            console.log(`⚠️ المدونة موجودة بالفعل: ${blog.title}`);
        }
    }
}

setupDatabase().catch(console.error);