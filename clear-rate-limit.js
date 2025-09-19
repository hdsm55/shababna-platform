import { query } from './server/config/database.js';

async function clearRateLimit() {
    try {
        console.log('🧹 مسح سجلات Rate Limiting...\n');

        // مسح جميع سجلات Rate Limiting
        const result = await query('DELETE FROM rate_limit_logs');

        console.log(`✅ تم حذف ${result.rowCount} سجل من Rate Limiting`);
        console.log('🎉 يمكنك الآن تجربة نظام إعادة تعيين كلمة المرور مرة أخرى');

    } catch (error) {
        console.error('❌ خطأ في مسح سجلات Rate Limiting:', error);
    }
}

clearRateLimit()
    .then(() => {
        console.log('\n✅ انتهى مسح السجلات');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ فشل مسح السجلات:', error);
        process.exit(1);
    });
