import { initDatabase, createTables, query, run } from './config/database-sqlite.js';

async function setupDatabase() {
    try {
        console.log('🔧 بدء إعداد قاعدة البيانات...\n');

        // 1. إنشاء الجداول
        console.log('1. إنشاء الجداول...');
        await createTables();
        console.log('✅ تم إنشاء الجداول بنجاح');

        // 2. إضافة بيانات تجريبية للفعاليات
        console.log('\n2. إضافة بيانات تجريبية للفعاليات...');
        const sampleEvents = [
            {
                title: 'ورشة تطوير المهارات القيادية',
                description: 'ورشة مكثفة لتطوير المهارات القيادية والإدارية للشباب',
                start_date: '2024-03-15',
                end_date: '2024-03-16',
                location: 'مركز الشباب - اسطنبول',
                max_attendees: 50,
                attendees: 35,
                category: 'تطوير الذات',
                status: 'upcoming'
            },
            {
                title: 'مؤتمر ريادة الأعمال',
                description: 'مؤتمر سنوي يجمع رواد الأعمال الشباب لمناقشة التحديات والفرص',
                start_date: '2024-04-20',
                end_date: '2024-04-22',
                location: 'فندق جراند - اسطنبول',
                max_attendees: 200,
                attendees: 150,
                category: 'ريادة الأعمال',
                status: 'upcoming'
            },
            {
                title: 'دورة البرمجة للمبتدئين',
                description: 'دورة شاملة لتعلم أساسيات البرمجة وتطوير التطبيقات',
                start_date: '2024-03-01',
                end_date: '2024-05-01',
                location: 'مركز التكنولوجيا - اسطنبول',
                max_attendees: 30,
                attendees: 25,
                category: 'التكنولوجيا',
                status: 'active'
            },
            {
                title: 'ملتقى الشباب العربي',
                description: 'ملتقى يجمع الشباب العرب في اسطنبول للتواصل وتبادل الخبرات',
                start_date: '2024-06-10',
                end_date: '2024-06-12',
                location: 'قاعة المؤتمرات - اسطنبول',
                max_attendees: 300,
                attendees: 0,
                category: 'التواصل',
                status: 'upcoming'
            },
            {
                title: 'ورشة التصميم الإبداعي',
                description: 'ورشة لتعلم أساسيات التصميم الجرافيكي والتصميم الرقمي',
                start_date: '2024-03-25',
                end_date: '2024-03-26',
                location: 'مركز الفنون - اسطنبول',
                max_attendees: 40,
                attendees: 28,
                category: 'الفنون',
                status: 'upcoming'
            },
            {
                title: 'ندوة التعليم في العصر الرقمي',
                description: 'ندوة لمناقشة تحديات وفرص التعليم في العصر الرقمي',
                start_date: '2024-04-05',
                end_date: '2024-04-05',
                location: 'جامعة اسطنبول',
                max_attendees: 100,
                attendees: 75,
                category: 'التعليم',
                status: 'upcoming'
            }
        ];

        for (const event of sampleEvents) {
            const existingEvent = await query('SELECT * FROM events WHERE title = ?', [event.title]);
            if (existingEvent.rows.length === 0) {
                await run(`
                    INSERT INTO events (title, description, start_date, end_date, location, max_attendees, attendees, category, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [event.title, event.description, event.start_date, event.end_date, event.location, event.max_attendees, event.attendees, event.category, event.status]);
                console.log(`✅ تم إضافة الفعالية: ${event.title}`);
            } else {
                console.log(`✅ الفعالية موجودة: ${event.title}`);
            }
        }

        // 3. إضافة بيانات تجريبية للبرامج
        console.log('\n3. إضافة بيانات تجريبية للبرامج...');
        const samplePrograms = [
            {
                title: 'برنامج تطوير المهارات الرقمية',
                description: 'برنامج شامل لتطوير المهارات الرقمية والتكنولوجية للشباب',
                category: 'التكنولوجيا',
                goal_amount: 50000,
                current_amount: 35000,
                participants_count: 45,
                start_date: '2024-03-01',
                end_date: '2024-08-01',
                status: 'active'
            },
            {
                title: 'برنامج دعم رواد الأعمال',
                description: 'برنامج لدعم وتطوير مشاريع رواد الأعمال الشباب',
                category: 'ريادة الأعمال',
                goal_amount: 100000,
                current_amount: 75000,
                participants_count: 30,
                start_date: '2024-02-01',
                end_date: '2024-12-01',
                status: 'active'
            },
            {
                title: 'برنامج التعليم المستمر',
                description: 'برنامج لتوفير فرص التعليم المستمر للشباب',
                category: 'التعليم',
                goal_amount: 30000,
                current_amount: 20000,
                participants_count: 60,
                start_date: '2024-01-01',
                end_date: '2024-06-01',
                status: 'active'
            },
            {
                title: 'برنامج التطوع المجتمعي',
                description: 'برنامج لتنظيم وتطوير العمل التطوعي في المجتمع',
                category: 'التطوع',
                goal_amount: 25000,
                current_amount: 18000,
                participants_count: 80,
                start_date: '2024-03-15',
                end_date: '2024-09-15',
                status: 'active'
            },
            {
                title: 'برنامج الفنون والإبداع',
                description: 'برنامج لتطوير المواهب الفنية والإبداعية للشباب',
                category: 'الفنون',
                goal_amount: 40000,
                current_amount: 25000,
                participants_count: 35,
                start_date: '2024-04-01',
                end_date: '2024-10-01',
                status: 'active'
            },
            {
                title: 'برنامج الصحة والرياضة',
                description: 'برنامج لتعزيز الصحة البدنية والنفسية للشباب',
                category: 'الصحة',
                goal_amount: 35000,
                current_amount: 22000,
                participants_count: 50,
                start_date: '2024-02-15',
                end_date: '2024-07-15',
                status: 'active'
            }
        ];

        for (const program of samplePrograms) {
            const existingProgram = await query('SELECT * FROM programs WHERE title = ?', [program.title]);
            if (existingProgram.rows.length === 0) {
                await run(`
                    INSERT INTO programs (title, description, category, goal_amount, current_amount, participants_count, start_date, end_date, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [program.title, program.description, program.category, program.goal_amount, program.current_amount, program.participants_count, program.start_date, program.end_date, program.status]);
                console.log(`✅ تم إضافة البرنامج: ${program.title}`);
            } else {
                console.log(`✅ البرنامج موجود: ${program.title}`);
            }
        }

        // 4. التحقق من البيانات
        console.log('\n4. التحقق من البيانات...');
        const eventsCount = await query('SELECT COUNT(*) as count FROM events');
        const programsCount = await query('SELECT COUNT(*) as count FROM programs');
        const usersCount = await query('SELECT COUNT(*) as count FROM users');

        console.log(`✅ عدد الفعاليات: ${eventsCount.rows[0].count}`);
        console.log(`✅ عدد البرامج: ${programsCount.rows[0].count}`);
        console.log(`✅ عدد المستخدمين: ${usersCount.rows[0].count}`);

        // 5. عرض عينة من البيانات
        console.log('\n5. عينة من البيانات:');

        const sampleEventsData = await query('SELECT * FROM events LIMIT 3');
        console.log('📅 الفعاليات:');
        sampleEventsData.rows.forEach((event, index) => {
            console.log(`   ${index + 1}. ${event.title} (${event.category})`);
        });

        const sampleProgramsData = await query('SELECT * FROM programs LIMIT 3');
        console.log('🎯 البرامج:');
        sampleProgramsData.rows.forEach((program, index) => {
            console.log(`   ${index + 1}. ${program.title} (${program.category})`);
        });

        console.log('\n✅ تم إعداد قاعدة البيانات بنجاح!');
        console.log('\n🔗 يمكنك الآن اختبار API:');
        console.log('   - الفعاليات: http://localhost:5001/api/events');
        console.log('   - البرامج: http://localhost:5001/api/programs');
        console.log('   - الصحة: http://localhost:5001/api/health');

    } catch (error) {
        console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
    }
}

setupDatabase();