import { query } from './config/database.js';

const addSampleEvents = async () => {
    try {
        console.log('🚀 بدء إضافة البيانات التجريبية للفعاليات...');

        // حذف البيانات القديمة
        await query('TRUNCATE TABLE events RESTART IDENTITY CASCADE');
        console.log('✅ تم حذف البيانات القديمة');

        // إضافة فعاليات تجريبية
        const events = [
            {
                title: 'ورشة تطوير المهارات القيادية',
                description: 'ورشة تفاعلية لتعلم المهارات القيادية الأساسية وكيفية تطبيقها في الحياة اليومية والعمل',
                start_date: '2024-12-15',
                end_date: '2024-12-15',
                location: 'مركز الشباب - الرياض',
                max_attendees: 30,
                category: 'workshop',
                status: 'upcoming'
            },
            {
                title: 'مؤتمر الشباب العربي',
                description: 'مؤتمر سنوي يجمع الشباب العربي لمناقشة التحديات والفرص في المنطقة',
                start_date: '2024-12-20',
                end_date: '2024-12-20',
                location: 'فندق الشرق - جدة',
                max_attendees: 200,
                category: 'conference',
                status: 'upcoming'
            },
            {
                title: 'لقاء شبكة التواصل المهني',
                description: 'فرصة للتواصل مع المهنيين في مجال التكنولوجيا وتبادل الخبرات',
                start_date: '2024-12-25',
                end_date: '2024-12-25',
                location: 'مقهى الابتكار - الدمام',
                max_attendees: 50,
                category: 'networking',
                status: 'upcoming'
            },
            {
                title: 'ورشة البرمجة للمبتدئين',
                description: 'تعلم أساسيات البرمجة باستخدام Python مع مشاريع عملية',
                start_date: '2024-12-30',
                end_date: '2024-12-30',
                location: 'مركز التدريب التقني - الرياض',
                max_attendees: 40,
                category: 'workshop',
                status: 'upcoming'
            },
            {
                title: 'مؤتمر ريادة الأعمال',
                description: 'مؤتمر يسلط الضوء على قصص نجاح رواد الأعمال المحليين',
                start_date: '2025-01-05',
                end_date: '2025-01-05',
                location: 'قاعة المؤتمرات - الرياض',
                max_attendees: 150,
                category: 'conference',
                status: 'upcoming'
            }
        ];

        for (const event of events) {
            await query(`
                INSERT INTO events (title, description, start_date, end_date, location, max_attendees, category, status, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            `, [
                event.title,
                event.description,
                event.start_date,
                event.end_date,
                event.location,
                event.max_attendees,
                event.category,
                event.status
            ]);
        }

        console.log('✅ تم إضافة البيانات التجريبية بنجاح');
        console.log(`📊 تم إضافة ${events.length} فعالية`);

    } catch (error) {
        console.error('❌ خطأ في إضافة البيانات التجريبية:', error);
    }
};

// تشغيل السكريبت
addSampleEvents();