# تقرير إصلاح مشكلة Timeout - Shababna Platform

## المشكلة المحددة

**المشكلة:** عند الانتظار 5 دقائق أو أكثر في الصفحات الفرعية، تظهر رسالة "Not Found" بسبب انتهاء مهلة الطلبات
**السبب:** إعدادات timeout قصيرة جداً في قاعدة البيانات والخادم

## الحلول المطبقة

### 1. تحسين إعدادات قاعدة البيانات

#### تحديث `server/config/database.js`:

```javascript
// إنشاء pool للاتصال بقاعدة البيانات
const pool = new Pool({
  host:
    process.env.DB_HOST ||
    'dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'shaababna_db',
  user: process.env.DB_USER || 'shaababna_db_user',
  password: process.env.DB_PASSWORD || 'vqvaeTyJS1qD1NVwurk8knW1GnUoRCna',
  max: 20, // زيادة الحد الأقصى لعدد الاتصالات
  min: 5, // زيادة الحد الأدنى لعدد الاتصالات
  idleTimeoutMillis: 300000, // 5 دقائق - زيادة وقت الانتظار قبل إغلاق الاتصال
  connectionTimeoutMillis: 60000, // دقيقة واحدة - زيادة وقت الانتظار للاتصال
  ssl: {
    rejectUnauthorized: false,
    require: true,
  },
  // إعدادات إضافية لتحسين الاستقرار
  keepAlive: true,
  keepAliveInitialDelayMillis: 30000, // 30 ثانية
  // إعدادات إضافية لتحسين الاستقرار
  statement_timeout: 300000, // 5 دقائق للاستعلامات
  query_timeout: 300000, // 5 دقائق للاستعلامات
  // إعدادات إضافية للاستقرار
  application_name: 'shababna-platform',
  // إعدادات إضافية للاتصال
  tcp_keepalives_idle: 300, // 5 دقائق
  tcp_keepalives_interval: 60, // دقيقة واحدة
  tcp_keepalives_count: 3,
});
```

### 2. إضافة Timeout Middleware

#### إضافة middleware للتعامل مع timeout:

```javascript
// Timeout handling middleware
app.use((req, res, next) => {
  // Set timeout for all requests
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.log('⚠️ Request timeout for:', req.path);
      res.status(408).json({
        success: false,
        message: 'طلب مهلة زمنية - يرجى المحاولة مرة أخرى',
      });
    }
  }, 300000); // 5 minutes

  // Clear timeout when response is sent
  res.on('finish', () => {
    clearTimeout(timeout);
  });

  next();
});
```

### 3. تحسين Headers للـ Timeout

#### إضافة timeout للـ requests:

```javascript
// Add additional headers for better SPA support
app.use((req, res, next) => {
  // Set headers for SPA routing
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Add CORS headers for better compatibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Set timeout for requests (5 minutes)
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000); // 5 minutes

  next();
});
```

### 4. تحسين معالجة الأخطاء

#### إضافة معالجة أخطاء timeout:

```javascript
export default function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // معالجة خاصة لأخطاء قاعدة البيانات
  if (
    err.message &&
    (err.message.includes('Connection terminated') ||
      err.message.includes('timeout') ||
      err.message.includes('ECONNRESET') ||
      err.message.includes('ENOTFOUND') ||
      err.message.includes('ETIMEDOUT'))
  ) {
    return res.status(503).json({
      success: false,
      message: 'خطأ في الاتصال بقاعدة البيانات، يرجى المحاولة مرة أخرى',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // معالجة أخطاء timeout
  if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT') {
    return res.status(408).json({
      success: false,
      message: 'طلب مهلة زمنية - يرجى المحاولة مرة أخرى',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // معالجة أخطاء JSON parsing
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'بيانات غير صحيحة',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // معالجة أخطاء قاعدة البيانات الأخرى
  if (err.code === '23505') {
    // unique constraint violation
    return res.status(400).json({
      success: false,
      message: 'البيانات موجودة مسبقاً',
    });
  }

  if (err.code === '23503') {
    // foreign key constraint violation
    return res.status(400).json({
      success: false,
      message: 'البيانات المرتبطة غير موجودة',
    });
  }

  // معالجة أخطاء connection pool
  if (err.message && err.message.includes('pool')) {
    return res.status(503).json({
      success: false,
      message: 'خطأ في الاتصال بقاعدة البيانات، يرجى المحاولة مرة أخرى',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حدث خطأ غير متوقع',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
```

## الملفات المحدثة

1. **`server/config/database.js`** - تحسين إعدادات timeout لقاعدة البيانات
2. **`server/index.js`** - إضافة timeout middleware
3. **`server/middleware/errorHandler.js`** - تحسين معالجة أخطاء timeout

## التحسينات الإضافية

### 1. تحسين إعدادات قاعدة البيانات

- زيادة `max` connections إلى 20
- زيادة `min` connections إلى 5
- زيادة `idleTimeoutMillis` إلى 5 دقائق
- زيادة `connectionTimeoutMillis` إلى دقيقة واحدة
- إضافة `statement_timeout` و `query_timeout` إلى 5 دقائق
- إضافة TCP keepalive settings

### 2. تحسين معالجة الطلبات

- إضافة timeout middleware
- تعيين timeout للـ requests والـ responses
- إضافة معالجة أفضل للأخطاء

### 3. تحسين تجربة المستخدم

- رسائل خطأ واضحة ومفيدة
- معالجة أفضل لأخطاء timeout
- تحسين الاستقرار

## النتائج المتوقعة

- ✅ عدم ظهور "Not Found" بعد الانتظار الطويل
- ✅ تحسين استقرار الاتصال بقاعدة البيانات
- ✅ معالجة أفضل لأخطاء timeout
- ✅ تجربة مستخدم أفضل

## اختبار الإصلاحات

### 1. اختبار الانتظار الطويل:

1. اذهب إلى صفحة فرعية
2. انتظر 5-10 دقائق
3. اضغط على أي شيء
4. تأكد من عدم ظهور "Not Found"

### 2. اختبار قاعدة البيانات:

1. تحقق من سجلات الاتصال
2. تأكد من عدم وجود أخطاء timeout
3. اختبر الاستعلامات الطويلة

### 3. اختبار الأداء:

1. تحقق من سرعة الاستجابة
2. تأكد من عدم وجود أخطاء في console
3. اختبر على أجهزة مختلفة

## المراقبة المستمرة

1. **مراقبة سجلات قاعدة البيانات** للتأكد من عدم وجود أخطاء timeout
2. **اختبار الصفحات الفرعية** بشكل دوري
3. **مراقبة أداء التطبيق** ووقت الاستجابة
4. **تحديث الإعدادات** حسب الحاجة

## إعدادات Render.com المطلوبة

### للخادم الخلفي:

- **Build Command:** `npm install`
- **Start Command:** `npm run prod:server`
- **Health Check Path:** `/api/health`
- **Timeout Settings:** 5 minutes

### للواجهة الأمامية:

- **Build Command:** `cd client && npm install && npm run build`
- **Static Publish Path:** `client/dist`

## متغيرات البيئة المطلوبة

### للخادم الخلفي:

```
NODE_ENV=production
PORT=10000
DB_HOST=dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com
DB_PORT=5432
DB_NAME=shaababna_db
DB_USER=shaababna_db_user
DB_PASSWORD=vqvaeTyJS1qD1NVwurk8knW1GnUoRCna
JWT_SECRET=[auto-generated]
CLIENT_URL=https://shababna-platform.onrender.com
FRONTEND_URL=https://shababna-platform.onrender.com
```

### للواجهة الأمامية:

```
VITE_API_URL=https://shababna-backend.onrender.com/api
```

## التحسينات المستقبلية

### 1. تحسين الأداء

- إضافة connection pooling أفضل
- تحسين إعدادات cache
- إضافة retry logic

### 2. تحسين الأمان

- إضافة rate limiting
- تحسين timeout settings
- إضافة circuit breaker pattern

### 3. تحسين تجربة المستخدم

- إضافة loading states
- تحسين رسائل الخطأ
- إضافة retry buttons

---

_تم إنشاء هذا التقرير في: ${new Date().toLocaleString('ar-SA')}_
