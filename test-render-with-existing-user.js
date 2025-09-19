// اختبار نظام إعادة تعيين كلمة المرور على Render مع مستخدم موجود
const API_BASE = 'https://shababna-backend.onrender.com/api';

async function testPasswordResetWithExistingUser() {
    console.log('🧪 اختبار نظام إعادة تعيين كلمة المرور على Render مع مستخدم موجود...\n');

    try {
        // قائمة المستخدمين الموجودين
        const existingUsers = [
            'ghayateam2025@gmail.com',
            'mohummed735@gmail.com',
            'hossamaldahry0@gmail.com',
            'admin@shababna.com'
        ];

        console.log('📋 المستخدمون الموجودون في قاعدة البيانات:');
        existingUsers.forEach((email, index) => {
            console.log(`${index + 1}. ${email}`);
        });

        // اختبار مع أول مستخدم
        const testEmail = existingUsers[0];
        console.log(`\n🔍 اختبار مع: ${testEmail}`);

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

        if (response.ok) {
            console.log('✅ تم إرسال طلب إعادة تعيين كلمة المرور بنجاح');

            if (result.success) {
                console.log('🎉 النظام يعمل بشكل صحيح!');
                console.log('📧 تحقق من البريد الإلكتروني للرابط');
            } else {
                console.log('⚠️ النظام أرسل رسالة خطأ');
            }
        } else {
            console.log('❌ فشل في إرسال طلب إعادة تعيين كلمة المرور');
            console.log('🔍 تفاصيل الخطأ:', result);
        }

        // اختبار مع بريد غير موجود
        console.log('\n2️⃣ اختبار مع بريد غير موجود...');

        const fakeEmail = 'nonexistent@example.com';
        const fakeResponse = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: fakeEmail
            })
        });

        const fakeResult = await fakeResponse.json();

        console.log('📊 حالة الاستجابة:', fakeResponse.status);
        console.log('📧 الرسالة:', fakeResult.message);

        if (fakeResponse.ok && fakeResult.success) {
            console.log('✅ النظام يعمل بشكل صحيح مع البريد غير الموجود (رسالة عامة)');
        } else {
            console.log('⚠️ مشكلة في التعامل مع البريد غير الموجود');
        }

        console.log('\n🎉 انتهى اختبار النظام على Render!');

    } catch (error) {
        console.error('❌ خطأ في اختبار النظام:', error);
    }
}

// تشغيل الاختبار
testPasswordResetWithExistingUser();
