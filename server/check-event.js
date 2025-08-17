import { getRow } from './config/database.js';

async function checkEvent() {
    try {
        console.log('🔍 فحص الفعالية رقم 5...');
        const event = await getRow('SELECT * FROM events WHERE id = 5');
        console.log('📊 نتيجة الفحص:', event);

        if (event) {
            console.log('✅ الفعالية موجودة:', {
                id: event.id,
                title: event.title,
                status: event.status
            });
        } else {
            console.log('❌ الفعالية غير موجودة');

            // فحص جميع الفعاليات المتاحة
            console.log('🔍 فحص جميع الفعاليات المتاحة...');
            const { getRows } = await import('./config/database.js');
            const allEvents = await getRows('SELECT id, title, status FROM events ORDER BY id');
            console.log('📊 الفعاليات المتاحة:', allEvents);
        }
    } catch (error) {
        console.error('❌ خطأ في الفحص:', error);
    }
}

checkEvent();
