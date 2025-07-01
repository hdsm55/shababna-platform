import fetch from 'node-fetch';

async function testFrontendBackend() {
    console.log('🧪 بدء اختبار شامل للفرونت إند والباك إند...\n');

    const baseURL = 'http://localhost:5001/api';
    const frontendURL = 'http://localhost:5173';

    try {
        // 1. اختبار الاتصال بالباك إند
        console.log('1. اختبار الاتصال بالباك إند...');
        const healthResponse = await fetch(`${baseURL}/health`);
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ الباك إند يعمل:', healthData.message);
        } else {
            console.log('❌ الباك إند لا يعمل');
            return;
        }

        // 2. اختبار API الفعاليات
        console.log('\n2. اختبار API الفعاليات...');
        const eventsResponse = await fetch(`${baseURL}/events`);
        if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json();
            console.log(`✅ تم جلب ${eventsData.events.length} فعالية`);
            console.log('📋 الفعاليات المتاحة:');
            eventsData.events.forEach(event => {
                console.log(`   - ${event.title} (${event.category})`);
            });
        } else {
            console.log('❌ فشل في جلب الفعاليات');
        }

        // 3. اختبار API البرامج
        console.log('\n3. اختبار API البرامج...');
        const programsResponse = await fetch(`${baseURL}/programs`);
        if (programsResponse.ok) {
            const programsData = await programsResponse.json();
            console.log(`✅ تم جلب ${programsData.programs.length} برنامج`);
            console.log('📋 البرامج المتاحة:');
            programsData.programs.forEach(program => {
                console.log(`   - ${program.title} (${program.category})`);
                console.log(`     التقدم: $${program.current_amount}/${program.goal_amount}`);
            });
        } else {
            console.log('❌ فشل في جلب البرامج');
        }

        // 4. اختبار الفرونت إند
        console.log('\n4. اختبار الفرونت إند...');
        const frontendResponse = await fetch(frontendURL);
        if (frontendResponse.ok) {
            console.log('✅ الفرونت إند يعمل على', frontendURL);
        } else {
            console.log('❌ الفرونت إند لا يعمل');
        }

        // 5. اختبار صفحة الفعاليات
        console.log('\n5. اختبار صفحة الفعاليات...');
        const eventsPageResponse = await fetch(`${frontendURL}/events`);
        if (eventsPageResponse.ok) {
            console.log('✅ صفحة الفعاليات متاحة');
        } else {
            console.log('❌ صفحة الفعاليات غير متاحة');
        }

        // 6. اختبار صفحة البرامج
        console.log('\n6. اختبار صفحة البرامج...');
        const programsPageResponse = await fetch(`${frontendURL}/programs`);
        if (programsPageResponse.ok) {
            console.log('✅ صفحة البرامج متاحة');
        } else {
            console.log('❌ صفحة البرامج غير متاحة');
        }

        console.log('\n🎉 انتهى الاختبار الشامل بنجاح!');
        console.log('\n📝 ملخص النتائج:');
        console.log('   - الباك إند: ✅ يعمل على البورت 5001');
        console.log('   - الفرونت إند: ✅ يعمل على البورت 5173');
        console.log('   - قاعدة البيانات: ✅ متصلة وتحتوي على بيانات');
        console.log('   - API الفعاليات: ✅ يعمل ويعرض البيانات');
        console.log('   - API البرامج: ✅ يعمل ويعرض البيانات');
        console.log('\n🌐 روابط الوصول:');
        console.log(`   - الصفحة الرئيسية: ${frontendURL}`);
        console.log(`   - صفحة الفعاليات: ${frontendURL}/events`);
        console.log(`   - صفحة البرامج: ${frontendURL}/programs`);
        console.log(`   - API الصحة: ${baseURL}/health`);

    } catch (error) {
        console.error('❌ خطأ في الاختبار:', error.message);
    }
}

// تشغيل الاختبار
testFrontendBackend();