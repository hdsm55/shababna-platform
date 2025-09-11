# دليل استخدام مكونات التحميل الموحدة

## 🎯 المكون الرئيسي: UnifiedLoader

مكون واحد يحل محل جميع مكونات التحميل الأخرى ويوفر تجربة موحدة في جميع أنحاء التطبيق.

## 📋 الخصائص المتاحة

### الخصائص الأساسية

- `message`: رسالة التحميل
- `showProgress`: إظهار شريط التقدم
- `progress`: قيمة التقدم (0-100)
- `variant`: نوع التصميم
- `size`: الحجم
- `color`: اللون
- `showLogo`: إظهار الشعار
- `showTips`: إظهار النصائح
- `isBackendIdle`: حالة الخادم المجاني
- `fullScreen`: شاشة كاملة
- `autoHide`: إخفاء تلقائي
- `autoHideDelay`: تأخير الإخفاء

### أنواع التصميم (variant)

- `default`: التصميم الافتراضي
- `minimal`: تصميم بسيط
- `brand`: تصميم بالهوية التجارية
- `modern`: تصميم حديث
- `elegant`: تصميم أنيق

### الأحجام (size)

- `sm`: صغير
- `md`: متوسط (افتراضي)
- `lg`: كبير

### الألوان (color)

- `primary`: أساسي (افتراضي)
- `secondary`: ثانوي
- `accent`: مميز
- `neutral`: محايد

## 🚀 أمثلة الاستخدام

### 1. تحميل بسيط

```tsx
import { UnifiedLoader } from './components/common/LoadingComponents';

<UnifiedLoader message="جاري التحميل..." />;
```

### 2. تحميل مع شريط التقدم

```tsx
<UnifiedLoader
  message="جاري تحميل البيانات..."
  showProgress={true}
  progress={75}
/>
```

### 3. تحميل بالهوية التجارية

```tsx
<UnifiedLoader
  variant="brand"
  size="lg"
  fullScreen={true}
  showLogo={true}
  message="مرحباً بك في شبابنا"
/>
```

### 4. تحميل للخادم المجاني

```tsx
<UnifiedLoader
  variant="modern"
  isBackendIdle={true}
  message="الخادم يستيقظ من النوم..."
/>
```

### 5. تحميل مع نصائح

```tsx
<UnifiedLoader
  variant="elegant"
  showTips={true}
  showProgress={true}
  message="جاري تحضير المحتوى..."
/>
```

### 6. تحميل بسيط بدون شعار

```tsx
<UnifiedLoader variant="minimal" showLogo={false} message="جاري التحميل..." />
```

## 🔧 المكونات المتخصصة

### AppLoader - تحميل التطبيق

```tsx
import { AppLoader } from './components/common/LoadingComponents';

<AppLoader>
  <YourAppContent />
</AppLoader>;
```

### PageLoadingWrapper - تحميل الصفحات

```tsx
import { PageLoadingWrapper } from './components/common/LoadingComponents';

<PageLoadingWrapper variant="brand">
  <YourPageContent />
</PageLoadingWrapper>;
```

### BackendIdleHandler - معالج الخادم المجاني

```tsx
import { BackendIdleHandler } from './components/common/LoadingComponents';

<BackendIdleHandler>
  <YourAppContent />
</BackendIdleHandler>;
```

### LoadingSpinner - للاستخدام المتوافق مع الكود الموجود

```tsx
import { LoadingSpinner } from './components/common/LoadingComponents';

<LoadingSpinner size="md" text="جاري التحميل..." />;
```

## 🎨 التخصيص

### ألوان مخصصة

```tsx
<UnifiedLoader color="primary" variant="modern" className="custom-loader" />
```

### أحجام مخصصة

```tsx
<UnifiedLoader size="lg" variant="brand" fullScreen={true} />
```

## 🌍 دعم الترجمة

جميع الرسائل تدعم الترجمة تلقائياً:

```tsx
// سيستخدم t('common.loading') تلقائياً
<UnifiedLoader />

// أو رسالة مخصصة
<UnifiedLoader message={t('custom.loading.message')} />
```

## 📱 الاستجابة

المكون متجاوب تلقائياً مع جميع أحجام الشاشات:

- **الهواتف**: حجم صغير مع تصميم مبسط
- **الأجهزة اللوحية**: حجم متوسط مع تفاصيل أكثر
- **أجهزة الكمبيوتر**: حجم كبير مع جميع المميزات

## ⚡ الأداء

- تحميل سريع ومحسن
- تأثيرات بصرية سلسة
- استخدام ذاكرة منخفض
- دعم SSR

## 🔄 الانتقال من المكونات القديمة

### بدلاً من LoadingSpinner

```tsx
// القديم
<LoadingSpinner size="md" text="جاري التحميل..." />

// الجديد
<UnifiedLoader message="جاري التحميل..." />
```

### بدلاً من PageLoader (محذوف)

```tsx
// القديم
<PageLoader variant="brand" message="جاري تحميل الصفحة..." />

// الجديد
<UnifiedLoader variant="brand" fullScreen={true} message="جاري تحميل الصفحة..." />
```

### بدلاً من CenteredLoader (محذوف)

```tsx
// القديم
<CenteredLoader message="جاري التحميل..." showProgress={true} />

// الجديد
<UnifiedLoader message="جاري التحميل..." showProgress={true} />
```

### بدلاً من SimpleLoader (محذوف)

```tsx
// القديم
<SimpleLoader />

// الجديد
<UnifiedLoader variant="minimal" showLogo={false} />
```

### بدلاً من LoadingPage (محذوف)

```tsx
// القديم
<LoadingPage />

// الجديد
<UnifiedLoader variant="brand" fullScreen={true} />
```

## 🎯 أفضل الممارسات

1. **استخدم UnifiedLoader** للمعظم الحالات
2. **استخدم AppLoader** لتحميل التطبيق الأولي
3. **استخدم PageLoadingWrapper** لتحميل الصفحات
4. **استخدم BackendIdleHandler** للخادم المجاني
5. **استخدم LoadingSpinner** فقط للتوافق مع الكود الموجود
6. **اختر variant مناسب** لكل حالة
7. **استخدم fullScreen={true}** للتحميل الكامل
8. **استخدم showProgress={true}** عند وجود تقدم فعلي
9. **استخدم showTips={true}** للتحميل الطويل
10. **تجنب المكونات المحذوفة** (PageLoader, CenteredLoader, SimpleLoader, LoadingPage, EnhancedLoadingSpinner)

## 🐛 استكشاف الأخطاء

### التحميل لا يظهر

- تأكد من أن `isVisible` صحيح
- تحقق من `autoHide` و `autoHideDelay`

### التصميم لا يظهر بشكل صحيح

- تحقق من `variant` و `size`
- تأكد من وجود CSS classes

### الرسالة لا تظهر

- تحقق من `message` prop
- تأكد من دعم الترجمة

## 📞 الدعم

للمساعدة أو الاستفسارات، راجع:

- ملف README.md
- ملفات الترجمة في `i18n/locales/`
- أمثلة الاستخدام في المكونات
