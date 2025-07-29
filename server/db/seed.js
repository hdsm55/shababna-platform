import bcrypt from 'bcryptjs';
import { query, testConnection } from '../config/database.js';

async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('Database connection failed');
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash('password123', 10);
        const adminPassword = await bcrypt.hash('admin123', 10);

        console.log('Seeding users...');
        await query(`
            INSERT INTO users (name, email, password, role, created_at)
            VALUES
                ('Admin User', 'admin@shababna.com', $1, 'admin', NOW()),
                ('User One', 'user1@example.com', $2, 'user', NOW()),
                ('User Two', 'user2@example.com', $2, 'user', NOW())
        `, [adminPassword, hashedPassword]);

        console.log('Seeding events...');
        await query(`
            INSERT INTO events (title, description, start_date, end_date, location, max_attendees, attendees, category, status, created_at)
            VALUES
                ('ندوة التطوع المجتمعي', 'ندوة حول أهمية العمل التطوعي ودوره في تنمية المجتمع', '2024-03-10', '2024-03-10', 'مركز المجتمع - الرياض', 100, 75, 'seminar', 'upcoming', NOW()),
                ('دورة تدريبية في الإسعافات الأولية', 'دورة شاملة لتعلم الإسعافات الأولية الأساسية للشباب', '2024-02-25', '2024-02-25', 'مركز الصحة - جدة', 40, 30, 'training', 'upcoming', NOW()),
                ('ورشة الكتابة الإبداعية', 'تعلم فنون الكتابة الإبداعية وتطوير المهارات الأدبية', '2024-03-08', '2024-03-08', 'مركز الثقافة - الدمام', 30, 22, 'workshop', 'upcoming', NOW())
        `);

        console.log('Seeding programs...');
        await query(`
            INSERT INTO programs (title, description, category, goal_amount, current_amount, participants_count, status, start_date, end_date, created_at)
            VALUES
                ('برنامج الصحة واللياقة البدنية', 'تشجيع الشباب على ممارسة الرياضة واتباع نمط حياة صحي من خلال برامج تدريبية متنوعة', 'صحي', 25000.00, 12000.00, 89, 'active', '2024-02-01', '2024-08-31', datetime('now')),
                ('مشروع الحرف اليدوية التقليدية', 'الحفاظ على الحرف اليدوية التقليدية وتعليمها للشباب لضمان استمراريتها للأجيال القادمة', 'ثقافي', 20000.00, 8000.00, 34, 'active', '2024-03-15', '2024-09-30', datetime('now')),
                ('برنامج دعم الطلاب المتفوقين', 'دعم الطلاب المتفوقين أكاديمياً وتوفير المنح الدراسية والكتب', 'تعليمي', 60000.00, 35000.00, 67, 'active', '2024-01-01', '2024-12-31', datetime('now'))
        `);

        console.log('Database seeding completed successfully!');
        console.log('Login credentials:');
        console.log('   - Admin: admin@shababna.com / admin123');
        console.log('   - User: user1@example.com / password123');

        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
}

async function seedPrograms() {
    try {
        console.log('🌱 Seeding programs data...');

        const programs = [
            {
                title: 'برنامج تطوير المهارات التقنية',
                description: 'برنامج شامل لتعليم الشباب المهارات التقنية المطلوبة في سوق العمل',
                start_date: '2024-02-01',
                end_date: '2024-12-31'
            },
            {
                title: 'مشروع ريادة الأعمال للشباب',
                description: 'دعم الشباب في إنشاء مشاريعهم الخاصة وتطوير أفكارهم الريادية',
                start_date: '2024-01-15',
                end_date: '2024-11-30'
            },
            {
                title: 'برنامج التطوع المجتمعي',
                description: 'تشجيع الشباب على المشاركة في الأعمال التطوعية لخدمة المجتمع',
                start_date: '2024-03-01',
                end_date: '2024-10-31'
            },
            {
                title: 'مشروع دعم التعليم العالي',
                description: 'مساعدة الطلاب المتفوقين في إكمال تعليمهم العالي',
                start_date: '2024-02-15',
                end_date: '2024-12-15'
            },
            {
                title: 'برنامج الابتكار والتكنولوجيا',
                description: 'دعم المشاريع الابتكارية في مجال التكنولوجيا والذكاء الاصطناعي',
                start_date: '2024-01-01',
                end_date: '2024-12-31'
            }
        ];

        for (const program of programs) {
            await query(
                'INSERT INTO programs (title, description, start_date, end_date) VALUES ($1, $2, $3, $4)',
                [program.title, program.description, program.start_date, program.end_date]
            );
        }

        console.log('✅ Programs data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Programs seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();
seedPrograms();