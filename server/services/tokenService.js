import crypto from 'crypto';
import { query, getRow } from '../config/database.js';
import { EMAIL_CONFIG } from './emailService.js';

/**
 * إنشاء توكن آمن لإعادة تعيين كلمة المرور
 * @returns {string} - توكن آمن
 */
export function generateSecureToken() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * إنشاء توكن إعادة تعيين كلمة المرور وحفظه في قاعدة البيانات
 * @param {number} userId - معرف المستخدم
 * @param {string} ipAddress - عنوان IP
 * @param {string} userAgent - User Agent
 * @returns {Promise<string|null>} - التوكن أو null في حالة الفشل
 */
export async function createPasswordResetToken(userId, ipAddress = null, userAgent = null) {
    try {
        // حذف أي توكنات سابقة للمستخدم
        await query(
            'DELETE FROM password_reset_tokens WHERE user_id = $1',
            [userId]
        );

        // إنشاء توكن جديد
        const token = generateSecureToken();
        const expiresAt = new Date(Date.now() + EMAIL_CONFIG.tokenTTLMinutes * 60 * 1000);

        // حفظ التوكن في قاعدة البيانات
        await query(`
      INSERT INTO password_reset_tokens (user_id, token, expires_at, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5)
    `, [userId, token, expiresAt, ipAddress, userAgent]);

        console.log(`🔑 تم إنشاء توكن إعادة تعيين كلمة المرور للمستخدم: ${userId}`);
        console.log(`⏰ ينتهي في: ${expiresAt.toISOString()}`);

        return token;

    } catch (error) {
        console.error('❌ خطأ في إنشاء توكن إعادة تعيين كلمة المرور:', error);
        return null;
    }
}

/**
 * التحقق من صحة توكن إعادة تعيين كلمة المرور
 * @param {string} token - التوكن للتحقق منه
 * @returns {Promise<Object|null>} - بيانات التوكن أو null إذا كان غير صالح
 */
export async function validatePasswordResetToken(token) {
    try {
        const tokenData = await getRow(`
      SELECT prt.*, u.email, u.first_name, u.last_name
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE prt.token = $1
        AND prt.expires_at > NOW()
        AND prt.used_at IS NULL
    `, [token]);

        if (!tokenData) {
            console.log('❌ توكن إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية');
            return null;
        }

        console.log(`✅ تم التحقق من توكن إعادة تعيين كلمة المرور للمستخدم: ${tokenData.email}`);
        return tokenData;

    } catch (error) {
        console.error('❌ خطأ في التحقق من توكن إعادة تعيين كلمة المرور:', error);
        return null;
    }
}

/**
 * تعيين التوكن كمستخدم
 * @param {string} token - التوكن
 * @returns {Promise<boolean>} - نجح التحديث أم لا
 */
export async function markTokenAsUsed(token) {
    try {
        const result = await query(`
      UPDATE password_reset_tokens
      SET used_at = NOW()
      WHERE token = $1
    `, [token]);

        if (result.rowCount > 0) {
            console.log('✅ تم تعيين توكن إعادة تعيين كلمة المرور كمستخدم');
            return true;
        }

        console.log('❌ لم يتم العثور على التوكن');
        return false;

    } catch (error) {
        console.error('❌ خطأ في تعيين التوكن كمستخدم:', error);
        return false;
    }
}

/**
 * تنظيف التوكنات المنتهية الصلاحية
 * @returns {Promise<number>} - عدد التوكنات المحذوفة
 */
export async function cleanupExpiredTokens() {
    try {
        const result = await query(`
      DELETE FROM password_reset_tokens
      WHERE expires_at < NOW() OR used_at IS NOT NULL
    `);

        const deletedCount = result.rowCount;
        if (deletedCount > 0) {
            console.log(`🧹 تم حذف ${deletedCount} توكن منتهي الصلاحية`);
        }

        return deletedCount;

    } catch (error) {
        console.error('❌ خطأ في تنظيف التوكنات المنتهية الصلاحية:', error);
        return 0;
    }
}

/**
 * الحصول على إحصائيات التوكنات
 * @returns {Promise<Object>} - إحصائيات التوكنات
 */
export async function getTokenStats() {
    try {
        const stats = await getRow(`
      SELECT
        COUNT(*) as total_tokens,
        COUNT(CASE WHEN expires_at > NOW() AND used_at IS NULL THEN 1 END) as active_tokens,
        COUNT(CASE WHEN expires_at < NOW() THEN 1 END) as expired_tokens,
        COUNT(CASE WHEN used_at IS NOT NULL THEN 1 END) as used_tokens
      FROM password_reset_tokens
    `);

        return stats || {
            total_tokens: 0,
            active_tokens: 0,
            expired_tokens: 0,
            used_tokens: 0
        };

    } catch (error) {
        console.error('❌ خطأ في الحصول على إحصائيات التوكنات:', error);
        return {
            total_tokens: 0,
            active_tokens: 0,
            expired_tokens: 0,
            used_tokens: 0
        };
    }
}
