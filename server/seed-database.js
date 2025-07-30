import { query } from './config/database.js';

async function seedDatabase() {
    try {
        console.log('🌱 بدء إضافة البيانات التجريبية...');

        // إضافة بيانات تجريبية للفعاليات
        const events = [
            {
                title: 'ورشة تطوير المهارات القيادية',
                description: 'ورشة تفاعلية لتعلم المهارات القيادية الأساسية وكيفية تطبيقها في الحياة اليومية والعمل',
                start_date: '2024-02-15',
                end_date: '2024-02-15',
                location: 'مركز الشباب - الرياض',
                max_attendees: 30,
                attendees: 0,
                category: 'workshop',
                status: 'upcoming'
            },
            {
                title: 'مؤتمر الشباب العربي',
                description: 'مؤتمر سنوي يجمع الشباب العربي لمناقشة التحديات والفرص في المنطقة',
                start_date: '2024-03-20',
                end_date: '2024-03-20',
                location: 'فندق الشرق - جدة',
                max_attendees: 200,
                attendees: 0,
                category: 'conference',
                status: 'upcoming'
            },
            {
                title: 'لقاء شبكة التواصل المهني',
                description: 'فرصة للتواصل مع المهنيين في مجال التكنولوجيا وتبادل الخبرات',
                start_date: '2024-02-28',
                end_date: '2024-02-28',
                location: 'مقهى الابتكار - الدمام',
                max_attendees: 50,
                attendees: 0,
                category: 'networking',
                status: 'upcoming'
            },
            {
                title: 'ورشة البرمجة للمبتدئين',
                description: 'تعلم أساسيات البرمجة باستخدام Python مع مشاريع عملية',
                start_date: '2024-02-10',
                end_date: '2024-02-10',
                location: 'مركز التدريب التقني - الرياض',
                max_attendees: 40,
                attendees: 0,
                category: 'workshop',
                status: 'upcoming'
            },
            {
                title: 'مؤتمر ريادة الأعمال',
                description: 'مؤتمر يسلط الضوء على قصص نجاح رواد الأعمال المحليين',
                start_date: '2024-01-25',
                end_date: '2024-01-25',
                location: 'قاعة المؤتمرات - الرياض',
                max_attendees: 150,
                attendees: 0,
                category: 'conference',
                status: 'upcoming'
            }
        ];

        for (const event of events) {
            await query(`
        INSERT INTO events (title, description, start_date, end_date, location, max_attendees, attendees, category, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      `, [event.title, event.description, event.start_date, event.end_date, event.location, event.max_attendees, event.attendees, event.category, event.status]);
        }

        console.log('✅ تم إضافة البيانات التجريبية بنجاح!');

        // عرض عدد الفعاليات المضافة
        const count = await query('SELECT COUNT(*) as count FROM events');
        console.log('📊 عدد الفعاليات في قاعدة البيانات:', count.rows[0].count);

    } catch (error) {
        console.error('❌ خطأ في إضافة البيانات التجريبية:', error);
    }
}

seedDatabase();