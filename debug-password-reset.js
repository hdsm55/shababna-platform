import dotenv from 'dotenv';
import { testConnection } from './server/config/database.js';
import { getRow } from './server/config/database.js';
import { createPasswordResetToken } from './server/services/tokenService.js';
import { sendPasswordResetEmail } from './server/services/emailService.js';

dotenv.config();

async function debugPasswordReset() {
    console.log('🔍 تشخيص مشكلة إعادة تعيين كلمة المرور...\n');

    try {
        // 1. فحص متغيرات البيئة
        console.log('1️⃣ فحص متغيرات البيئة:');
        console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ محدد' : '❌ غير محدد');
        console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL || '❌ غير محدد');
        console.log('SENDER_NAME:', process.env.SENDER_NAME || '❌ غير محدد');
        console.log('RESET_LINK_BASE:', process.env.RESET_LINK_BASE || '❌ غير محدد');
        console.log('TOKEN_TTL_MINUTES:', process.env.TOKEN_TTL_MINUTES || '❌ غير محدد');

        // 2. فحص الاتصال بقاعدة البيانات
        console.log('\n2️⃣ فحص الاتصال بقاعدة البيانات:');
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.log('❌ فشل في الاتصال بقاعدة البيانات');
            return;
        }
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

        // 3. فحص وجود المستخدم
        console.log('\n3️⃣ فحص وجود المستخدم:');
        const testEmail = 'ghaya.team.2025@gmail.com';
        const userResult = await getRow('SELECT * FROM users WHERE email = $1', [testEmail]);

        if (!userResult) {
            console.log(`❌ المستخدم ${testEmail} غير موجود في قاعدة البيانات`);
            console.log('📝 المستخدمون الموجودون:');
            const allUsers = await getRow('SELECT email, first_name, last_name FROM users LIMIT 5');
            if (allUsers) {
                console.log(`- ${allUsers.email} (${allUsers.first_name} ${allUsers.last_name})`);
            }
            return;
        }

        console.log(`✅ تم العثور على المستخدم: ${userResult.first_name} ${userResult.last_name}`);

        // 4. اختبار إنشاء التوكن
        console.log('\n4️⃣ اختبار إنشاء التوكن:');
        const token = await createPasswordResetToken(userResult.id, '127.0.0.1', 'debug-test');

        if (!token) {
            console.log('❌ فشل في إنشاء التوكن');
            return;
        }

        console.log('✅ تم إنشاء التوكن بنجاح');
        console.log('🔑 التوكن:', token.substring(0, 20) + '...');

        // 5. اختبار إرسال البريد الإلكتروني
        console.log('\n5️⃣ اختبار إرسال البريد الإلكتروني:');
        const emailSent = await sendPasswordResetEmail(
            userResult.email,
            token,
            userResult.first_name
        );

        if (emailSent) {
            console.log('✅ تم إرسال البريد الإلكتروني بنجاح');
        } else {
            console.log('❌ فشل في إرسال البريد الإلكتروني');
        }

        console.log('\n🎉 انتهى التشخيص');

    } catch (error) {
        console.error('❌ خطأ في التشخيص:', error);
    }
}

// تشغيل التشخيص
debugPasswordReset()
    .then(() => {
        console.log('\n✅ انتهى التشخيص');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ فشل التشخيص:', error);
        process.exit(1);
    });
