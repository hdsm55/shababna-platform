// اختبار مباشر للخادم المحلي
const API_BASE = 'http://127.0.0.1:5000/api';

async function testLocalServerDirect() {
    console.log('🧪 اختبار مباشر للخادم المحلي...\n');

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

        // 2. اختبار نسيان كلمة المرور مع بريد مختلف
        console.log('\n2️⃣ اختبار نسيان كلمة المرور...');
        const testEmail = 'info@shaababna.com'; // البريد المسموح في وضع الاختبار

        try {
            const response = await fetch(`${API_BASE}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: testEmail })
            });

            const result = await response.json();

            console.log(`📊 الحالة: ${response.status}`);
            console.log(`📧 الرسالة: ${result.message}`);

            if (response.ok && result.success) {
                console.log('✅ تم إرسال الطلب بنجاح');
                console.log('📧 تحقق من البريد الإلكتروني: info@shaababna.com');
            } else {
                console.log('❌ فشل في إرسال الطلب');
                if (result.error) {
                    console.log(`📝 الخطأ: ${result.error}`);
                }
            }
        } catch (error) {
            console.log('❌ خطأ في الطلب:', error.message);
        }

    } catch (error) {
        console.error('❌ خطأ في الاختبار:', error);
    }
}

// تشغيل الاختبار
testLocalServerDirect();
