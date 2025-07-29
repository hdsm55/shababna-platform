-- === 1. حذف أي جداول قديمة (إن وجدت) ===
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS program_supporters CASCADE;
DROP TABLE IF EXISTS program_registrations CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS join_requests CASCADE;
DROP TABLE IF EXISTS contact_forms CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS volunteer_hours CASCADE;
DROP TABLE IF EXISTS volunteer_certificates CASCADE;

-- === 1. جدول المستخدمين ===
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 2. جدول البرامج ===
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'عام',
    goal_amount NUMERIC(10,2) DEFAULT 0,
    current_amount NUMERIC(10,2) DEFAULT 0,
    participants_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    image_url VARCHAR(500),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 3. جدول الفعاليات ===
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    location VARCHAR(255),
    max_attendees INTEGER,
    attendees INTEGER DEFAULT 0,
    category VARCHAR(100),
    image_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 4. جدول التبرعات ===
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    donor_name VARCHAR(255) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    program_id INTEGER REFERENCES programs(id) ON DELETE SET NULL,
    payment_method VARCHAR(100),
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 5. جدول تسجيلات البرامج ===
CREATE TABLE IF NOT EXISTS program_registrations (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 6. جدول داعمي البرامج ===
CREATE TABLE IF NOT EXISTS program_supporters (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
    supporter_name VARCHAR(255) NOT NULL,
    supporter_email VARCHAR(255),
    amount NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 7. جدول تسجيلات الفعاليات ===
-- يسمح بتسجيل أي شخص (بحساب أو بدون حساب)
CREATE TABLE IF NOT EXISTS event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 8. جدول طلبات الانضمام ===
CREATE TABLE IF NOT EXISTS join_requests (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100) NOT NULL,
    age INTEGER,
    motivation TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 9. جدول رسائل التواصل ===
CREATE TABLE IF NOT EXISTS contact_forms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 10. جدول المتطوعين ===
CREATE TABLE IF NOT EXISTS volunteers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    skills TEXT,
    interests TEXT,
    availability TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relationship VARCHAR(100),
    medical_conditions TEXT,
    allergies TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 11. جدول ساعات التطوع ===
CREATE TABLE IF NOT EXISTS volunteer_hours (
    id SERIAL PRIMARY KEY,
    volunteer_id INTEGER REFERENCES volunteers(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
    program_id INTEGER REFERENCES programs(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    total_hours DECIMAL(4,2),
    activity_description TEXT,
    supervisor_name VARCHAR(255),
    supervisor_notes TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 12. جدول شهادات التطوع ===
CREATE TABLE IF NOT EXISTS volunteer_certificates (
    id SERIAL PRIMARY KEY,
    volunteer_id INTEGER REFERENCES volunteers(id) ON DELETE CASCADE,
    certificate_number VARCHAR(100) UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_hours DECIMAL(6,2),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    issued_by INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 11. جدول تسجيل رسائل البريد الإلكتروني ===
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    subject VARCHAR(500),
    email_type VARCHAR(100),
    content TEXT,
    status VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 4. جدول المقالات (المدونة) ===
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === إنشاء الفهارس لتحسين الأداء ===
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_donations_program_id ON donations(program_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_user_id ON volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_hours_volunteer_id ON volunteer_hours(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_hours_date ON volunteer_hours(date);
CREATE INDEX IF NOT EXISTS idx_volunteer_certificates_volunteer_id ON volunteer_certificates(volunteer_id);

-- === إضافة بيانات تجريبية للمتطوعين ===
INSERT INTO volunteers (user_id, first_name, last_name, email, phone, date_of_birth, gender, address, city, country, skills, interests, availability, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, status, created_at) VALUES
(1, 'أحمد', 'محمد', 'ahmed@example.com', '+966501234567', '1995-03-15', 'ذكر', 'شارع الملك فهد', 'الرياض', 'السعودية', 'التدريس,الكمبيوتر,القيادة', 'التعليم,الصحة,البيئة', 'أيام العمل من 9 صباحاً إلى 5 مساءً', 'فاطمة محمد', '+966501234568', 'أم', 'approved', NOW()),
(2, 'سارة', 'علي', 'sara@example.com', '+966502345678', '1998-07-22', 'أنثى', 'شارع التحلية', 'جدة', 'السعودية', 'التمريض,التواصل,الرعاية', 'الصحة,الأطفال,المساعدة', 'أيام العمل من 8 صباحاً إلى 4 مساءً', 'محمد علي', '+966502345679', 'أب', 'approved', NOW()),
(3, 'عمر', 'خالد', 'omar@example.com', '+966503456789', '1993-11-08', 'ذكر', 'شارع العليا', 'الدمام', 'السعودية', 'الهندسة,التصميم,البناء', 'البناء,التطوير,المشاريع', 'أيام العمل من 10 صباحاً إلى 6 مساءً', 'خديجة خالد', '+966503456790', 'أم', 'pending', NOW()),
(4, 'نور', 'حسن', 'noor@example.com', '+966504567890', '1997-01-30', 'أنثى', 'شارع الملك عبدالله', 'مكة', 'السعودية', 'التصميم,الفن,الإبداع', 'الفن,الثقافة,الإبداع', 'أيام العمل من 9 صباحاً إلى 5 مساءً', 'حسن محمد', '+966504567891', 'أب', 'approved', NOW()),
(5, 'يوسف', 'عبدالله', 'youssef@example.com', '+966505678901', '1994-09-12', 'ذكر', 'شارع الملك خالد', 'المدينة', 'السعودية', 'الطب,العلاج,الرعاية', 'الصحة,العلاج,المساعدة', 'أيام العمل من 8 صباحاً إلى 4 مساءً', 'فاطمة عبدالله', '+966505678902', 'أم', 'approved', NOW());

-- === إضافة ساعات تطوع تجريبية ===
INSERT INTO volunteer_hours (volunteer_id, event_id, program_id, date, start_time, end_time, total_hours, activity_description, supervisor_name, status) VALUES
(1, 1, NULL, '2024-01-15', '09:00:00', '12:00:00', 3.00, 'مساعدة في تنظيف الموقع', 'محمد أحمد', 'completed'),
(1, 2, NULL, '2024-01-20', '14:00:00', '17:00:00', 3.00, 'تنظيم الفعالية', 'أحمد علي', 'completed'),
(2, 1, NULL, '2024-01-15', '09:00:00', '13:00:00', 4.00, 'مساعدة في التسجيل', 'فاطمة محمد', 'completed'),
(2, 3, NULL, '2024-01-25', '10:00:00', '15:00:00', 5.00, 'مساعدة في التوزيع', 'سارة خالد', 'completed'),
(4, 2, NULL, '2024-01-20', '14:00:00', '18:00:00', 4.00, 'تصميم المواد الإعلانية', 'عمر حسن', 'completed'),
(5, 1, NULL, '2024-01-15', '08:00:00', '12:00:00', 4.00, 'الرعاية الصحية', 'د. أحمد محمد', 'completed');

-- === إضافة شهادات تطوع تجريبية ===
INSERT INTO volunteer_certificates (volunteer_id, certificate_number, title, description, total_hours, issue_date, issued_by, status) VALUES
(1, 'CERT-2024-001', 'شهادة تطوع في الخدمة المجتمعية', 'شهادة تقدير للمتطوع أحمد محمد على جهوده في خدمة المجتمع', 6.00, '2024-01-30', 1, 'active'),
(2, 'CERT-2024-002', 'شهادة تطوع في الرعاية الصحية', 'شهادة تقدير للمتطوعة سارة علي على جهودها في الرعاية الصحية', 9.00, '2024-01-30', 1, 'active'),
(4, 'CERT-2024-003', 'شهادة تطوع في الفن والإبداع', 'شهادة تقدير للمتطوعة نور حسن على جهودها في الفن والإبداع', 4.00, '2024-01-30', 1, 'active'),
(5, 'CERT-2024-004', 'شهادة تطوع في الرعاية الصحية', 'شهادة تقدير للمتطوع يوسف عبدالله على جهوده في الرعاية الصحية', 4.00, '2024-01-30', 1, 'active');