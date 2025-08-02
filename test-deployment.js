#!/usr/bin/env node

/**
 * فحص سريع للنشر على Render.com
 * تشغيل: node test-deployment.js
 */

import axios from 'axios';

const BACKEND_URL = 'https://shababna-backend.onrender.com';
const FRONTEND_URL = 'https://shababna-frontend.onrender.com';

console.log('🔍 فحص النشر على Render.com...\n');

async function testBackend() {
    console.log('📡 فحص الخادم الخلفي...');

    try {
        // فحص health endpoint
        const healthResponse = await axios.get(`${BACKEND_URL}/api/health`);
        console.log('✅ Health Check:', healthResponse.data);

        // فحص API endpoints
        const endpoints = [
            '/api/auth',
            '/api/events',
            '/api/programs',
            '/api/blogs'
        ];

        for (const endpoint of endpoints) {
            try {
                await axios.get(`${BACKEND_URL}${endpoint}`);
                console.log(`✅ ${endpoint} - متاح`);
            } catch (error) {
                console.log(`❌ ${endpoint} - خطأ: ${error.response?.status || error.message}`);
            }
        }

    } catch (error) {
        console.log('❌ الخادم الخلفي غير متاح:', error.message);
    }
}

async function testFrontend() {
    console.log('\n🌐 فحص الواجهة الأمامية...');

    try {
        const response = await axios.get(FRONTEND_URL);
        console.log('✅ الواجهة الأمامية متاحة');
        console.log('📊 Status Code:', response.status);
    } catch (error) {
        console.log('❌ الواجهة الأمامية غير متاحة:', error.message);
    }
}

async function testDatabase() {
    console.log('\n🗄️ فحص قاعدة البيانات...');

    try {
        // فحص الاتصال بقاعدة البيانات عبر API
        const response = await axios.get(`${BACKEND_URL}/api/health`);
        if (response.data.status === 'OK') {
            console.log('✅ قاعدة البيانات متصلة');
        } else {
            console.log('❌ مشكلة في قاعدة البيانات');
        }
    } catch (error) {
        console.log('❌ لا يمكن فحص قاعدة البيانات:', error.message);
    }
}

async function runTests() {
    await testBackend();
    await testFrontend();
    await testDatabase();

    console.log('\n📋 ملخص الفحص:');
    console.log('🔗 روابط الموقع:');
    console.log(`   الخادم الخلفي: ${BACKEND_URL}`);
    console.log(`   الواجهة الأمامية: ${FRONTEND_URL}`);
    console.log(`   Health Check: ${BACKEND_URL}/api/health`);

    console.log('\n💡 إذا كانت هناك مشاكل:');
    console.log('1. فحص logs في Render.com Dashboard');
    console.log('2. التأكد من متغيرات البيئة');
    console.log('3. فحص الاتصال بقاعدة البيانات');
    console.log('4. التأكد من build commands');
}

runTests().catch(console.error);