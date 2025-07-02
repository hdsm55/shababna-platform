import express from 'express';
import emailService from '../services/emailService.js';
import { query } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// إرسال نموذج الاتصال
router.post('/contact', async (req, res) => {
    try {
        const { first_name, last_name, email, phone, subject, message } = req.body;

        // التحقق من البيانات المطلوبة
        if (!first_name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول المطلوبة يجب ملؤها'
            });
        }

        // حفظ النموذج في قاعدة البيانات
        const formData = {
            form_type: 'contact',
            first_name,
            last_name,
            email,
            phone,
            subject,
            message
        };

        const savedForm = await emailService.saveFormSubmission(formData);

        // إرسال إيميل تأكيد للمستخدم
        await emailService.sendContactConfirmation(formData);

        // إرسال إشعار للمدير
        await emailService.sendAdminNotification(formData);

        res.json({
            success: true,
            message: 'تم إرسال رسالتك بنجاح! سنقوم بالرد عليك في أقرب وقت ممكن.',
            data: { formId: savedForm.id }
        });

    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
        });
    }
});

// إرسال نموذج الانضمام
router.post('/join-us', async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            country,
            age,
            interests,
            motivation
        } = req.body;

        // التحقق من البيانات المطلوبة
        if (!first_name || !last_name || !email || !country || !age || !motivation) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول المطلوبة يجب ملؤها'
            });
        }

        // حفظ النموذج في قاعدة البيانات
        const formData = {
            form_type: 'join_us',
            first_name,
            last_name,
            email,
            phone,
            country,
            age: parseInt(age),
            interests: Array.isArray(interests) ? interests : [interests],
            motivation
        };

        const savedForm = await emailService.saveFormSubmission(formData);

        // إرسال إيميل تأكيد للمستخدم
        const welcomeSubject = 'شكراً لك على اهتمامك بالانضمام إلينا!';
        const welcomeContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #14b8a6;">مرحباً ${first_name}!</h2>
        <p>شكراً لك على اهتمامك بالانضمام إلى مجتمع شبابنا العالمية.</p>
        <p>لقد تم استلام طلبك وسنقوم بمراجعته بعناية.</p>
        <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>تفاصيل طلبك:</h3>
          <p><strong>الاسم:</strong> ${first_name} ${last_name}</p>
          <p><strong>البلد:</strong> ${country}</p>
          <p><strong>العمر:</strong> ${age}</p>
          <p><strong>الاهتمامات:</strong> ${interests.join(', ')}</p>
          <p><strong>الدافع:</strong> ${motivation}</p>
        </div>
        <p>سنقوم بالتواصل معك خلال 3-5 أيام عمل لتوضيح الخطوات التالية.</p>
        <p>مع تحيات،<br>فريق شبابنا العالمية</p>
      </div>
    `;

        await emailService.sendEmail(email, first_name, welcomeSubject, welcomeContent, 'join_us_confirmation');

        // إرسال إشعار للمدير
        await emailService.sendAdminNotification(formData);

        res.json({
            success: true,
            message: 'تم إرسال طلبك بنجاح! سنقوم بالتواصل معك قريباً.',
            data: { formId: savedForm.id }
        });

    } catch (error) {
        console.error('Join us form submission error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.'
        });
    }
});

// الاشتراك في النشرة الإخبارية
router.post('/newsletter', async (req, res) => {
    try {
        const { email, first_name, last_name } = req.body;

        // التحقق من البريد الإلكتروني
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني مطلوب'
            });
        }

        // التحقق من صحة البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني غير صحيح'
            });
        }

        // إضافة المشترك
        const subscriber = await emailService.addNewsletterSubscriber(email, first_name, last_name);

        // إرسال إيميل ترحيب
        const welcomeSubject = 'مرحباً بك في النشرة الإخبارية!';
        const welcomeContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #14b8a6;">مرحباً ${first_name || 'عزيزي'}!</h2>
        <p>شكراً لك على الاشتراك في النشرة الإخبارية لشبابنا العالمية.</p>
        <p>ستصلك آخر الأخبار والتحديثات حول:</p>
        <ul>
          <li>الفعاليات القادمة</li>
          <li>البرامج الجديدة</li>
          <li>قصص النجاح</li>
          <li>الفرص التطوعية</li>
        </ul>
        <p>إذا كنت ترغب في إلغاء الاشتراك، يمكنك ذلك في أي وقت.</p>
        <p>مع تحيات،<br>فريق شبابنا العالمية</p>
      </div>
    `;

        await emailService.sendEmail(email, first_name, welcomeSubject, welcomeContent, 'newsletter_welcome');

        res.json({
            success: true,
            message: 'تم الاشتراك في النشرة الإخبارية بنجاح!'
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.'
        });
    }
});

// إلغاء الاشتراك من النشرة الإخبارية
router.post('/newsletter/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني مطلوب'
            });
        }

        const success = await emailService.unsubscribeFromNewsletter(email);

        if (success) {
            res.json({
                success: true,
                message: 'تم إلغاء الاشتراك بنجاح'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'لم يتم العثور على هذا البريد الإلكتروني في قائمة المشتركين'
            });
        }

    } catch (error) {
        console.error('Newsletter unsubscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إلغاء الاشتراك'
        });
    }
});

// === مسارات المدير ===

// الحصول على جميع النماذج المعلقة (للمدير فقط)
router.get('/pending', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const pendingForms = await emailService.getPendingForms();

        res.json({
            success: true,
            data: pendingForms
        });

    } catch (error) {
        console.error('Get pending forms error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب النماذج'
        });
    }
});

// تحديث حالة النموذج (للمدير فقط)
router.patch('/:formId/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { formId } = req.params;
        const { status, admin_notes } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'حالة النموذج مطلوبة'
            });
        }

        const success = await emailService.updateFormStatus(formId, status, admin_notes);

        if (success) {
            res.json({
                success: true,
                message: 'تم تحديث حالة النموذج بنجاح'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'لم يتم العثور على النموذج'
            });
        }

    } catch (error) {
        console.error('Update form status error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تحديث حالة النموذج'
        });
    }
});

// إرسال النشرة الإخبارية (للمدير فقط)
router.post('/newsletter/send', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { subject, content } = req.body;

        if (!subject || !content) {
            return res.status(400).json({
                success: false,
                message: 'الموضوع والمحتوى مطلوبان'
            });
        }

        // الحصول على جميع المشتركين النشطين
        const { query } = await import('../config/database.js');
        const result = await query(`
      SELECT * FROM newsletter_subscribers
      WHERE is_active = TRUE
    `);

        const subscribers = result.rows;
        const newsletterData = { subject, content };

        // إرسال النشرة الإخبارية
        const results = await emailService.sendNewsletter(subscribers, newsletterData);

        const successCount = results.filter(r => r.success).length;
        const failureCount = results.length - successCount;

        res.json({
            success: true,
            message: `تم إرسال النشرة الإخبارية إلى ${successCount} مشترك`,
            data: {
                total: results.length,
                success: successCount,
                failed: failureCount,
                results
            }
        });

    } catch (error) {
        console.error('Send newsletter error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إرسال النشرة الإخبارية'
        });
    }
});

export default router;