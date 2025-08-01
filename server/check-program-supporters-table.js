import { query } from './config/database.js';

async function checkProgramSupportersTable() {
    try {
        console.log('🔍 التحقق من جدول program_supporters...');

        // التحقق من وجود الجدول
        const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'program_supporters'
      );
    `);

        if (!tableExists.rows[0].exists) {
            console.log('❌ جدول program_supporters غير موجود');
            return;
        }

        console.log('✅ جدول program_supporters موجود');

        // جلب هيكل الجدول
        const columns = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'program_supporters'
      ORDER BY ordinal_position;
    `);

        console.log('\n📋 أعمدة الجدول:');
        columns.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });

        // جلب عدد الصفوف
        const count = await query('SELECT COUNT(*) FROM program_supporters');
        console.log(`\n📊 عدد الصفوف: ${count.rows[0].count}`);

        // جلب عينة من البيانات
        if (parseInt(count.rows[0].count) > 0) {
            const sample = await query('SELECT * FROM program_supporters LIMIT 3');
            console.log('\n📋 عينة من البيانات:');
            sample.rows.forEach((row, index) => {
                console.log(`  ${index + 1}. ${JSON.stringify(row, null, 2)}`);
            });
        }

    } catch (error) {
        console.error('❌ خطأ في التحقق من الجدول:', error);
    }
}

checkProgramSupportersTable();