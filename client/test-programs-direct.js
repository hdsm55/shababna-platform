#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'https://shababna-backend.onrender.com/api';

async function makeRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function testProgramsAPI() {
    console.log('🚀 بدء اختبار APIs البرامج...\n');

    const tests = [
        {
            name: 'قائمة البرامج',
            endpoint: '/programs',
            method: 'GET'
        },
        {
            name: 'تفاصيل برنامج',
            endpoint: '/programs/1',
            method: 'GET'
        },
        {
            name: 'إنشاء برنامج',
            endpoint: '/programs',
            method: 'POST',
            data: {
                title: 'برنامج اختبار مباشر',
                description: 'وصف البرنامج للاختبار المباشر',
                category: 'تنمية بشرية',
                duration: '3 أشهر',
                max_participants: 50,
                status: 'draft',
                instructor: 'د. أحمد محمد',
                price: 500,
                currency: 'SAR'
            }
        },
        {
            name: 'تحديث برنامج',
            endpoint: '/programs/1',
            method: 'PUT',
            data: {
                title: 'برنامج محدث مباشر',
                description: 'وصف محدث للبرنامج',
                status: 'active'
            }
        },
        {
            name: 'تسجيل برنامج',
            endpoint: '/programs/1/enroll',
            method: 'POST',
            data: {
                program_id: 1,
                user_id: 1,
                enrollment_date: new Date().toISOString(),
                status: 'confirmed',
                payment_status: 'paid'
            }
        }
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const test of tests) {
        console.log(`🔍 اختبار: ${test.name}`);

        try {
            const options = {
                method: test.method
            };

            if (test.data) {
                options.body = JSON.stringify(test.data);
            }

            const data = await makeRequest(test.endpoint, options);

            if (data.success) {
                console.log(`✅ نجح: ${test.name}`);
                successCount++;
            } else {
                console.log(`❌ فشل: ${test.name} - ${data.message}`);
                errorCount++;
            }
        } catch (error) {
            console.log(`❌ خطأ: ${test.name} - ${error.message}`);
            errorCount++;
        }

        console.log('---');
    }

    console.log(`📊 النتائج النهائية:`);
    console.log(`✅ نجح: ${successCount}`);
    console.log(`❌ فشل: ${errorCount}`);
    console.log(`📈 نسبة النجاح: ${Math.round((successCount / tests.length) * 100)}%`);
}

// تشغيل الاختبار
testProgramsAPI().catch(console.error);
