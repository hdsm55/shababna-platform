import express from 'express';
import emailService from '../services/emailService.js';
import { query } from '../config/database-sqlite.js';
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

        // التحقق من صحة البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني غير صالح'
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

        let savedForm;
        try {
            savedForm = await emailService.saveFormSubmission(formData);
        } catch (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({
                success: false,
                message: 'حدث خطأ أثناء حفظ الرسالة. يرجى المحاولة مرة أخرى.'
            });
        }

        // محاولة إرسال الإيميلات
        try {
            // إرسال إيميل تأكيد للمستخدم
            await emailService.sendContactConfirmation(formData);
            // إرسال إشعار للمدير
            await emailService.sendAdminNotification(formData);
        } catch (emailError) {
            // تسجيل الخطأ ولكن لا نعيد خطأ للمستخدم لأن الرسالة تم حفظها بنجاح
            console.error('Email sending error:', emailError);
        }

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

// استقبال طلبات الانضمام من الواجهة الأمامية بدون توكن
router.post('/join-requests', async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            country,
            age,
            motivation
        } = req.body;

        if (!first_name || !last_name || !email || !country || !age || !motivation) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة'
            });
        }

        const result = await query(
            `INSERT INTO join_requests (first_name, last_name, email, phone, country, age, motivation, created_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), 'pending')
       RETURNING *`,
            [first_name, last_name, email, phone, country, age, motivation]
        );

        res.json({
            success: true,
            message: 'تم إرسال طلب الانضمام بنجاح!',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Join request error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إرسال الطلب'
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
        const { status, notes } = req.body;

        const updatedForm = await emailService.updateFormStatus(formId, status, notes);

        res.json({
            success: true,
            data: updatedForm
        });

    } catch (error) {
        console.error('Update form status error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تحديث حالة النموذج'
        });
    }
});

// === مسارات البيانات للداشبورد ===

// جلب جميع رسائل التواصل (للمدير فقط)
router.get('/contact-forms', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        let queryStr = `
            SELECT id, name, email, subject, message, created_at, is_read, status
            FROM contact_forms
        `;

        const params = [];
        if (status) {
            queryStr += ` WHERE status = $1`;
            params.push(status);
        }

        queryStr += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await query(queryStr, params);

        // جلب العدد الإجمالي
        let countQuery = `SELECT COUNT(*) as total FROM contact_forms`;
        if (status) {
            countQuery += ` WHERE status = $1`;
        }
        const countResult = await query(countQuery, status ? [status] : []);

        res.json({
            success: true,
            data: {
                forms: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: parseInt(countResult.rows[0].total),
                    pages: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limit))
                }
            }
        });

    } catch (error) {
        console.error('Get contact forms error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب رسائل التواصل'
        });
    }
});

// تحديث حالة قراءة رسالة التواصل (للمدير فقط)
router.patch('/contact-forms/:id/read', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { is_read } = req.body;

        const result = await query(
            'UPDATE contact_forms SET is_read = $1 WHERE id = $2 RETURNING *',
            [is_read, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'الرسالة غير موجودة'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update contact form read status error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تحديث حالة القراءة'
        });
    }
});

// جلب جميع طلبات الانضمام (للمدير فقط)
router.get('/join-requests', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        let queryStr = `
            SELECT id, first_name, last_name, email, phone, country, age, motivation, created_at, status
            FROM join_requests
        `;

        const params = [];
        if (status) {
            queryStr += ` WHERE status = $1`;
            params.push(status);
        }

        queryStr += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await query(queryStr, params);

        // جلب العدد الإجمالي
        let countQuery = `SELECT COUNT(*) as total FROM join_requests`;
        if (status) {
            countQuery += ` WHERE status = $1`;
        }
        const countResult = await query(countQuery, status ? [status] : []);

        res.json({
            success: true,
            data: {
                requests: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: parseInt(countResult.rows[0].total),
                    pages: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limit))
                }
            }
        });

    } catch (error) {
        console.error('Get join requests error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب طلبات الانضمام'
        });
    }
});

// تحديث حالة طلب الانضمام (للمدير فقط)
router.patch('/join-requests/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const result = await query(
            'UPDATE join_requests SET status = $1, notes = $2 WHERE id = $3 RETURNING *',
            [status, notes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'طلب الانضمام غير موجود'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update join request status error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تحديث حالة طلب الانضمام'
        });
    }
});

// جلب جميع التسجيلات في البرامج (للمدير فقط)
router.get('/program-registrations', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, program_id } = req.query;
        const offset = (page - 1) * limit;

        let queryStr = `
            SELECT pr.id, pr.created_at,
                   p.title as program_title, p.description as program_description,
                   u.first_name || ' ' || u.last_name as user_name, u.email as user_email
            FROM program_registrations pr
            JOIN programs p ON pr.program_id = p.id
            JOIN users u ON pr.user_id = u.id
        `;

        const params = [];
        if (program_id) {
            queryStr += ` WHERE pr.program_id = $1`;
            params.push(program_id);
        }

        queryStr += ` ORDER BY pr.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await query(queryStr, params);

        // جلب العدد الإجمالي
        let countQuery = `
            SELECT COUNT(*) as total
            FROM program_registrations pr
            JOIN programs p ON pr.program_id = p.id
            JOIN users u ON pr.user_id = u.id
        `;
        if (program_id) {
            countQuery += ` WHERE pr.program_id = $1`;
        }
        const countResult = await query(countQuery, program_id ? [program_id] : []);

        res.json({
            success: true,
            data: {
                registrations: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: parseInt(countResult.rows[0].total),
                    pages: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limit))
                }
            }
        });

    } catch (error) {
        console.error('Get program registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب تسجيلات البرامج'
        });
    }
});

// جلب جميع التسجيلات في الفعاليات (للمدير فقط)
router.get('/event-registrations', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, event_id } = req.query;
        const offset = (page - 1) * limit;

        let queryStr = `
            SELECT er.id, er.created_at,
                   e.title as event_title, e.description as event_description,
                   u.first_name || ' ' || u.last_name as user_name, u.email as user_email
            FROM event_registrations er
            JOIN events e ON er.event_id = e.id
            JOIN users u ON er.user_id = u.id
        `;

        const params = [];
        if (event_id) {
            queryStr += ` WHERE er.event_id = $1`;
            params.push(event_id);
        }

        queryStr += ` ORDER BY er.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await query(queryStr, params);

        // جلب العدد الإجمالي
        let countQuery = `
            SELECT COUNT(*) as total
            FROM event_registrations er
            JOIN events e ON er.event_id = e.id
            JOIN users u ON er.user_id = u.id
        `;
        if (event_id) {
            countQuery += ` WHERE er.event_id = $1`;
        }
        const countResult = await query(countQuery, event_id ? [event_id] : []);

        res.json({
            success: true,
            data: {
                registrations: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: parseInt(countResult.rows[0].total),
                    pages: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limit))
                }
            }
        });

    } catch (error) {
        console.error('Get event registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب تسجيلات الفعاليات'
        });
    }
});

export default router;