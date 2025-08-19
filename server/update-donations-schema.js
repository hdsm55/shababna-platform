import { query } from './config/database.js';

async function updateDonationsSchema() {
    try {
        console.log('🔄 بدء تحديث جدول program_supporters...');

        // إضافة الحقول الجديدة
        const updates = [
            "ALTER TABLE program_supporters ADD COLUMN IF NOT EXISTS supporter_type VARCHAR(50) DEFAULT 'individual'",
            "ALTER TABLE program_supporters ADD COLUMN IF NOT EXISTS first_name VARCHAR(255)",
            "ALTER TABLE program_supporters ADD COLUMN IF NOT EXISTS last_name VARCHAR(255)",
            "ALTER TABLE program_supporters ADD COLUMN IF NOT EXISTS org_name VARCHAR(255)",
            "ALTER TABLE program_supporters ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255)",
            "ALTER TABLE program_supporters ADD COLUMN IF NOT EXISTS website VARCHAR(500)",
            "ALTER TABLE program_supporters ADD COLUMN IF NOT EXISTS partnership_type VARCHAR(100)"
        ];

        for (const update of updates) {
            try {
                await query(update);
                console.log('✅ تم تنفيذ:', update);
            } catch (error) {
                if (error.code === '42701') { // column already exists
                    console.log('ℹ️  الحقل موجود بالفعل:', update);
                } else {
                    console.error('❌ خطأ في:', update, error.message);
                }
            }
        }

        // تحديث البيانات الموجودة
        await query("UPDATE program_supporters SET supporter_type = 'individual' WHERE supporter_type IS NULL");
        console.log('✅ تم تحديث البيانات الموجودة');

        // إنشاء الفهارس
        const indexes = [
            "CREATE INDEX IF NOT EXISTS idx_program_supporters_type ON program_supporters(supporter_type)",
            "CREATE INDEX IF NOT EXISTS idx_program_supporters_program_id ON program_supporters(program_id)",
            "CREATE INDEX IF NOT EXISTS idx_program_supporters_status ON program_supporters(status)"
        ];

        for (const index of indexes) {
            await query(index);
            console.log('✅ تم إنشاء الفهرس:', index);
        }

        console.log('🎉 تم تحديث جدول program_supporters بنجاح!');

        // عرض هيكل الجدول المحدث
        const tableInfo = await query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'program_supporters'
            ORDER BY ordinal_position
        `);

        console.log('\n📋 هيكل الجدول المحدث:');
        tableInfo.rows.forEach(row => {
            console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? '(NULL)' : '(NOT NULL)'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
        });

    } catch (error) {
        console.error('❌ خطأ في تحديث قاعدة البيانات:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

updateDonationsSchema();
