// اختبار نسيان كلمة المرور مع بريد مسجل
const API_BASE = 'http://127.0.0.1:5000/api';

async function testForgotPasswordRegistered() {
    console.log('🧪 اختبار نسيان كلمة المرور مع بريد مسجل...\n');

    try {
        const testEmail = 'hossamaldahry@gmail.com'; // بريد مسجل في قاعدة البيانات

        console.log(`📧 البريد الإلكتروني: ${testEmail}`);
        console.log(`🌐 الخادم: ${API_BASE}`);

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
            console.log('📧 تحقق من البريد الإلكتروني');
        } else {
            console.log('❌ فشل في إرسال الطلب');
            if (result.error) {
                console.log(`📝 الخطأ: ${result.error}`);
            }
        }

    } catch (error) {
        console.error('❌ خطأ في اختبار نسيان كلمة المرور:', error);
    }
}

// تشغيل الاختبار
testForgotPasswordRegistered();
