import fs from 'fs';
import path from 'path';

async function switchToPostgreSQL() {
    console.log('🔄 بدء تبديل قاعدة البيانات إلى PostgreSQL...');

    try {
        // 1. نسخ ملف PostgreSQL إلى database.js
        const postgresConfig = fs.readFileSync('./server/config/database-postgres.js', 'utf8');
        fs.writeFileSync('./server/config/database.js', postgresConfig);
        console.log('✅ تم نسخ إعدادات PostgreSQL');

        // 2. تحديث ملف .env
        const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shababna
DB_USER=postgres
DB_PASSWORD=123456

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
`;
        fs.writeFileSync('./.env', envContent);
        console.log('✅ تم تحديث ملف .env');

        // 3. إنشاء سكريبت إعداد PostgreSQL
        const setupPostgresContent = `import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'shababna',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
});

async function setupPostgreSQL() {
  try {
    console.log('🚀 بدء إعداد قاعدة البيانات PostgreSQL...');

    // قراءة ملف schema.sql
    const schemaPath = path.join(process.cwd(), 'server', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // تنفيذ أوامر SQL
    const client = await pool.connect();

    // إنشاء قاعدة البيانات إذا لم تكن موجودة
    try {
      await client.query('CREATE DATABASE shababna');
      console.log('✅ تم إنشاء قاعدة البيانات shababna');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('ℹ️ قاعدة البيانات موجودة بالفعل');
      } else {
        throw error;
      }
    }

    // إغلاق الاتصال وإنشاء اتصال جديد لقاعدة البيانات المحددة
    client.release();

    const dbPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: 'shababna',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '123456',
    });

    const dbClient = await dbPool.connect();

    // تنفيذ schema
    await dbClient.query(schema);
    console.log('✅ تم تنفيذ schema بنجاح');

    // إدخال بيانات تجريبية
    const seedData = \`
      INSERT INTO users (first_name, last_name, email, password, role) VALUES
      ('أحمد', 'محمد', 'admin@shababna.com', '\$2a\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
      ('فاطمة', 'علي', 'user@shababna.com', '\$2a\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user')
      ON CONFLICT (email) DO NOTHING;

      INSERT INTO events (title, description, start_date, end_date, location, max_attendees, category, status) VALUES
      ('ورشة تطوير المهارات القيادية', 'ورشة تفاعلية لتعلم المهارات القيادية الأساسية', '2024-02-15 10:00:00', '2024-02-15 16:00:00', 'مركز الشباب', 50, 'workshop', 'upcoming'),
      ('مؤتمر التكنولوجيا الحديثة', 'مؤتمر حول أحدث التطورات في مجال التكنولوجيا', '2024-03-01 09:00:00', '2024-03-01 18:00:00', 'قاعة المؤتمرات', 200, 'conference', 'upcoming')
      ON CONFLICT DO NOTHING;

      INSERT INTO programs (title, description, category, goal_amount, current_amount, start_date, end_date) VALUES
      ('برنامج تطوير الشباب', 'برنامج شامل لتطوير مهارات الشباب', 'تعليمية', 10000, 5000, '2024-01-01', '2024-12-31'),
      ('مشروع الصحة المجتمعية', 'مشروع لتحسين الصحة في المجتمع', 'صحية', 15000, 8000, '2024-01-01', '2024-12-31')
      ON CONFLICT DO NOTHING;
    \`;

    await dbClient.query(seedData);
    console.log('✅ تم إدخال البيانات التجريبية');

    dbClient.release();
    await dbPool.end();

    console.log('🎉 تم إعداد قاعدة البيانات PostgreSQL بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
  }
}

setupPostgreSQL();
`;

        fs.writeFileSync('./server/db/setup-postgres.js', setupPostgresContent);
        console.log('✅ تم إنشاء سكريبت إعداد PostgreSQL');

        console.log('\\n📋 الخطوات التالية:');
        console.log('1. تأكد من تثبيت PostgreSQL على جهازك');
        console.log('2. تأكد من تشغيل خدمة PostgreSQL');
        console.log('3. قم بتشغيل: npm run db:setup-postgres');
        console.log('4. قم بتشغيل: npm run dev');

    } catch (error) {
        console.error('❌ خطأ في تبديل قاعدة البيانات:', error);
    }
}

switchToPostgreSQL();