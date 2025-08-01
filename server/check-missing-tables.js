import { query } from './config/database.js';

async function checkMissingTables() {
    try {
        console.log('🔍 التحقق من الجداول المفقودة...');

        const requiredTables = [
            'join_requests',
            'contact_forms',
            'program_registrations',
            'event_registrations',
            'donations',
            'volunteers',
            'volunteer_hours'
        ];

        for (const tableName of requiredTables) {
            const result = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = $1
        );
      `, [tableName]);

            const exists = result.rows[0].exists;
            console.log(`📋 جدول ${tableName}: ${exists ? '✅ موجود' : '❌ غير موجود'}`);

            if (!exists) {
                console.log(`   ⚠️  جدول ${tableName} مفقود - سيتم إنشاؤه`);
            }
        }

    } catch (error) {
        console.error('❌ خطأ في التحقق من الجداول:', error);
    }
}

checkMissingTables();