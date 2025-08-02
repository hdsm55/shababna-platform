#!/usr/bin/env node

/**
 * فحص سريع للخادم الخلفي
 */

import https from 'https';

const SERVERS = [
    'https://shababna-platform.onrender.com',
    'https://shababna-backend.onrender.com'
];

console.log('🔍 فحص الخوادم الخلفية...\n');

async function testServer(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(`${url}/api/health`, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    url: url,
                    status: res.statusCode,
                    data: data,
                    working: res.statusCode === 200
                });
            });
        });

        req.on('error', (error) => {
            resolve({
                url: url,
                status: 'ERROR',
                data: error.message,
                working: false
            });
        });

        req.setTimeout(10000, () => {
            req.destroy();
            resolve({
                url: url,
                status: 'TIMEOUT',
                data: 'Request timeout',
                working: false
            });
        });
    });
}

async function runTests() {
    console.log('📡 فحص الخوادم...\n');

    for (const server of SERVERS) {
        const result = await testServer(server);

        if (result.working) {
            console.log(`✅ ${server} - يعمل!`);
            console.log(`   Status: ${result.status}`);
            console.log(`   Response: ${result.data}`);
        } else {
            console.log(`❌ ${server} - لا يعمل`);
            console.log(`   Status: ${result.status}`);
            console.log(`   Error: ${result.data}`);
        }
        console.log('');
    }

    console.log('💡 التوصيات:');
    console.log('1. فحص Render Dashboard للخادم الخلفي');
    console.log('2. التأكد من متغيرات البيئة');
    console.log('3. إعادة نشر الخادم مع مسح cache');
    console.log('4. فحص logs للبحث عن أخطاء');
}

runTests().catch(console.error);