import { query } from './config/database.js';

async function checkUserRole() {
    try {
        console.log('🔍 التحقق من دور المستخدم...');

        // جلب جميع المستخدمين مع أدوارهم
        const usersResult = await query(`
      SELECT
        id,
        email,
        first_name,
        last_name,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);

        console.log('📋 بيانات المستخدمين:');
        usersResult.rows.forEach((user, index) => {
            console.log(`${index + 1}. ${user.first_name} ${user.last_name}`);
            console.log(`   - Email: ${user.email}`);
            console.log(`   - Role: ${user.role}`);
            console.log(`   - ID: ${user.id}`);
            console.log('   ---');
        });

        // التحقق من وجود مستخدمين بصلاحيات admin
        const adminUsers = usersResult.rows.filter(user => user.role === 'admin');
        console.log(`📊 عدد المستخدمين بصلاحيات admin: ${adminUsers.length}`);

        if (adminUsers.length === 0) {
            console.log('⚠️  لا يوجد مستخدمين بصلاحيات admin!');
            console.log('💡 يجب إنشاء مستخدم admin أولاً');
        } else {
            console.log('✅ يوجد مستخدمين بصلاحيات admin');
        }

    } catch (error) {
        console.error('❌ خطأ:', error.message);
    }
}

checkUserRole();