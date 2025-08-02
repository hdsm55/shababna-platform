#!/usr/bin/env node

/**
 * فحص شامل للخادم الخلفي
 */

import https from 'https';

const BACKEND_URL = 'https://shababna-backend.onrender.com';

console.log('🔍 فحص شامل للخادم الخلفي...\n');

function testEndpoint(path) {
    return new Promise((resolve, reject) => {
        const req = https.get(`${BACKEND_URL}${path}`, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    data: data,
                    path: path
                });
            });
        });

        req.on('error', (error) => {
            reject({
                error: error.message,
                path: path
            });
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject({
                error: 'Timeout',
                path: path
            });
        });
    });
}

async function runTests() {
    const endpoints = [
        '/',
        '/api',
        '/api/health',
        '/api/auth',
        '/api/events',
        '/api/programs'
    ];

    console.log('📡 فحص النقاط النهائية...\n');

    for (const endpoint of endpoints) {
        try {
            const result = await testEndpoint(endpoint);
            console.log(`✅ ${endpoint} - Status: ${result.status}`);
            if (result.data && result.data.length < 200) {
                console.log(`   Response: ${result.data}`);
            }
        } catch (error) {
            console.log(`❌ ${endpoint} - Error: ${error.error}`);
        }
    }

    console.log('\n📋 ملخص الفحص:');
    console.log('🔗 رابط الخادم الخلفي:', BACKEND_URL);
    console.log('🌐 رابط الواجهة الأمامية: https://shababna-frontend.onrender.com');

    console.log('\n💡 إذا كانت هناك مشاكل:');
    console.log('1. فحص logs في Render Dashboard');
    console.log('2. التأكد من متغيرات البيئة');
    console.log('3. فحص الاتصال بقاعدة البيانات');
    console.log('4. التأكد من أن الخادم يعمل على المنفذ الصحيح');
}

runTests().catch(console.error);