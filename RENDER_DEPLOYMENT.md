# دليل النشر على Render

## الملفات المطلوبة لـ Render

### 1. `render.yaml` (الملف الرئيسي)

```yaml
services:
  - type: web
    name: shababna-frontend
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /api/*
        destination: https://shababna-platform.onrender.com/api/*
      - type: rewrite
        source: /*
        destination: /index.html
```

### 2. `static.json` (بديل لـ render.yaml)

```json
{
  "root": "dist",
  "routes": {
    "/**": "index.html"
  },
  "redirects": [
    {
      "source": "/api/*",
      "destination": "https://shababna-platform.onrender.com/api/*"
    }
  ]
}
```

### 3. `public/_redirects` (للـ SPA routing)

```
# SPA Routing - Redirect all routes to index.html
/*    /index.html   200

# API Proxy - Redirect API calls to backend
/api/*  https://shababna-platform.onrender.com/api/:splat  200
```

## خطوات النشر

### 1. نشر Backend أولاً

```bash
cd server
git add .
git commit -m "Update API URLs for Render"
git push origin main
```

### 2. نشر Frontend

```bash
cd client
npm run build
git add .
git commit -m "Fix SPA routing for Render"
git push origin main
```

## الروابط المحدثة

- **Frontend**: `https://shababna-platform-1.onrender.com`
- **Backend**: `https://shababna-platform.onrender.com`
- **API**: `https://shababna-platform.onrender.com/api`

## اختبار النشر

1. افتح `https://shababna-platform-1.onrender.com`
2. تحقق من أن جميع الصفحات تعمل
3. تحقق من أن التبرع في قسم البرامج يعمل
4. افتح `test-production.html` لاختبار API

## ملاحظات مهمة

- ✅ تم إصلاح SPA routing
- ✅ تم تحديث جميع URLs
- ✅ تم إزالة ملفات المنصات الأخرى
- ✅ التركيز على Render فقط
