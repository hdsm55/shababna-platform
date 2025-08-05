import fetch from 'node-fetch';

async function testNewsletter() {
    try {
        console.log('🧪 اختبار النشرة الإخبارية...\n');

        // اختبار الاشتراك
        console.log('1. اختبار الاشتراك في النشرة الإخبارية...');
        const subscribeResponse = await fetch('http://localhost:5000/api/newsletter/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                first_name: 'أحمد',
                last_name: 'محمد'
            })
        });

        const subscribeData = await subscribeResponse.json();
        console.log('✅ استجابة الاشتراك:', subscribeData);

        // اختبار إلغاء الاشتراك
        console.log('\n2. اختبار إلغاء الاشتراك...');
        const unsubscribeResponse = await fetch('http://localhost:5000/api/newsletter/unsubscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com'
            })
        });

        const unsubscribeData = await unsubscribeResponse.json();
        console.log('✅ استجابة إلغاء الاشتراك:', unsubscribeData);

        console.log('\n🎉 اختبار النشرة الإخبارية مكتمل!');

    } catch (error) {
        console.error('❌ خطأ في اختبار النشرة الإخبارية:', error.message);
    }
}

testNewsletter();