import { query } from './server/config/database.js';
import bcrypt from 'bcryptjs';

async function createTestUser() {
    try {
        console.log('🚀 إنشاء مستخدم تجريبي في PostgreSQL...');

        // إنشاء كلمة مرور مشفرة
        const hashedPassword = await bcrypt.hash('123456', 10);

        // إدخال المستخدم
        const result = await query(`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        role = EXCLUDED.role
      RETURNING id, email, role
    `, ['أحمد', 'محمد', 'admin@shababna.com', hashedPassword, 'admin']);

        console.log('✅ تم إنشاء المستخدم التجريبي بنجاح!');
        console.log('📧 البريد الإلكتروني: admin@shababna.com');
        console.log('🔑 كلمة المرور: 123456');
        console.log('👤 الدور: admin');
        console.log('🆔 معرف المستخدم:', result.rows[0].id);

    } catch (error) {
        console.error('❌ خطأ في إنشاء المستخدم التجريبي:', error);
    }
}

createTestUser();