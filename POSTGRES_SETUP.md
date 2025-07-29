# إعداد قاعدة البيانات PostgreSQL

## الطريقة الأولى: استخدام Docker (موصى به)

### 1. تشغيل الخدمات

```bash
# تشغيل PostgreSQL و pgAdmin
npm run docker:up

# أو مباشرة
docker-compose up -d
```

### 2. إعداد قاعدة البيانات

```bash
# إعداد الجداول والبيانات
npm run db:setup-postgres
```

### 3. الوصول إلى pgAdmin

- افتح المتصفح واذهب إلى: http://localhost:5050
- بيانات تسجيل الدخول:
  - Email: admin@shababna.com
  - Password: admin123

### 4. إعداد الاتصال في pgAdmin

1. انقر على "Add New Server"
2. في تبويب General:
   - Name: Shababna DB
3. في تبويب Connection:
   - Host: postgres
   - Port: 5432
   - Database: shababna_db
   - Username: postgres
   - Password: password

## الطريقة الثانية: تثبيت PostgreSQL محلياً

### 1. تثبيت PostgreSQL

#### Windows:

- حمل من: https://www.postgresql.org/download/windows/
- أو استخدم Chocolatey: `choco install postgresql`

#### macOS:

```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu):

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. إنشاء قاعدة البيانات

```bash
# الدخول إلى PostgreSQL
sudo -u postgres psql

# إنشاء قاعدة البيانات والمستخدم
CREATE DATABASE shababna_db;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE shababna_db TO postgres;
\q
```

### 3. إعداد متغيرات البيئة

انسخ ملف `env.example` إلى `.env` وعدل الإعدادات:

```bash
cp server/env.example server/.env
```

### 4. تشغيل الإعداد

```bash
npm run db:setup-postgres
```

## تشغيل التطبيق

### 1. تشغيل الخادم

```bash
npm run dev:server
```

### 2. تشغيل الواجهة الأمامية

```bash
npm run dev:client
```

### 3. الوصول للتطبيق

- الواجهة الأمامية: http://localhost:5173
- API: http://localhost:5000/api
- pgAdmin: http://localhost:5050

## بيانات تسجيل الدخول

### التطبيق:

- Admin: admin@shababna.com / admin123
- User: user1@example.com / password123

### pgAdmin:

- Email: admin@shababna.com
- Password: admin123

## أوامر مفيدة

```bash
# تشغيل الخدمات
npm run docker:up

# إيقاف الخدمات
npm run docker:down

# عرض السجلات
npm run docker:logs

# إعادة إعداد قاعدة البيانات
npm run db:setup-postgres

# اختبار الاتصال
curl http://localhost:5000/api/health
```

## استكشاف الأخطاء

### مشكلة CORS:

تأكد من أن إعدادات CORS في `server/index.js` تشمل المنفذ الصحيح.

### مشكلة الاتصال بقاعدة البيانات:

1. تأكد من تشغيل PostgreSQL
2. تحقق من متغيرات البيئة
3. اختبر الاتصال: `npm run db:setup-postgres`

### مشكلة Docker:

```bash
# إعادة بناء الصور
docker-compose build

# حذف الحاويات وإعادة تشغيلها
docker-compose down -v
docker-compose up -d
```
