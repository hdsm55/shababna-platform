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

async function testAllAPIs() {
    console.log('🚀 بدء الاختبار النهائي الشامل...\n');

    const tests = [
        // Auth APIs
        {
            name: 'تسجيل الدخول',
            endpoint: '/auth/login',
            method: 'POST',
            data: { email: 'test@example.com', password: 'test123' }
        },
        {
            name: 'تسجيل مستخدم جديد',
            endpoint: '/auth/register',
            method: 'POST',
            data: {
                email: 'newuser@example.com',
                password: 'password123',
                first_name: 'مستخدم',
                last_name: 'جديد'
            }
        },

        // Events APIs
        {
            name: 'قائمة الفعاليات',
            endpoint: '/events',
            method: 'GET'
        },
        {
            name: 'تفاصيل فعالية',
            endpoint: '/events/1',
            method: 'GET'
        },
        {
            name: 'إنشاء فعالية',
            endpoint: '/events',
            method: 'POST',
            data: {
                title: 'فعالية اختبار نهائي',
                description: 'وصف الفعالية للاختبار النهائي',
                location: 'الرياض',
                start_date: '2024-12-25T10:00:00Z',
                end_date: '2024-12-25T18:00:00Z',
                max_participants: 100,
                status: 'upcoming'
            }
        },

        // Programs APIs
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
                title: 'برنامج اختبار نهائي',
                description: 'وصف البرنامج للاختبار النهائي',
                category: 'تنمية بشرية',
                duration: '6 أشهر',
                max_participants: 50,
                status: 'draft'
            }
        },

        // Blogs APIs
        {
            name: 'قائمة المدونات',
            endpoint: '/blogs',
            method: 'GET'
        },
        {
            name: 'تفاصيل مدونة',
            endpoint: '/blogs/1',
            method: 'GET'
        },
        {
            name: 'إنشاء مدونة',
            endpoint: '/blogs',
            method: 'POST',
            data: {
                title: 'مدونة اختبار نهائي',
                content: 'محتوى المدونة للاختبار النهائي',
                excerpt: 'ملخص المدونة',
                author: 'فريق الاختبار',
                status: 'draft'
            }
        },

        // Contact Forms APIs
        {
            name: 'قائمة نماذج التواصل',
            endpoint: '/forms/contact-forms',
            method: 'GET'
        },
        {
            name: 'إرسال نموذج تواصل',
            endpoint: '/forms/contact',
            method: 'POST',
            data: {
                name: 'مستخدم اختبار نهائي',
                email: 'finaltest@example.com',
                subject: 'رسالة اختبار نهائي',
                message: 'هذه رسالة اختبار نهائي لنموذج التواصل',
                phone: '+966501234567'
            }
        },

        // Dashboard APIs
        {
            name: 'إحصائيات الداشبورد',
            endpoint: '/dashboard/stats',
            method: 'GET'
        },
        {
            name: 'تحليلات الداشبورد',
            endpoint: '/dashboard/analytics',
            method: 'GET'
        },

        // Users APIs
        {
            name: 'قائمة المستخدمين',
            endpoint: '/users',
            method: 'GET'
        },

        // Health Check
        {
            name: 'فحص صحة الخادم',
            endpoint: '/health',
            method: 'GET'
        }
    ];

    let successCount = 0;
    let errorCount = 0;
    const results = [];

    console.log('📋 قائمة الاختبارات:');
    tests.forEach((test, index) => {
        console.log(`${index + 1}. ${test.name}`);
    });
    console.log('\n' + '='.repeat(50) + '\n');

    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        console.log(`🔍 [${i + 1}/${tests.length}] اختبار: ${test.name}`);

        try {
            const options = {
                method: test.method
            };

            if (test.data) {
                options.body = JSON.stringify(test.data);
            }

            const startTime = Date.now();
            const data = await makeRequest(test.endpoint, options);
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            if (data.success) {
                console.log(`✅ نجح: ${test.name} (${responseTime}ms)`);
                successCount++;
                results.push({ name: test.name, status: 'success', time: responseTime });
            } else {
                console.log(`❌ فشل: ${test.name} - ${data.message} (${responseTime}ms)`);
                errorCount++;
                results.push({ name: test.name, status: 'failed', error: data.message, time: responseTime });
            }
        } catch (error) {
            console.log(`❌ خطأ: ${test.name} - ${error.message}`);
            errorCount++;
            results.push({ name: test.name, status: 'error', error: error.message });
        }

        // إضافة تأخير بين الطلبات لتجنب الضغط على الخادم
        if (i < tests.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 النتائج النهائية:');
    console.log(`✅ نجح: ${successCount}`);
    console.log(`❌ فشل: ${errorCount}`);
    console.log(`📈 نسبة النجاح: ${Math.round((successCount / tests.length) * 100)}%`);
    console.log(`⏱️  إجمالي الاختبارات: ${tests.length}`);

    console.log('\n📋 تفاصيل النتائج:');
    results.forEach((result, index) => {
        const status = result.status === 'success' ? '✅' : '❌';
        const time = result.time ? ` (${result.time}ms)` : '';
        const error = result.error ? ` - ${result.error}` : '';
        console.log(`${index + 1}. ${status} ${result.name}${time}${error}`);
    });

    // تقرير الأداء
    const successfulTests = results.filter(r => r.status === 'success');
    if (successfulTests.length > 0) {
        const avgResponseTime = successfulTests.reduce((sum, test) => sum + test.time, 0) / successfulTests.length;
        console.log(`\n⚡ متوسط وقت الاستجابة: ${Math.round(avgResponseTime)}ms`);
    }

    // توصيات
    console.log('\n💡 التوصيات:');
    if (errorCount === 0) {
        console.log('🎉 جميع الاختبارات نجحت! النظام يعمل بشكل مثالي.');
    } else if (errorCount <= 3) {
        console.log('✅ النظام يعمل بشكل جيد مع بعض المشاكل البسيطة.');
    } else if (errorCount <= 6) {
        console.log('⚠️  النظام يعمل مع مشاكل متوسطة تحتاج مراجعة.');
    } else {
        console.log('🚨 النظام يحتاج إصلاحات عاجلة.');
    }

    return { successCount, errorCount, results };
}

// تشغيل الاختبار النهائي
testAllAPIs().catch(console.error);