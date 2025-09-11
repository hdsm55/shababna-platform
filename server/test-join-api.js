import fetch from 'node-fetch';

async function testJoinRequestsAPI() {
    try {
        console.log('🔍 فحص API طلبات الانضمام...');

        // محاكاة طلب من frontend
        const response = await fetch('http://localhost:5000/api/forms/join-requests', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token' // سيتم تجاهله في الاختبار
            }
        });

        console.log('📊 Status:', response.status);

        const data = await response.json();
        console.log('📋 Response:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('❌ خطأ:', error);
    }
}

testJoinRequestsAPI();