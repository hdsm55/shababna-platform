// اختبار شامل لنظام الإشعارات
const API_BASE = 'https://shababna-backend.onrender.com/api';

async function testNotificationSystem() {
    console.log('🧪 اختبار شامل لنظام الإشعارات...\n');

    try {
        // 1. اختبار تسجيل عضو جديد
        console.log('1️⃣ اختبار تسجيل عضو جديد...');
        const testUser = {
            first_name: 'أحمد',
            last_name: 'محمد',
            email: `test.user.${Date.now()}@example.com`,
            password: '123456'
        };

        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testUser)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log('✅ تم تسجيل العضو بنجاح');
                console.log('📧 يجب أن يصل إشعار للإدارة على: info@shaababna.com');
                console.log(`👤 العضو الجديد: ${testUser.first_name} ${testUser.last_name} (${testUser.email})`);
            } else {
                console.log('❌ فشل في تسجيل العضو:', result.message);
            }
        } catch (error) {
            console.log('❌ خطأ في تسجيل العضو:', error.message);
        }

        // انتظار ثانية واحدة
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 2. اختبار التسجيل في فعالية
        console.log('\n2️⃣ اختبار التسجيل في فعالية...');

        // أولاً، جلب فعالية موجودة
        try {
            const eventsResponse = await fetch(`${API_BASE}/events`);
            const eventsResult = await eventsResponse.json();

            if (eventsResult.success && eventsResult.data.items.length > 0) {
                const event = eventsResult.data.items[0];
                console.log(`📅 الفعالية المختارة: ${event.title}`);

                const registrationData = {
                    first_name: 'سارة',
                    last_name: 'أحمد',
                    email: `test.event.${Date.now()}@example.com`,
                    phone: '0501234567'
                };

                const regResponse = await fetch(`${API_BASE}/events/${event.id}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(registrationData)
                });

                const regResult = await regResponse.json();

                if (regResponse.ok && regResult.success) {
                    console.log('✅ تم التسجيل في الفعالية بنجاح');
                    console.log('📧 يجب أن يصل إشعار للإدارة على: info@shaababna.com');
                    console.log(`👤 المسجل: ${registrationData.first_name} ${registrationData.last_name} (${registrationData.email})`);
                } else {
                    console.log('❌ فشل في التسجيل في الفعالية:', regResult.message);
                }
            } else {
                console.log('⚠️ لا توجد فعاليات متاحة للاختبار');
            }
        } catch (error) {
            console.log('❌ خطأ في التسجيل في الفعالية:', error.message);
        }

        // انتظار ثانية واحدة
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. اختبار نموذج الاتصال
        console.log('\n3️⃣ اختبار نموذج الاتصال...');
        const contactData = {
            first_name: 'محمد',
            last_name: 'علي',
            email: `test.contact.${Date.now()}@example.com`,
            phone: '0509876543',
            subject: 'استفسار عن البرامج',
            message: 'أرغب في معرفة المزيد عن برامج المنظمة'
        };

        try {
            const contactResponse = await fetch(`${API_BASE}/forms/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData)
            });

            const contactResult = await contactResponse.json();

            if (contactResponse.ok && contactResult.success) {
                console.log('✅ تم إرسال نموذج الاتصال بنجاح');
                console.log('📧 يجب أن يصل إشعار للإدارة على: info@shaababna.com');
                console.log(`👤 المرسل: ${contactData.first_name} ${contactData.last_name} (${contactData.email})`);
            } else {
                console.log('❌ فشل في إرسال نموذج الاتصال:', contactResult.message);
            }
        } catch (error) {
            console.log('❌ خطأ في إرسال نموذج الاتصال:', error.message);
        }

        console.log('\n🎉 انتهى اختبار نظام الإشعارات!');
        console.log('\n📋 ملخص الاختبار:');
        console.log('✅ تسجيل عضو جديد - يجب أن يصل إشعار للإدارة');
        console.log('✅ التسجيل في فعالية - يجب أن يصل إشعار للإدارة');
        console.log('✅ نموذج الاتصال - يجب أن يصل إشعار للإدارة');
        console.log('\n📧 تحقق من البريد الإلكتروني: info@shaababna.com');
        console.log('⚠️ إذا لم تصل الإشعارات - تحقق من متغيرات البيئة في Render');

    } catch (error) {
        console.error('❌ خطأ في الاختبار الشامل:', error);
    }
}

// تشغيل الاختبار
testNotificationSystem();
