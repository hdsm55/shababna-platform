// استخدام fetch المدمج في Node.js
const BASE_URL = 'http://localhost:5000/api';
const CLIENT_URL = 'http://localhost:5175';

// ألوان للطباعة
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

// اختبار الاتصال بالخادم
async function testServerConnection() {
    logSection('اختبار الاتصال بالخادم');

    try {
        const response = await fetch(`${BASE_URL}/health`);
        if (response.ok) {
            logSuccess('الخادم يعمل بشكل صحيح');
            return true;
        } else {
            logError(`الخادم لا يستجيب: ${response.status}`);
            return false;
        }
    } catch (error) {
        logError(`خطأ في الاتصال بالخادم: ${error.message}`);
        return false;
    }
}

// اختبار قاعدة البيانات
async function testDatabase() {
    logSection('اختبار قاعدة البيانات');

    try {
        const response = await fetch(`${BASE_URL}/dashboard/stats`);
        if (response.ok) {
            const data = await response.json();
            logSuccess('قاعدة البيانات متصلة');
            log(`📊 الإحصائيات:`, 'blue');
            log(`  - المستخدمين: ${data.data?.totalUsers || 0}`);
            log(`  - الفعاليات: ${data.data?.totalEvents || 0}`);
            log(`  - البرامج: ${data.data?.totalPrograms || 0}`);
            log(`  - المدونات: ${data.data?.totalBlogs || 0}`);
            return true;
        } else {
            logError(`خطأ في قاعدة البيانات: ${response.status}`);
            return false;
        }
    } catch (error) {
        logError(`خطأ في اختبار قاعدة البيانات: ${error.message}`);
        return false;
    }
}

// اختبار الفعاليات
async function testEvents() {
    logSection('اختبار الفعاليات');

    try {
        // جلب الفعاليات
        const response = await fetch(`${BASE_URL}/events`);
        if (response.ok) {
            const data = await response.json();
            logSuccess(`تم جلب ${data.data?.events?.length || 0} فعالية`);

            // اختبار فعالية محددة
            if (data.data?.events?.length > 0) {
                const eventId = data.data.events[0].id;
                const eventResponse = await fetch(`${BASE_URL}/events/${eventId}`);
                if (eventResponse.ok) {
                    logSuccess(`تم جلب تفاصيل الفعالية ${eventId}`);
                } else {
                    logWarning(`فشل في جلب تفاصيل الفعالية ${eventId}`);
                }
            }
            return true;
        } else {
            logError(`خطأ في جلب الفعاليات: ${response.status}`);
            return false;
        }
    } catch (error) {
        logError(`خطأ في اختبار الفعاليات: ${error.message}`);
        return false;
    }
}

// اختبار البرامج
async function testPrograms() {
    logSection('اختبار البرامج');

    try {
        // جلب البرامج
        const response = await fetch(`${BASE_URL}/programs`);
        if (response.ok) {
            const data = await response.json();
            logSuccess(`تم جلب ${data.data?.programs?.length || 0} برنامج`);

            // اختبار برنامج محدد
            if (data.data?.programs?.length > 0) {
                const programId = data.data.programs[0].id;
                const programResponse = await fetch(`${BASE_URL}/programs/${programId}`);
                if (programResponse.ok) {
                    logSuccess(`تم جلب تفاصيل البرنامج ${programId}`);
                } else {
                    logWarning(`فشل في جلب تفاصيل البرنامج ${programId}`);
                }
            }
            return true;
        } else {
            logError(`خطأ في جلب البرامج: ${response.status}`);
            return false;
        }
    } catch (error) {
        logError(`خطأ في اختبار البرامج: ${error.message}`);
        return false;
    }
}

// اختبار المدونات
async function testBlogs() {
    logSection('اختبار المدونات');

    try {
        const response = await fetch(`${BASE_URL}/blogs`);
        if (response.ok) {
            const data = await response.json();
            logSuccess(`تم جلب ${data.data?.blogs?.length || 0} مدونة`);
            return true;
        } else {
            logError(`خطأ في جلب المدونات: ${response.status}`);
            return false;
        }
    } catch (error) {
        logError(`خطأ في اختبار المدونات: ${error.message}`);
        return false;
    }
}

// اختبار نماذج الاتصال
async function testContactForms() {
    logSection('اختبار نماذج الاتصال');

    try {
        const testData = {
            first_name: 'اختبار',
            last_name: 'النظام',
            email: 'test@example.com',
            phone: '0500000000',
            subject: 'اختبار النظام',
            message: 'هذا اختبار للنظام'
        };

        const response = await fetch(`${BASE_URL}/forms/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        if (response.ok) {
            logSuccess('تم إرسال نموذج الاتصال بنجاح');
            return true;
        } else {
            logError(`خطأ في إرسال نموذج الاتصال: ${response.status}`);
            return false;
        }
    } catch (error) {
        logError(`خطأ في اختبار نموذج الاتصال: ${error.message}`);
        return false;
    }
}

// اختبار نموذج الانضمام
async function testJoinForm() {
    logSection('اختبار نموذج الانضمام');

    try {
        const testData = {
            first_name: 'اختبار',
            last_name: 'الانضمام',
            email: 'join@example.com',
            phone: '0500000001',
            country: 'السعودية',
            age: 25,
            interests: 'التطوع',
            motivation: 'رغبة في المساهمة'
        };

        const response = await fetch(`${BASE_URL}/forms/join-us`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        if (response.ok) {
            logSuccess('تم إرسال نموذج الانضمام بنجاح');
            return true;
        } else {
            logError(`خطأ في إرسال نموذج الانضمام: ${response.status}`);
            return false;
        }
    } catch (error) {
        logError(`خطأ في اختبار نموذج الانضمام: ${error.message}`);
        return false;
    }
}

// اختبار التبرعات
async function testDonations() {
    logSection('اختبار التبرعات');

    try {
        // أولاً نحتاج برنامج للتبرع له
        const programsResponse = await fetch(`${BASE_URL}/programs`);
        if (!programsResponse.ok) {
            logWarning('لا يمكن اختبار التبرعات بدون برامج');
            return false;
        }

        const programsData = await programsResponse.json();
        if (!programsData.data?.programs?.length) {
            logWarning('لا توجد برامج للتبرع لها');
            return false;
        }

        const programId = programsData.data.programs[0].id;

        // اختبار تبرع فرد
        const individualDonation = {
            program_id: programId,
            support_type: 'individual',
            amount: 100,
            email: 'donor@example.com',
            phone: '0500000002',
            first_name: 'محمد',
            last_name: 'أحمد',
            message: 'تبرع فردي'
        };

        const response = await fetch(`${BASE_URL}/forms/donations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(individualDonation)
        });

        if (response.ok) {
            logSuccess('تم إرسال تبرع فردي بنجاح');

            // اختبار تبرع مؤسسة
            const orgDonation = {
                program_id: programId,
                support_type: 'organization',
                amount: 1000,
                email: 'org@example.com',
                phone: '0500000003',
                org_name: 'شركة الاختبار',
                contact_person: 'أحمد محمد',
                website: 'https://example.com',
                partnership_type: 'sponsor',
                message: 'تبرع مؤسسي'
            };

            const orgResponse = await fetch(`${BASE_URL}/forms/donations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orgDonation)
            });

            if (orgResponse.ok) {
                logSuccess('تم إرسال تبرع مؤسسي بنجاح');
            } else {
                logWarning('فشل في إرسال التبرع المؤسسي');
            }

            return true;
        } else {
            logError(`خطأ في إرسال التبرع: ${response.status}`);
            return false;
        }
    } catch (error) {
        logError(`خطأ في اختبار التبرعات: ${error.message}`);
        return false;
    }
}

// اختبار تسجيل الفعاليات
async function testEventRegistration() {
    logSection('اختبار تسجيل الفعاليات');

    try {
        // أولاً نحتاج فعالية للتسجيل فيها
        const eventsResponse = await fetch(`${BASE_URL}/events`);
        if (!eventsResponse.ok) {
            logWarning('لا يمكن اختبار تسجيل الفعاليات بدون فعاليات');
            return false;
        }

        const eventsData = await eventsResponse.json();
        if (!eventsData.data?.events?.length) {
            logWarning('لا توجد فعاليات للتسجيل فيها');
            return false;
        }

        const eventId = eventsData.data.events[0].id;

        const registrationData = {
            event_id: eventId,
            first_name: 'سارة',
            last_name: 'محمد',
            email: 'sara@example.com',
            phone: '0500000004'
        };

        const response = await fetch(`${BASE_URL}/events/${eventId}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData)
        });

        if (response.ok) {
            logSuccess('تم تسجيل الفعالية بنجاح');
            return true;
        } else {
            logError(`خطأ في تسجيل الفعالية: ${response.status}`);
            return false;
        }
    } catch (error) {
        logError(`خطأ في اختبار تسجيل الفعاليات: ${error.message}`);
        return false;
    }
}

// اختبار لوحة التحكم
async function testDashboard() {
    logSection('اختبار لوحة التحكم');

    try {
        const endpoints = [
            '/dashboard/stats',
            '/dashboard/recent-events',
            '/dashboard/recent-programs',
            '/dashboard/recent-users'
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`${BASE_URL}${endpoint}`);
                if (response.ok) {
                    logSuccess(`✅ ${endpoint} يعمل`);
                } else {
                    logWarning(`⚠️ ${endpoint} فشل: ${response.status}`);
                }
            } catch (error) {
                logWarning(`⚠️ ${endpoint} خطأ: ${error.message}`);
            }
        }

        return true;
    } catch (error) {
        logError(`خطأ في اختبار لوحة التحكم: ${error.message}`);
        return false;
    }
}

// اختبار الملفات الثابتة
async function testStaticFiles() {
    logSection('اختبار الملفات الثابتة');

    try {
        const files = [
            '/images/logo.png',
            '/images/hero-bg.jpg',
            '/site.webmanifest'
        ];

        for (const file of files) {
            try {
                const response = await fetch(`${CLIENT_URL}${file}`);
                if (response.ok) {
                    logSuccess(`✅ ${file} متاح`);
                } else {
                    logWarning(`⚠️ ${file} غير متاح: ${response.status}`);
                }
            } catch (error) {
                logWarning(`⚠️ ${file} خطأ: ${error.message}`);
            }
        }

        return true;
    } catch (error) {
        logError(`خطأ في اختبار الملفات الثابتة: ${error.message}`);
        return false;
    }
}

// الاختبار الرئيسي
async function runComprehensiveTest() {
    logSection('بدء الاختبار الشامل للنظام');

    const tests = [
        { name: 'الاتصال بالخادم', fn: testServerConnection },
        { name: 'قاعدة البيانات', fn: testDatabase },
        { name: 'الفعاليات', fn: testEvents },
        { name: 'البرامج', fn: testPrograms },
        { name: 'المدونات', fn: testBlogs },
        { name: 'نماذج الاتصال', fn: testContactForms },
        { name: 'نماذج الانضمام', fn: testJoinForm },
        { name: 'التبرعات', fn: testDonations },
        { name: 'تسجيل الفعاليات', fn: testEventRegistration },
        { name: 'لوحة التحكم', fn: testDashboard },
        { name: 'الملفات الثابتة', fn: testStaticFiles }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const test of tests) {
        try {
            const result = await test.fn();
            if (result) passedTests++;
        } catch (error) {
            logError(`خطأ في اختبار ${test.name}: ${error.message}`);
        }
    }

    logSection('نتائج الاختبار');
    log(`📊 النتائج: ${passedTests}/${totalTests} اختبارات نجحت`, passedTests === totalTests ? 'green' : 'yellow');

    if (passedTests === totalTests) {
        logSuccess('🎉 جميع الاختبارات نجحت! النظام يعمل بشكل مثالي');
    } else {
        logWarning(`⚠️ ${totalTests - passedTests} اختبارات فشلت. يرجى مراجعة الأخطاء أعلاه`);
    }
}

// تشغيل الاختبار
runComprehensiveTest().catch(error => {
    logError(`خطأ في تشغيل الاختبار: ${error.message}`);
    process.exit(1);
});
