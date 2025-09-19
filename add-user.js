import bcrypt from 'bcryptjs';
import { query } from './server/config/database.js';

async function addUser() {
    try {
        console.log('👤 إضافة مستخدم جديد...\n');

        const userData = {
            email: 'ghaya.team.2025@gmail.com',
            password: '123456', // كلمة مرور مؤقتة
            first_name: 'Ghaya',
            last_name: 'Team',
            role: 'user'
        };

        // التحقق من وجود المستخدم
        const existingUser = await query('SELECT * FROM users WHERE email = $1', [userData.email]);

        if (existingUser.rows.length > 0) {
            console.log('⚠️ المستخدم موجود بالفعل:', existingUser.rows[0].email);
            return;
        }

        // تشفير كلمة المرور
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        // إضافة المستخدم
        const result = await query(`
      INSERT INTO users (email, password, first_name, last_name, role, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, email, first_name, last_name, role
    `, [userData.email, hashedPassword, userData.first_name, userData.last_name, userData.role]);

        const newUser = result.rows[0];

        console.log('✅ تم إضافة المستخدم بنجاح:');
        console.log(`📧 البريد: ${newUser.email}`);
        console.log(`👤 الاسم: ${newUser.first_name} ${newUser.last_name}`);
        console.log(`🔑 الدور: ${newUser.role}`);
        console.log(`🔐 كلمة المرور المؤقتة: ${userData.password}`);
        console.log('\n💡 يمكن للمستخدم الآن استخدام نظام إعادة تعيين كلمة المرور');

    } catch (error) {
        console.error('❌ خطأ في إضافة المستخدم:', error);
    }
}

addUser()
    .then(() => {
        console.log('\n✅ انتهى إضافة المستخدم');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ فشل إضافة المستخدم:', error);
        process.exit(1);
    });
