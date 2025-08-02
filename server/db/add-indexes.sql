-- إضافة indexes لتحسين أداء قاعدة البيانات

-- Indexes لجدول الأحداث
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);

-- Indexes لجدول البرامج
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_created_at ON programs(created_at);

-- Indexes لجدول تسجيل الأحداث
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at ON event_registrations(created_at);

-- Indexes لجدول المستخدمين
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Indexes لجدول المدونات
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);

-- Indexes لجدول طلبات الانضمام
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON join_requests(status);
CREATE INDEX IF NOT EXISTS idx_join_requests_created_at ON join_requests(created_at);

-- Indexes لجدول نماذج الاتصال
CREATE INDEX IF NOT EXISTS idx_contact_forms_created_at ON contact_forms(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_forms_status ON contact_forms(status);

-- Composite indexes للاستعلامات المعقدة
CREATE INDEX IF NOT EXISTS idx_events_status_category ON events(status, category);
CREATE INDEX IF NOT EXISTS idx_events_start_date_status ON events(start_date, status);
CREATE INDEX IF NOT EXISTS idx_programs_status_category ON programs(status, category);

-- تحليل الإحصائيات بعد إضافة Indexes
ANALYZE events;
ANALYZE programs;
ANALYZE event_registrations;
ANALYZE users;
ANALYZE blogs;
ANALYZE join_requests;
ANALYZE contact_forms; 