// مسح سجلات Rate Limiting للخادم المحلي
import { query } from './server/config/database.js';

async function clearRateLimitLocal() {
    try {
        console.log('🧹 مسح سجلات Rate Limiting للخادم المحلي...\n');

        // مسح جميع سجلات Rate Limiting
        const result = await query('DELETE FROM rate_limit_logs');
        console.log(`✅ تم حذف ${result.rowCount} سجل من rate_limit_logs`);

        // مسح التوكنات المنتهية الصلاحية
        const tokenResult = await query(
            `DELETE FROM password_reset_tokens
       WHERE expires_at < NOW() OR used_at IS NOT NULL`
        );
        console.log(`✅ تم حذف ${tokenResult.rowCount} توكن منتهي/مستخدم`);

        console.log('\n🎉 تم مسح جميع السجلات بنجاح!');
        console.log('💡 يمكنك الآن اختبار نظام نسيان كلمة المرور مرة أخرى');

    } catch (error) {
        console.error('❌ خطأ في مسح السجلات:', error);
    }
}

clearRateLimitLocal()
    .then(() => {
        console.log('\n✅ انتهى مسح السجلات');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ فشل مسح السجلات:', error);
        process.exit(1);
    });
