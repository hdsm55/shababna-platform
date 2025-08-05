#!/usr/bin/env node

import fetch from 'node-fetch';

console.log('🚀 بدء اختبار Frontend Deployment...\n');

// Test URLs for SPA routing
const testUrls = [
    'http://localhost:5173',
    'http://localhost:5173/programs',
    'http://localhost:5173/programs/1',
    'http://localhost:5173/events',
    'http://localhost:5173/events/1',
    'http://localhost:5173/blogs',
    'http://localhost:5173/blogs/1',
    'http://localhost:5173/contact',
    'http://localhost:5173/donations',
    'http://localhost:5173/join-us',
    'http://localhost:5173/volunteers',
    'http://localhost:5173/dashboard'
];

// API endpoints to test
const apiEndpoints = [
    'https://shababna-backend.onrender.com/api/health',
    'https://shababna-backend.onrender.com/api/events',
    'https://shababna-backend.onrender.com/api/programs',
    'https://shababna-backend.onrender.com/api/blogs',
    'https://shababna-backend.onrender.com/api/forms/contact-forms'
];

async function testUrl(url) {
    try {
        const startTime = Date.now();
        const response = await fetch(url, {
            method: 'GET',
            timeout: 10000
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (response.ok) {
            console.log(`✅ ${url} (${responseTime}ms)`);
            return { success: true, time: responseTime };
        } else {
            console.log(`❌ ${url} (Status: ${response.status})`);
            return { success: false, error: `HTTP ${response.status}` };
        }
    } catch (error) {
        console.log(`❌ ${url} (Error: ${error.message})`);
        return { success: false, error: error.message };
    }
}

async function testApiEndpoint(endpoint) {
    try {
        const startTime = Date.now();
        const response = await fetch(endpoint, {
            method: 'GET',
            timeout: 15000
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (response.ok) {
            console.log(`✅ ${endpoint} (${responseTime}ms)`);
            return { success: true, time: responseTime };
        } else {
            console.log(`❌ ${endpoint} (Status: ${response.status})`);
            return { success: false, error: `HTTP ${response.status}` };
        }
    } catch (error) {
        console.log(`❌ ${endpoint} (Error: ${error.message})`);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log('📋 اختبار SPA Routing...\n');

    let routingSuccess = 0;
    let routingFailed = 0;
    const routingResults = [];

    for (const url of testUrls) {
        const result = await testUrl(url);
        routingResults.push({ url, ...result });

        if (result.success) {
            routingSuccess++;
        } else {
            routingFailed++;
        }

        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n📋 اختبار API Connectivity...\n');

    let apiSuccess = 0;
    let apiFailed = 0;
    const apiResults = [];

    for (const endpoint of apiEndpoints) {
        const result = await testApiEndpoint(endpoint);
        apiResults.push({ endpoint, ...result });

        if (result.success) {
            apiSuccess++;
        } else {
            apiFailed++;
        }

        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Print results
    console.log('\n' + '='.repeat(50));
    console.log('📊 النتائج النهائية:');
    console.log('='.repeat(50));

    console.log('\n🌐 SPA Routing:');
    console.log(`✅ نجح: ${routingSuccess}`);
    console.log(`❌ فشل: ${routingFailed}`);
    console.log(`📈 نسبة النجاح: ${Math.round((routingSuccess / (routingSuccess + routingFailed)) * 100)}%`);

    console.log('\n🔌 API Connectivity:');
    console.log(`✅ نجح: ${apiSuccess}`);
    console.log(`❌ فشل: ${apiFailed}`);
    console.log(`📈 نسبة النجاح: ${Math.round((apiSuccess / (apiSuccess + apiFailed)) * 100)}%`);

    const totalSuccess = routingSuccess + apiSuccess;
    const totalTests = (routingSuccess + routingFailed) + (apiSuccess + apiFailed);

    console.log('\n🎯 الإجمالي:');
    console.log(`✅ نجح: ${totalSuccess}`);
    console.log(`❌ فشل: ${totalTests - totalSuccess}`);
    console.log(`📈 نسبة النجاح الإجمالية: ${Math.round((totalSuccess / totalTests) * 100)}%`);

    // Performance analysis
    const successfulRouting = routingResults.filter(r => r.success);
    const successfulApis = apiResults.filter(r => r.success);

    if (successfulRouting.length > 0) {
        const avgRoutingTime = successfulRouting.reduce((sum, r) => sum + r.time, 0) / successfulRouting.length;
        console.log(`\n⚡ متوسط وقت استجابة SPA: ${Math.round(avgRoutingTime)}ms`);
    }

    if (successfulApis.length > 0) {
        const avgApiTime = successfulApis.reduce((sum, r) => sum + r.time, 0) / successfulApis.length;
        console.log(`⚡ متوسط وقت استجابة API: ${Math.round(avgApiTime)}ms`);
    }

    // Recommendations
    console.log('\n💡 التوصيات:');

    if (totalSuccess === totalTests) {
        console.log('🎉 جميع الاختبارات نجحت! النظام جاهز للـ deployment.');
    } else if (totalSuccess >= totalTests * 0.8) {
        console.log('✅ النظام يعمل بشكل جيد مع بعض المشاكل البسيطة.');
    } else if (totalSuccess >= totalTests * 0.6) {
        console.log('⚠️  النظام يعمل مع مشاكل متوسطة تحتاج مراجعة.');
    } else {
        console.log('🚨 النظام يحتاج إصلاحات عاجلة قبل الـ deployment.');
    }

    // Detailed results
    console.log('\n📋 تفاصيل النتائج:');

    console.log('\n🌐 SPA Routing:');
    routingResults.forEach((result, index) => {
        const status = result.success ? '✅' : '❌';
        const time = result.time ? ` (${result.time}ms)` : '';
        const error = result.error ? ` - ${result.error}` : '';
        console.log(`${index + 1}. ${status} ${result.url}${time}${error}`);
    });

    console.log('\n🔌 API Connectivity:');
    apiResults.forEach((result, index) => {
        const status = result.success ? '✅' : '❌';
        const time = result.time ? ` (${result.time}ms)` : '';
        const error = result.error ? ` - ${result.error}` : '';
        console.log(`${index + 1}. ${status} ${result.endpoint}${time}${error}`);
    });

    console.log('\n✅ انتهى الاختبار!');
}

// Run tests
runTests().catch(console.error);