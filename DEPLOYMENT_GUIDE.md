# دليل النشر - Shababna Platform

## الإعدادات الحالية

### البيئة المحلية (Development)

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **API URL**: `http://localhost:5000/api`

### البيئة الإنتاجية (Production)

- **Frontend**: `https://shababna-platform-1.onrender.com`
- **Backend**: `https://shababna-platform.onrender.com`
- **API URL**: `https://shababna-platform.onrender.com/api`

## التغييرات المطلوبة للنشر

### 1. إعدادات البيئة

تم إصلاح الإعدادات لتعمل تلقائياً في كلا البيئتين:

```typescript
// في client/src/config/environment.ts
export const getApiUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api'; // المحلية
  }
  return 'https://shababna-backend.onrender.com/api'; // الإنتاجية
};
```

### 2. ملفات التكوين

#### Frontend (client/)

- `vite.config.ts` - إعدادات Vite مع CSP محسنة
- `render.yaml` - إعدادات Render للـ frontend
- `package.json` - dependencies و scripts

#### Backend (server/)

- `index.js` - إعدادات الخادم مع body-parser محسن
- `render.yaml` - إعدادات Render للـ backend
- `package.json` - dependencies و scripts

### 3. خطوات النشر

#### النشر على Render

1. **Backend أولاً**:

   ```bash
   # في مجلد server/
   git add .
   git commit -m "Fix API endpoints and body-parser"
   git push origin main
   ```

2. **Frontend ثانياً**:
   ```bash
   # في مجلد client/
   npm run build
   git add .
   git commit -m "Update environment config"
   git push origin main
   ```

### 4. التحقق من النشر

#### اختبار Backend

```bash
curl https://shababna-platform.onrender.com/api/events
```

#### اختبار Frontend

- افتح `https://shababna-platform-1.onrender.com`
- تحقق من أن التبرع يعمل في قسم البرامج

### 5. إعدادات CORS

تم تحديث إعدادات CORS في الخادم لتشمل:

- `https://shababna-platform-1.onrender.com`
- `https://shababna-platform.onrender.com`
- `http://localhost:5173` (للاختبار المحلي)

### 6. Content Security Policy

تم تحديث CSP في:

- `client/index.html`
- `client/vite.config.ts`

لتشمل:

- `'unsafe-inline'` للـ scripts
- `'unsafe-eval'` للـ Vite
- URLs صحيحة للـ connect-src

## ملاحظات مهمة

1. **البيئة التلقائية**: التطبيق يكتشف البيئة تلقائياً
2. **API URLs**: تستخدم الخادم المحلي في التطوير والإنتاجي في النشر
3. **CORS**: مُعد مسبقاً للعمل في كلا البيئتين
4. **CSP**: مُعد للسماح بـ Vite و React

## استكشاف الأخطاء

### إذا لم يعمل التبرع:

1. تحقق من أن Backend يعمل على Render
2. تحقق من CORS settings
3. تحقق من console للـ errors

### إذا لم يعمل Frontend:

1. تحقق من build logs
2. تحقق من CSP settings
3. تحقق من environment variables
