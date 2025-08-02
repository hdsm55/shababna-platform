import { query } from './config/database.js';
import bcrypt from 'bcryptjs';

async function addAdminUser() {
    try {
        console.log('🚀 إضافة مستخدم أدمن...');

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // التحقق من وجود المستخدم
        const existingUser = await query('SELECT * FROM users WHERE email = $1', ['admin@shababna.org']);

        if (existingUser.rows.length > 0) {
            console.log('⚠️ المستخدم موجود بالفعل');
            console.log('📧 البريد الإلكتروني: admin@shababna.org');
            console.log('🔑 كلمة المرور: admin123');
            return;
        }

        // إنشاء مستخدم أدمن
        await query(`
            INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        `, ['أحمد', 'محمد', 'admin@shababna.org', hashedPassword, 'admin']);

        console.log('✅ تم إضافة المستخدم الأدمن بنجاح!');
        console.log('📧 البريد الإلكتروني: admin@shababna.org');
        console.log('🔑 كلمة المرور: admin123');
        console.log('👤 الدور: admin');

    } catch (error) {
        console.error('❌ خطأ في إضافة المستخدم الأدمن:', error);
    }
}

addAdminUser();