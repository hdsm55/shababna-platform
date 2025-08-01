import fetch from 'node-fetch';

async function testLogin() {
    try {
        console.log('🔍 اختبار API تسجيل الدخول...');

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@shababna.com',
                password: '123456'
            })
        });

        const data = await response.json();
        console.log('📊 استجابة API:', data);

        if (response.ok) {
            console.log('✅ تسجيل الدخول ناجح!');
            console.log('🔑 Token:', data.token ? 'موجود' : 'غير موجود');
        } else {
            console.log('❌ فشل تسجيل الدخول:', data.message);
        }

    } catch (error) {
        console.error('❌ خطأ في اختبار API:', error);
    }
}

testLogin();