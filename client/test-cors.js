#!/usr/bin/env node

import fetch from 'node-fetch';

console.log('🔍 اختبار CORS Configuration...\n');

const corsTests = [
    {
        name: 'GET Request',
        method: 'GET',
        endpoint: 'https://shababna-backend.onrender.com/api/health'
    },
    {
        name: 'POST Request',
        method: 'POST',
        endpoint: 'https://shababna-backend.onrender.com/api/auth/login',
        data: { email: 'test@example.com', password: 'test123' }
    },
    {
        name: 'PUT Request',
        method: 'PUT',
        endpoint: 'https://shababna-backend.onrender.com/api/events/1',
        data: { title: 'Test Event' }
    },
    {
        name: 'DELETE Request',
        method: 'DELETE',
        endpoint: 'https://shababna-backend.onrender.com/api/events/999'
    },
    {
        name: 'OPTIONS Request (Preflight)',
        method: 'OPTIONS',
        endpoint: 'https://shababna-backend.onrender.com/api/events'
    }
];

async function testCORS() {
    let success = 0;
    let failed = 0;

    for (const test of corsTests) {
        console.log(`🔍 اختبار: ${test.name}`);

        try {
            const options = {
                method: test.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:5173',
                    'Access-Control-Request-Method': test.method,
                    'Access-Control-Request-Headers': 'Content-Type'
                }
            };

            if (test.data) {
                options.body = JSON.stringify(test.data);
            }

            const response = await fetch(test.endpoint, options);

            // Check CORS headers
            const corsHeaders = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
                'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
            };

            console.log('📋 CORS Headers:');
            Object.entries(corsHeaders).forEach(([key, value]) => {
                console.log(`  ${key}: ${value || 'Not Set'}`);
            });

            if (response.ok || response.status === 204) {
                console.log(`✅ ${test.name} - نجح`);
                success++;
            } else {
                console.log(`❌ ${test.name} - فشل (Status: ${response.status})`);
                failed++;
            }

        } catch (error) {
            console.log(`❌ ${test.name} - خطأ: ${error.message}`);
            failed++;
        }

        console.log('---\n');

        // Delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('📊 نتائج اختبار CORS:');
    console.log(`✅ نجح: ${success}`);
    console.log(`❌ فشل: ${failed}`);
    console.log(`📈 نسبة النجاح: ${Math.round((success / (success + failed)) * 100)}%`);

    if (success === corsTests.length) {
        console.log('\n🎉 CORS مُعد بشكل صحيح!');
    } else {
        console.log('\n⚠️  CORS يحتاج إصلاحات.');
    }
}

testCORS().catch(console.error);