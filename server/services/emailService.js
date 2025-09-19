import { Resend } from 'resend';
import dotenv from 'dotenv';
import { query } from '../config/database.js';

dotenv.config();

// إنشاء Resend instance فقط إذا كان API key موجود
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const EMAIL_CONFIG = {
    from: process.env.SENDER_EMAIL || 'info@shaababna.com',
    fromName: process.env.SENDER_NAME || 'منظمة شبابنا العالمية',
    resetLinkBase: process.env.RESET_LINK_BASE || 'https://shaababna.com/reset-password',
    tokenTTLMinutes: parseInt(process.env.TOKEN_TTL_MINUTES) || 60
};

export async function sendPasswordResetEmail(email, token, firstName = '') {
    try {
        if (!process.env.RESEND_API_KEY || !resend) {
            console.error('❌ RESEND_API_KEY غير محدد في متغيرات البيئة');
            return false;
        }

        const resetLink = `${EMAIL_CONFIG.resetLinkBase}?token=${token}`;
        const expirationTime = EMAIL_CONFIG.tokenTTLMinutes;

        // في وضع الاختبار، أرسل البريد إلى info@shaababna.com فقط
        const isDevelopment = process.env.NODE_ENV === 'development';
        const recipientEmail = isDevelopment ? 'info@shaababna.com' : email;

        const emailData = {
            from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
            to: [recipientEmail],
            subject: 'إعادة تعيين كلمة المرور - منظمة شبابنا العالمية',
            html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>إعادة تعيين كلمة المرور</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e9ecef; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
            .title { font-size: 20px; color: #1f2937; margin-bottom: 20px; }
            .button { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; margin: 20px 0; }
            .warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; color: #92400e; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 14px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🌍 منظمة شبابنا العالمية</div>
              <div class="title">إعادة تعيين كلمة المرور</div>
            </div>

            <div style="font-size: 16px; margin-bottom: 20px;">
              ${firstName ? `مرحباً ${firstName}،` : 'مرحباً،'}
            </div>

            <div style="font-size: 16px; margin-bottom: 30px;">
              تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في منصة شبابنا العالمية.
              إذا كنت قد طلبت هذا التغيير، يرجى النقر على الزر أدناه لإعادة تعيين كلمة المرور.
            </div>

            ${isDevelopment ? `<div class="warning">
              <strong>ملاحظة:</strong> هذا بريد إلكتروني تجريبي. البريد الأصلي كان مخصص لـ: ${email}
            </div>` : ''}

            <div style="text-align: center;">
              <a href="${resetLink}" class="button">إعادة تعيين كلمة المرور</a>
            </div>

            <div style="background-color: #f3f4f6; border-radius: 6px; padding: 10px; margin: 15px 0; font-size: 14px;">
              ⏰ <strong>مهم:</strong> هذا الرابط صالح لمدة ${expirationTime} دقيقة فقط
            </div>

            <div class="warning">
              <strong>⚠️ تحذير أمني:</strong>
              <ul style="margin: 10px 0; padding-right: 20px;">
                <li>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد</li>
                <li>لا تشارك هذا الرابط مع أي شخص آخر</li>
                <li>سيتم إلغاء صلاحية الرابط بعد استخدامه مرة واحدة</li>
              </ul>
            </div>

            <div class="footer">
              <p>هذا البريد الإلكتروني تم إرساله من منظمة شبابنا العالمية</p>
              <p>إذا واجهت أي مشاكل، يرجى التواصل معنا</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        console.log(`📧 إرسال بريد إعادة تعيين كلمة المرور إلى: ${email}`);
        console.log(`🔗 رابط إعادة التعيين: ${resetLink}`);

        const result = await resend.emails.send(emailData);

        if (result.error) {
            console.error('❌ خطأ في إرسال البريد الإلكتروني:', result.error);
            return false;
        }

        console.log('✅ تم إرسال بريد إعادة تعيين كلمة المرور بنجاح:', result.data?.id);
        return true;

    } catch (error) {
        console.error('❌ خطأ في خدمة إرسال البريد الإلكتروني:', error);
        return false;
    }
}

export async function testEmailConfiguration() {
    try {
        if (!process.env.RESEND_API_KEY || !resend) {
            console.error('❌ RESEND_API_KEY غير محدد');
            return false;
        }

        console.log('🔍 اختبار إعدادات البريد الإلكتروني...');
        console.log(`📧 من: ${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`);
        console.log(`🔗 رابط إعادة التعيين: ${EMAIL_CONFIG.resetLinkBase}`);
        console.log(`⏰ مدة الصلاحية: ${EMAIL_CONFIG.tokenTTLMinutes} دقيقة`);

        return true;

    } catch (error) {
        console.error('❌ خطأ في اختبار إعدادات البريد الإلكتروني:', error);
        return false;
    }
}

// دوال إضافية مطلوبة من forms.js
export async function saveFormSubmission(formData) {
    try {
        const { name, email, phone, message, type } = formData;

        const result = await query(
            `INSERT INTO contact_forms (name, email, phone, message, type, status, created_at)
             VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
             RETURNING *`,
            [name, email, phone, message, type]
        );

        console.log('✅ تم حفظ نموذج الاتصال:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('❌ خطأ في حفظ نموذج الاتصال:', error);
        throw error;
    }
}

export async function sendContactConfirmation(formData) {
    try {
        if (!resend) {
            console.log('⚠️ خدمة البريد الإلكتروني غير متاحة');
            return false;
        }

        const emailData = {
            from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
            to: [formData.email],
            subject: 'تأكيد استلام رسالتك - منظمة شبابنا العالمية',
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">شكراً لك على تواصلك معنا</h2>
                    <p>مرحباً ${formData.name}،</p>
                    <p>تم استلام رسالتك بنجاح وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
                    <p>تفاصيل رسالتك:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p><strong>الاسم:</strong> ${formData.name}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${formData.email}</p>
                        <p><strong>الهاتف:</strong> ${formData.phone || 'غير محدد'}</p>
                        <p><strong>الرسالة:</strong> ${formData.message}</p>
                    </div>
                    <p>مع تحيات فريق منظمة شبابنا العالمية</p>
                </div>
            `
        };

        const result = await resend.emails.send(emailData);
        console.log('✅ تم إرسال تأكيد الاستلام:', result.data?.id);
        return true;
    } catch (error) {
        console.error('❌ خطأ في إرسال تأكيد الاستلام:', error);
        return false;
    }
}

export async function sendAdminNotification(formData) {
    try {
        if (!resend) {
            console.log('⚠️ خدمة البريد الإلكتروني غير متاحة');
            return false;
        }

        const emailData = {
            from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
            to: [EMAIL_CONFIG.from],
            subject: `رسالة جديدة من ${formData.name} - ${formData.type}`,
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #dc2626;">رسالة جديدة من الموقع</h2>
                    <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p><strong>الاسم:</strong> ${formData.name}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${formData.email}</p>
                        <p><strong>الهاتف:</strong> ${formData.phone || 'غير محدد'}</p>
                        <p><strong>نوع الرسالة:</strong> ${formData.type}</p>
                        <p><strong>الرسالة:</strong></p>
                        <div style="background-color: white; padding: 10px; border-radius: 4px; margin: 10px 0;">
                            ${formData.message}
                        </div>
                    </div>
                </div>
            `
        };

        const result = await resend.emails.send(emailData);
        console.log('✅ تم إرسال إشعار الإدارة:', result.data?.id);
        return true;
    } catch (error) {
        console.error('❌ خطأ في إرسال إشعار الإدارة:', error);
        return false;
    }
}

export async function sendEmail(email, name, subject, content, type) {
    try {
        if (!resend) {
            console.log('⚠️ خدمة البريد الإلكتروني غير متاحة');
            return false;
        }

        const emailData = {
            from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
            to: [email],
            subject: subject,
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">${subject}</h2>
                    <p>مرحباً ${name}،</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        ${content}
                    </div>
                    <p>مع تحيات فريق منظمة شبابنا العالمية</p>
                </div>
            `
        };

        const result = await resend.emails.send(emailData);
        console.log(`✅ تم إرسال البريد الإلكتروني (${type}):`, result.data?.id);
        return true;
    } catch (error) {
        console.error(`❌ خطأ في إرسال البريد الإلكتروني (${type}):`, error);
        return false;
    }
}

export async function addNewsletterSubscriber(email, firstName, lastName) {
    try {
        const result = await query(
            `INSERT INTO newsletter_subscribers (email, first_name, last_name, subscribed_at, status)
             VALUES ($1, $2, $3, NOW(), 'active')
             ON CONFLICT (email) DO UPDATE SET
             first_name = EXCLUDED.first_name,
             last_name = EXCLUDED.last_name,
             status = 'active',
             subscribed_at = NOW()
             RETURNING *`,
            [email, firstName, lastName]
        );

        console.log('✅ تم إضافة/تحديث المشترك:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('❌ خطأ في إضافة المشترك:', error);
        throw error;
    }
}

export async function unsubscribeFromNewsletter(email) {
    try {
        const result = await query(
            `UPDATE newsletter_subscribers
             SET status = 'unsubscribed', unsubscribed_at = NOW()
             WHERE email = $1
             RETURNING *`,
            [email]
        );

        if (result.rows.length > 0) {
            console.log('✅ تم إلغاء الاشتراك:', result.rows[0]);
            return true;
        } else {
            console.log('⚠️ لم يتم العثور على المشترك');
            return false;
        }
    } catch (error) {
        console.error('❌ خطأ في إلغاء الاشتراك:', error);
        throw error;
    }
}

export async function getPendingForms() {
    try {
        const result = await query(
            `SELECT * FROM contact_forms
             WHERE status = 'pending'
             ORDER BY created_at DESC`
        );

        console.log(`✅ تم جلب ${result.rows.length} نموذج معلق`);
        return result.rows;
    } catch (error) {
        console.error('❌ خطأ في جلب النماذج المعلقة:', error);
        throw error;
    }
}

export async function updateFormStatus(formId, status, notes) {
    try {
        const result = await query(
            `UPDATE contact_forms
             SET status = $1, notes = $2, updated_at = NOW()
             WHERE id = $3
             RETURNING *`,
            [status, notes, formId]
        );

        if (result.rows.length > 0) {
            console.log('✅ تم تحديث حالة النموذج:', result.rows[0]);
            return result.rows[0];
        } else {
            throw new Error('لم يتم العثور على النموذج');
        }
    } catch (error) {
        console.error('❌ خطأ في تحديث حالة النموذج:', error);
        throw error;
    }
}

export { EMAIL_CONFIG };