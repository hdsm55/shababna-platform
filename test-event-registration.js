// اختبار تسجيل في فعالية
const API_BASE = 'https://shababna-backend.onrender.com/api';

async function testEventRegistration() {
    console.log('🧪 اختبار تسجيل في فعالية...\n');

    try {
        const eventId = 6; // فعالية "تجربة"
        const registrationData = {
            first_name: 'فاطمة',
            last_name: 'السعيد',
            email: `test.event.${Date.now()}@example.com`,
            phone: '0501234567'
        };

        console.log(`📅 الفعالية: تجربة (ID: ${eventId})`);
        console.log(`👤 المسجل: ${registrationData.first_name} ${registrationData.last_name} (${registrationData.email})`);

        const response = await fetch(`${API_BASE}/events/${eventId}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData)
        });

        const result = await response.json();

        console.log(`📊 الحالة: ${response.status}`);
        console.log(`📧 الرسالة: ${result.message}`);

        if (response.ok && result.success) {
            console.log('✅ تم التسجيل في الفعالية بنجاح');
            console.log('📧 يجب أن يصل إشعار للإدارة على: info@shaababna.com');
            console.log(`👥 عدد المسجلين الجديد: ${result.data.event.attendees}`);
        } else {
            console.log('❌ فشل في التسجيل في الفعالية');
            if (result.message) {
                console.log(`📝 السبب: ${result.message}`);
            }
        }

    } catch (error) {
        console.error('❌ خطأ في اختبار التسجيل في الفعالية:', error);
    }
}

// تشغيل الاختبار
testEventRegistration();
