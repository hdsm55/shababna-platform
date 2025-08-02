#!/usr/bin/env node

/**
 * فحص سريع للخادم الخلفي
 */

import https from 'https';

const BACKEND_URL = 'https://shababna-backend.onrender.com';

console.log('🔍 فحص الخادم الخلفي...\n');

function checkBackend() {
    return new Promise((resolve, reject) => {
        const req = https.get(`${BACKEND_URL}/api/health`, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log('✅ الخادم الخلفي يعمل!');
                console.log('📊 Status Code:', res.statusCode);
                console.log('📄 Response:', data);
                resolve(data);
            });
        });

        req.on('error', (error) => {
            console.log('❌ الخادم الخلفي غير متاح:', error.message);
            reject(error);
        });

        req.setTimeout(10000, () => {
            console.log('⏰ انتهت مهلة الاتصال');
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function runCheck() {
    try {
        await checkBackend();
        console.log('\n🎉 الموقع يعمل بشكل صحيح!');
        console.log('🔗 روابط الموقع:');
        console.log('   الواجهة الأمامية: https://shababna-frontend.onrender.com');
        console.log('   الخادم الخلفي: https://shababna-backend.onrender.com');
    } catch (error) {
        console.log('\n❌ هناك مشكلة في الخادم الخلفي');
        console.log('💡 تحقق من:');
        console.log('   1. logs في Render Dashboard');
        console.log('   2. متغيرات البيئة');
        console.log('   3. الاتصال بقاعدة البيانات');
    }
}

runCheck();