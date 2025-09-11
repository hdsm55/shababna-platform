import fetch from 'node-fetch';

async function testJoinSubmit() {
    try {
        console.log('🔍 اختبار إرسال طلب انضمام...');

        const testData = {
            first_name: 'أحمد',
            last_name: 'محمد',
            email: 'ahmed@test.com',
            phone: '+905551234567',
            country: 'تركيا',
            age: 25,
            motivation: 'أرغب في الانضمام إلى مجتمع شبابنا للمشاركة في الأنشطة والبرامج المختلفة'
        };

        const response = await fetch('http://localhost:5000/api/forms/join-requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        console.log('📊 Status:', response.status);

        const data = await response.json();
        console.log('📋 Response:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('❌ خطأ:', error);
    }
}

testJoinSubmit();
