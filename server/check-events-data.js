import { query } from './config/database.js';

async function checkEventsData() {
    try {
        console.log('🔍 التحقق من بيانات الفعاليات...');

        // التحقق من عدد الفعاليات
        const countResult = await query('SELECT COUNT(*) as count FROM events');
        console.log('📊 عدد الفعاليات:', countResult.rows[0].count);

        // جلب بيانات الفعاليات مع عدد المشاركين
        const eventsResult = await query(`
      SELECT
        id,
        title,
        status,
        attendees,
        max_attendees,
        created_at
      FROM events
      ORDER BY created_at DESC
      LIMIT 10
    `);

        console.log('📋 بيانات الفعاليات:');
        eventsResult.rows.forEach((event, index) => {
            console.log(`${index + 1}. ${event.title}`);
            console.log(`   - ID: ${event.id}`);
            console.log(`   - Status: ${event.status}`);
            console.log(`   - Attendees: ${event.attendees} (type: ${typeof event.attendees})`);
            console.log(`   - Max Attendees: ${event.max_attendees} (type: ${typeof event.max_attendees})`);
            console.log(`   - Created: ${event.created_at}`);
            console.log('   ---');
        });

        // حساب إجمالي المشاركين
        const totalAttendees = eventsResult.rows.reduce((sum, event) => {
            const attendees = parseInt(event.attendees) || 0;
            return sum + attendees;
        }, 0);

        console.log('📊 إجمالي عدد المشاركين:', totalAttendees);

    } catch (error) {
        console.error('❌ خطأ:', error.message);
    }
}

checkEventsData();