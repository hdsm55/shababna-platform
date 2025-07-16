-- جدول رسائل التواصل
CREATE TABLE IF NOT EXISTS contact_forms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول طلبات الانضمام
CREATE TABLE IF NOT EXISTS join_requests (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    interests TEXT[],
    motivation TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول تسجيل البرامج
CREATE TABLE IF NOT EXISTS program_registrations (
    id SERIAL PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, user_id)
);

-- جدول تسجيل الفعاليات
CREATE TABLE IF NOT EXISTS event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- جدول دعم البرامج
CREATE TABLE IF NOT EXISTS program_supporters (
    id SERIAL PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    supporter_name VARCHAR(255) NOT NULL,
    supporter_email VARCHAR(255) NOT NULL,
    supporter_phone VARCHAR(50),
    support_type VARCHAR(100) NOT NULL, -- 'volunteer', 'donation', 'partnership'
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إضافة بيانات تجريبية لرسائل التواصل
INSERT INTO contact_forms (name, email, phone, subject, message, is_read, status) VALUES
('أحمد محمد', 'ahmed@example.com', '+966501234567', 'استفسار عن البرامج', 'أريد معرفة المزيد عن برامج التوعية الصحية المتاحة', FALSE, 'pending'),
('سارة أحمد', 'sara@example.com', '+966502345678', 'طلب معلومات', 'هل يمكنني الحصول على معلومات عن الفعاليات القادمة؟', TRUE, 'completed'),
('محمد علي', 'mohammed@example.com', '+966503456789', 'اقتراح', 'أقترح إضافة برنامج جديد للتوعية البيئية', FALSE, 'pending'),
('فاطمة حسن', 'fatima@example.com', '+966504567890', 'شكوى', 'لم أستطع التسجيل في الفعالية الأخيرة', TRUE, 'completed'),
('علي محمود', 'ali@example.com', '+966505678901', 'استفسار', 'ما هي شروط الانضمام للمنظمة؟', FALSE, 'pending');

-- إضافة بيانات تجريبية لطلبات الانضمام
INSERT INTO join_requests (first_name, last_name, email, phone, country, age, interests, motivation, status) VALUES
('أحمد', 'محمد', 'ahmed@example.com', '+966501234567', 'السعودية', 25, ARRAY['التوعية الصحية', 'التطوع'], 'أريد المساهمة في خدمة المجتمع', 'pending'),
('سارة', 'أحمد', 'sara@example.com', '+966502345678', 'السعودية', 22, ARRAY['التعليم', 'البيئة'], 'أرغب في تطوير مهاراتي وخدمة المجتمع', 'approved'),
('محمد', 'علي', 'mohammed@example.com', '+966503456789', 'السعودية', 28, ARRAY['التوعية', 'التطوع'], 'أريد الانضمام للمساهمة في البرامج المجتمعية', 'pending'),
('فاطمة', 'حسن', 'fatima@example.com', '+966504567890', 'السعودية', 24, ARRAY['الصحة', 'التعليم'], 'أرغب في المساهمة في برامج التوعية', 'approved'),
('علي', 'محمود', 'ali@example.com', '+966505678901', 'السعودية', 26, ARRAY['البيئة', 'التطوع'], 'أريد الانضمام للمساهمة في خدمة المجتمع', 'pending');

-- إضافة بيانات تجريبية لتسجيل البرامج
INSERT INTO program_registrations (program_id, user_id, status) VALUES
(1, 1, 'approved'),
(2, 1, 'pending'),
(1, 2, 'approved'),
(3, 2, 'approved'),
(2, 3, 'pending');

-- إضافة بيانات تجريبية لتسجيل الفعاليات
INSERT INTO event_registrations (event_id, user_id, status) VALUES
(1, 1, 'approved'),
(2, 1, 'pending'),
(1, 2, 'approved'),
(3, 2, 'approved'),
(2, 3, 'pending');

-- إضافة بيانات تجريبية لدعم البرامج
INSERT INTO program_supporters (program_id, supporter_name, supporter_email, supporter_phone, support_type, message, status) VALUES
(1, 'أحمد محمد', 'ahmed@example.com', '+966501234567', 'volunteer', 'أريد التطوع في برنامج التوعية الصحية', 'approved'),
(2, 'سارة أحمد', 'sara@example.com', '+966502345678', 'donation', 'أريد التبرع لبرنامج التعليم', 'pending'),
(1, 'محمد علي', 'mohammed@example.com', '+966503456789', 'partnership', 'أريد التعاون مع البرنامج', 'pending'),
(3, 'فاطمة حسن', 'fatima@example.com', '+966504567890', 'volunteer', 'أريد التطوع في برنامج البيئة', 'approved'),
(2, 'علي محمود', 'ali@example.com', '+966505678901', 'donation', 'أريد التبرع لبرنامج الشباب', 'pending');