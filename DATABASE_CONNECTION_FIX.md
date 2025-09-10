# إصلاح مشكلة الاتصال بقاعدة البيانات

## المشكلة الحالية
```
❌ خطأ في الاتصال بقاعدة البيانات PostgreSQL: Connection terminated unexpectedly
```

## الأسباب المحتملة

### 1. قاعدة البيانات معلقة على Render
- قد تكون قاعدة البيانات في حالة "Suspended" أو "Paused"
- **الحل:** اذهب إلى Render Dashboard وتأكد من أن قاعدة البيانات تعمل

### 2. مشكلة في Access Control
- قاعدة البيانات قد تكون مقيدة للاتصالات الخارجية
- **الحل:** تأكد من إضافة IP الخاص بك في Access Control

### 3. كلمة المرور غير صحيحة
- قد تكون كلمة المرور قد تغيرت
- **الحل:** تحقق من كلمة المرور في Render Dashboard

## خطوات الإصلاح

### الخطوة 1: تحقق من حالة قاعدة البيانات
1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. ابحث عن قاعدة البيانات `shababna-database`
3. تأكد من أن الحالة "Available" وليس "Suspended"

### الخطوة 2: تحقق من Access Control
1. في صفحة قاعدة البيانات، اذهب إلى "Access Control"
2. تأكد من وجود IP range يسمح بالاتصال من خارج الشبكة الخاصة
3. إذا لم يكن موجود، أضف: `0.0.0.0/0` (للسماح من أي مكان)

### الخطوة 3: تحقق من بيانات الاتصال
1. في صفحة قاعدة البيانات، اذهب إلى "Info"
2. انسخ بيانات الاتصال الصحيحة:
   - Hostname
   - Port
   - Database
   - Username
   - Password

### الخطوة 4: إنشاء ملف .env
أنشئ ملف `.env` في المجلد الجذر مع البيانات الصحيحة:

```env
# Database Configuration
DB_HOST=dpg-c21lhgh5pdra72anavg-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=shababna
DB_USER=shababna_user
DB_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE

# JWT Configuration
JWT_SECRET=shababna_global_secret_key_2024_development
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Client Environment Variables
VITE_API_URL=http://localhost:5000/api
```

### الخطوة 5: اختبار الاتصال
```bash
node test-db-connection.js
```

## إعدادات SSL المحدثة
تم تحديث إعدادات SSL في `server/config/database.js` لتعمل مع Render:

```javascript
ssl: {
    rejectUnauthorized: false,
    require: true
}
```

## ملاحظات مهمة
1. **كلمة المرور:** تأكد من نسخ كلمة المرور الصحيحة من Render Dashboard
2. **Access Control:** تأكد من إضافة IP range للسماح بالاتصال الخارجي
3. **حالة قاعدة البيانات:** تأكد من أن قاعدة البيانات تعمل وليست معلقة

## إذا استمرت المشكلة
1. تحقق من logs في Render Dashboard
2. تأكد من أن حساب Render نشط
3. جرب إعادة تشغيل قاعدة البيانات من Render Dashboard

---
**تاريخ الإصلاح:** 2025-01-10  
**الحالة:** 🔄 قيد الإصلاح
