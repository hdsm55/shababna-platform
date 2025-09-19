import { query } from '../config/database.js';

async function createRateLimitTable() {
    try {
        console.log('🔄 إنشاء جدول rate_limit_logs...');

        // إنشاء جدول سجلات Rate Limiting
        await query(`
      CREATE TABLE IF NOT EXISTS rate_limit_logs (
        id SERIAL PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL,
        action VARCHAR(100) NOT NULL,
        ip_address INET,
        user_agent TEXT,
        success BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // إنشاء فهرس للمعرف والعملية
        await query(`
      CREATE INDEX IF NOT EXISTS idx_rate_limit_logs_identifier_action
      ON rate_limit_logs(identifier, action)
    `);

        // إنشاء فهرس للوقت
        await query(`
      CREATE INDEX IF NOT EXISTS idx_rate_limit_logs_created_at
      ON rate_limit_logs(created_at)
    `);

        // إنشاء فهرس للعنوان IP
        await query(`
      CREATE INDEX IF NOT EXISTS idx_rate_limit_logs_ip_address
      ON rate_limit_logs(ip_address)
    `);

        console.log('✅ تم إنشاء جدول rate_limit_logs بنجاح');

        // تنظيف السجلات القديمة
        await query(`
      DELETE FROM rate_limit_logs
      WHERE created_at < NOW() - INTERVAL '7 days'
    `);

        console.log('🧹 تم تنظيف السجلات القديمة');

    } catch (error) {
        console.error('❌ خطأ في إنشاء جدول rate_limit_logs:', error);
        throw error;
    }
}

// تشغيل الدالة إذا تم استدعاء الملف مباشرة
if (process.argv[1] && process.argv[1].endsWith('create-rate-limit-table.js')) {
    createRateLimitTable()
        .then(() => {
            console.log('✅ تم إنشاء جدول rate_limit_logs بنجاح');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ فشل في إنشاء جدول rate_limit_logs:', error);
            process.exit(1);
        });
}

export default createRateLimitTable;
