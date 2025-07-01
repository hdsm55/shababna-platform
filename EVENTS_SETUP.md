# إعداد نظام الفعاليات - Shababna Platform

## الخطوات المطلوبة لإعداد نظام الفعاليات

### 1. إعداد متغيرات البيئة

قم بإنشاء ملف `.env` في مجلد `server/` مع المحتوى التالي:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shababna_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5001
NODE_ENV=development

# Client URL for CORS
CLIENT_URL=http://localhost:5173
```

وقم بإنشاء ملف `.env` في مجلد `client/` مع المحتوى التالي:

```env
VITE_API_URL=http://localhost:5001/api
```

### 2. إعداد قاعدة البيانات

#### أ. تثبيت PostgreSQL

تأكد من تثبيت PostgreSQL على جهازك.

#### ب. إنشاء قاعدة البيانات

```sql
CREATE DATABASE shababna_db;
```

#### ج. تشغيل إعداد قاعدة البيانات

```bash
npm run db:setup
```

هذا الأمر سيقوم بـ:

- إنشاء جميع الجداول المطلوبة
- إضافة البيانات التجريبية للفعاليات

### 3. تشغيل الخادم

```bash
npm run dev:server
```

### 4. تشغيل العميل

```bash
npm run dev:client
```

## الميزات المتاحة

### الباك إند (API Endpoints)

#### الفعاليات

- `GET /api/events` - جلب جميع الفعاليات مع الفلترة والترقيم
- `GET /api/events/:id` - جلب فعالية محددة
- `POST /api/events` - إنشاء فعالية جديدة (للمديرين فقط)
- `PUT /api/events/:id` - تحديث فعالية (للمديرين فقط)
- `DELETE /api/events/:id` - حذف فعالية (للمديرين فقط)

#### التسجيل في الفعاليات

- `POST /api/events/:id/register` - التسجيل في فعالية
- `GET /api/events/user/registrations` - جلب تسجيلات المستخدم
- `DELETE /api/events/:id/register` - إلغاء التسجيل

### الفرونت إند

#### صفحة الفعاليات

- عرض جميع الفعاليات مع التصميم الجميل
- فلترة حسب الفئة (ورشة، مؤتمر، شبكة تواصل)
- البحث في عنوان ووصف ومكان الفعالية
- ترقيم الصفحات
- عرض حالة الفعالية (قادمة، نشطة، مكتملة، ملغية)
- عرض عدد الحضور والحد الأقصى

#### الميزات التفاعلية

- أزرار التسجيل (معطلة للفعاليات الملغية أو المكتملة)
- عرض الوقت والتاريخ بشكل واضح
- ألوان مختلفة لكل فئة وحالة

## بنية قاعدة البيانات

### جدول الفعاليات (events)

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  max_attendees INT,
  attendees INT DEFAULT 0,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### جدول تسجيل الفعاليات (event_registrations)

```sql
CREATE TABLE event_registrations (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, event_id)
);
```

## أنواع البيانات (TypeScript)

### Event Interface

```typescript
interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  category: 'conference' | 'workshop' | 'networking';
  image?: string;
  max_attendees?: number;
  attendees: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}
```

## اختبار النظام

### 1. اختبار API

```bash
npm run test:api
```

### 2. اختبار قاعدة البيانات

```bash
# في psql
\c shababna_db
SELECT * FROM events;
SELECT * FROM event_registrations;
```

### 3. اختبار الفرونت إند

افتح المتصفح على `http://localhost:5173/events`

## استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في الاتصال بقاعدة البيانات**

   - تأكد من تشغيل PostgreSQL
   - تحقق من صحة بيانات الاتصال في ملف .env

2. **خطأ في CORS**

   - تأكد من صحة CLIENT_URL في ملف .env

3. **خطأ في JWT**

   - تأكد من وجود JWT_SECRET في ملف .env

4. **خطأ في تشغيل الخادم**
   - تأكد من عدم استخدام المنفذ 5001 من قبل تطبيق آخر

## التطوير المستقبلي

- إضافة صور للفعاليات
- إضافة نظام إشعارات
- إضافة تقويم للفعاليات
- إضافة نظام تقييم الفعاليات
- إضافة شهادات الحضور
