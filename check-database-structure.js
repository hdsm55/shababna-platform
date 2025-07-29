import { query } from './server/config/database.js';

async function checkDatabaseStructure() {
    console.log('🔍 التحقق من هيكل قاعدة البيانات...');

    try {
        // التحقق من جدول المستخدمين
        console.log('\n👥 جدول المستخدمين:');
        const usersStructure = await query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users'
            ORDER BY ordinal_position
        `);
        usersStructure.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });

        // التحقق من جدول الفعاليات
        console.log('\n📅 جدول الفعاليات:');
        const eventsStructure = await query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'events'
            ORDER BY ordinal_position
        `);
        eventsStructure.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });

        // التحقق من جدول البرامج
        console.log('\n🎯 جدول البرامج:');
        const programsStructure = await query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'programs'
            ORDER BY ordinal_position
        `);
        programsStructure.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });

        // التحقق من عدد الصفوف في كل جدول
        console.log('\n📊 عدد الصفوف في الجداول:');

        const usersCount = await query('SELECT COUNT(*) as count FROM users');
        console.log(`  - المستخدمين: ${usersCount.rows[0].count}`);

        const eventsCount = await query('SELECT COUNT(*) as count FROM events');
        console.log(`  - الفعاليات: ${eventsCount.rows[0].count}`);

        const programsCount = await query('SELECT COUNT(*) as count FROM programs');
        console.log(`  - البرامج: ${programsCount.rows[0].count}`);

        const contactsCount = await query('SELECT COUNT(*) as count FROM contact_forms');
        console.log(`  - رسائل التواصل: ${contactsCount.rows[0].count}`);

        const joinsCount = await query('SELECT COUNT(*) as count FROM join_requests');
        console.log(`  - طلبات الانضمام: ${joinsCount.rows[0].count}`);

    } catch (error) {
        console.error('❌ خطأ في التحقق من هيكل قاعدة البيانات:', error.message);
    }
}

checkDatabaseStructure();