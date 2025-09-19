// اختبار نظام إعادة تعيين كلمة المرور على Render
const API_BASE = 'https://shababna-backend.onrender.com/api';

async function testPasswordResetOnRender() {
    console.log('🧪 اختبار نظام إعادة تعيين كلمة المرور على Render...\n');

    try {
        // اختبار endpoint نسيان كلمة المرور
        console.log('1️⃣ اختبار endpoint نسيان كلمة المرور...');

        const testEmail = 'info@shaababna.com'; // استخدم البريد الرسمي للمؤسسة للاختبار

        const response = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testEmail
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ تم إرسال طلب إعادة تعيين كلمة المرور بنجاح');
            console.log('📧 الرسالة:', result.message);
        } else {
            console.log('❌ فشل في إرسال طلب إعادة تعيين كلمة المرور');
            console.log('📧 الخطأ:', result.message);
        }

        // اختبار Rate Limiting
        console.log('\n2️⃣ اختبار Rate Limiting...');

        for (let i = 1; i <= 6; i++) {
            const rateLimitResponse = await fetch(`${API_BASE}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: `test${i}@example.com`
                })
            });

            const rateLimitResult = await rateLimitResponse.json();

            if (rateLimitResponse.status === 429) {
                console.log(`🚫 تم حظر الطلب بعد ${i} محاولات (Rate Limiting يعمل)`);
                console.log('📧 الرسالة:', rateLimitResult.message);
                break;
            } else {
                console.log(`✅ المحاولة ${i}: نجحت`);
            }
        }

        console.log('\n🎉 انتهى اختبار النظام على Render!');

    } catch (error) {
        console.error('❌ خطأ في اختبار النظام:', error);
    }
}

// تشغيل الاختبار
testPasswordResetOnRender();
