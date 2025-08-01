import { query } from './config/database.js';

async function updateUserRole() {
    try {
        console.log('🔍 تحديث دور المستخدم...');

        // تحديث دور المستخدم Husam إلى admin
        const updateResult = await query(`
      UPDATE users
      SET role = 'admin'
      WHERE email = 'hossamaldahry@gmail.com'
    `);

        console.log('✅ تم تحديث دور المستخدم بنجاح!');
        console.log(`📊 عدد الصفوف المحدثة: ${updateResult.rowCount}`);

        // التحقق من التحديث
        const checkResult = await query(`
      SELECT id, email, first_name, last_name, role
      FROM users
      WHERE email = 'hossamaldahry@gmail.com'
    `);

        if (checkResult.rows.length > 0) {
            const user = checkResult.rows[0];
            console.log('📋 بيانات المستخدم المحدث:');
            console.log(`   - الاسم: ${user.first_name} ${user.last_name}`);
            console.log(`   - البريد الإلكتروني: ${user.email}`);
            console.log(`   - الدور: ${user.role}`);
            console.log(`   - ID: ${user.id}`);
        }

    } catch (error) {
        console.error('❌ خطأ:', error.message);
    }
}

updateUserRole();