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
            INSERT INTO users (email, password, first_name, last_name, role, created_at)
            VALUES
                ('admin@shababna.com', $1, 'Admin', 'User', 'admin', NOW()),
                ('user1@example.com', $2, 'User', 'One', 'user', NOW()),
                ('user2@example.com', $2, 'User', 'Two', 'user', NOW())
        `, [adminPassword, hashedPassword]);

        console.log('Seeding events...');
        await query(`
            INSERT INTO events (title, description, event_date, location, created_at)
            VALUES
                ('Islamic Lecture', 'Valuable lecture on Quran interpretation', '2024-02-15', 'Masjid Al-Noor - Riyadh', NOW()),
                ('Quran Memorization Course', 'Intensive course for beginners', '2024-02-20', 'Quran Center - Jeddah', NOW()),
                ('Youth Islamic Camp', 'Summer camp with sports and spiritual activities', '2024-03-01', 'Green Mountain Resort - Taif', NOW())
        `);

        console.log('Seeding programs...');
        await query(`
            INSERT INTO programs (title, description, start_date, end_date, created_at)
            VALUES
                ('Build Mosque in Remote Village', 'Project to build mosque in poor village', '2024-01-01', '2024-06-30', NOW()),
                ('Orphan Sponsorship', 'Program to sponsor orphans for education and healthcare', '2024-01-15', '2024-12-31', NOW()),
                ('Distribute Quran Copies', 'Project to distribute Quran and Islamic books', '2024-02-01', '2024-05-31', NOW())
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
                category: 'education',
                goal_amount: 50000.00,
                current_amount: 15000.00,
                start_date: '2024-02-01 00:00:00',
                end_date: '2024-12-31 23:59:59'
            },
            {
                title: 'مشروع ريادة الأعمال للشباب',
                description: 'دعم الشباب في إنشاء مشاريعهم الخاصة وتطوير أفكارهم الريادية',
                category: 'entrepreneurship',
                goal_amount: 100000.00,
                current_amount: 35000.00,
                start_date: '2024-01-15 00:00:00',
                end_date: '2024-11-30 23:59:59'
            },
            {
                title: 'برنامج التطوع المجتمعي',
                description: 'تشجيع الشباب على المشاركة في الأعمال التطوعية لخدمة المجتمع',
                category: 'volunteering',
                goal_amount: 25000.00,
                current_amount: 8000.00,
                start_date: '2024-03-01 00:00:00',
                end_date: '2024-10-31 23:59:59'
            },
            {
                title: 'مشروع دعم التعليم العالي',
                description: 'مساعدة الطلاب المتفوقين في إكمال تعليمهم العالي',
                category: 'education',
                goal_amount: 75000.00,
                current_amount: 22000.00,
                start_date: '2024-02-15 00:00:00',
                end_date: '2024-12-15 23:59:59'
            },
            {
                title: 'برنامج الابتكار والتكنولوجيا',
                description: 'دعم المشاريع الابتكارية في مجال التكنولوجيا والذكاء الاصطناعي',
                category: 'technology',
                goal_amount: 150000.00,
                current_amount: 45000.00,
                start_date: '2024-01-01 00:00:00',
                end_date: '2024-12-31 23:59:59'
            }
        ];

        for (const program of programs) {
            await query(
                'INSERT INTO programs (title, description, category, goal_amount, current_amount, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [program.title, program.description, program.category, program.goal_amount, program.current_amount, program.start_date, program.end_date]
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