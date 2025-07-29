import { query } from './server/config/database.js';

async function seedData() {
    console.log('🌱 بدء إضافة البيانات التجريبية...');

    try {
        // إضافة مستخدمين تجريبيين
        console.log('👥 إضافة مستخدمين تجريبيين...');
        await query(`
            INSERT INTO users (first_name, last_name, email, password, role) VALUES
            ('أحمد', 'محمد', 'ahmed@example.com', '$2b$10$example', 'admin'),
            ('فاطمة', 'علي', 'fatima@example.com', '$2b$10$example', 'user'),
            ('محمد', 'حسن', 'mohammed@example.com', '$2b$10$example', 'user'),
            ('سارة', 'أحمد', 'sara@example.com', '$2b$10$example', 'user'),
            ('علي', 'محمود', 'ali@example.com', '$2b$10$example', 'user')
            ON CONFLICT (email) DO NOTHING
        `);
        console.log('✅ تم إضافة 5 مستخدمين');

        // إضافة فعاليات تجريبية
        console.log('📅 إضافة فعاليات تجريبية...');
        await query(`
            INSERT INTO events (title, description, start_date, end_date, location, max_attendees, category) VALUES
            ('مؤتمر الشباب العربي', 'مؤتمر سنوي يجمع الشباب العربي لمناقشة قضاياهم', '2024-03-15', '2024-03-17', 'القاهرة', 200, 'مؤتمر'),
            ('ورشة البرمجة', 'ورشة تعليمية في مجال البرمجة للمبتدئين', '2024-03-20', '2024-03-20', 'الرياض', 50, 'تعليمي'),
            ('معرض الفنون', 'معرض للفنون التشكيلية للشباب الموهوبين', '2024-04-01', '2024-04-05', 'جدة', 100, 'ثقافي'),
            ('ملتقى ريادة الأعمال', 'ملتقى يجمع رواد الأعمال الشباب', '2024-04-10', '2024-04-12', 'دبي', 150, 'اقتصادي'),
            ('مخيم الشباب الصيفي', 'مخيم صيفي للشباب في الطبيعة', '2024-07-01', '2024-07-07', 'الطائف', 80, 'ترفيهي')
            ON CONFLICT DO NOTHING
        `);
        console.log('✅ تم إضافة 5 فعاليات');

        // إضافة برامج تجريبية
        console.log('🎯 إضافة برامج تجريبية...');
        await query(`
            INSERT INTO programs (title, description, category) VALUES
            ('برنامج تعليم الأطفال', 'برنامج لتعليم الأطفال في المناطق الفقيرة', 'تعليمي'),
            ('مشروع المياه النظيفة', 'توفير مياه نظيفة للقرى المحتاجة', 'إنساني'),
            ('برنامج التدريب المهني', 'تدريب الشباب على المهن المختلفة', 'تدريبي'),
            ('مشروع الطاقة الشمسية', 'تركيب ألواح شمسية للمدارس', 'بيئي'),
            ('برنامج الصحة المجتمعية', 'توعية المجتمع بأمور الصحة العامة', 'صحي')
            ON CONFLICT DO NOTHING
        `);
        console.log('✅ تم إضافة 5 برامج');

        // إضافة رسائل تواصل تجريبية
        console.log('📧 إضافة رسائل تواصل تجريبية...');
        await query(`
            INSERT INTO contact_forms (name, email, subject, message) VALUES
            ('عبدالله أحمد', 'abdullah@example.com', 'استفسار عن الفعاليات', 'أريد معرفة المزيد عن الفعاليات القادمة'),
            ('مريم سعد', 'maryam@example.com', 'طلب مشاركة', 'أريد المشاركة في برنامج تعليم الأطفال'),
            ('خالد محمد', 'khalid@example.com', 'اقتراح', 'اقتراح لتنظيم فعالية جديدة'),
            ('نورا علي', 'nora@example.com', 'استفسار', 'كيف يمكنني التطوع في البرامج؟'),
            ('يوسف حسن', 'youssef@example.com', 'شكوى', 'مشكلة في التسجيل في الفعالية')
            ON CONFLICT DO NOTHING
        `);
        console.log('✅ تم إضافة 5 رسائل تواصل');

        // إضافة طلبات انضمام تجريبية
        console.log('🤝 إضافة طلبات انضمام تجريبية...');
        await query(`
            INSERT INTO join_requests (name, email, phone, message, status) VALUES
            ('أحمد محمود', 'ahmed.m@example.com', '0501234567', 'أريد الانضمام للفريق التطوعي', 'pending'),
            ('سارة محمد', 'sara.m@example.com', '0502345678', 'لدي خبرة في مجال التعليم', 'pending'),
            ('محمد علي', 'mohammed.a@example.com', '0503456789', 'أريد المساهمة في المشاريع', 'approved'),
            ('فاطمة حسن', 'fatima.h@example.com', '0504567890', 'لدي مهارات في التصميم', 'pending'),
            ('علي أحمد', 'ali.a@example.com', '0505678901', 'أريد التطوع في الفعاليات', 'approved')
            ON CONFLICT DO NOTHING
        `);
        console.log('✅ تم إضافة 5 طلبات انضمام');

        // إضافة تسجيلات في الفعاليات
        console.log('📝 إضافة تسجيلات في الفعاليات...');
        await query(`
            INSERT INTO event_registrations (event_id, name, email, phone) VALUES
            (1, 'أحمد محمد', 'ahmed@example.com', '0501234567'),
            (1, 'فاطمة علي', 'fatima@example.com', '0502345678'),
            (2, 'محمد حسن', 'mohammed@example.com', '0503456789'),
            (3, 'سارة أحمد', 'sara@example.com', '0504567890'),
            (4, 'علي محمود', 'ali@example.com', '0505678901'),
            (5, 'نورا محمد', 'nora@example.com', '0506789012')
            ON CONFLICT DO NOTHING
        `);
        console.log('✅ تم إضافة 6 تسجيلات في الفعاليات');

        // إضافة تسجيلات في البرامج
        console.log('📋 إضافة تسجيلات في البرامج...');
        await query(`
            INSERT INTO program_registrations (program_id, name, email, phone) VALUES
            (1, 'أحمد محمد', 'ahmed@example.com', '0501234567'),
            (2, 'فاطمة علي', 'fatima@example.com', '0502345678'),
            (3, 'محمد حسن', 'mohammed@example.com', '0503456789'),
            (4, 'سارة أحمد', 'sara@example.com', '0504567890'),
            (5, 'علي محمود', 'ali@example.com', '0505678901')
            ON CONFLICT DO NOTHING
        `);
        console.log('✅ تم إضافة 5 تسجيلات في البرامج');

        // إضافة داعمين للبرامج
        console.log('💝 إضافة داعمين للبرامج...');
        await query(`
            INSERT INTO program_supporters (program_id, name, email, support_type) VALUES
            (1, 'أحمد محمد', 'ahmed@example.com', 'مالي'),
            (2, 'فاطمة علي', 'fatima@example.com', 'تطوعي'),
            (3, 'محمد حسن', 'mohammed@example.com', 'مالي'),
            (4, 'سارة أحمد', 'sara@example.com', 'تطوعي'),
            (5, 'علي محمود', 'ali@example.com', 'مالي')
            ON CONFLICT DO NOTHING
        `);
        console.log('✅ تم إضافة 5 داعمين للبرامج');

        // إضافة تبرعات تجريبية
        console.log('💰 إضافة تبرعات تجريبية...');
        await query(`
            INSERT INTO donations (donor_name, amount, program_id, payment_method) VALUES
            ('أحمد محمد', 1000, 1, 'بطاقة ائتمان'),
            ('فاطمة علي', 500, 2, 'تحويل بنكي'),
            ('محمد حسن', 2000, 3, 'بطاقة ائتمان'),
            ('سارة أحمد', 750, 4, 'تحويل بنكي'),
            ('علي محمود', 1500, 5, 'بطاقة ائتمان')
            ON CONFLICT DO NOTHING
        `);
        console.log('✅ تم إضافة 5 تبرعات');

        console.log('\n🎉 تم إضافة جميع البيانات التجريبية بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في إضافة البيانات:', error.message);
    }
}

seedData();