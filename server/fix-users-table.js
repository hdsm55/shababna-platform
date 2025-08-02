import { query } from './config/database.js';

async function fixUsersTable() {
    try {
        console.log('🚀 إصلاح جدول المستخدمين...');

        // التحقق من وجود الجدول
        const tableExists = await query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'users'
            );
        `);

        if (!tableExists.rows[0].exists) {
            console.log('❌ جدول المستخدمين غير موجود');
            return;
        }

        // التحقق من هيكل الجدول
        const columns = await query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'users'
            ORDER BY ordinal_position;
        `);

        console.log('📊 هيكل جدول المستخدمين:');
        columns.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type}`);
        });

        // التحقق من البيانات الموجودة
        const usersCount = await query('SELECT COUNT(*) as count FROM users');
        console.log(`👥 عدد المستخدمين: ${usersCount.rows[0].count}`);

        // إضافة مستخدم أدمن إذا لم يكن موجود
        const adminExists = await query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['admin']);

        if (adminExists.rows[0].count === 0) {
            console.log('➕ إضافة مستخدم أدمن...');
            const bcrypt = await import('bcryptjs');
            const hashedPassword = await bcrypt.default.hash('admin123', 10);

            await query(`
                INSERT INTO users (first_name, last_name, email, password, role, created_at)
                VALUES ($1, $2, $3, $4, $5, NOW())
            `, ['أحمد', 'محمد', 'admin@shababna.org', hashedPassword, 'admin']);

            console.log('✅ تم إضافة مستخدم أدمن');
            console.log('📧 البريد الإلكتروني: admin@shababna.org');
            console.log('🔑 كلمة المرور: admin123');
        } else {
            console.log('✅ مستخدم أدمن موجود بالفعل');
        }

        console.log('✅ تم إصلاح جدول المستخدمين بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في إصلاح جدول المستخدمين:', error);
    }
}

fixUsersTable();