// اختبار خدمة البريد الإلكتروني مع البريد المسموح
import dotenv from 'dotenv';
import { sendPasswordResetEmail } from './server/services/emailService.js';

// تحميل متغيرات البيئة
dotenv.config();

async function testEmailServiceFixed() {
    console.log('🧪 اختبار خدمة البريد الإلكتروني مع البريد المسموح...\n');

    try {
        console.log('📧 إعدادات البريد الإلكتروني:');
        console.log(`🔑 RESEND_API_KEY: ${process.env.RESEND_API_KEY ? 'محدد' : 'غير محدد'}`);
        console.log(`📧 SENDER_EMAIL: ${process.env.SENDER_EMAIL}`);
        console.log(`👤 SENDER_NAME: ${process.env.SENDER_NAME}`);
        console.log(`🔗 RESET_LINK_BASE: ${process.env.RESET_LINK_BASE}`);

        // استخدام البريد الإلكتروني المسموح في وضع الاختبار
        const testEmail = 'info@shaababna.com';
        const testToken = 'test-token-123456789';
        const testName = 'حسام';

        console.log(`\n📤 إرسال بريد إلكتروني تجريبي إلى: ${testEmail}`);

        const result = await sendPasswordResetEmail(testEmail, testToken, testName);

        if (result) {
            console.log('✅ تم إرسال البريد الإلكتروني بنجاح');
            console.log('📧 تحقق من البريد الإلكتروني: info@shaababna.com');
        } else {
            console.log('❌ فشل في إرسال البريد الإلكتروني');
        }

    } catch (error) {
        console.error('❌ خطأ في اختبار خدمة البريد الإلكتروني:', error);
    }
}

// تشغيل الاختبار
testEmailServiceFixed();
