# دليل النشر على Render.com - منصة شبابنا العالمية

## 🚀 الخطوة الأولى: إعداد قاعدة البيانات

### 1. إنشاء قاعدة البيانات PostgreSQL

1. **اذهب إلى [Render Dashboard](https://dashboard.render.com)**
2. **انقر على "New" → "Postgres"**
3. **أدخل البيانات التالية:**

```
Name: shababna-db
Database: shababna
User: shababna_user
Region: Frankfurt (أقرب لمنطقة الشرق الأوسط)
Plan: Free (للبداية)
```

### 2. نسخ بيانات الاتصال

بعد إنشاء قاعدة البيانات، ستحصل على:

- **Internal Database URL**: `postgresql://user:pass@host:port/db`
- **External Database URL**: `postgresql://user:pass@host:port/db`
- **Database Name**: `shababna`
- **User**: `shababna_user`
- **Password**: `auto-generated`

### 3. إعداد قاعدة البيانات

```bash
# تشغيل ملف الإعداد (بعد رفع المشروع)
npm run db:setup-render
```

## 🖥️ الخطوة الثانية: نشر الخادم الخلفي

### 1. إنشاء Web Service

1. **انقر على "New" → "Web Service"**
2. **ربط GitHub Repository**
3. **أدخل البيانات التالية:**

```
Name: shababna-backend
Environment: Node
Build Command: npm install
Start Command: npm run dev:server
```

### 2. إعداد Environment Variables

```env
# Database
DB_HOST=your-render-postgres-host
DB_PORT=5432
DB_NAME=shababna
DB_USER=shababna_user
DB_PASSWORD=your-render-db-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=10000
NODE_ENV=production
CLIENT_URL=https://your-frontend-app.onrender.com
FRONTEND_URL=https://your-frontend-app.onrender.com
```

## 🌐 الخطوة الثالثة: نشر الواجهة الأمامية

### 1. إنشاء Static Site

1. **انقر على "New" → "Static Site"**
2. **ربط GitHub Repository**
3. **أدخل البيانات التالية:**

```
Name: shababna-frontend
Build Command: cd client && npm install && npm run build
Publish Directory: client/dist
```

### 2. إعداد Environment Variables

```env
# Client
VITE_API_URL=https://your-backend-app.onrender.com/api
```

## 🔧 إعدادات إضافية

### 1. تحديث CORS في الخادم

```javascript
// في server/index.js
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://your-frontend-app.onrender.com',
    ],
    credentials: true,
  })
);
```

### 2. إعداد SSL

- Render يوفر SSL مجانياً
- سيتم توجيه HTTP إلى HTTPS تلقائياً

### 3. مراقبة الأداء

- **Logs**: متاحة في لوحة التحكم
- **Metrics**: مراقبة الأداء والذاكرة
- **Health Checks**: فحص صحة التطبيق

## 📋 قائمة التحقق

### ✅ قبل النشر

- [ ] قاعدة البيانات PostgreSQL جاهزة
- [ ] Environment Variables محددة
- [ ] GitHub Repository محدث
- [ ] Build يعمل محلياً

### ✅ بعد النشر

- [ ] الخادم الخلفي يعمل
- [ ] الواجهة الأمامية تعمل
- [ ] قاعدة البيانات متصلة
- [ ] API calls تعمل
- [ ] SSL مفعل

## 🚨 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في الاتصال بقاعدة البيانات**

   - تحقق من Environment Variables
   - تأكد من صحة بيانات الاتصال

2. **خطأ في Build**

   - تحقق من Build Command
   - راجع Logs للحصول على التفاصيل

3. **خطأ في CORS**
   - تأكد من إعدادات CORS
   - تحقق من عناوين URL

## 📞 الدعم

- **Render Documentation**: https://render.com/docs
- **Community Forum**: https://community.render.com
- **Status Page**: https://status.render.com

---

**🎉 تهانينا! المشروع جاهز للنشر على Render.com**
