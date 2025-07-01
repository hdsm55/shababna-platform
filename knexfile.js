import dotenv from 'dotenv';
import path from 'path';

// حمّل متغيرات البيئة من ملف .env في جذر المشروع مع تفعيل التصحيح
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  debug: true
});

// طباعة لتأكد أنّ المتغيرات محمّلة فعلاً
console.log('→ loaded .env from', path.resolve(process.cwd(), '.env'));
console.log('→ DB_USER=', process.env.DB_USER);
console.log('→ DB_PASSWORD=', process.env.DB_PASSWORD);

export default {
  development: {
    client: process.env.DB_CLIENT || 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || 'shababna',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || ''
    },
    migrations: {
      directory: './server/db/migrations'
    },
    seeds: {
      directory: './server/db/seeds'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
