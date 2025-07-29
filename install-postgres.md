# دليل تثبيت PostgreSQL

## الخيار الأول: تثبيت Docker Desktop

### 1. تحميل Docker Desktop

- اذهب إلى: https://www.docker.com/products/docker-desktop/
- قم بتحميل Docker Desktop for Windows
- قم بتثبيته وإعادة تشغيل الكمبيوتر

### 2. تشغيل PostgreSQL

```bash
# تشغيل PostgreSQL container
docker run -d \
  --name shababna-postgres \
  -e POSTGRES_DB=shababna \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password_here \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

## الخيار الثاني: تثبيت PostgreSQL مباشرة

### 1. تحميل PostgreSQL

- اذهب إلى: https://www.postgresql.org/download/windows/
- قم بتحميل أحدث إصدار
- قم بتثبيته مع كلمة المرور: `your_password_here`

### 2. إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
createdb -U postgres shababna

# أو باستخدام psql
psql -U postgres
CREATE DATABASE shababna;
\q
```

## الخيار الثالث: استخدام Docker Compose

### 1. تشغيل جميع الخدمات

```bash
docker-compose up -d postgres
```

### 2. التحقق من التشغيل

```bash
docker-compose ps
```

## إعداد ملف .env

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shababna
DB_USER=postgres
DB_PASSWORD=your_password_here

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Client Configuration
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

## اختبار الاتصال

```bash
# اختبار الاتصال
node -e "
import { testConnection } from './server/config/database-postgres.js';
testConnection();
"
```

## تشغيل التطبيق

```bash
# تشغيل الخادم
npm run dev:server

# تشغيل العميل
npm run dev:client
```
