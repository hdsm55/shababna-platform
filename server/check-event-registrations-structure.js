import { query } from './config/database.js';

async function checkEventRegistrationsStructure() {
    try {
        console.log('🔍 فحص بنية جدول event_registrations...');

        const result = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'event_registrations'
      ORDER BY ordinal_position
    `);

        console.log('📋 بنية جدول event_registrations:');
        result.rows.forEach(row => {
            console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });

        // فحص البيانات الموجودة
        const data = await query('SELECT * FROM event_registrations LIMIT 3');
        console.log('\n📊 عينة من البيانات الموجودة:');
        if (data.rows.length > 0) {
            console.log('الحقول المتاحة:', Object.keys(data.rows[0]));
            data.rows.forEach((item, index) => {
                console.log(`التسجيل ${index + 1}:`, item);
            });
        } else {
            console.log('لا توجد بيانات في جدول event_registrations');
        }

    } catch (error) {
        console.error('❌ خطأ في فحص بنية الجدول:', error);
    }
}

checkEventRegistrationsStructure();
