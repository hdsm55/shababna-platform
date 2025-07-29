import { getDatabase } from './config/database.js';
import bcrypt from 'bcryptjs';

async function createTestUser() {
    try {
        console.log('🚀 إنشاء مستخدم تجريبي...');
        const database = await getDatabase();

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash('123456', 10);

        // إنشاء مستخدم تجريبي
        const result = await database.run(`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `, ['أحمد', 'محمد', 'admin@shababna.com', hashedPassword, 'admin']);

        console.log('✅ تم إنشاء المستخدم التجريبي بنجاح!');
        console.log('📧 البريد الإلكتروني: admin@shababna.com');
        console.log('🔑 كلمة المرور: 123456');
        console.log('🆔 معرف المستخدم:', result.lastID);

        // التحقق من وجود المستخدم
        const user = await database.get('SELECT * FROM users WHERE email = ?', ['admin@shababna.com']);
        console.log('👤 بيانات المستخدم:', {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        });

    } catch (error) {
        console.error('❌ خطأ في إنشاء المستخدم التجريبي:', error);
    }
}

createTestUser();