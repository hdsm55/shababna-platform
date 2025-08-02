#!/usr/bin/env node

import https from 'https';

const SERVER_URL = 'https://shababna-platform.onrender.com';

console.log('🔍 فحص CORS للخادم الخلفي...\n');

async function testCORS() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'shababna-platform.onrender.com',
            port: 443,
            path: '/api/events',
            method: 'GET',
            headers: {
                'Origin': 'https://shababna-platform-1.onrender.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log('✅ الخادم يستجيب!');
                console.log('📊 Status Code:', res.statusCode);
                console.log('🔗 CORS Headers:');
                console.log('   Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
                console.log('   Access-Control-Allow-Methods:', res.headers['access-control-allow-methods']);
                console.log('   Access-Control-Allow-Headers:', res.headers['access-control-allow-headers']);
                console.log('📄 Response:', data.substring(0, 200) + '...');

                resolve({
                    status: res.statusCode,
                    corsHeaders: {
                        'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
                        'Access-Control-Allow-Methods': res.headers['access-control-allow-methods'],
                        'Access-Control-Allow-Headers': res.headers['access-control-allow-headers']
                    },
                    data: data
                });
            });
        });

        req.on('error', (error) => {
            console.log('❌ خطأ في الاتصال:', error.message);
            reject(error);
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Timeout'));
        });

        req.end();
    });
}

async function runTest() {
    try {
        await testCORS();
        console.log('\n🎉 فحص CORS مكتمل!');
        console.log('💡 إذا كانت CORS Headers موجودة، فالمشكلة قد تكون في متغيرات البيئة');
    } catch (error) {
        console.log('\n❌ فشل فحص CORS:', error.message);
    }
}

runTest();