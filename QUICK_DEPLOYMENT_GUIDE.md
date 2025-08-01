# دليل النشر السريع - منصة شبابنا العالمية

## 🎯 **الخطوات السريعة للنشر**

### ✅ **الخطوة 1: قاعدة البيانات (مكتملة)**

- ✅ قاعدة البيانات PostgreSQL جاهزة على Render
- ✅ البيانات التجريبية محفوظة
- ✅ الاتصال يعمل بنجاح

### 🚀 **الخطوة 2: نشر الخادم الخلفي**

#### 1. إنشاء Web Service على Render

1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. انقر على "New" → "Web Service"
3. ربط GitHub Repository
4. أدخل البيانات:

```
Name: shababna-backend
Environment: Node
Build Command: cd server && npm install
Start Command: cd server && npm start
```

#### 2. إعداد Environment Variables

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

### 🌐 **الخطوة 3: نشر الواجهة الأمامية**

#### 1. إنشاء Static Site على Render

1. انقر على "New" → "Static Site"
2. ربط GitHub Repository
3. أدخل البيانات:

```
Name: shababna-frontend
Build Command: cd client && npm install && npm run build
Publish Directory: client/dist
```

#### 2. إعداد Environment Variables

```env
VITE_API_URL=https://shababna-backend.onrender.com/api
```

## 📋 **قائمة التحقق النهائية**

### ✅ قبل النشر

- [x] قاعدة البيانات PostgreSQL جاهزة
- [x] ملف server/package.json موجود
- [x] ملف render.yaml جاهز
- [x] إعدادات CORS محدثة

### ⏳ بعد النشر

- [ ] الخادم الخلفي يعمل على https://shababna-backend.onrender.com
- [ ] الواجهة الأمامية تعمل على https://shababna-frontend.onrender.com
- [ ] Health Check يعمل: `/api/health`
- [ ] API endpoints تعمل
- [ ] SSL مفعل تلقائياً

## 🔗 **روابط مهمة**

- **Render Dashboard**: https://dashboard.render.com
- **GitHub Repository**: (رابط المستودع الخاص بك)
- **Documentation**: https://render.com/docs

## 🚨 **ملاحظات مهمة**

1. **JWT_SECRET**: تأكد من تغيير القيمة الافتراضية
2. **Environment Variables**: تأكد من إدخال جميع المتغيرات
3. **Auto-Deploy**: مفعل تلقائياً
4. **SSL**: مجاني ومفعل تلقائياً

---

**🎉 المشروع جاهز للنشر! اتبع الخطوات أعلاه للنشر السريع.**
