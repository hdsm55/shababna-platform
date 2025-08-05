#!/usr/bin/env node

import fetch from 'node-fetch';

console.log('🔍 اختبار قاعدة البيانات على Render...\n');

const dbTests = [
    {
        name: 'Database Connection Test',
        endpoint: 'https://shababna-backend.onrender.com/api/health',
        method: 'GET',
        description: 'اختبار الاتصال بقاعدة البيانات'
    },
    {
        name: 'Events Data Test',
        endpoint: 'https://shababna-backend.onrender.com/api/events',
        method: 'GET',
        description: 'اختبار جلب بيانات الفعاليات'
    },
    {
        name: 'Programs Data Test',
        endpoint: 'https://shababna-backend.onrender.com/api/programs',
        method: 'GET',
        description: 'اختبار جلب بيانات البرامج'
    },
    {
        name: 'Blogs Data Test',
        endpoint: 'https://shababna-backend.onrender.com/api/blogs',
        method: 'GET',
        description: 'اختبار جلب بيانات المدونات'
    },
    {
        name: 'Users Data Test',
        endpoint: 'https://shababna-backend.onrender.com/api/users',
        method: 'GET',
        description: 'اختبار جلب بيانات المستخدمين'
    },
    {
        name: 'Contact Forms Data Test',
        endpoint: 'https://shababna-backend.onrender.com/api/forms/contact-forms',
        method: 'GET',
        description: 'اختبار جلب بيانات نماذج التواصل'
    },
    {
        name: 'Dashboard Stats Test',
        endpoint: 'https://shababna-backend.onrender.com/api/dashboard/stats',
        method: 'GET',
        description: 'اختبار إحصائيات الداشبورد'
    },
    {
        name: 'Database Write Test',
        endpoint: 'https://shababna-backend.onrender.com/api/forms/contact',
        method: 'POST',
        data: {
            name: 'Database Test User',
            email: 'dbtest@example.com',
            subject: 'Database Connection Test',
            message: 'This is a test message to verify database write operations',
            phone: '+966501234567'
        },
        description: 'اختبار كتابة البيانات في قاعدة البيانات'
    }
];

async function testRenderDatabase() {
    let success = 0;
    let failed = 0;
    const results = [];

    console.log('📋 قائمة اختبارات قاعدة البيانات:');
    dbTests.forEach((test, index) => {
        console.log(`${index + 1}. ${test.name} - ${test.description}`);
    });
    console.log('\n' + '='.repeat(60) + '\n');

    for (let i = 0; i < dbTests.length; i++) {
        const test = dbTests[i];
        console.log(`🔍 [${i + 1}/${dbTests.length}] ${test.name}`);
        console.log(`📝 ${test.description}`);

        try {
            const startTime = Date.now();
            const options = {
                method: test.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 seconds timeout for database operations
            };

            if (test.data) {
                options.body = JSON.stringify(test.data);
            }

            const response = await fetch(test.endpoint, options);
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ${test.name} (${responseTime}ms)`);
                console.log(`   Status: ${response.status}`);

                // Check if data is returned
                if (data && (data.success || data.data || Array.isArray(data))) {
                    console.log(`   Data: ${JSON.stringify(data).substring(0, 150)}...`);
                } else {
                    console.log(`   Response: ${JSON.stringify(data).substring(0, 150)}...`);
                }

                success++;
                results.push({
                    name: test.name,
                    status: 'success',
                    httpStatus: response.status,
                    time: responseTime,
                    data: data
                });
            } else {
                console.log(`❌ ${test.name} (Status: ${response.status})`);
                failed++;
                results.push({
                    name: test.name,
                    status: 'failed',
                    httpStatus: response.status,
                    error: `HTTP ${response.status}`
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

        // Delay between tests to avoid overwhelming the database
        if (i < dbTests.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log('='.repeat(60));
    console.log('📊 نتائج اختبار قاعدة البيانات:');
    console.log('='.repeat(60));

    console.log(`✅ نجح: ${success}`);
    console.log(`❌ فشل: ${failed}`);
    console.log(`📈 نسبة النجاح: ${Math.round((success / (success + failed)) * 100)}%`);

    // Performance analysis
    const successfulTests = results.filter(r => r.status === 'success');
    if (successfulTests.length > 0) {
        const avgResponseTime = successfulTests.reduce((sum, test) => sum + test.time, 0) / successfulTests.length;
        console.log(`⚡ متوسط وقت الاستجابة: ${Math.round(avgResponseTime)}ms`);

        const minResponseTime = Math.min(...successfulTests.map(t => t.time));
        const maxResponseTime = Math.max(...successfulTests.map(t => t.time));
        console.log(`⚡ أسرع استجابة: ${minResponseTime}ms`);
        console.log(`⚡ أبطأ استجابة: ${maxResponseTime}ms`);
    }

    // Database health assessment
    console.log('\n🏥 تقييم صحة قاعدة البيانات:');

    const readTests = results.filter(r => r.name.includes('Data Test') || r.name.includes('Stats'));
    const writeTests = results.filter(r => r.name.includes('Write Test'));
    const connectionTests = results.filter(r => r.name.includes('Connection'));

    const readSuccess = readTests.filter(r => r.status === 'success').length;
    const writeSuccess = writeTests.filter(r => r.status === 'success').length;
    const connectionSuccess = connectionTests.filter(r => r.status === 'success').length;

    console.log(`📖 عمليات القراءة: ${readSuccess}/${readTests.length} نجح`);
    console.log(`✍️  عمليات الكتابة: ${writeSuccess}/${writeTests.length} نجح`);
    console.log(`🔌 الاتصال: ${connectionSuccess}/${connectionTests.length} نجح`);

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
    if (success === dbTests.length) {
        console.log('🎉 قاعدة البيانات تعمل بشكل مثالي!');
        console.log('✅ جميع العمليات (قراءة/كتابة/اتصال) تعمل بشكل صحيح.');
    } else if (success >= dbTests.length * 0.8) {
        console.log('✅ قاعدة البيانات تعمل بشكل جيد مع بعض المشاكل البسيطة.');
        if (writeSuccess < writeTests.length) {
            console.log('⚠️  مشاكل في عمليات الكتابة - تحقق من صلاحيات المستخدم.');
        }
        if (readSuccess < readTests.length) {
            console.log('⚠️  مشاكل في عمليات القراءة - تحقق من البيانات.');
        }
    } else if (success >= dbTests.length * 0.6) {
        console.log('⚠️  قاعدة البيانات تعمل مع مشاكل متوسطة تحتاج مراجعة.');
        console.log('🔧 تحقق من إعدادات الاتصال والصلاحيات.');
    } else {
        console.log('🚨 قاعدة البيانات تحتاج إصلاحات عاجلة.');
        console.log('🚨 تحقق من:');
        console.log('   - إعدادات الاتصال بقاعدة البيانات');
        console.log('   - متغيرات البيئة (DATABASE_URL)');
        console.log('   - صلاحيات المستخدم');
        console.log('   - حالة الخادم على Render');
    }

    return { success, failed, results };
}

testRenderDatabase().catch(console.error);