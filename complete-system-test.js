// اختبار شامل لنظام إعادة تعيين كلمة المرور
const API_BASE = 'https://shababna-backend.onrender.com/api';

async function completeSystemTest() {
    console.log('🧪 اختبار شامل لنظام إعادة تعيين كلمة المرور...\n');

    try {
        // 1. فحص حالة الخادم
        console.log('1️⃣ فحص حالة الخادم...');
        try {
            const healthResponse = await fetch(`${API_BASE}/stats`);
            if (healthResponse.ok) {
                console.log('✅ الخادم يعمل بشكل صحيح');
            } else {
                console.log('⚠️ الخادم قد يكون غير متاح');
            }
        } catch (error) {
            console.log('❌ الخادم غير متاح:', error.message);
            return;
        }

        // 2. اختبار المستخدمين الموجودين
        console.log('\n2️⃣ المستخدمون الموجودون:');
        const testUsers = [
            'ghaya.team.2025@gmail.com',
            'ghayateam2025@gmail.com',
            'admin@shababna.com'
        ];

        for (const email of testUsers) {
            console.log(`\n🔍 اختبار مع: ${email}`);

            try {
                const response = await fetch(`${API_BASE}/auth/forgot-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });

                const result = await response.json();

                console.log(`📊 الحالة: ${response.status}`);
                console.log(`📧 الرسالة: ${result.message}`);

                if (response.ok && result.success) {
                    console.log('✅ تم إرسال الطلب بنجاح');
                    console.log('📧 تحقق من البريد الإلكتروني');
                } else if (response.status === 429) {
                    console.log('🚫 تم حظر الطلب (Rate Limiting)');
                } else {
                    console.log('❌ فشل في إرسال الطلب');
                }

                // انتظار ثانية واحدة بين الطلبات
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.log('❌ خطأ في الطلب:', error.message);
            }
        }

        console.log('\n🎉 انتهى الاختبار الشامل!');
        console.log('\n📋 ملخص:');
        console.log('✅ إذا رأيت "تم إرسال الطلب بنجاح" - النظام يعمل');
        console.log('📧 تحقق من البريد الإلكتروني للرابط');
        console.log('⚠️ إذا لم يصل البريد - تحقق من متغيرات البيئة في Render');

    } catch (error) {
        console.error('❌ خطأ في الاختبار الشامل:', error);
    }
}

// تشغيل الاختبار
completeSystemTest();
