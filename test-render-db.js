import { Pool } from 'pg';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة من render.env
dotenv.config({ path: './render.env' });

// استخدام External Database URL من Render
const DATABASE_URL = 'postgresql://shaababna_db_user:vqvaeTyJS1qD1NVwurk8knW1GnUoRCna@dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com:5432/shaababna_db';

// إنشاء pool للاتصال بقاعدة البيانات
const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // مطلوب لـ Render.com
});

// اختبار الاتصال
const testConnection = async () => {
    try {
        console.log('🔍 محاولة الاتصال بقاعدة البيانات...');
        console.log('📍 Host: dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com');
        console.log('📊 Database: shaababna_db');
        console.log('👤 User: shaababna_db_user');

        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time, version() as db_version');
        client.release();

        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!');
        console.log('🕐 الوقت الحالي:', result.rows[0].current_time);
        console.log('📋 إصدار PostgreSQL:', result.rows[0].db_version.split(' ')[0]);

        return true;
    } catch (error) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error.message);
        console.error('💡 تأكد من:');
        console.error('   - صحة كلمة المرور في render.env');
        console.error('   - تفعيل SSL في Render');
        console.error('   - صحة بيانات الاتصال');
        return false;
    } finally {
        await pool.end();
    }
};

// تشغيل الاختبار
testConnection();