import { query } from './config/database.js';

async function createSampleData() {
    try {
        console.log('🚀 إنشاء بيانات تجريبية للمسجلون...');

        // إنشاء مستخدمين تجريبيين
        console.log('👥 إنشاء مستخدمين تجريبيين...');
        const users = [
            {
                first_name: 'أحمد',
                last_name: 'محمد علي',
                email: 'ahmed@example.com',
                role: 'member'
            },
            {
                first_name: 'فاطمة',
                last_name: 'أحمد السعيد',
                email: 'fatima@example.com',
                role: 'member'
            },
            {
                first_name: 'محمد',
                last_name: 'عبدالله القحطاني',
                email: 'mohammed@example.com',
                role: 'volunteer'
            }
        ];

        for (const user of users) {
            await query(`
        INSERT INTO users (first_name, last_name, email, password, role, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (email) DO NOTHING
      `, [user.first_name, user.last_name, user.email, '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', user.role]);
        }

        // إنشاء تسجيلات فعاليات تجريبية
        console.log('📅 إنشاء تسجيلات فعاليات تجريبية...');
        const eventRegistrations = [
            {
                first_name: 'سارة',
                last_name: 'أحمد المطيري',
                email: 'sara@example.com',
                phone: '+966501111111',
                event_id: 6 // الفعالية الموجودة
            },
            {
                first_name: 'خالد',
                last_name: 'محمد الشمري',
                email: 'khalid@example.com',
                phone: '+966502222222',
                event_id: 6
            },
            {
                first_name: 'نورا',
                last_name: 'عبدالرحمن العتيبي',
                email: 'nora@example.com',
                phone: '+966503333333',
                event_id: 6
            }
        ];

        for (const reg of eventRegistrations) {
            await query(`
        INSERT INTO event_registrations (first_name, last_name, email, phone, event_id, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
      `, [reg.first_name, reg.last_name, reg.email, reg.phone, reg.event_id]);
        }

        // استخدام برنامج موجود
        console.log('🎯 البحث عن برنامج موجود...');
        const existingProgram = await query('SELECT id FROM programs LIMIT 1');
        const programId = existingProgram.rows[0]?.id;

        if (programId) {
            // إنشاء داعمي برامج تجريبيين
            console.log('💝 إنشاء داعمي برامج تجريبيين...');
            const supporters = [
                {
                    supporter_name: 'أحمد علي القحطاني',
                    supporter_email: 'ahmed.supporter@example.com',
                    supporter_phone: '+966506666666',
                    program_id: programId,
                    support_type: 'donation',
                    amount: 500,
                    status: 'completed',
                    message: 'دعم مالي للبرنامج'
                },
                {
                    supporter_name: 'فاطمة محمد الشمري',
                    supporter_email: 'fatima.supporter@example.com',
                    supporter_phone: '+966507777777',
                    program_id: programId,
                    support_type: 'donation',
                    amount: 1000,
                    status: 'pending',
                    message: 'دعم مالي للبرنامج'
                }
            ];

            for (const supporter of supporters) {
                await query(`
          INSERT INTO program_supporters (supporter_name, supporter_email, supporter_phone, program_id, support_type, amount, status, message, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        `, [supporter.supporter_name, supporter.supporter_email, supporter.supporter_phone, supporter.program_id, supporter.support_type, supporter.amount, supporter.status, supporter.message]);
            }
        }

        console.log('✅ تم إنشاء البيانات التجريبية بنجاح!');

        // عرض إحصائيات البيانات
        const usersCount = await query('SELECT COUNT(*) as count FROM users');
        const eventsCount = await query('SELECT COUNT(*) as count FROM event_registrations');
        const supportersCount = await query('SELECT COUNT(*) as count FROM program_supporters');

        console.log('\n📊 إحصائيات البيانات:');
        console.log(`👥 المستخدمون: ${usersCount.rows[0].count}`);
        console.log(`📅 تسجيلات الفعاليات: ${eventsCount.rows[0].count}`);
        console.log(`💝 داعمو البرامج: ${supportersCount.rows[0].count}`);

    } catch (error) {
        console.error('❌ خطأ في إنشاء البيانات التجريبية:', error);
    }
}

createSampleData();
