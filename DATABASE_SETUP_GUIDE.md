# دليل إعداد قاعدة البيانات - شبابنا العالمية

## 🗄️ إعداد قاعدة البيانات PostgreSQL على Render.com

### الخطوة 1: إنشاء قاعدة البيانات في Render.com

1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. انقر على "New" → "PostgreSQL"
3. أدخل البيانات:
   ```
   Name: shababna-db
   Database: shaababna_db
   User: shaababna_db_user
   ```
4. انقر على "Create Database"

### الخطوة 2: نسخ بيانات الاتصال

بعد إنشاء قاعدة البيانات، انسخ بيانات الاتصال:

```
Host: dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com
Port: 5432
Database: shaababna_db
User: shaababna_db_user
Password: vqvaeTyJS1qD1NVwurk8knW1GnUoRCna
```

### الخطوة 3: إعداد متغيرات البيئة

في الخادم الخلفي (shababna-backend)، أضف هذه المتغيرات:

```env
DB_HOST=dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com
DB_PORT=5432
DB_NAME=shaababna_db
DB_USER=shaababna_db_user
DB_PASSWORD=vqvaeTyJS1qD1NVwurk8knW1GnUoRCna
DATABASE_URL=postgresql://shaababna_db_user:vqvaeTyJS1qD1NVwurk8knW1GnUoRCna@dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com:5432/shaababna_db
```

### الخطوة 4: إنشاء الجداول والبيانات

#### تشغيل إعداد قاعدة البيانات:

```bash
npm run setup:database
```

#### فحص قاعدة البيانات:

```bash
npm run check:database
```

## 📋 الجداول المطلوبة

### 1. جدول المستخدمين (users)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. جدول الأحداث (events)

```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    location VARCHAR(200),
    image_url VARCHAR(500),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. جدول البرامج (programs)

```sql
CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    category VARCHAR(100),
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. جدول المدونات (blogs)

```sql
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100),
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. جدول نماذج الاتصال (contact_forms)

```sql
CREATE TABLE contact_forms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. جدول طلبات الانضمام (join_requests)

```sql
CREATE TABLE join_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📝 البيانات التجريبية

### المستخدم التجريبي:

- Username: admin
- Email: admin@shababna.org
- Role: admin

### الأحداث التجريبية:

1. مؤتمر الشباب العربي
2. ورشة العمل التطوعية

### البرامج التجريبية:

1. برنامج القيادة الشبابية
2. برنامج التطوع المجتمعي

### المدونات التجريبية:

1. أهمية العمل التطوعي في المجتمع
2. كيف تصبح قائداً فعالاً

## 🔍 فحص قاعدة البيانات

### فحص الاتصال:

```bash
npm run check:database
```

### فحص الجداول:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

### فحص البيانات:

```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM events;
SELECT COUNT(*) FROM programs;
SELECT COUNT(*) FROM blogs;
```

## 🚨 استكشاف الأخطاء

### إذا فشل الاتصال:

1. تأكد من بيانات الاتصال الصحيحة
2. تأكد من أن قاعدة البيانات مفعلة
3. تأكد من إعدادات SSL

### إذا فشل إنشاء الجداول:

1. تأكد من صلاحيات المستخدم
2. تأكد من وجود قاعدة البيانات
3. فحص logs للأخطاء

### إذا لم تظهر البيانات:

1. تأكد من تشغيل script إدخال البيانات
2. فحص أخطاء في البيانات
3. تأكد من صحة SQL queries

## ✅ قائمة التحقق

- [ ] قاعدة البيانات منشأة في Render.com
- [ ] متغيرات البيئة محدثة
- [ ] الجداول منشأة
- [ ] البيانات التجريبية مدخلة
- [ ] الاتصال يعمل
- [ ] الخادم الخلفي يعمل مع قاعدة البيانات

## 🎯 النتيجة المتوقعة

بعد إكمال الإعداد:

- ✅ قاعدة البيانات متصلة
- ✅ جميع الجداول موجودة
- ✅ البيانات التجريبية مدخلة
- ✅ الخادم الخلفي يعمل مع قاعدة البيانات
- ✅ API endpoints تعمل بشكل صحيح

---

**📝 ملاحظة**: تأكد من إعادة نشر الخادم الخلفي بعد تحديث متغيرات البيئة.
