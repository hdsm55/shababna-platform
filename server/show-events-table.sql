-- هيكل جدول الفعاليات
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;

-- بيانات الفعاليات الحالية
SELECT
    id,
    title,
    status,
    start_date,
    location,
    attendees,
    max_attendees
FROM events
ORDER BY created_at DESC
LIMIT 10;