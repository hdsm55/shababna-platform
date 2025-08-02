-- إنشاء جدول مشتركي النشرة الإخبارية
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    country VARCHAR(100),
    interests TEXT[],
    status VARCHAR(20) DEFAULT 'active',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إضافة بيانات تجريبية
INSERT INTO newsletter_subscribers (email, first_name, last_name, phone, country, interests, status) VALUES
('ahmed@example.com', 'أحمد', 'محمد', '0500000001', 'السعودية', ARRAY['technology', 'business'], 'active'),
('fatima@example.com', 'فاطمة', 'أحمد', '0500000002', 'السعودية', ARRAY['volunteering', 'education'], 'active'),
('mohammed@example.com', 'محمد', 'علي', '0500000003', 'السعودية', ARRAY['entrepreneurship', 'innovation'], 'active'),
('noor@example.com', 'نور', 'العمري', '0500000004', 'السعودية', ARRAY['youth', 'community'], 'active'),
('khalid@example.com', 'خالد', 'الغامدي', '0500000005', 'السعودية', ARRAY['leadership', 'development'], 'active');
