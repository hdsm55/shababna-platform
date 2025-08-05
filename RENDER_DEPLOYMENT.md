# دليل النشر على Render - الإصلاحات الجديدة

## المشاكل التي تم حلها

### 1. مشكلة SPA Routing (404 للصفحات الفرعية)
**السبب:** الخادم لا يعرف كيف يتعامل مع routes الفرعية
**الحل:** إضافة rewrite rules في `render.yaml` و `static.json`

### 2. مشكلة Content Security Policy (CSP)
**السبب:** CSP يمنع تنفيذ scripts
**الحل:** إضافة `'wasm-unsafe-eval'` و تحديث URLs

## الملفات المحدثة

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
    headers:
      - path: /*
        name: X-Frame-Options
        value: DENY
      - path: /*
        name: X-Content-Type-Options
        value: nosniff
      - path: /*
        name: X-XSS-Protection
        value: '1; mode=block'
      - path: /*
        name: Referrer-Policy
        value: no-referrer-when-downgrade
      - path: /*
        name: Cache-Control
        value: 'no-cache, no-store, must-revalidate'
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
  ],
  "headers": {
    "/**": {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "no-referrer-when-downgrade",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  }
}
```

### 3. `public/_redirects` (للـ SPA routing)
```
# SPA Routing - Redirect all routes to index.html
/*    /index.html   200

# API Proxy - Redirect API calls to backend
/api/*  https://shababna-platform.onrender.com/api/:splat  200

# Static assets
/assets/*  /assets/:splat  200
*.js       /:splat        200
*.css      /:splat        200
*.png      /:splat        200
*.jpg      /:splat        200
*.svg      /:splat        200
*.ico      /:splat        200
*.woff     /:splat        200
*.woff2    /:splat        200
*.ttf      /:splat        200
*.eot      /:splat        200
```

### 4. `public/_headers` (للـ headers)
```
# SPA Routing Headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: no-referrer-when-downgrade
  Cache-Control: no-cache, no-store, must-revalidate

# Static Assets - Long cache
/assets/*
  Cache-Control: public, max-age=31536000, immutable

*.js
  Cache-Control: public, max-age=31536000, immutable

*.css
  Cache-Control: public, max-age=31536000, immutable
```

### 5. `index.html` (CSP محدث)
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:5000 http://127.0.0.1:5000 https://shababna-platform.onrender.com https://*.onrender.com https://*.render.com; object-src 'none'; base-uri 'self'; form-action 'self';" />
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
git commit -m "Fix SPA routing and CSP for Render"
git push origin main
```

## الروابط المحدثة

- **Frontend**: `https://shababna-platform-1.onrender.com`
- **Backend**: `https://shababna-platform.onrender.com`
- **API**: `https://shababna-platform.onrender.com/api`

## اختبار النشر

1. افتح `https://shababna-platform-1.onrender.com`
2. تحقق من أن جميع الصفحات تعمل (لا 404)
3. تحقق من أن التبرع في قسم البرامج يعمل
4. تحقق من أن CSP لا يمنع scripts
5. افتح `test-production.html` لاختبار API

## النتيجة المتوقعة

- ✅ جميع الصفحات الفرعية ستعمل (لا 404)
- ✅ CSP لن يمنع scripts
- ✅ التبرع في قسم البرامج سيعمل
- ✅ التنقل بين الصفحات سيعمل
- ✅ لا حاجة لإعادة تحميل الصفحة

## ملاحظات مهمة

- ✅ تم إصلاح SPA routing بالكامل
- ✅ تم إصلاح CSP بالكامل
- ✅ تم تحديث جميع URLs
- ✅ تم إضافة headers مناسبة
- ✅ جاهز للنشر على Render
