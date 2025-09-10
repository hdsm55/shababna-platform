# إعداد التطوير المحلي

## المشاكل التي تم إصلاحها

### 1. مشكلة قاعدة البيانات

**المشكلة:** كان الخادم يحاول الاتصال بقاعدة بيانات محلية `shababna_dev` غير موجودة.

**الحل:** تم تحديث إعدادات قاعدة البيانات لاستخدام قاعدة البيانات على Render حتى في التطوير المحلي.

### 2. مشكلة ترتيب CSS

**المشكلة:** تحذير في Vite حول ترتيب `@import` في ملف CSS.

**الحل:** تم نقل `@import` إلى بداية الملف قبل قواعد Tailwind.

## إعداد متغيرات البيئة

أنشئ ملف `.env` في المجلد الجذر للمشروع مع المحتوى التالي:

```env
# Database Configuration - استخدام قاعدة البيانات على Render للتطوير
DB_HOST=dpg-d2lhhgh5pdvs73anravg-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=shababna
DB_USER=shababna_user
DB_PASSWORD=mWiirXAZ4L7jZNoG1TQOGePRaVkEZgL8

# JWT Configuration
JWT_SECRET=shababna_global_secret_key_2024_development
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Payment Gateways (Development)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
IYZICO_API_KEY=your_iyzico_api_key
IYZICO_SECRET_KEY=your_iyzico_secret_key
IYZICO_URI=https://sandbox-api.iyzipay.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=shababna.global@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=no-reply@shababna.org
EMAIL_FROM_NAME=شبابنا العالمية
EMAIL_ENABLED=false

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Client Environment Variables
VITE_API_URL=http://localhost:5000/api
```

## تشغيل المشروع

بعد إنشاء ملف `.env`، يمكنك تشغيل المشروع:

```bash
npm run dev
```

## ملاحظات مهمة

1. **قاعدة البيانات:** الآن يستخدم المشروع قاعدة البيانات على Render حتى في التطوير المحلي
2. **SSL:** تم تفعيل SSL للاتصال بقاعدة البيانات على Render
3. **الأمان:** كلمة مرور قاعدة البيانات محدثة حسب الصورة المرفقة
4. **CSS:** تم إصلاح ترتيب imports في ملف CSS

## التحقق من الإصلاحات

بعد تشغيل `npm run dev`، يجب أن ترى:

- ✅ تم الاتصال بقاعدة البيانات PostgreSQL بنجاح
- لا توجد تحذيرات CSS في Vite
- الخادم يعمل على المنفذ 5000
- العميل يعمل على المنفذ 5173
