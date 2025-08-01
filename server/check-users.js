import { query } from './config/database.js';
import bcrypt from 'bcryptjs';

async function checkUsers() {
    try {
        console.log('🔍 التحقق من المستخدمين في قاعدة البيانات...');

        // جلب جميع المستخدمين
        const users = await query('SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC');

        console.log(`👥 عدد المستخدمين: ${users.rows.length}`);

        if (users.rows.length > 0) {
            console.log('\n📋 قائمة المستخدمين:');
            users.rows.forEach((user, index) => {
                console.log(`${index + 1}. ${user.email} - ${user.first_name} ${user.last_name} (${user.role}) - ${user.created_at}`);
            });
        } else {
            console.log('❌ لا يوجد مستخدمين في قاعدة البيانات');
        }

        // التحقق من كلمة مرور المستخدم الأول
        if (users.rows.length > 0) {
            const firstUser = users.rows[0];
            console.log(`\n🔍 اختبار كلمة المرور للمستخدم: ${firstUser.email}`);

            // جلب كلمة المرور المشفرة
            const passwordResult = await query('SELECT password FROM users WHERE id = $1', [firstUser.id]);
            const hashedPassword = passwordResult.rows[0].password;

            console.log('🔐 كلمة المرور المشفرة:', hashedPassword);

            // اختبار كلمات المرور المحتملة
            const testPasswords = ['123456', 'password', 'admin', '123456789', 'qwerty'];

            for (const testPassword of testPasswords) {
                const isMatch = await bcrypt.compare(testPassword, hashedPassword);
                if (isMatch) {
                    console.log(`✅ كلمة المرور الصحيحة هي: "${testPassword}"`);
                    break;
                }
            }
        }

    } catch (error) {
        console.error('❌ خطأ في التحقق من المستخدمين:', error);
    }
}

checkUsers();