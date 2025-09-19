import { query } from '../config/database.js';

async function createPasswordResetTable() {
    try {
        console.log('🔄 إنشاء جدول password_reset_tokens...');

        // إنشاء جدول tokens إعادة تعيين كلمة المرور
        await query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        used_at TIMESTAMP WITH TIME ZONE NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ip_address INET,
        user_agent TEXT
      )
    `);

        // إنشاء فهرس للتوكن
        await query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token
      ON password_reset_tokens(token)
    `);

        // إنشاء فهرس للتوكنات المنتهية الصلاحية
        await query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at
      ON password_reset_tokens(expires_at)
    `);

        // إنشاء فهرس للمستخدم
        await query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id
      ON password_reset_tokens(user_id)
    `);

        console.log('✅ تم إنشاء جدول password_reset_tokens بنجاح');

        // تنظيف التوكنات المنتهية الصلاحية
        await query(`
      DELETE FROM password_reset_tokens
      WHERE expires_at < NOW() OR used_at IS NOT NULL
    `);

        console.log('🧹 تم تنظيف التوكنات المنتهية الصلاحية');

    } catch (error) {
        console.error('❌ خطأ في إنشاء جدول password_reset_tokens:', error);
        throw error;
    }
}

// تشغيل الدالة إذا تم استدعاء الملف مباشرة
if (process.argv[1] && process.argv[1].endsWith('create-password-reset-table.js')) {
    createPasswordResetTable()
        .then(() => {
            console.log('✅ تم إنشاء جدول password_reset_tokens بنجاح');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ فشل في إنشاء جدول password_reset_tokens:', error);
            process.exit(1);
        });
}

export default createPasswordResetTable;
