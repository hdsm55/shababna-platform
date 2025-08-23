# دليل النشر على Render

## المشكلة المكتشفة

كان هناك تضارب في أسماء الخدمات وعناوين URL بين Frontend و Backend.

## الحل المطبق

### 1. تحديث أسماء الخدمات

- **Frontend**: `shababna-platform-frontend`
- **Backend**: `shababna-platform-backend`

### 2. عناوين URL المحدثة

- **Frontend URL**: `https://shababna-platform-frontend.onrender.com`
- **Backend URL**: `https://shababna-platform-backend.onrender.com`

## خطوات النشر

### 1. نشر Backend

```bash
# في Render Dashboard:
# - إنشاء Web Service جديد
# - اختيار مجلد server/
# - استخدام server/render.yaml
# - أو إعداد يدوي:
```

**إعدادات Backend:**

- **Name**: `shababna-platform-backend`
- **Environment**: `Node`
- **Build Command**: `npm ci`
- **Start Command**: `npm start`
- **Root Directory**: `server`

**متغيرات البيئة المطلوبة:**

```
NODE_ENV=production
PORT=10000
DB_HOST=dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com
DB_PORT=5432
DB_NAME=shaababna_db
DB_USER=shaababna_db_user
DB_PASSWORD=vqvaeTyJS1qD1NVwurk8knW1GnUoRCna
JWT_SECRET=[سيتم إنشاؤه تلقائياً]
JWT_EXPIRES_IN=7d
CLIENT_URL=https://shababna-platform-frontend.onrender.com
FRONTEND_URL=https://shababna-platform-frontend.onrender.com
```

### 2. نشر Frontend

```bash
# في Render Dashboard:
# - إنشاء Static Site جديد
# - اختيار مجلد client/
# - استخدام client/render.yaml
# - أو إعداد يدوي:
```

**إعدادات Frontend:**

- **Name**: `shababna-platform-frontend`
- **Environment**: `Static Site`
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`
- **Root Directory**: `client`

**متغيرات البيئة المطلوبة:**

```
NODE_ENV=production
VITE_API_URL=https://shababna-platform-backend.onrender.com/api
VITE_PRODUCTION_API_URL=https://shababna-platform-backend.onrender.com/api
```

## 3. التحقق من النشر

### اختبار Backend:

```bash
curl https://shababna-platform-backend.onrender.com/api/health
```

### اختبار Frontend:

- زيارة: `https://shababna-platform-frontend.onrender.com`
- التأكد من تحميل الصفحة الرئيسية
- اختبار تسجيل الدخول

## 4. إعدادات إضافية

### في Render Dashboard:

1. تأكد من تشغيل Backend أولاً
2. انتظر حتى يصبح Backend متاحاً
3. ثم انشر Frontend
4. تأكد من أن متغيرات البيئة محددة بشكل صحيح

### مشاكل شائعة وحلولها:

#### مشكلة CORS:

- تأكد من أن Frontend URL مضاف إلى قائمة CORS في Backend
- تحقق من متغيرات CLIENT_URL و FRONTEND_URL

#### مشكلة API Calls:

- تأكد من أن VITE_API_URL يشير إلى Backend الصحيح
- تحقق من أن Backend يعمل ويستجيب على /api/health

#### مشكلة Database:

- تحقق من إعدادات قاعدة البيانات
- تأكد من أن SSL مفعل

## 5. نصائح مهمة

1. **استخدم `npm ci` بدلاً من `npm install`** للحصول على builds أسرع وأكثر استقراراً
2. **تأكد من ترتيب النشر**: Backend أولاً، ثم Frontend
3. **راقب اللوجز** في Render Dashboard للتأكد من عدم وجود أخطاء
4. **اختبر الاتصالات** بين Frontend و Backend بعد النشر

## 6. عناوين مهمة بعد النشر

- **الموقع الرئيسي**: `https://shababna-platform-frontend.onrender.com`
- **API**: `https://shababna-platform-backend.onrender.com/api`
- **Health Check**: `https://shababna-platform-backend.onrender.com/api/health`

---

تم إصلاح جميع التضاربات في الإعدادات. يجب أن يعمل الموقع الآن بشكل صحيح على Render.
