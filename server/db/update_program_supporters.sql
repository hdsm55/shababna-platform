-- تحديث جدول program_supporters لإضافة الحقول المطلوبة
ALTER TABLE program_supporters
ADD COLUMN IF NOT EXISTS supporter_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS support_type VARCHAR(100) DEFAULT 'donation',
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';