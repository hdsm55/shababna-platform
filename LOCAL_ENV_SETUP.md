# إعداد متغيرات البيئة للخادم المحلي

## 🚨 المشكلة الحالية

الخادم المحلي لا يحتوي على متغيرات البيئة المطلوبة لإرسال البريد الإلكتروني، مما يسبب خطأ 500 عند محاولة إرسال طلب نسيان كلمة المرور.

## 🛠️ الحل

### 1. إنشاء ملف `.env` في المجلد الجذر

أنشئ ملف `.env` في المجلد الجذر للمشروع (`C:\Users\ALWI\Downloads\شبابنا\project-2\shababna-platform\.env`) وأضف المحتوى التالي:

```env
# Database Configuration
DB_HOST=dpg-d2lhhgh5pdvs73anravg-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=shababna
DB_USER=shababna_user
DB_PASSWORD=mWiirXAZ4L7jZNoG1TQOGePRaVkEZgL8

# JWT Configuration
JWT_SECRET=shababna_global_secret_key_2024_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5174
FRONTEND_URL=http://localhost:5174

# Payment Gateways
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
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
EMAIL_ENABLED=true

# Resend Email Service (for password reset)
RESEND_API_KEY=re_RBySDSii_3rcPzpJodg8F65TVknmkSWE6
SENDER_EMAIL=info@shaababna.com
SENDER_NAME=منظمة شبابنا العالمية
RESET_LINK_BASE=http://localhost:5174/reset-password
TOKEN_TTL_MINUTES=60

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Client Environment Variables
VITE_API_URL=http://127.0.0.1:5000/api
```

### 2. إعادة تشغيل الخادم

بعد إنشاء ملف `.env`، أعد تشغيل الخادم:

```bash
# في terminal منفصل
cd server
npm run dev
```

### 3. اختبار النظام

بعد إعادة تشغيل الخادم، اختبر نظام نسيان كلمة المرور:

```bash
node test-forgot-password-local.js
```

## 📋 المتغيرات المطلوبة

- `RESEND_API_KEY`: مفتاح API لخدمة Resend
- `SENDER_EMAIL`: البريد الإلكتروني المرسل (info@shaababna.com)
- `SENDER_NAME`: اسم المرسل (منظمة شبابنا العالمية)
- `RESET_LINK_BASE`: رابط إعادة تعيين كلمة المرور
- `TOKEN_TTL_MINUTES`: مدة صلاحية التوكن (60 دقيقة)

## ⚠️ ملاحظات مهمة

1. **لا تشارك ملف `.env`** - احتفظ به محلياً فقط
2. **أعد تشغيل الخادم** بعد إضافة المتغيرات
3. **تحقق من السجلات** للتأكد من تحميل المتغيرات

## 🧪 اختبار سريع

بعد إعداد المتغيرات، يمكنك اختبار النظام:

```bash
# فحص المتغيرات
node check-env-vars.js

# اختبار نسيان كلمة المرور
node test-forgot-password-local.js
```

---

**تاريخ الإنشاء**: 26 مارس 2025
**الحالة**: ⚠️ يتطلب إعداد متغيرات البيئة
