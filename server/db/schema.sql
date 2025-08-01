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

-- === 1. جدول المستخدمين ===
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 2. جدول البرامج ===
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'completed',
    donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    supporter_phone VARCHAR(50),
    support_type VARCHAR(100) DEFAULT 'donation',
    message TEXT,
    amount NUMERIC(10,2),
    status VARCHAR(50) DEFAULT 'pending',
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
    phone VARCHAR(50),
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 10. جدول المتطوعين ===
CREATE TABLE IF NOT EXISTS volunteers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    age INTEGER,
    skills TEXT,
    interests TEXT,
    availability TEXT,
    motivation TEXT,
    experience TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 11. جدول ساعات التطوع ===
CREATE TABLE IF NOT EXISTS volunteer_hours (
    id SERIAL PRIMARY KEY,
    volunteer_id INTEGER REFERENCES volunteers(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
    program_id INTEGER REFERENCES programs(id) ON DELETE SET NULL,
    hours_worked NUMERIC(4,2) NOT NULL,
    date_worked DATE NOT NULL,
    description TEXT,
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === 12. إنشاء فهارس لتحسين الأداء ===
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_programs_start_date ON programs(start_date);
CREATE INDEX IF NOT EXISTS idx_donations_donated_at ON donations(donated_at);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_program_registrations_program_id ON program_registrations(program_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_hours_volunteer_id ON volunteer_hours(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_hours_date ON volunteer_hours(date_worked);

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