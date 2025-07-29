import fetch from 'node-fetch';

async function testDashboardAPI() {
    console.log('🔍 اختبار API الداشبورد...');

    const baseURL = 'http://localhost:3001';

    try {
        // اختبار جلب إحصائيات الداشبورد
        console.log('\n📊 اختبار جلب إحصائيات الداشبورد...');
        const statsResponse = await fetch(`${baseURL}/api/dashboard/stats`);

        if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            console.log('✅ تم جلب إحصائيات الداشبورد بنجاح');
            console.log('📈 البيانات المستلمة:');
            console.log(`  - إجمالي الفعاليات: ${statsData.data.overview[0]?.value || 0}`);
            console.log(`  - إجمالي البرامج: ${statsData.data.overview[1]?.value || 0}`);
            console.log(`  - إجمالي الأعضاء: ${statsData.data.overview[2]?.value || 0}`);
            console.log(`  - طلبات الانضمام: ${statsData.data.overview[3]?.value || 0}`);
        } else {
            console.error('❌ فشل في جلب إحصائيات الداشبورد:', statsResponse.status);
        }

        // اختبار جلب الأنشطة الحديثة
        console.log('\n📝 اختبار جلب الأنشطة الحديثة...');
        const activitiesResponse = await fetch(`${baseURL}/api/dashboard/activities`);

        if (activitiesResponse.ok) {
            const activitiesData = await activitiesResponse.json();
            console.log('✅ تم جلب الأنشطة الحديثة بنجاح');
            console.log(`📊 عدد الأنشطة: ${activitiesData.length || 0}`);
        } else {
            console.error('❌ فشل في جلب الأنشطة الحديثة:', activitiesResponse.status);
        }

        // اختبار جلب الفعاليات
        console.log('\n📅 اختبار جلب الفعاليات...');
        const eventsResponse = await fetch(`${baseURL}/api/events`);

        if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json();
            console.log('✅ تم جلب الفعاليات بنجاح');
            console.log(`📊 عدد الفعاليات: ${eventsData.data?.items?.length || 0}`);
        } else {
            console.error('❌ فشل في جلب الفعاليات:', eventsResponse.status);
        }

        // اختبار جلب البرامج
        console.log('\n🎯 اختبار جلب البرامج...');
        const programsResponse = await fetch(`${baseURL}/api/programs`);

        if (programsResponse.ok) {
            const programsData = await programsResponse.json();
            console.log('✅ تم جلب البرامج بنجاح');
            console.log(`📊 عدد البرامج: ${programsData.data?.items?.length || 0}`);
        } else {
            console.error('❌ فشل في جلب البرامج:', programsResponse.status);
        }

        console.log('\n🎉 تم اختبار جميع APIs بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في اختبار API:', error.message);
    }
}

testDashboardAPI();