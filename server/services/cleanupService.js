import { cleanupExpiredTokens } from './tokenService.js';
import rateLimitService from './rateLimitService.js';

/**
 * خدمة التنظيف الدوري للنظام
 */
class CleanupService {
    constructor() {
        this.isRunning = false;
        this.cleanupInterval = null;
    }

    /**
     * بدء خدمة التنظيف الدوري
     * @param {number} intervalMinutes - فترة التنظيف بالدقائق (افتراضي: 60)
     */
    start(intervalMinutes = 60) {
        if (this.isRunning) {
            console.log('⚠️ خدمة التنظيف تعمل بالفعل');
            return;
        }

        this.isRunning = true;
        const intervalMs = intervalMinutes * 60 * 1000;

        console.log(`🧹 بدء خدمة التنظيف الدوري كل ${intervalMinutes} دقيقة`);

        // تشغيل التنظيف فوراً
        this.performCleanup();

        // جدولة التنظيف الدوري
        this.cleanupInterval = setInterval(() => {
            this.performCleanup();
        }, intervalMs);
    }

    /**
     * إيقاف خدمة التنظيف الدوري
     */
    stop() {
        if (!this.isRunning) {
            console.log('⚠️ خدمة التنظيف غير نشطة');
            return;
        }

        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }

        this.isRunning = false;
        console.log('🛑 تم إيقاف خدمة التنظيف الدوري');
    }

    /**
     * تنفيذ عملية التنظيف
     */
    async performCleanup() {
        try {
            console.log('🧹 بدء عملية التنظيف الدوري...');
            const startTime = Date.now();

            // تنظيف التوكنات المنتهية الصلاحية
            const expiredTokens = await cleanupExpiredTokens();
            console.log(`🗑️ تم حذف ${expiredTokens} توكن منتهي الصلاحية`);

            // تنظيف سجلات Rate Limiting القديمة
            const oldLogs = await rateLimitService.cleanupOldLogs();
            console.log(`🗑️ تم حذف ${oldLogs} سجل قديم من Rate Limiting`);

            const endTime = Date.now();
            const duration = endTime - startTime;

            console.log(`✅ انتهت عملية التنظيف في ${duration}ms`);
            console.log(`📊 إجمالي العناصر المحذوفة: ${expiredTokens + oldLogs}`);

        } catch (error) {
            console.error('❌ خطأ في عملية التنظيف:', error);
        }
    }

    /**
     * الحصول على حالة الخدمة
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            hasInterval: !!this.cleanupInterval
        };
    }
}

// إنشاء instance واحد للخدمة
const cleanupService = new CleanupService();

export default cleanupService;
