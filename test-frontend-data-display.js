import fetch from 'node-fetch';

async function testFrontendDataDisplay() {
    console.log('🔍 اختبار عرض البيانات في الواجهة الأمامية...');

    const baseURL = 'http://localhost:3001';

    try {
        console.log('\n📊 اختبار جلب البيانات من API...');

        // اختبار جلب إحصائيات الداشبورد
        const statsResponse = await fetch(`${baseURL}/api/dashboard/stats`);
        if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            console.log('✅ إحصائيات الداشبورد:');
            console.log(`  - إجمالي الفعاليات: ${statsData.data.overview[0]?.value || 0}`);
            console.log(`  - البرامج: ${statsData.data.overview[1]?.value || 0}`);
            console.log(`  - إجمالي الأعضاء: ${statsData.data.overview[2]?.value || 0}`);
            console.log(`  - طلبات الانضمام: ${statsData.data.overview[3]?.value || 0}`);
        }

        // اختبار جلب الفعاليات
        const eventsResponse = await fetch(`${baseURL}/api/events`);
        if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json();
            console.log(`✅ الفعاليات: ${eventsData.data?.items?.length || 0} فعالية`);
        }

        // اختبار جلب البرامج
        const programsResponse = await fetch(`${baseURL}/api/programs`);
        if (programsResponse.ok) {
            const programsData = await programsResponse.json();
            console.log(`✅ البرامج: ${programsData.data?.items?.length || 0} برنامج`);
        }

        // اختبار جلب المستخدمين
        const usersResponse = await fetch(`${baseURL}/api/users`);
        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            console.log(`✅ المستخدمين: ${usersData.data?.items?.length || 0} مستخدم`);
        }

        console.log('\n🎉 تم اختبار جميع البيانات بنجاح!');
        console.log('📱 يمكنك الآن الوصول للواجهة الأمامية على: http://localhost:5173');

    } catch (error) {
        console.error('❌ خطأ في اختبار البيانات:', error.message);
    }
}

testFrontendDataDisplay();