// اختبار نظام إعادة تعيين كلمة المرور مع المستخدم الجديد
const API_BASE = 'https://shababna-backend.onrender.com/api';

async function testNewUser() {
    console.log('🧪 اختبار نظام إعادة تعيين كلمة المرور مع المستخدم الجديد...\n');

    try {
        const testEmail = 'ghaya.team.2025@gmail.com';
        console.log(`🔍 اختبار مع: ${testEmail}`);

        // اختبار endpoint نسيان كلمة المرور
        console.log('\n1️⃣ اختبار endpoint نسيان كلمة المرور...');

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

        console.log('📊 حالة الاستجابة:', response.status);
        console.log('📧 الرسالة:', result.message);

        if (response.ok && result.success) {
            console.log('✅ تم إرسال طلب إعادة تعيين كلمة المرور بنجاح');
            console.log('🎉 النظام يعمل بشكل صحيح!');
            console.log('📧 تحقق من البريد الإلكتروني للرابط');
            console.log('\n💡 معلومات المستخدم:');
            console.log('📧 البريد: ghaya.team.2025@gmail.com');
            console.log('🔐 كلمة المرور المؤقتة: 123456');
        } else {
            console.log('❌ فشل في إرسال طلب إعادة تعيين كلمة المرور');
            console.log('🔍 تفاصيل الخطأ:', result);
        }

    } catch (error) {
        console.error('❌ خطأ في اختبار النظام:', error);
    }
}

// تشغيل الاختبار
testNewUser();
