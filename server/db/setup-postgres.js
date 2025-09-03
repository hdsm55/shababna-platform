import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// إعدادات قاعدة البيانات المحلية للتطوير
const isDevelopment = process.env.NODE_ENV === 'development';

const pool = new Pool({
  host: isDevelopment ? 'localhost' : (process.env.DB_HOST || 'dpg-d2lhhgh5pdvs73anravg-a.oregon-postgres.render.com'),
  port: process.env.DB_PORT || 5432,
  database: isDevelopment ? 'postgres' : (process.env.DB_NAME || 'shababna'),
  user: isDevelopment ? 'postgres' : (process.env.DB_USER || 'shababna_user'),
  password: isDevelopment ? 'postgres' : (process.env.DB_PASSWORD || 'mWiirXAZ4L7jZNoG1TQOGePRaVkEZgL8'),
  ssl: isDevelopment ? false : {
    rejectUnauthorized: false,
    require: true
  }
});

async function setupPostgreSQL() {
  try {
    console.log('🚀 بدء إعداد قاعدة البيانات PostgreSQL...');
    console.log(`🌐 البيئة: ${isDevelopment ? 'تطوير محلي' : 'إنتاج'}`);

    // قراءة ملف schema.sql
    const schemaPath = path.join(process.cwd(), 'server', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // تنفيذ أوامر SQL
    const client = await pool.connect();

    if (isDevelopment) {
      // إنشاء قاعدة البيانات المحلية إذا لم تكن موجودة
      try {
        await client.query('CREATE DATABASE shababna_dev');
        console.log('✅ تم إنشاء قاعدة البيانات shababna_dev');
      } catch (error) {
        if (error.code === '42P04') {
          console.log('ℹ️ قاعدة البيانات shababna_dev موجودة بالفعل');
        } else {
          throw error;
        }
      }

      // إغلاق الاتصال وإنشاء اتصال جديد لقاعدة البيانات المحددة
      client.release();

      const dbPool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'shababna_dev',
        user: 'postgres',
        password: 'postgres',
        ssl: false
      });

      const dbClient = await dbPool.connect();

      // تنفيذ schema مع معالجة الأخطاء
      try {
        await dbClient.query(schema);
        console.log('✅ تم تنفيذ schema بنجاح');
      } catch (error) {
        if (error.code === '42P07') {
          console.log('ℹ️ الجداول والفهارس موجودة بالفعل');
        } else {
          throw error;
        }
      }

      // إدخال بيانات تجريبية
      const seedData = `
        INSERT INTO users (first_name, last_name, email, password, role) VALUES
        ('أحمد', 'محمد', 'admin@shababna.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
        ('فاطمة', 'علي', 'user@shababna.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user')
        ON CONFLICT (email) DO NOTHING;

        INSERT INTO events (title, description, start_date, end_date, location, max_attendees, category, status) VALUES
        ('ورشة تطوير المهارات القيادية', 'ورشة تفاعلية لتعلم المهارات القيادية الأساسية', '2024-02-15', '2024-02-15', 'مركز الشباب', 50, 'workshop', 'upcoming'),
        ('مؤتمر التكنولوجيا الحديثة', 'مؤتمر حول أحدث التطورات في مجال التكنولوجيا', '2024-03-01', '2024-03-01', 'قاعة المؤتمرات', 200, 'conference', 'upcoming')
        ON CONFLICT DO NOTHING;

        INSERT INTO programs (title, description, start_date, end_date) VALUES
        ('برنامج تطوير الشباب', 'برنامج شامل لتطوير مهارات الشباب', '2024-01-01', '2024-12-31'),
        ('مشروع الصحة المجتمعية', 'مشروع لتحسين الصحة في المجتمع', '2024-01-01', '2024-12-31')
        ON CONFLICT DO NOTHING;
      `;

      await dbClient.query(seedData);
      console.log('✅ تم إدخال البيانات التجريبية');

      dbClient.release();
      await dbPool.end();
    } else {
      // الإنتاج - استخدام قاعدة البيانات على Render
      // تنفيذ schema مع معالجة الأخطاء
      try {
        await client.query(schema);
        console.log('✅ تم تنفيذ schema بنجاح');
      } catch (error) {
        if (error.code === '42P07') {
          console.log('ℹ️ الجداول والفهارس موجودة بالفعل');
        } else {
          throw error;
        }
      }

      // إدخال بيانات تجريبية
      const seedData = `
        INSERT INTO users (first_name, last_name, email, password, role) VALUES
        ('أحمد', 'محمد', 'admin@shababna.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
        ('فاطمة', 'علي', 'user@shababna.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user')
        ON CONFLICT (email) DO NOTHING;

        INSERT INTO events (title, description, start_date, end_date, location, max_attendees, category, status) VALUES
        ('ورشة تطوير المهارات القيادية', 'ورشة تفاعلية لتعلم المهارات القيادية الأساسية', '2024-02-15', '2024-02-15', 'مركز الشباب', 50, 'workshop', 'upcoming'),
        ('مؤتمر التكنولوجيا الحديثة', 'مؤتمر حول أحدث التطورات في مجال التكنولوجيا', '2024-03-01', '2024-03-01', 'قاعة المؤتمرات', 200, 'conference', 'upcoming')
        ON CONFLICT DO NOTHING;

        INSERT INTO programs (title, description, start_date, end_date) VALUES
        ('برنامج تطوير الشباب', 'برنامج شامل لتطوير مهارات الشباب', '2024-01-01', '2024-12-31'),
        ('مشروع الصحة المجتمعية', 'مشروع لتحسين الصحة في المجتمع', '2024-01-01', '2024-12-31')
        ON CONFLICT DO NOTHING;
      `;

      await client.query(seedData);
      console.log('✅ تم إدخال البيانات التجريبية');

      client.release();
    }

    await pool.end();

    console.log('🎉 تم إعداد قاعدة البيانات PostgreSQL بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
  }
}

setupPostgreSQL();
