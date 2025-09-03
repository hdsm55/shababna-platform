import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';
const FRONTEND_BASE = 'http://localhost:5173';

console.log('🧪 بدء اختبار شامل للداشبورد...\n');

// اختبار الصفحات الأساسية للداشبورد
const dashboardPages = [
    { name: 'الداشبورد الرئيسي', url: `${FRONTEND_BASE}/dashboard` },
    { name: 'إدارة الفعاليات', url: `${FRONTEND_BASE}/dashboard/events` },
    { name: 'إنشاء فعالية جديدة', url: `${FRONTEND_BASE}/dashboard/events/new` },
    { name: 'إدارة البرامج', url: `${FRONTEND_BASE}/dashboard/programs` },
    { name: 'إنشاء برنامج جديد', url: `${FRONTEND_BASE}/dashboard/programs/new` },
    { name: 'إدارة المدونات', url: `${FRONTEND_BASE}/dashboard/blogs` },
    { name: 'إدارة المستخدمين', url: `${FRONTEND_BASE}/dashboard/users` },
    { name: 'رسائل التواصل', url: `${FRONTEND_BASE}/dashboard/contact-forms` },
    { name: 'الإعدادات', url: `${FRONTEND_BASE}/dashboard/settings` },
    { name: 'التقارير', url: `${FRONTEND_BASE}/dashboard/reports` },
    { name: 'التحليلات', url: `${FRONTEND_BASE}/dashboard/analytics` },
];

// اختبار نقاط API الأساسية للداشبورد
const apiEndpoints = [
    { name: 'جلب الفعاليات', url: `${API_BASE}/events` },
    { name: 'جلب البرامج', url: `${API_BASE}/programs` },
    { name: 'جلب المدونات', url: `${API_BASE}/blogs` },
    { name: 'جلب المستخدمين', url: `${API_BASE}/users` },
    { name: 'جلب رسائل التواصل', url: `${API_BASE}/contact` },
];

// اختبار صفحات الداشبورد
async function testDashboardPages() {
    console.log('🔍 اختبار صفحات الداشبورد...\n');

    for (const page of dashboardPages) {
        try {
            const response = await fetch(page.url, {
                method: 'GET',
                timeout: 10000,
            });

            if (response.ok) {
                console.log(`✅ ${page.name}: يعمل بشكل صحيح`);
            } else {
                console.log(`❌ ${page.name}: خطأ ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ ${page.name}: فشل الاتصال - ${error.message}`);
        }
    }
    console.log('');
}

// اختبار نقاط API
async function testApiEndpoints() {
    console.log('🔍 اختبار نقاط API للداشبورد...\n');

    for (const endpoint of apiEndpoints) {
        try {
            const response = await fetch(endpoint.url, {
                method: 'GET',
                timeout: 10000,
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ${endpoint.name}: يعمل بشكل صحيح (${Array.isArray(data) ? data.length : 'بيانات'} عنصر)`);
            } else {
                console.log(`❌ ${endpoint.name}: خطأ ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ ${endpoint.name}: فشل الاتصال - ${error.message}`);
        }
    }
    console.log('');
}

// اختبار إنشاء فعالية تجريبية
async function testCreateEvent() {
    console.log('🔍 اختبار إنشاء فعالية تجريبية...\n');

    const testEvent = {
        title: 'فعالية اختبارية',
        description: 'هذه فعالية اختبارية لفحص النظام',
        category: 'workshop',
        location: 'مركز الشباب',
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        max_attendees: 50,
        status: 'upcoming'
    };

    try {
        const response = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testEvent),
            timeout: 10000,
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ إنشاء فعالية تجريبية: نجح (ID: ${data.id})`);

            // حذف الفعالية التجريبية
            try {
                await fetch(`${API_BASE}/events/${data.id}`, {
                    method: 'DELETE',
                    timeout: 5000,
                });
                console.log(`✅ حذف الفعالية التجريبية: نجح`);
            } catch (deleteError) {
                console.log(`⚠️ تحذير: لم يتم حذف الفعالية التجريبية`);
            }
        } else {
            console.log(`❌ إنشاء فعالية تجريبية: فشل ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ إنشاء فعالية تجريبية: فشل الاتصال - ${error.message}`);
    }
    console.log('');
}

// اختبار إنشاء برنامج تجريبي
async function testCreateProgram() {
    console.log('🔍 اختبار إنشاء برنامج تجريبي...\n');

    const testProgram = {
        title: 'برنامج اختباري',
        description: 'هذا برنامج اختباري لفحص النظام',
        category: 'education',
        goal_amount: 1000,
        current_amount: 0,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
    };

    try {
        const response = await fetch(`${API_BASE}/programs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testProgram),
            timeout: 10000,
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ إنشاء برنامج تجريبي: نجح (ID: ${data.id})`);

            // حذف البرنامج التجريبي
            try {
                await fetch(`${API_BASE}/programs/${data.id}`, {
                    method: 'DELETE',
                    timeout: 5000,
                });
                console.log(`✅ حذف البرنامج التجريبي: نجح`);
            } catch (deleteError) {
                console.log(`⚠️ تحذير: لم يتم حذف البرنامج التجريبي`);
            }
        } else {
            console.log(`❌ إنشاء برنامج تجريبي: فشل ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ إنشاء برنامج تجريبي: فشل الاتصال - ${error.message}`);
    }
    console.log('');
}

// اختبار إنشاء مدونة تجريبية
async function testCreateBlog() {
    console.log('🔍 اختبار إنشاء مدونة تجريبية...\n');

    const testBlog = {
        title: 'مقال اختباري',
        content: 'هذا مقال اختباري لفحص النظام. المحتوى يجب أن يكون طويلاً بما فيه الكفاية لاختبار النظام.',
        author: 'فريق الاختبار',
        image_url: '/images/blog-logo.jpg'
    };

    try {
        const response = await fetch(`${API_BASE}/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testBlog),
            timeout: 10000,
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ إنشاء مقال تجريبي: نجح (ID: ${data.id})`);

            // حذف المقال التجريبي
            try {
                await fetch(`${API_BASE}/blogs/${data.id}`, {
                    method: 'DELETE',
                    timeout: 5000,
                });
                console.log(`✅ حذف المقال التجريبي: نجح`);
            } catch (deleteError) {
                console.log(`⚠️ تحذير: لم يتم حذف المقال التجريبي`);
            }
        } else {
            console.log(`❌ إنشاء مقال تجريبي: فشل ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ إنشاء مقال تجريبي: فشل الاتصال - ${error.message}`);
    }
    console.log('');
}

// تشغيل جميع الاختبارات
async function runAllTests() {
    console.log('🚀 بدء اختبار شامل للداشبورد...\n');

    await testApiEndpoints();
    await testDashboardPages();
    await testCreateEvent();
    await testCreateProgram();
    await testCreateBlog();

    console.log('✅ تم الانتهاء من جميع اختبارات الداشبورد!');
    console.log('📊 يرجى مراجعة النتائج أعلاه لمعرفة حالة كل قسم.');
}

runAllTests().catch(console.error);
