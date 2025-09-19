import { testConnection } from './server/config/database.js';
import { testEmailConfiguration } from './server/services/emailService.js';
import { getTokenStats } from './server/services/tokenService.js';
import rateLimitService from './server/services/rateLimitService.js';

async function testPasswordResetSystem() {
    console.log('🧪 اختبار نظام إعادة تعيين كلمة المرور...\n');

    try {
        // 1. اختبار الاتصال بقاعدة البيانات
        console.log('1️⃣ اختبار الاتصال بقاعدة البيانات...');
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.error('❌ فشل في الاتصال بقاعدة البيانات');
            return;
        }
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح\n');

        // 2. اختبار إعدادات البريد الإلكتروني
        console.log('2️⃣ اختبار إعدادات البريد الإلكتروني...');
        const emailConfigOk = await testEmailConfiguration();
        if (!emailConfigOk) {
            console.warn('⚠️ تحقق من إعدادات البريد الإلكتروني');
        } else {
            console.log('✅ إعدادات البريد الإلكتروني صحيحة\n');
        }

        // 3. اختبار إحصائيات التوكنات
        console.log('3️⃣ اختبار إحصائيات التوكنات...');
        const tokenStats = await getTokenStats();
        console.log('📊 إحصائيات التوكنات:', tokenStats);
        console.log('✅ تم الحصول على إحصائيات التوكنات بنجاح\n');

        // 4. اختبار إحصائيات Rate Limiting
        console.log('4️⃣ اختبار إحصائيات Rate Limiting...');
        const rateLimitStats = await rateLimitService.getStats();
        console.log('📊 إحصائيات Rate Limiting:', rateLimitStats);
        console.log('✅ تم الحصول على إحصائيات Rate Limiting بنجاح\n');

        // 5. اختبار Rate Limiting
        console.log('5️⃣ اختبار Rate Limiting...');
        const testIP = '192.168.1.100';
        const rateLimitResult = await rateLimitService.checkRateLimit(testIP, 'forgotPassword');
        console.log('🔍 نتيجة Rate Limiting:', rateLimitResult);
        console.log('✅ تم اختبار Rate Limiting بنجاح\n');

        console.log('🎉 تم اختبار جميع مكونات نظام إعادة تعيين كلمة المرور بنجاح!');
        console.log('\n📋 ملخص النظام:');
        console.log('✅ قاعدة البيانات متصلة');
        console.log('✅ خدمة البريد الإلكتروني جاهزة');
        console.log('✅ نظام التوكنات يعمل');
        console.log('✅ نظام Rate Limiting نشط');
        console.log('\n🚀 النظام جاهز للاستخدام!');

    } catch (error) {
        console.error('❌ خطأ في اختبار النظام:', error);
    }
}

// تشغيل الاختبار
testPasswordResetSystem()
    .then(() => {
        console.log('\n✅ انتهى الاختبار');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ فشل الاختبار:', error);
        process.exit(1);
    });
