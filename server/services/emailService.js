import nodemailer from 'nodemailer';
import { query } from '../config/database.js';
import { emailConfig, emailSettings, validateEmailConfig } from '../config/email.js';

class EmailService {
    constructor() {
        // التحقق من إعدادات البريد الإلكتروني
        this.isEmailEnabled = validateEmailConfig();

        if (this.isEmailEnabled) {
            // إعداد مزود البريد الإلكتروني
            const config = emailConfig[emailConfig.default];
            this.transporter = nodemailer.createTransporter(config);

            this.fromEmail = emailSettings.fromEmail;
            this.fromName = emailSettings.fromName;
            this.adminEmails = emailSettings.adminEmails;
        } else {
            console.warn('📧 Email service is disabled due to missing configuration');
            this.transporter = null;
        }
    }

    // إرسال إيميل ترحيب للمستخدمين الجدد
    async sendWelcomeEmail(user) {
        const subject = 'مرحباً بك في شبابنا العالمية!';
        const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #14b8a6;">مرحباً ${user.first_name}!</h2>
        <p>شكراً لك على الانضمام إلى مجتمع شبابنا العالمية.</p>
        <p>نحن متحمسون لرؤية مساهماتك في تطوير الشباب حول العالم.</p>
        <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>ما يمكنك فعله الآن:</h3>
          <ul>
            <li>استكشف الفعاليات القادمة</li>
            <li>انضم إلى البرامج المتاحة</li>
            <li>تواصل مع أعضاء آخرين</li>
            <li>شارك في المبادرات المجتمعية</li>
          </ul>
        </div>
        <p>إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.</p>
        <p>مع تحيات،<br>فريق شبابنا العالمية</p>
      </div>
    `;

        return this.sendEmail(user.email, user.first_name, subject, content, 'welcome');
    }

    // إرسال إيميل تأكيد النموذج
    async sendContactConfirmation(formData) {
        const subject = 'تم استلام رسالتك - شبابنا العالمية';
        const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #14b8a6;">شكراً لك ${formData.first_name}!</h2>
        <p>لقد تم استلام رسالتك بنجاح وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
        <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>تفاصيل رسالتك:</h3>
          <p><strong>الموضوع:</strong> ${formData.subject}</p>
          <p><strong>الرسالة:</strong> ${formData.message}</p>
        </div>
        <p>سنقوم بالرد عليك خلال 24-48 ساعة.</p>
        <p>مع تحيات،<br>فريق شبابنا العالمية</p>
      </div>
    `;

        return this.sendEmail(formData.email, formData.first_name, subject, content, 'contact_confirmation');
    }

    // إرسال إشعار للمدير عن نموذج جديد
    async sendAdminNotification(formData) {
        const subject = `نموذج جديد: ${formData.form_type} - ${formData.subject || 'بدون موضوع'}`;
        const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">نموذج جديد مقدم</h2>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>تفاصيل النموذج:</h3>
          <p><strong>نوع النموذج:</strong> ${formData.form_type}</p>
          <p><strong>الاسم:</strong> ${formData.first_name} ${formData.last_name}</p>
          <p><strong>البريد الإلكتروني:</strong> ${formData.email}</p>
          <p><strong>الهاتف:</strong> ${formData.phone || 'غير محدد'}</p>
          <p><strong>الموضوع:</strong> ${formData.subject || 'غير محدد'}</p>
          <p><strong>الرسالة:</strong> ${formData.message || 'غير محدد'}</p>
          <p><strong>التاريخ:</strong> ${new Date().toLocaleString('ar-SA')}</p>
        </div>
        <p>يرجى مراجعة هذا النموذج والرد على المستخدم في أقرب وقت ممكن.</p>
      </div>
    `;

        // إرسال للمديرين
        for (const adminEmail of this.adminEmails) {
            await this.sendEmail(adminEmail, 'Admin', subject, content, 'admin_notification');
        }
    }

    // إرسال النشرة الإخبارية
    async sendNewsletter(subscribers, newsletterData) {
        const subject = newsletterData.subject;
        const content = newsletterData.content;

        const results = [];
        for (const subscriber of subscribers) {
            try {
                const personalizedContent = content.replace(
                    /{name}/g,
                    subscriber.first_name || 'عزيزي'
                );

                const result = await this.sendEmail(
                    subscriber.email,
                    subscriber.first_name,
                    subject,
                    personalizedContent,
                    'newsletter'
                );

                results.push({ email: subscriber.email, success: true, result });

                // تحديث آخر إيميل مرسل
                await this.updateLastEmailSent(subscriber.id);

            } catch (error) {
                results.push({ email: subscriber.email, success: false, error: error.message });
            }
        }

        return results;
    }

    // إرسال إيميل عام
    async sendEmail(to, recipientName, subject, content, emailType = 'general') {
        try {
            // التحقق من تفعيل خدمة البريد الإلكتروني
            if (!this.isEmailEnabled || !this.transporter) {
                console.warn('📧 Email service is disabled. Email would have been sent to:', to);
                console.warn('📧 Subject:', subject);
                console.warn('📧 Content preview:', content.substring(0, 100) + '...');

                // تسجيل الإيميل في قاعدة البيانات كـ "simulated"
                await this.logEmail(to, recipientName, subject, content, emailType, 'simulated');

                return { success: true, messageId: 'simulated', simulated: true };
            }

            const mailOptions = {
                from: `"${this.fromName}" <${this.fromEmail}>`,
                to: to,
                subject: subject,
                html: content,
            };

            const result = await this.transporter.sendMail(mailOptions);

            // تسجيل الإيميل في قاعدة البيانات
            await this.logEmail(to, recipientName, subject, content, emailType, 'sent');

            return { success: true, messageId: result.messageId };

        } catch (error) {
            console.error('Email sending failed:', error);

            // تسجيل الخطأ في قاعدة البيانات
            await this.logEmail(to, recipientName, subject, content, emailType, 'failed', error.message);

            throw error;
        }
    }

    // تسجيل الإيميل في قاعدة البيانات
    async logEmail(recipientEmail, recipientName, subject, content, emailType, status, errorMessage = null) {
        try {
            const sqlQuery = `
        INSERT INTO email_logs (recipient_email, recipient_name, subject, email_type, content, status, error_message)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

            await query(sqlQuery, [
                recipientEmail,
                recipientName,
                subject,
                emailType,
                content,
                status,
                errorMessage
            ]);

        } catch (error) {
            console.error('Failed to log email:', error);
        }
    }

    // تحديث آخر إيميل مرسل للمشترك
    async updateLastEmailSent(subscriberId) {
        try {
            const sqlQuery = `
        UPDATE newsletter_subscribers
        SET last_email_sent_at = NOW()
        WHERE id = $1
      `;

            await query(sqlQuery, [subscriberId]);

        } catch (error) {
            console.error('Failed to update last email sent:', error);
        }
    }

    // إضافة مشترك جديد للنشرة الإخبارية
    async addNewsletterSubscriber(email, firstName = null, lastName = null) {
        try {
            const sqlQuery = `
        INSERT INTO newsletter_subscribers (email, first_name, last_name)
        VALUES ($1, $2, $3)
        ON CONFLICT (email)
        DO UPDATE SET
          is_active = TRUE,
          unsubscribed_at = NULL,
          updated_at = NOW()
        RETURNING *
      `;

            const result = await query(sqlQuery, [email, firstName, lastName]);
            return result.rows[0];

        } catch (error) {
            console.error('Failed to add newsletter subscriber:', error);
            throw error;
        }
    }

    // إلغاء اشتراك من النشرة الإخبارية
    async unsubscribeFromNewsletter(email) {
        try {
            const sqlQuery = `
        UPDATE newsletter_subscribers
        SET is_active = FALSE, unsubscribed_at = NOW()
        WHERE email = $1
      `;

            const result = await query(sqlQuery, [email]);
            return result.rowCount > 0;

        } catch (error) {
            console.error('Failed to unsubscribe from newsletter:', error);
            throw error;
        }
    }

    // حفظ نموذج مقدم
    async saveFormSubmission(formData) {
        try {
            if (formData.form_type === 'contact') {
                // نموذج التواصل
                const sqlQuery = `
        INSERT INTO contact_forms (
          name, email, phone, subject, message
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
                const result = await query(sqlQuery, [
                    formData.first_name + (formData.last_name ? ' ' + formData.last_name : ''),
                    formData.email,
                    formData.phone,
                    formData.subject,
                    formData.message
                ]);
                return result.rows[0];
            } else if (formData.form_type === 'join_us') {
                // نموذج الانضمام
                const sqlQuery = `
        INSERT INTO join_requests (
          first_name, last_name, email, phone, country, age, motivation
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
                const result = await query(sqlQuery, [
                    formData.first_name,
                    formData.last_name,
                    formData.email,
                    formData.phone,
                    formData.country,
                    formData.age,
                    formData.motivation
                ]);
                return result.rows[0];
            } else {
                throw new Error('نوع النموذج غير مدعوم');
            }
        } catch (error) {
            console.error('Failed to save form submission:', error);
            throw error;
        }
    }

    // الحصول على النماذج المقدمات المعلقة
    async getPendingForms() {
        try {
            const sqlQuery = `
        SELECT * FROM form_submissions
        WHERE status = 'pending'
        ORDER BY created_at DESC
      `;

            const result = await query(sqlQuery);
            return result.rows;

        } catch (error) {
            console.error('Failed to get pending forms:', error);
            throw error;
        }
    }

    // تحديث حالة النموذج
    async updateFormStatus(formId, status) {
        try {
            const sqlQuery = `
        UPDATE form_submissions
        SET status = $2
        WHERE id = $1
      `;

            const result = await query(sqlQuery, [formId, status]);
            return result.rowCount > 0;

        } catch (error) {
            console.error('Failed to update form status:', error);
            throw error;
        }
    }
}

export default EmailService;