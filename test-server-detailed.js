#!/usr/bin/env node

import https from 'https';

const SERVER_URL = 'https://shababna-platform.onrender.com';

console.log('🔍 فحص مفصل للخادم الخلفي...\n');

async function testEndpoint(endpoint) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'shababna-platform.onrender.com',
            port: 443,
            path: endpoint,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log(`📊 ${endpoint}:`);
                console.log(`   Status: ${res.statusCode}`);
                console.log(`   Response: ${data.substring(0, 300)}...`);
                console.log('');

                resolve({
                    endpoint,
                    status: res.statusCode,
                    data: data
                });
            });
        });

        req.on('error', (error) => {
            console.log(`❌ ${endpoint}: ${error.message}`);
            reject(error);
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Timeout'));
        });

        req.end();
    });
}

async function runTests() {
    const endpoints = [
        '/api/health',
        '/api/events',
        '/api/programs',
        '/api/blogs'
    ];

    console.log('🚀 بدء فحص النقاط النهائية...\n');

    for (const endpoint of endpoints) {
        try {
            await testEndpoint(endpoint);
        } catch (error) {
            console.log(`❌ فشل فحص ${endpoint}: ${error.message}\n`);
        }
    }

    console.log('🎉 انتهى الفحص!');
    console.log('💡 إذا كانت جميع النقاط تعطي 500، فالمشكلة في قاعدة البيانات');
}

runTests();