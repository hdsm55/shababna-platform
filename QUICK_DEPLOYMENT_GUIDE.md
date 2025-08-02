# دليل النشر السريع - شبابنا العالمية

## المشاكل المحتملة والحلول

### 1. مشاكل في ملف render.yaml

✅ **تم الإصلاح**: تحديث buildCommand و startCommand للخادم الخلفي

### 2. مشاكل في متغيرات البيئة

✅ **تم الإصلاح**: إضافة DATABASE_URL في render.yaml

### 3. مشاكل في إعداد البناء

✅ **تم الإصلاح**: تحديث vite.config.ts للإنتاج

## خطوات النشر المحدثة

### 1. إعداد الخادم الخلفي (Backend)

```bash
# في Render.com Dashboard:
# 1. إنشاء Web Service جديد
# 2. ربط GitHub Repository
# 3. إعداد Environment Variables:
NODE_ENV=production
PORT=10000
DB_HOST=dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com
DB_PORT=5432
DB_NAME=shaababna_db
DB_USER=shaababna_db_user
DB_PASSWORD=vqvaeTyJS1qD1NVwurk8knW1GnUoRCna
DATABASE_URL=postgresql://shaababna_db_user:vqvaeTyJS1qD1NVwurk8knW1GnUoRCna@dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com:5432/shaababna_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CLIENT_URL=https://shababna-frontend.onrender.com
FRONTEND_URL=https://shababna-frontend.onrender.com

# Build Command:
cd server && npm install

# Start Command:
cd server && npm start
```

### 2. إعداد الواجهة الأمامية (Frontend)

```bash
# في Render.com Dashboard:
# 1. إنشاء Static Site جديد
# 2. ربط GitHub Repository
# 3. إعداد Environment Variables:
VITE_API_URL=https://shababna-backend.onrender.com/api

# Build Command:
cd client && npm install && npm run build

# Publish Directory:
client/dist
```

### 3. إعداد قاعدة البيانات

```bash
# في Render.com Dashboard:
# 1. إنشاء PostgreSQL Database
# 2. نسخ بيانات الاتصال إلى Environment Variables
```

## فحص المشاكل

### 1. فحص الخادم الخلفي

```bash
# فحص الـ logs في Render.com Dashboard
# البحث عن أخطاء في الاتصال بقاعدة البيانات
```

### 2. فحص الواجهة الأمامية

```bash
# فحص console في المتصفح
# البحث عن أخطاء في الاتصال بالـ API
```

### 3. فحص قاعدة البيانات

```bash
# فحص الاتصال بقاعدة البيانات
# التأكد من وجود الجداول المطلوبة
```

## روابط الموقع

- الخادم الخلفي: https://shababna-backend.onrender.com
- الواجهة الأمامية: https://shababna-frontend.onrender.com
- API Health Check: https://shababna-backend.onrender.com/api/health

## استكشاف الأخطاء

### إذا لم يظهر شيء:

1. فحص logs الخادم الخلفي
2. فحص console المتصفح
3. التأكد من متغيرات البيئة
4. فحص الاتصال بقاعدة البيانات

### إذا ظهرت أخطاء CORS:

1. التأكد من إعداد CORS في الخادم
2. فحص متغيرات CLIENT_URL و FRONTEND_URL

### إذا فشل البناء:

1. فحص package.json files
2. التأكد من وجود جميع dependencies
3. فحص build commands
