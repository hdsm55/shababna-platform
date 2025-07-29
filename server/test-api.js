import { testConnection } from './config/database.js';
import fetch from 'node-fetch';

async function testAPI() {
    try {
        console.log('🧪 بدء اختبار API...');

        // اختبار الاتصال بقاعدة البيانات
        console.log('1. اختبار الاتصال بقاعدة البيانات...');
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('❌ فشل الاتصال بقاعدة البيانات');
            return;
        }
        console.log('✅ الاتصال بقاعدة البيانات ناجح');

        // اختبار السيرفر
        console.log('2. اختبار السيرفر...');
        const response = await fetch('http://localhost:5001/api/health');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ السيرفر يعمل:', data);
        } else {
            console.error('❌ السيرفر لا يعمل');
        }

        // اختبار API الفعاليات
        console.log('3. اختبار API الفعاليات...');
        const eventsResponse = await fetch('http://localhost:5001/api/events');
        if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json();
            console.log(`✅ تم جلب ${eventsData.events.length} فعالية`);
        } else {
            console.error('❌ فشل في جلب الفعاليات');
        }

        // اختبار API البرامج
        console.log('4. اختبار API البرامج...');
        const programsResponse = await fetch('http://localhost:5001/api/programs');
        if (programsResponse.ok) {
            const programsData = await programsResponse.json();
            console.log(`✅ تم جلب ${programsData.programs.length} برنامج`);
        } else {
            console.error('❌ فشل في جلب البرامج');
        }

        console.log('🎉 انتهى اختبار API بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في اختبار API:', error.message);
    }
}

async function testJoinRequestsAPI() {
    try {
        console.log('🔍 فحص API طلبات الانضمام...');

        // محاكاة طلب من frontend
        const response = await fetch('http://localhost:3000/api/forms/join-requests', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token' // سيتم تجاهله في الاختبار
            }
        });

        console.log('📊 Status:', response.status);
        console.log('📋 Headers:', response.headers);

        const data = await response.json();
        console.log('📋 Response:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('❌ خطأ:', error);
    }
}

// تشغيل الاختبار
testAPI();
testJoinRequestsAPI();