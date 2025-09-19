import { query, getRow } from '../config/database.js';

/**
 * خدمة Rate Limiting لحماية endpoints الحساسة
 */
class RateLimitService {
    constructor() {
        this.limits = {
            forgotPassword: {
                maxAttempts: 5, // 5 محاولات
                windowMinutes: 60, // في ساعة واحدة
                blockDurationMinutes: 60 // حظر لمدة ساعة
            },
            resetPassword: {
                maxAttempts: 3, // 3 محاولات
                windowMinutes: 30, // في 30 دقيقة
                blockDurationMinutes: 30 // حظر لمدة 30 دقيقة
            }
        };
    }

    /**
     * التحقق من Rate Limit
     * @param {string} identifier - المعرف (IP أو email)
     * @param {string} action - نوع العملية
     * @returns {Promise<Object>} - نتيجة التحقق
     */
    async checkRateLimit(identifier, action) {
        try {
            const limit = this.limits[action];
            if (!limit) {
                return { allowed: true, remaining: 0, resetTime: null };
            }

            const now = new Date();
            const windowStart = new Date(now.getTime() - limit.windowMinutes * 60 * 1000);

            // الحصول على عدد المحاولات في النافذة الزمنية
            const attempts = await getRow(`
        SELECT COUNT(*) as count, MAX(created_at) as last_attempt
        FROM rate_limit_logs
        WHERE identifier = $1
          AND action = $2
          AND created_at > $3
      `, [identifier, action, windowStart]);

            const attemptCount = parseInt(attempts?.count || 0);
            const remaining = Math.max(0, limit.maxAttempts - attemptCount);
            const allowed = attemptCount < limit.maxAttempts;

            // حساب وقت إعادة التعيين
            let resetTime = null;
            if (attempts?.last_attempt) {
                const lastAttempt = new Date(attempts.last_attempt);
                resetTime = new Date(lastAttempt.getTime() + limit.windowMinutes * 60 * 1000);
            }

            return {
                allowed,
                remaining,
                resetTime,
                limit: limit.maxAttempts,
                windowMinutes: limit.windowMinutes
            };

        } catch (error) {
            console.error('❌ خطأ في التحقق من Rate Limit:', error);
            // في حالة الخطأ، نسمح بالعملية لتجنب حجب المستخدمين
            return { allowed: true, remaining: 0, resetTime: null };
        }
    }

    /**
     * تسجيل محاولة
     * @param {string} identifier - المعرف
     * @param {string} action - نوع العملية
     * @param {string} ipAddress - عنوان IP
     * @param {string} userAgent - User Agent
     * @param {boolean} success - نجحت العملية أم لا
     * @returns {Promise<void>}
     */
    async recordAttempt(identifier, action, ipAddress = null, userAgent = null, success = false) {
        try {
            await query(`
        INSERT INTO rate_limit_logs (identifier, action, ip_address, user_agent, success, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
      `, [identifier, action, ipAddress, userAgent, success]);

            console.log(`📝 تم تسجيل محاولة ${action} للمعرف: ${identifier} (نجح: ${success})`);

        } catch (error) {
            console.error('❌ خطأ في تسجيل المحاولة:', error);
        }
    }

    /**
     * تنظيف السجلات القديمة
     * @returns {Promise<number>} - عدد السجلات المحذوفة
     */
    async cleanupOldLogs() {
        try {
            // حذف السجلات الأقدم من 7 أيام
            const result = await query(`
        DELETE FROM rate_limit_logs
        WHERE created_at < NOW() - INTERVAL '7 days'
      `);

            const deletedCount = result.rowCount;
            if (deletedCount > 0) {
                console.log(`🧹 تم حذف ${deletedCount} سجل قديم من rate_limit_logs`);
            }

            return deletedCount;

        } catch (error) {
            console.error('❌ خطأ في تنظيف السجلات القديمة:', error);
            return 0;
        }
    }

    /**
     * الحصول على إحصائيات Rate Limit
     * @param {string} action - نوع العملية (اختياري)
     * @returns {Promise<Object>} - الإحصائيات
     */
    async getStats(action = null) {
        try {
            let whereClause = '';
            let params = [];

            if (action) {
                whereClause = 'WHERE action = $1';
                params = [action];
            }

            const stats = await getRow(`
        SELECT
          COUNT(*) as total_attempts,
          COUNT(CASE WHEN success = true THEN 1 END) as successful_attempts,
          COUNT(CASE WHEN success = false THEN 1 END) as failed_attempts,
          COUNT(DISTINCT identifier) as unique_identifiers,
          COUNT(DISTINCT action) as unique_actions
        FROM rate_limit_logs
        ${whereClause}
      `, params);

            return stats || {
                total_attempts: 0,
                successful_attempts: 0,
                failed_attempts: 0,
                unique_identifiers: 0,
                unique_actions: 0
            };

        } catch (error) {
            console.error('❌ خطأ في الحصول على إحصائيات Rate Limit:', error);
            return {
                total_attempts: 0,
                successful_attempts: 0,
                failed_attempts: 0,
                unique_identifiers: 0,
                unique_actions: 0
            };
        }
    }
}

// إنشاء instance واحد للخدمة
const rateLimitService = new RateLimitService();

export default rateLimitService;
