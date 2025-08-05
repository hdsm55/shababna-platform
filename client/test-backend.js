#!/usr/bin/env node

import fetch from 'node-fetch';

console.log('🔍 اختبار Backend Connectivity...\n');

const backendTests = [
    {
        name: 'Health Check',
        endpoint: 'https://shababna-backend.onrender.com/api/health',
        method: 'GET'
    },
    {
        name: 'Database Connection',
        endpoint: 'https://shababna-backend.onrender.com/api/health',
        method: 'GET'
    },
    {
        name: 'Events API',
        endpoint: 'https://shababna-backend.onrender.com/api/events',
        method: 'GET'
    },
    {
        name: 'Programs API',
        endpoint: 'https://shababna-backend.onrender.com/api/programs',
        method: 'GET'
    },
    {
        name: 'Blogs API',
        endpoint: 'https://shababna-backend.onrender.com/api/blogs',
        method: 'GET'
    },
    {
        name: 'Contact Forms API',
        endpoint: 'https://shababna-backend.onrender.com/api/forms/contact-forms',
        method: 'GET'
    },
    {
        name: 'Users API',
        endpoint: 'https://shababna-backend.onrender.com/api/users',
        method: 'GET'
    },
    {
        name: 'Dashboard Stats',
        endpoint: 'https://shababna-backend.onrender.com/api/dashboard/stats',
        method: 'GET'
    },
    {
        name: 'Dashboard Analytics',
        endpoint: 'https://shababna-backend.onrender.com/api/dashboard/analytics',
        method: 'GET'
    }
];

async function testBackend() {
    let success = 0;
    let failed = 0;
    const results = [];

    for (const test of backendTests) {
        console.log(`🔍 اختبار: ${test.name}`);

        try {
            const startTime = Date.now();
            const response = await fetch(test.endpoint, {
                method: test.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 seconds timeout
            });
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ${test.name} (${responseTime}ms)`);
                console.log(`   Status: ${response.status}`);
                console.log(`   Data: ${JSON.stringify(data).substring(0, 100)}...`);
                success++;
                results.push({ name: test.name, status: 'success', time: responseTime, data });
            } else {
                console.log(`❌ ${test.name} (Status: ${response.status})`);
                failed++;
                results.push({ name: test.name, status: 'failed', error: `HTTP ${response.status}` });
            }

        } catch (error) {
            console.log(`❌ ${test.name} - خطأ: ${error.message}`);
            failed++;
            results.push({ name: test.name, status: 'error', error: error.message });
        }

        console.log('---\n');

        // Delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('📊 نتائج اختبار Backend:');
    console.log(`✅ نجح: ${success}`);
    console.log(`❌ فشل: ${failed}`);
    console.log(`📈 نسبة النجاح: ${Math.round((success / (success + failed)) * 100)}%`);

    // Performance analysis
    const successfulTests = results.filter(r => r.status === 'success');
    if (successfulTests.length > 0) {
        const avgResponseTime = successfulTests.reduce((sum, test) => sum + test.time, 0) / successfulTests.length;
        console.log(`⚡ متوسط وقت الاستجابة: ${Math.round(avgResponseTime)}ms`);
    }

    // Detailed results
    console.log('\n📋 تفاصيل النتائج:');
    results.forEach((result, index) => {
        const status = result.status === 'success' ? '✅' : '❌';
        const time = result.time ? ` (${result.time}ms)` : '';
        const error = result.error ? ` - ${result.error}` : '';
        console.log(`${index + 1}. ${status} ${result.name}${time}${error}`);
    });

    // Recommendations
    console.log('\n💡 التوصيات:');
    if (success === backendTests.length) {
        console.log('🎉 Backend يعمل بشكل مثالي!');
    } else if (success >= backendTests.length * 0.8) {
        console.log('✅ Backend يعمل بشكل جيد مع بعض المشاكل البسيطة.');
    } else if (success >= backendTests.length * 0.6) {
        console.log('⚠️  Backend يعمل مع مشاكل متوسطة تحتاج مراجعة.');
    } else {
        console.log('🚨 Backend يحتاج إصلاحات عاجلة.');
    }

    return { success, failed, results };
}

testBackend().catch(console.error);