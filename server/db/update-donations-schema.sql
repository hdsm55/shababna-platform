-- تحديث جدول program_supporters لدعم الحقول الجديدة
-- تشغيل هذا الملف لتحديث قاعدة البيانات الحالية

-- إضافة الحقول الجديدة إذا لم تكن موجودة
DO $$
BEGIN
    -- إضافة حقل supporter_type إذا لم يكن موجوداً
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'program_supporters' AND column_name = 'supporter_type') THEN
        ALTER TABLE program_supporters ADD COLUMN supporter_type VARCHAR(50) DEFAULT 'individual';
    END IF;

    -- إضافة حقول الأفراد إذا لم تكن موجودة
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'program_supporters' AND column_name = 'first_name') THEN
        ALTER TABLE program_supporters ADD COLUMN first_name VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'program_supporters' AND column_name = 'last_name') THEN
        ALTER TABLE program_supporters ADD COLUMN last_name VARCHAR(255);
    END IF;

    -- إضافة حقول المؤسسات إذا لم تكن موجودة
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'program_supporters' AND column_name = 'org_name') THEN
        ALTER TABLE program_supporters ADD COLUMN org_name VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'program_supporters' AND column_name = 'contact_person') THEN
        ALTER TABLE program_supporters ADD COLUMN contact_person VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'program_supporters' AND column_name = 'website') THEN
        ALTER TABLE program_supporters ADD COLUMN website VARCHAR(500);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'program_supporters' AND column_name = 'partnership_type') THEN
        ALTER TABLE program_supporters ADD COLUMN partnership_type VARCHAR(100);
    END IF;

END $$;

-- تحديث البيانات الموجودة (اختياري)
-- إذا كان هناك بيانات موجودة، يمكن تحديثها لتتناسب مع الهيكل الجديد
UPDATE program_supporters
SET supporter_type = 'individual'
WHERE supporter_type IS NULL;

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_program_supporters_type ON program_supporters(supporter_type);
CREATE INDEX IF NOT EXISTS idx_program_supporters_program_id ON program_supporters(program_id);
CREATE INDEX IF NOT EXISTS idx_program_supporters_status ON program_supporters(status);

-- رسالة تأكيد
SELECT 'تم تحديث جدول program_supporters بنجاح!' as message;
