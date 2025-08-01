import { query } from './config/database.js';

async function checkTables() {
    try {
        console.log('🔍 التحقق من وجود الجداول...');

        // التحقق من جدول المستخدمين
        const usersResult = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `);
        console.log('📋 جدول المستخدمين:', usersResult.rows[0].exists ? '✅ موجود' : '❌ غير موجود');

        // التحقق من جدول الأحداث
        const eventsResult = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'events'
      );
    `);
        console.log('📋 جدول الأحداث:', eventsResult.rows[0].exists ? '✅ موجود' : '❌ غير موجود');

        // التحقق من جدول البرامج
        const programsResult = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'programs'
      );
    `);
        console.log('📋 جدول البرامج:', programsResult.rows[0].exists ? '✅ موجود' : '❌ غير موجود');

        // التحقق من عدد المستخدمين
        if (usersResult.rows[0].exists) {
            const userCount = await query('SELECT COUNT(*) FROM users');
            console.log('👥 عدد المستخدمين:', userCount.rows[0].count);
        }

        // التحقق من عدد الأحداث
        if (eventsResult.rows[0].exists) {
            const eventCount = await query('SELECT COUNT(*) FROM events');
            console.log('📅 عدد الأحداث:', eventCount.rows[0].count);
        }

        // التحقق من عدد البرامج
        if (programsResult.rows[0].exists) {
            const programCount = await query('SELECT COUNT(*) FROM programs');
            console.log('📚 عدد البرامج:', programCount.rows[0].count);
        }

    } catch (error) {
        console.error('❌ خطأ في التحقق من الجداول:', error);
    }
}

checkTables();
