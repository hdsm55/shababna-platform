// ملف لاختبار البيانات في الصفحة الرئيسية
import { http } from './services/api';

export async function testHomePageData() {
    try {
        console.log('🧪 بدء اختبار بيانات الصفحة الرئيسية...\n');

        // 1. اختبار API الصحة
        console.log('1. اختبار API الصحة...');
        try {
            const healthResponse = await http.get('/health');
            console.log('✅ API الصحة يعمل:', healthResponse.data);
        } catch (error) {
            console.error('❌ API الصحة لا يعمل:', error.message);
        }

        // 2. اختبار API الفعاليات
        console.log('\n2. اختبار API الفعاليات...');
        try {
            const eventsResponse = await http.get('/events?limit=6&status=upcoming');
            console.log('✅ API الفعاليات يعمل');
            console.log('📊 عدد الفعاليات:', eventsResponse.data?.data?.items?.length || 0);
            console.log('📋 الفعاليات:', eventsResponse.data?.data?.items?.map(e => e.title) || []);
        } catch (error) {
            console.error('❌ API الفعاليات لا يعمل:', error.message);
        }

        // 3. اختبار API البرامج
        console.log('\n3. اختبار API البرامج...');
        try {
            const programsResponse = await http.get('/programs?limit=6');
            console.log('✅ API البرامج يعمل');
            console.log('📊 عدد البرامج:', programsResponse.data?.data?.items?.length || 0);
            console.log('📋 البرامج:', programsResponse.data?.data?.items?.map(p => p.title) || []);
        } catch (error) {
            console.error('❌ API البرامج لا يعمل:', error.message);
        }

        // 4. اختبار البيانات في الصفحة الرئيسية
        console.log('\n4. اختبار البيانات في الصفحة الرئيسية...');

        // محاكاة استدعاء البيانات كما في Home.tsx
        const homeEventsData = await http.get('/events?limit=6&status=upcoming');
        const homeProgramsData = await http.get('/programs?limit=6');

        const featuredEvents = homeEventsData.data?.data?.items || [];
        const featuredPrograms = homeProgramsData.data?.data?.items || [];

        console.log('📅 الفعاليات المميزة:', featuredEvents.length);
        featuredEvents.forEach((event, index) => {
            console.log(`   ${index + 1}. ${event.title} (${event.category})`);
        });

        console.log('🎯 البرامج المميزة:', featuredPrograms.length);
        featuredPrograms.forEach((program, index) => {
            console.log(`   ${index + 1}. ${program.title} (${program.category})`);
        });

        // حساب الإحصائيات
        const totalEvents = homeEventsData.data?.data?.pagination?.total || 0;
        const totalPrograms = homeProgramsData.data?.data?.total || homeProgramsData.data?.data?.items?.length || 0;
        const totalParticipants = featuredEvents.reduce((sum, event) => sum + (event.attendees || 0), 0);
        const totalProgramParticipants = featuredPrograms.reduce((sum, program) => sum + (program.participants_count || 0), 0);

        console.log('\n📊 الإحصائيات:');
        console.log(`   - إجمالي الفعاليات: ${totalEvents}`);
        console.log(`   - إجمالي البرامج: ${totalPrograms}`);
        console.log(`   - إجمالي المشاركين: ${totalParticipants + totalProgramParticipants}`);

        console.log('\n✅ تم اختبار بيانات الصفحة الرئيسية بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في اختبار البيانات:', error);
    }
}

// تشغيل الاختبار إذا تم استدعاء الملف مباشرة
if (typeof window !== 'undefined') {
    // تشغيل الاختبار في المتصفح
    window.testHomePageData = testHomePageData;
    console.log('🔧 تم تحميل اختبار البيانات. استخدم testHomePageData() في وحدة التحكم');
}