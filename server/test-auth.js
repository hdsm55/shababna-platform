import { query } from './config/database-sqlite.js';
import bcrypt from 'bcryptjs';

async function testAuth() {
    try {
        console.log('🧪 بدء اختبار نظام المصادقة...\n');

        // 1. اختبار وجود المستخدمين
        console.log('1. اختبار وجود المستخدمين...');
        const usersResult = await query('SELECT * FROM users');
        console.log(`✅ عدد المستخدمين: ${usersResult.rows.length}`);

        if (usersResult.rows.length > 0) {
            console.log('📋 المستخدمين المتاحة:');
            usersResult.rows.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.email} (${user.role})`);
            });
        } else {
            console.log('⚠️ لا توجد مستخدمين في قاعدة البيانات');
        }

        // 2. اختبار تسجيل دخول المدير
        console.log('\n2. اختبار تسجيل دخول المدير...');
        const adminEmail = 'admin@shababna.com';
        const adminPassword = 'password';

        const adminResult = await query('SELECT * FROM users WHERE email = ?', [adminEmail]);

        if (adminResult.rows.length > 0) {
            const admin = adminResult.rows[0];
            console.log('✅ تم العثور على المدير:', admin.email);

            // اختبار كلمة المرور
            const isPasswordValid = await bcrypt.compare(adminPassword, admin.password);
            console.log(`🔐 كلمة المرور صحيحة: ${isPasswordValid}`);

            if (!isPasswordValid) {
                console.log('⚠️ كلمة المرور غير صحيحة للمدير');
            }
        } else {
            console.log('❌ لم يتم العثور على المدير');
        }

        // 3. اختبار إنشاء مدير جديد
        console.log('\n3. اختبار إنشاء مدير جديد...');
        const testEmail = 'admin@shababna.com';
        const testPassword = 'password';

        // التحقق من وجود المستخدم
        const existingUser = await query('SELECT * FROM users WHERE email = ?', [testEmail]);

        if (existingUser.rows.length === 0) {
            console.log('إنشاء مدير جديد...');
            const hashedPassword = await bcrypt.hash(testPassword, 12);

            await query(`
                INSERT INTO users (email, password, first_name, last_name, role)
                VALUES (?, ?, ?, ?, ?)
            `, [testEmail, hashedPassword, 'Admin', 'User', 'admin']);

            console.log('✅ تم إنشاء المدير بنجاح');
        } else {
            console.log('✅ المدير موجود بالفعل');
        }

        // 4. اختبار API تسجيل الدخول
        console.log('\n4. اختبار API تسجيل الدخول...');
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ API تسجيل الدخول يعمل:', data.success);
            if (data.success) {
                console.log('🔑 التوكن:', data.data.token.substring(0, 20) + '...');
                console.log('👤 المستخدم:', data.data.user);
            }
        } else {
            const errorData = await response.json();
            console.log('❌ خطأ في API تسجيل الدخول:', errorData);
        }

    } catch (error) {
        console.error('❌ خطأ في اختبار المصادقة:', error);
    }
}

testAuth();