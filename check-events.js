import { getRows } from './server/config/database.js';

async function checkEvents() {
    try {
        console.log('🔍 فحص الفعاليات في قاعدة البيانات...\n');

        const events = await getRows(`
      SELECT
        id,
        title,
        description,
        location,
        start_date,
        end_date,
        max_attendees,
        attendees,
        category,
        status,
        created_at
      FROM events
      ORDER BY created_at DESC
      LIMIT 10
    `);

        if (events.length === 0) {
            console.log('❌ لا توجد فعاليات في قاعدة البيانات');
            return;
        }

        console.log(`✅ تم العثور على ${events.length} فعالية:`);
        console.log('─'.repeat(100));

        events.forEach((event, index) => {
            console.log(`${index + 1}. ${event.title}`);
            console.log(`   📍 المكان: ${event.location}`);
            console.log(`   📅 التاريخ: ${new Date(event.start_date).toLocaleString('ar-SA')}`);
            console.log(`   👥 المسجلون: ${event.attendees}/${event.max_attendees || 'غير محدود'}`);
            console.log(`   📊 الحالة: ${event.status}`);
            console.log(`   🏷️ الفئة: ${event.category}`);
            console.log(`   📅 تم الإنشاء: ${new Date(event.created_at).toLocaleString('ar-SA')}`);
            console.log('─'.repeat(100));
        });

        // إحصائيات
        const upcomingEvents = events.filter(e => e.status === 'upcoming');
        const activeEvents = events.filter(e => e.status === 'active');
        const completedEvents = events.filter(e => e.status === 'completed');

        console.log('\n📊 إحصائيات الفعاليات:');
        console.log(`🟢 قادمة: ${upcomingEvents.length}`);
        console.log(`🔵 نشطة: ${activeEvents.length}`);
        console.log(`✅ مكتملة: ${completedEvents.length}`);

        if (upcomingEvents.length > 0) {
            console.log('\n💡 يمكنك استخدام أحد هذه الفعاليات للاختبار:');
            upcomingEvents.forEach((event, index) => {
                console.log(`${index + 1}. ${event.title} (ID: ${event.id})`);
            });
        }

    } catch (error) {
        console.error('❌ خطأ في فحص الفعاليات:', error);
    }
}

checkEvents()
    .then(() => {
        console.log('\n✅ انتهى فحص الفعاليات');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ فشل فحص الفعاليات:', error);
        process.exit(1);
    });
