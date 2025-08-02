#!/usr/bin/env node

/**
 * فحص قاعدة البيانات PostgreSQL على Render.com
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

console.log('🔍 فحص قاعدة البيانات PostgreSQL...\n');

async function checkDatabase() {
    try {
        const client = await pool.connect();
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

        // فحص الجداول الموجودة
        const tablesResult = await client.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        console.log('\n📋 الجداول الموجودة:');
        if (tablesResult.rows.length === 0) {
            console.log('❌ لا توجد جداول في قاعدة البيانات');
        } else {
            tablesResult.rows.forEach(row => {
                console.log(`   ✅ ${row.table_name}`);
            });
        }

        // فحص البيانات في كل جدول
        const tables = ['users', 'events', 'programs', 'blogs', 'contact_forms', 'join_requests'];

        for (const table of tables) {
            try {
                const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
                const count = countResult.rows[0].count;
                console.log(`   📊 ${table}: ${count} صف`);

                if (count > 0) {
                    const sampleResult = await client.query(`SELECT * FROM ${table} LIMIT 1`);
                    console.log(`   📝 عينة: ${JSON.stringify(sampleResult.rows[0], null, 2)}`);
                }
            } catch (error) {
                console.log(`   ❌ ${table}: الجدول غير موجود`);
            }
        }

        client.release();
        console.log('\n🎉 فحص قاعدة البيانات مكتمل!');

    } catch (error) {
        console.error('❌ خطأ في فحص قاعدة البيانات:', error.message);
    } finally {
        await pool.end();
    }
}

checkDatabase().catch(console.error);