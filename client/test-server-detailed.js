#!/usr/bin/env node

import fetch from 'node-fetch';

console.log('🔍 اختبار تفصيلي للخادم...\n');

const detailedTests = [
    // Basic connectivity
    {
        name: 'Server Reachability',
        endpoint: 'https://shababna-backend.onrender.com',
        method: 'GET',
        expectedStatus: [200, 404] // 404 is OK for root endpoint
    },
    {
        name: 'API Health Check',
        endpoint: 'https://shababna-backend.onrender.com/api/health',
        method: 'GET',
        expectedStatus: [200]
    },

    // Authentication
    {
        name: 'Login Endpoint',
        endpoint: 'https://shababna-backend.onrender.com/api/auth/login',
        method: 'POST',
        data: { email: 'test@example.com', password: 'test123' },
        expectedStatus: [200, 401, 400]
    },
    {
        name: 'Register Endpoint',
        endpoint: 'https://shababna-backend.onrender.com/api/auth/register',
        method: 'POST',
        data: {
            email: 'newuser@example.com',
            password: 'password123',
            first_name: 'Test',
            last_name: 'User'
        },
        expectedStatus: [200, 201, 400]
    },

    // Events
    {
        name: 'Events List',
        endpoint: 'https://shababna-backend.onrender.com/api/events',
        method: 'GET',
        expectedStatus: [200]
    },
    {
        name: 'Single Event',
        endpoint: 'https://shababna-backend.onrender.com/api/events/1',
        method: 'GET',
        expectedStatus: [200, 404]
    },
    {
        name: 'Create Event',
        endpoint: 'https://shababna-backend.onrender.com/api/events',
        method: 'POST',
        data: {
            title: 'Test Event',
            description: 'Test Description',
            location: 'Test Location',
            start_date: '2024-12-25T10:00:00Z',
            end_date: '2024-12-25T18:00:00Z',
            max_participants: 100,
            status: 'upcoming'
        },
        expectedStatus: [200, 201, 400, 401]
    },

    // Programs
    {
        name: 'Programs List',
        endpoint: 'https://shababna-backend.onrender.com/api/programs',
        method: 'GET',
        expectedStatus: [200]
    },
    {
        name: 'Single Program',
        endpoint: 'https://shababna-backend.onrender.com/api/programs/1',
        method: 'GET',
        expectedStatus: [200, 404]
    },
    {
        name: 'Create Program',
        endpoint: 'https://shababna-backend.onrender.com/api/programs',
        method: 'POST',
        data: {
            title: 'Test Program',
            description: 'Test Description',
            category: 'Test Category',
            duration: '3 months',
            max_participants: 50,
            status: 'draft'
        },
        expectedStatus: [200, 201, 400, 401]
    },

    // Blogs
    {
        name: 'Blogs List',
        endpoint: 'https://shababna-backend.onrender.com/api/blogs',
        method: 'GET',
        expectedStatus: [200]
    },
    {
        name: 'Single Blog',
        endpoint: 'https://shababna-backend.onrender.com/api/blogs/1',
        method: 'GET',
        expectedStatus: [200, 404]
    },
    {
        name: 'Create Blog',
        endpoint: 'https://shababna-backend.onrender.com/api/blogs',
        method: 'POST',
        data: {
            title: 'Test Blog',
            content: 'Test Content',
            excerpt: 'Test Excerpt',
            author: 'Test Author',
            status: 'draft'
        },
        expectedStatus: [200, 201, 400, 401]
    },

    // Contact Forms
    {
        name: 'Contact Forms List',
        endpoint: 'https://shababna-backend.onrender.com/api/forms/contact-forms',
        method: 'GET',
        expectedStatus: [200, 401]
    },
    {
        name: 'Submit Contact Form',
        endpoint: 'https://shababna-backend.onrender.com/api/forms/contact',
        method: 'POST',
        data: {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'Test Message',
            phone: '+966501234567'
        },
        expectedStatus: [200, 201, 400]
    },

    // Dashboard
    {
        name: 'Dashboard Stats',
        endpoint: 'https://shababna-backend.onrender.com/api/dashboard/stats',
        method: 'GET',
        expectedStatus: [200, 401]
    },
    {
        name: 'Dashboard Analytics',
        endpoint: 'https://shababna-backend.onrender.com/api/dashboard/analytics',
        method: 'GET',
        expectedStatus: [200, 401]
    },

    // Users
    {
        name: 'Users List',
        endpoint: 'https://shababna-backend.onrender.com/api/users',
        method: 'GET',
        expectedStatus: [200, 401]
    }
];

async function testServerDetailed() {
    let success = 0;
    let failed = 0;
    const results = [];

    for (const test of detailedTests) {
        console.log(`🔍 اختبار: ${test.name}`);

        try {
            const startTime = Date.now();
            const options = {
                method: test.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            };

            if (test.data) {
                options.body = JSON.stringify(test.data);
            }

            const response = await fetch(test.endpoint, options);
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            const isExpectedStatus = test.expectedStatus.includes(response.status);

            if (isExpectedStatus) {
                console.log(`✅ ${test.name} (${response.status}) (${responseTime}ms)`);
                success++;
                results.push({
                    name: test.name,
                    status: 'success',
                    httpStatus: response.status,
                    time: responseTime
                });
            } else {
                console.log(`❌ ${test.name} (Status: ${response.status}, Expected: ${test.expectedStatus.join(', ')})`);
                failed++;
                results.push({
                    name: test.name,
                    status: 'failed',
                    httpStatus: response.status,
                    expectedStatus: test.expectedStatus,
                    error: `Unexpected status: ${response.status}`
                });
            }

        } catch (error) {
            console.log(`❌ ${test.name} - خطأ: ${error.message}`);
            failed++;
            results.push({
                name: test.name,
                status: 'error',
                error: error.message
            });
        }

        console.log('---\n');

        // Delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('📊 نتائج الاختبار التفصيلي:');
    console.log(`✅ نجح: ${success}`);
    console.log(`❌ فشل: ${failed}`);
    console.log(`📈 نسبة النجاح: ${Math.round((success / (success + failed)) * 100)}%`);

    // Performance analysis
    const successfulTests = results.filter(r => r.status === 'success');
    if (successfulTests.length > 0) {
        const avgResponseTime = successfulTests.reduce((sum, test) => sum + test.time, 0) / successfulTests.length;
        console.log(`⚡ متوسط وقت الاستجابة: ${Math.round(avgResponseTime)}ms`);
    }

    // Status code analysis
    const statusCodes = {};
    results.forEach(result => {
        if (result.httpStatus) {
            statusCodes[result.httpStatus] = (statusCodes[result.httpStatus] || 0) + 1;
        }
    });

    console.log('\n📊 تحليل رموز الحالة:');
    Object.entries(statusCodes).forEach(([status, count]) => {
        console.log(`  ${status}: ${count} requests`);
    });

    // Detailed results
    console.log('\n📋 تفاصيل النتائج:');
    results.forEach((result, index) => {
        const status = result.status === 'success' ? '✅' : '❌';
        const time = result.time ? ` (${result.time}ms)` : '';
        const httpStatus = result.httpStatus ? ` [${result.httpStatus}]` : '';
        const error = result.error ? ` - ${result.error}` : '';
        console.log(`${index + 1}. ${status} ${result.name}${httpStatus}${time}${error}`);
    });

    // Recommendations
    console.log('\n💡 التوصيات:');
    if (success === detailedTests.length) {
        console.log('🎉 الخادم يعمل بشكل مثالي!');
    } else if (success >= detailedTests.length * 0.8) {
        console.log('✅ الخادم يعمل بشكل جيد مع بعض المشاكل البسيطة.');
    } else if (success >= detailedTests.length * 0.6) {
        console.log('⚠️  الخادم يعمل مع مشاكل متوسطة تحتاج مراجعة.');
    } else {
        console.log('🚨 الخادم يحتاج إصلاحات عاجلة.');
    }

    return { success, failed, results };
}

testServerDetailed().catch(console.error);