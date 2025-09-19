import { query } from './config/database.js';

async function checkUsersStructure() {
    try {
        console.log('🔍 فحص بنية جدول users...');

        const result = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

        console.log('📋 بنية جدول users:');
        result.rows.forEach(row => {
            console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });

        // فحص البيانات الموجودة
        const usersData = await query('SELECT * FROM users LIMIT 3');
        console.log('\n📊 عينة من البيانات الموجودة:');
        if (usersData.rows.length > 0) {
            console.log('الحقول المتاحة:', Object.keys(usersData.rows[0]));
            usersData.rows.forEach((user, index) => {
                console.log(`المستخدم ${index + 1}:`, user);
            });
        } else {
            console.log('لا توجد بيانات في جدول users');
        }

    } catch (error) {
        console.error('❌ خطأ في فحص بنية الجدول:', error);
    }
}

checkUsersStructure();
