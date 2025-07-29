import { query, run } from './config/database-sqlite.js';
import bcrypt from 'bcryptjs';

async function setupUsers() {
    try {
        console.log('🔧 بدء إعداد المستخدمين...\n');

        // 1. إنشاء جدول المستخدمين
        console.log('1. إنشاء جدول المستخدمين...');
        await run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ تم إنشاء جدول المستخدمين');

        // 2. إنشاء مدير افتراضي
        console.log('\n2. إنشاء مدير افتراضي...');
        const adminEmail = 'admin@shababna.com';
        const adminPassword = 'password';

        // التحقق من وجود المدير
        const existingAdmin = await query('SELECT * FROM users WHERE email = ?', [adminEmail]);

        if (existingAdmin.rows.length === 0) {
            const hashedPassword = await bcrypt.hash(adminPassword, 12);

            await run(`
                INSERT INTO users (email, password, first_name, last_name, role)
                VALUES (?, ?, ?, ?, ?)
            `, [adminEmail, hashedPassword, 'Admin', 'User', 'admin']);

            console.log('✅ تم إنشاء المدير بنجاح');
            console.log(`📧 البريد الإلكتروني: ${adminEmail}`);
            console.log(`🔑 كلمة المرور: ${adminPassword}`);
        } else {
            console.log('✅ المدير موجود بالفعل');
        }

        // 3. إنشاء مستخدمين تجريبيين
        console.log('\n3. إنشاء مستخدمين تجريبيين...');
        const sampleUsers = [
            {
                email: 'user1@example.com',
                password: 'password123',
                first_name: 'أحمد',
                last_name: 'محمد',
                role: 'user'
            },
            {
                email: 'user2@example.com',
                password: 'password123',
                first_name: 'سارة',
                last_name: 'علي',
                role: 'user'
            },
            {
                email: 'moderator@example.com',
                password: 'password123',
                first_name: 'عمر',
                last_name: 'خالد',
                role: 'moderator'
            }
        ];

        for (const user of sampleUsers) {
            const existingUser = await query('SELECT * FROM users WHERE email = ?', [user.email]);

            if (existingUser.rows.length === 0) {
                const hashedPassword = await bcrypt.hash(user.password, 12);

                await run(`
                    INSERT INTO users (email, password, first_name, last_name, role)
                    VALUES (?, ?, ?, ?, ?)
                `, [user.email, hashedPassword, user.first_name, user.last_name, user.role]);

                console.log(`✅ تم إنشاء المستخدم: ${user.email}`);
            } else {
                console.log(`✅ المستخدم موجود: ${user.email}`);
            }
        }

        // 4. التحقق من البيانات
        console.log('\n4. التحقق من البيانات...');
        const usersResult = await query('SELECT * FROM users');
        console.log(`✅ عدد المستخدمين: ${usersResult.rows.length}`);

        console.log('📋 المستخدمين المتاحة:');
        usersResult.rows.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.email} (${user.role}) - ${user.first_name} ${user.last_name}`);
        });

        console.log('\n✅ تم إعداد المستخدمين بنجاح!');
        console.log('\n🔑 بيانات تسجيل الدخول للمدير:');
        console.log(`   البريد الإلكتروني: ${adminEmail}`);
        console.log(`   كلمة المرور: ${adminPassword}`);

    } catch (error) {
        console.error('❌ خطأ في إعداد المستخدمين:', error);
    }
}

setupUsers();