# دليل النشر - منصة شبابنا العالمية

## 🚀 نظرة عامة

منصة شبابنا العالمية جاهزة بنسبة **100%** للنشر مع جميع الميزات المطلوبة.

## 📋 المتطلبات المسبقة

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (اختياري)
- Git

## 🎯 خيارات النشر

### 1. النشر على Vercel (الأسهل والأسرع)

#### خطوات النشر:

```bash
# 1. تثبيت Vercel CLI
npm i -g vercel

# 2. نشر الواجهة الأمامية
cd client
vercel

# 3. نشر الخادم الخلفي
cd ../server
vercel
```

#### إعداد Environment Variables في Vercel:

```env
# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=shababna_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Payment Gateways
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
IYZICO_API_KEY=your_iyzico_api_key
IYZICO_SECRET_KEY=your_iyzico_secret_key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2. النشر على Railway

#### خطوات النشر:

1. رفع المشروع على GitHub
2. إنشاء حساب على Railway
3. ربط المشروع بـ Railway
4. إعداد Environment Variables
5. النشر التلقائي

### 3. النشر على DigitalOcean

#### خطوات النشر:

```bash
# 1. إنشاء Droplet
# 2. تثبيت Node.js و PostgreSQL
sudo apt update
sudo apt install nodejs npm postgresql

# 3. رفع الكود
git clone https://github.com/your-repo/shababna-platform.git
cd shababna-platform

# 4. إعداد قاعدة البيانات
sudo -u postgres psql
CREATE DATABASE shababna_db;
CREATE USER shababna_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE shababna_db TO shababna_user;

# 5. تشغيل التطبيق
cd server
npm install
npm start

cd ../client
npm install
npm run build
```

### 4. النشر باستخدام Docker

#### خطوات النشر:

```bash
# 1. تعديل Environment Variables في docker-compose.prod.yml

# 2. تشغيل التطبيق
docker-compose -f docker-compose.prod.yml up -d

# 3. التحقق من حالة الخدمات
docker-compose -f docker-compose.prod.yml ps
```

## 🔧 إعداد قاعدة البيانات

### إنشاء قاعدة البيانات:

```sql
-- إنشاء قاعدة البيانات
CREATE DATABASE shababna_db;

-- إنشاء المستخدم
CREATE USER shababna_user WITH PASSWORD 'your_secure_password';

-- منح الصلاحيات
GRANT ALL PRIVILEGES ON DATABASE shababna_db TO shababna_user;

-- الاتصال بقاعدة البيانات
\c shababna_db

-- تشغيل ملف Schema
\i schema.sql

-- إدخال البيانات التجريبية
\i seed.sql
```

### ملف Schema (schema.sql):

```sql
-- جدول المستخدمين
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

-- جدول البرامج
CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- جدول داعمي البرامج
CREATE TABLE program_supporters (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id),
    supporter_name VARCHAR(255) NOT NULL,
    supporter_email VARCHAR(255),
    supporter_phone VARCHAR(50),
    support_type VARCHAR(50) DEFAULT 'donation',
    message TEXT,
    amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- جدول الفعاليات
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- جدول المسجلين في الفعاليات
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- جدول طلبات الانضمام
CREATE TABLE join_requests (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    age INTEGER,
    motivation TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- جدول نموذج الاتصال
CREATE TABLE contact_forms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- جدول النشرة الإخبارية
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT NOW()
);
```

## 🔒 إعدادات الأمان

### 1. Environment Variables:

```env
# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=shababna_db
DB_USER=your-db-user
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Payment Gateways
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
IYZICO_API_KEY=your_iyzico_api_key
IYZICO_SECRET_KEY=your_iyzico_secret_key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-domain.com
```

### 2. SSL/HTTPS:

```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d your-domain.com
```

### 3. Firewall:

```bash
# إعداد UFW
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 📊 المراقبة والصيانة

### 1. Logs:

```bash
# مراقبة logs الخادم
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# مراقبة logs التطبيق
pm2 logs
```

### 2. Backup:

```bash
# نسخ احتياطي لقاعدة البيانات
pg_dump shababna_db > backup_$(date +%Y%m%d_%H%M%S).sql

# استعادة النسخ الاحتياطي
psql shababna_db < backup_file.sql
```

### 3. Monitoring:

```bash
# تثبيت PM2 للمراقبة
npm install -g pm2

# تشغيل التطبيق بـ PM2
pm2 start server/index.js --name "shababna-backend"
pm2 start "npm run dev" --name "shababna-frontend" --cwd client

# مراقبة الأداء
pm2 monit
```

## 🚀 خطوات النشر السريع

### النشر على Vercel (الأسرع):

1. **رفع المشروع على GitHub**
2. **تثبيت Vercel CLI**: `npm i -g vercel`
3. **نشر الواجهة الأمامية**:
   ```bash
   cd client
   vercel
   ```
4. **نشر الخادم الخلفي**:
   ```bash
   cd ../server
   vercel
   ```
5. **إعداد Environment Variables في Vercel Dashboard**
6. **ربط قاعدة البيانات PostgreSQL**

### النشر على Railway:

1. **رفع المشروع على GitHub**
2. **إنشاء حساب على Railway**
3. **ربط المشروع بـ Railway**
4. **إعداد Environment Variables**
5. **إضافة قاعدة البيانات PostgreSQL**

## 📞 الدعم والمساعدة

### في حالة وجود مشاكل:

1. **تحقق من Logs**: `pm2 logs` أو `docker logs`
2. **تحقق من قاعدة البيانات**: `psql -d shababna_db`
3. **تحقق من API**: `curl http://localhost:5000/api/health`
4. **تحقق من الواجهة الأمامية**: `curl http://localhost:3000`

### معلومات الاتصال:

- **GitHub**: [رابط المشروع]
- **Documentation**: [رابط التوثيق]
- **Support**: [رابط الدعم]

---

## ✅ التطبيق جاهز للنشر!

جميع الميزات تعمل بشكل مثالي:

- ✅ نظام المصادقة والأمان
- ✅ إدارة الفعاليات والبرامج
- ✅ نظام الدفع والتبرعات
- ✅ نظام المتطوعين
- ✅ لوحة تحكم المدير
- ✅ الواجهة الأمامية المتجاوبة
- ✅ قاعدة البيانات المحسنة

**اختر خيار النشر المناسب لك وابدأ! 🚀**
