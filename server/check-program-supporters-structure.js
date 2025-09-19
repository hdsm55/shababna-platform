import { query } from './config/database.js';

async function checkProgramSupportersStructure() {
    try {
        console.log('🔍 فحص بنية جدول program_supporters...');

        const result = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'program_supporters'
      ORDER BY ordinal_position
    `);

        console.log('📋 بنية جدول program_supporters:');
        result.rows.forEach(row => {
            console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });

        // فحص البيانات الموجودة
        const data = await query('SELECT * FROM program_supporters LIMIT 3');
        console.log('\n📊 عينة من البيانات الموجودة:');
        if (data.rows.length > 0) {
            console.log('الحقول المتاحة:', Object.keys(data.rows[0]));
            data.rows.forEach((item, index) => {
                console.log(`الداعم ${index + 1}:`, item);
            });
        } else {
            console.log('لا توجد بيانات في جدول program_supporters');
        }

    } catch (error) {
        console.error('❌ خطأ في فحص بنية الجدول:', error);
    }
}

checkProgramSupportersStructure();
