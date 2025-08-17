const { Pool } = require('pg');

// تكوين قاعدة البيانات
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/shababna_db',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testEventsAPI() {
    try {
        console.log('🔍 اختبار API الفعاليات...\n');

        // اختبار الاتصال بقاعدة البيانات
        const client = await pool.connect();
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

        // اختبار جدول الفعاليات
        const eventsResult = await client.query('SELECT * FROM events LIMIT 5');
        console.log(`📊 عدد الفعاليات في قاعدة البيانات: ${eventsResult.rows.length}`);

        if (eventsResult.rows.length > 0) {
            console.log('📋 عينة من الفعاليات:');
            eventsResult.rows.forEach((event, index) => {
                console.log(`${index + 1}. ${event.title} - ${event.category} - ${event.status}`);
            });
        } else {
            console.log('⚠️ لا توجد فعاليات في قاعدة البيانات');
        }

        // اختبار هيكل الجدول
        const tableStructure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'events'
      ORDER BY ordinal_position
    `);

        console.log('\n🏗️ هيكل جدول الفعاليات:');
        tableStructure.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });

        client.release();
        console.log('\n✅ تم اختبار API الفعاليات بنجاح');

    } catch (error) {
        console.error('❌ خطأ في اختبار API الفعاليات:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 تأكد من تشغيل قاعدة البيانات PostgreSQL');
        }
    } finally {
        await pool.end();
    }
}

testEventsAPI();

