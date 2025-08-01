# دليل نشر الخادم الخلفي على Render.com

## 🚀 الخطوات السريعة

### 1. إنشاء Web Service

1. **اذهب إلى [Render Dashboard](https://dashboard.render.com)**
2. **انقر على "New" → "Web Service"**
3. **ربط GitHub Repository**
4. **أدخل البيانات التالية:**

```
Name: shababna-backend
Environment: Node
Build Command: cd server && npm install
Start Command: cd server && npm start
```

### 2. إعداد Environment Variables

```env
# Database
DB_HOST=dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com
DB_PORT=5432
DB_NAME=shaababna_db
DB_USER=shaababna_db_user
DB_PASSWORD=vqvaeTyJS1qD1NVwurk8knW1GnUoRCna

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=10000
NODE_ENV=production
CLIENT_URL=https://shababna-frontend.onrender.com
FRONTEND_URL=https://shababna-frontend.onrender.com
```

### 3. إعدادات إضافية

#### Health Check

```
Path: /api/health
```

#### Auto-Deploy

- ✅ **Enable Auto-Deploy**
- ✅ **Deploy on Push**

## 🔧 إعدادات متقدمة

### 1. إعدادات الأمان

- ✅ **SSL/HTTPS** (مجاني تلقائياً)
- ✅ **Security Headers** (مفعلة)
- ✅ **CORS** (محدث)

### 2. مراقبة الأداء

- **Logs**: متاحة في لوحة التحكم
- **Metrics**: مراقبة الأداء والذاكرة
- **Health Checks**: فحص صحة التطبيق

### 3. إعدادات قاعدة البيانات

- ✅ **SSL Connection** (مطلوب لـ Render)
- ✅ **Connection Pooling** (مفعل)
- ✅ **Auto-Reconnect** (مفعل)

## 📋 قائمة التحقق

### ✅ قبل النشر

- [ ] قاعدة البيانات PostgreSQL جاهزة
- [ ] Environment Variables محددة
- [ ] GitHub Repository محدث
- [ ] ملف package.json في مجلد server

### ✅ بعد النشر

- [ ] الخادم يعمل على https://shababna-backend.onrender.com
- [ ] Health Check يعمل: `/api/health`
- [ ] قاعدة البيانات متصلة
- [ ] API endpoints تعمل
- [ ] SSL مفعل

## 🚨 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في Build**

   - تحقق من وجود ملف `server/package.json`
   - تأكد من صحة Build Command

2. **خطأ في الاتصال بقاعدة البيانات**

   - تحقق من Environment Variables
   - تأكد من تفعيل SSL

3. **خطأ في CORS**
   - تحقق من إعدادات CORS في server/index.js
   - تأكد من صحة عناوين URL

## 📞 الدعم

- **Render Documentation**: https://render.com/docs
- **Community Forum**: https://community.render.com
- **Status Page**: https://status.render.com

---

**🎉 الخادم الخلفي جاهز للنشر على Render.com!**
