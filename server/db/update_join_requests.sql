-- تحديث جدول طلبات الانضمام لإضافة الحقول الجديدة
-- هذا الملف يضيف الحقول الجديدة المطلوبة لنموذج العضوية الموسع

-- إضافة الحقول الجديدة لجدول join_requests
ALTER TABLE join_requests
ADD COLUMN IF NOT EXISTS country_of_residence VARCHAR(100),
ADD COLUMN IF NOT EXISTS nationality VARCHAR(100),
ADD COLUMN IF NOT EXISTS specialization VARCHAR(255),
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS occupation VARCHAR(255),
ADD COLUMN IF NOT EXISTS marital_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS other_interests TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- تحديث الحقول الموجودة لتكون متوافقة مع المتطلبات الجديدة
-- country الحالي سيصبح country_of_residence إذا كان فارغاً
UPDATE join_requests
SET country_of_residence = country
WHERE country_of_residence IS NULL AND country IS NOT NULL;

-- إضافة فهارس للحقول الجديدة لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_join_requests_country_of_residence ON join_requests(country_of_residence);
CREATE INDEX IF NOT EXISTS idx_join_requests_nationality ON join_requests(nationality);
CREATE INDEX IF NOT EXISTS idx_join_requests_marital_status ON join_requests(marital_status);
CREATE INDEX IF NOT EXISTS idx_join_requests_specialization ON join_requests(specialization);
CREATE INDEX IF NOT EXISTS idx_join_requests_occupation ON join_requests(occupation);

-- إضافة قيود للتحقق من صحة البيانات
ALTER TABLE join_requests
ADD CONSTRAINT IF NOT EXISTS chk_marital_status
CHECK (marital_status IN ('أعزب', 'متزوج', 'مطلق', 'أرمل') OR marital_status IS NULL);

-- تحديث الحقول المطلوبة
ALTER TABLE join_requests
ALTER COLUMN country_of_residence SET NOT NULL,
ALTER COLUMN nationality SET NOT NULL,
ALTER COLUMN specialization SET NOT NULL,
ALTER COLUMN occupation SET NOT NULL,
ALTER COLUMN marital_status SET NOT NULL;

-- إضافة تعليقات للحقول الجديدة
COMMENT ON COLUMN join_requests.country_of_residence IS 'بلد الإقامة الحالي';
COMMENT ON COLUMN join_requests.nationality IS 'الجنسية';
COMMENT ON COLUMN join_requests.specialization IS 'التخصص/المجال الدراسي أو المهني';
COMMENT ON COLUMN join_requests.interests IS 'قائمة الاهتمامات المختارة';
COMMENT ON COLUMN join_requests.occupation IS 'العمل/الوظيفة الحالية';
COMMENT ON COLUMN join_requests.marital_status IS 'الحالة الاجتماعية';
COMMENT ON COLUMN join_requests.other_interests IS 'اهتمامات أخرى (نص حر)';
