import { createTables, testConnection } from './config/database.js';
import { query } from './config/database.js';
import bcrypt from 'bcryptjs';

async function setupDatabase() {
    try {
        console.log('🚀 بدء إعداد قاعدة البيانات PostgreSQL...');

        // اختبار الاتصال
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('❌ فشل الاتصال بقاعدة البيانات');
            process.exit(1);
        }

        // إنشاء الجداول
        console.log('📋 إنشاء الجداول...');
        await createTables();
        console.log('✅ تم إنشاء الجداول بنجاح');

        // إضافة بيانات المستخدمين
        console.log('👥 إضافة المستخدمين...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        const adminPassword = await bcrypt.hash('admin123', 10);

        await query(`
            INSERT INTO users (name, email, password, role, created_at)
            VALUES
                ('Admin User', 'admin@shababna.com', $1, 'admin', NOW()),
                ('User One', 'user1@example.com', $2, 'user', NOW()),
                ('User Two', 'user2@example.com', $2, 'user', NOW())
            ON CONFLICT (email) DO NOTHING
        `, [adminPassword, hashedPassword]);

        // إضافة بيانات الفعاليات
        console.log('📅 إضافة الفعاليات...');
        await query(`
            INSERT INTO events (title, description, start_date, end_date, location, max_attendees, attendees, category, status, created_at)
            VALUES
                ('ورشة تطوير المهارات القيادية', 'ورشة تفاعلية لتعلم المهارات القيادية الأساسية وكيفية تطبيقها في الحياة اليومية والعمل', '2024-02-15', '2024-02-15', 'مركز الشباب - الرياض', 30, 12, 'workshop', 'upcoming', NOW()),
                ('مؤتمر الشباب العربي', 'مؤتمر سنوي يجمع الشباب العربي لمناقشة التحديات والفرص في المنطقة', '2024-03-20', '2024-03-20', 'فندق الشرق - جدة', 200, 45, 'conference', 'upcoming', NOW()),
                ('لقاء شبكة التواصل المهني', 'فرصة للتواصل مع المهنيين في مجال التكنولوجيا وتبادل الخبرات', '2024-02-28', '2024-02-28', 'مقهى الابتكار - الدمام', 50, 28, 'networking', 'upcoming', NOW()),
                ('ورشة البرمجة للمبتدئين', 'تعلم أساسيات البرمجة باستخدام Python مع مشاريع عملية', '2024-02-10', '2024-02-10', 'مركز التدريب التقني - الرياض', 40, 35, 'workshop', 'upcoming', NOW()),
                ('مؤتمر ريادة الأعمال', 'مؤتمر يسلط الضوء على قصص نجاح رواد الأعمال المحليين', '2024-01-25', '2024-01-25', 'قاعة المؤتمرات - الرياض', 150, 120, 'conference', 'upcoming', NOW()),
                ('ندوة التطوع المجتمعي', 'ندوة حول أهمية العمل التطوعي ودوره في تنمية المجتمع', '2024-03-10', '2024-03-10', 'مركز المجتمع - الرياض', 100, 75, 'seminar', 'upcoming', NOW()),
                ('دورة تدريبية في الإسعافات الأولية', 'دورة شاملة لتعلم الإسعافات الأولية الأساسية للشباب', '2024-02-25', '2024-02-25', 'مركز الصحة - جدة', 40, 30, 'training', 'upcoming', NOW()),
                ('ورشة الكتابة الإبداعية', 'تعلم فنون الكتابة الإبداعية وتطوير المهارات الأدبية', '2024-03-08', '2024-03-08', 'مركز الثقافة - الدمام', 30, 22, 'workshop', 'upcoming', NOW())
            ON CONFLICT DO NOTHING
        `);

        // إضافة بيانات البرامج
        console.log('📊 إضافة البرامج...');
        await query(`
            INSERT INTO programs (title, description, category, goal_amount, current_amount, participants_count, status, start_date, end_date, created_at)
            VALUES
                ('برنامج تطوير المهارات التقنية', 'برنامج شامل لتعليم الشباب المهارات التقنية المطلوبة في سوق العمل مثل البرمجة والتصميم والتسويق الرقمي', 'تقني', 50000.00, 25000.00, 45, 'active', '2024-02-01', '2024-12-31', NOW()),
                ('مشروع ريادة الأعمال للشباب', 'دعم الشباب في إنشاء مشاريعهم الخاصة وتطوير أفكارهم الريادية مع توفير التدريب والتمويل', 'ريادة أعمال', 75000.00, 40000.00, 32, 'active', '2024-01-15', '2024-11-30', NOW()),
                ('برنامج التطوع المجتمعي', 'تشجيع الشباب على المشاركة في الأعمال التطوعية لخدمة المجتمع وتنمية روح المسؤولية الاجتماعية', 'اجتماعي', 30000.00, 18000.00, 78, 'active', '2024-03-01', '2024-10-31', NOW()),
                ('مشروع دعم التعليم العالي', 'مساعدة الطلاب المتفوقين في إكمال تعليمهم العالي وتوفير المنح الدراسية والكتب', 'تعليمي', 100000.00, 65000.00, 120, 'active', '2024-02-15', '2024-12-15', NOW()),
                ('برنامج الابتكار والتكنولوجيا', 'دعم المشاريع الابتكارية في مجال التكنولوجيا والذكاء الاصطناعي وتطوير الحلول المستقبلية', 'تقني', 80000.00, 45000.00, 56, 'active', '2024-01-01', '2024-12-31', NOW()),
                ('برنامج الصحة واللياقة البدنية', 'تشجيع الشباب على ممارسة الرياضة واتباع نمط حياة صحي من خلال برامج تدريبية متنوعة', 'صحي', 25000.00, 12000.00, 89, 'active', '2024-02-01', '2024-08-31', NOW()),
                ('مشروع الحرف اليدوية التقليدية', 'الحفاظ على الحرف اليدوية التقليدية وتعليمها للشباب لضمان استمراريتها للأجيال القادمة', 'ثقافي', 20000.00, 8000.00, 34, 'active', '2024-03-15', '2024-09-30', NOW())
            ON CONFLICT DO NOTHING
        `);

        console.log('✅ تم إعداد قاعدة البيانات بنجاح!');
        console.log('📊 بيانات تسجيل الدخول:');
        console.log('   - Admin: admin@shababna.com / admin123');
        console.log('   - User: user1@example.com / password123');
        console.log('🌐 pgAdmin: http://localhost:5050');
        console.log('   - Email: admin@shababna.com');
        console.log('   - Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
        process.exit(1);
    }
}

setupDatabase();