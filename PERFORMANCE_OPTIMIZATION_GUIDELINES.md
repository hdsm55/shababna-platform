# إرشادات تحسين الأداء المعتمدة - منصة شبابنا

## نظرة عامة

هذا الدليل يحتوي على الإرشادات والمعايير المعتمدة لتحسين أداء جميع صفحات الموقع، بناءً على التحسينات المنجزة في الصفحة الرئيسية.

## 1. معايير الأداء (Performance Standards)

### 1.1 معايير React

```javascript
// ✅ صحيح - استخدام React.memo
const Component = memo(() => {
  return <div>Content</div>;
});

// ❌ خطأ - عدم استخدام React.memo
const Component = () => {
  return <div>Content</div>;
};
```

### 1.2 معايير Framer Motion

```javascript
// ✅ صحيح - حركات سريعة
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.4 }}
>

// ❌ خطأ - حركات بطيئة
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
```

### 1.3 معايير CSS Transitions

```css
/* ✅ صحيح - انتقالات سريعة */
transition-all duration-200
hover:-translate-y-1

/* ❌ خطأ - انتقالات بطيئة */
transition-all duration-300
hover:-translate-y-2
```

## 2. معايير الألوان (Color Standards)

### 2.1 الألوان المعتمدة

```css
/* الألوان الأساسية */
--color-primary-500: #27548a; /* YInMn Blue */
--color-secondary-500: #183b4e; /* Japanese Indigo */
--color-accent-500: #dda853; /* Indian Yellow */
--color-dark-500: #003362; /* Dark Midnight Blue */
--color-neutral-500: #f3f3e0; /* Beige */
```

### 2.2 استخدام الألوان

```css
/* ✅ صحيح - استخدام الألوان المعتمدة */
.text-dark-500
.bg-primary-600
.border-secondary-300

/* ❌ خطأ - استخدام ألوان غير معتمدة */
.text-slate-900
.bg-blue-600
.border-gray-300;
```

### 2.3 التدرجات المعتمدة

```css
/* ✅ صحيح - تدرجات معتمدة */
.bg-gradient-to-r from-primary-600 to-primary-700
.bg-gradient-to-br from-dark-500 via-primary-900 to-secondary-800

/* ❌ خطأ - تدرجات غير معتمدة */
.bg-gradient-to-r from-blue-600 to-blue-700
.bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800;
```

## 3. معايير الأحجام والمسافات (Size & Spacing Standards)

### 3.1 المسافات المعتمدة

```css
/* ✅ صحيح - مسافات معتمدة */
.py-16          /* بدلاً من py-20 */
/* بدلاً من py-20 */
.mb-12          /* بدلاً من mb-16 */
.gap-6          /* بدلاً من gap-8 */
.p-6            /* بدلاً من p-8 */

/* ❌ خطأ - مسافات كبيرة */
.py-20
.mb-16
.gap-8
.p-8;
```

### 3.2 أحجام الخطوط المعتمدة

```css
/* ✅ صحيح - أحجام معتمدة */
.text-2xl md:text-3xl    /* بدلاً من text-3xl md:text-4xl */
.text-base md:text-lg    /* بدلاً من text-lg */
.text-sm                 /* بدلاً من text-base */

/* ❌ خطأ - أحجام كبيرة */
.text-3xl md:text-4xl
.text-lg
.text-base
```

### 3.3 أحجام الأيقونات المعتمدة

```css
/* ✅ صحيح - أحجام معتمدة */
.w-8 h-8        /* بدلاً من w-10 h-10 */
.w-6 h-6        /* بدلاً من w-8 h-8 */
.w-4 h-4        /* بدلاً من w-5 h-5 */

/* ❌ خطأ - أحجام كبيرة */
.w-10 h-10
.w-8 h-8
.w-5 h-5;
```

## 4. معايير هيكلة الكود (Code Structure Standards)

### 4.1 تقسيم المكونات

```javascript
// ✅ صحيح - مكونات منفصلة
const Section1 = memo(() => { ... });
const Section2 = memo(() => { ... });
const Section3 = memo(() => { ... });

const MainPage = memo(() => {
  return (
    <>
      <Section1 />
      <Section2 />
      <Section3 />
    </>
  );
});

// ❌ خطأ - مكون واحد كبير
const MainPage = () => {
  return (
    <>
      {/* Section 1 JSX */}
      {/* Section 2 JSX */}
      {/* Section 3 JSX */}
    </>
  );
};
```

### 4.2 تحسين الاستيرادات

```javascript
// ✅ صحيح - استيراد محسن
import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';

// ❌ خطأ - استيراد غير محسن
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
```

### 4.3 استخدام useCallback

```javascript
// ✅ صحيح - استخدام useCallback
const handleSubmit = useCallback(
  async (e) => {
    // logic
  },
  [dependencies]
);

// ❌ خطأ - عدم استخدام useCallback
const handleSubmit = async (e) => {
  // logic
};
```

## 5. معايير تحميل البيانات (Data Loading Standards)

### 5.1 Loading States

```javascript
// ✅ صحيح - loading states محسنة
if (isLoading) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="animate-pulse bg-dark-200 h-8 w-48 mx-auto mb-4 rounded"></div>
          <div className="animate-pulse bg-dark-200 h-4 w-96 mx-auto rounded"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-dark-200 h-40 rounded-lg mb-4"></div>
              <div className="bg-dark-200 h-4 w-3/4 mb-2 rounded"></div>
              <div className="bg-dark-200 h-3 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ❌ خطأ - loading state بسيط
if (isLoading) {
  return <div>Loading...</div>;
}
```

### 5.2 React Query Optimization

```javascript
// ✅ صحيح - إعداد محسن
const { data, isLoading, error } = useQuery({
  queryKey: ['data-key'],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
});

// ❌ خطأ - إعداد غير محسن
const { data, isLoading, error } = useQuery({
  queryKey: ['data-key'],
  queryFn: fetchData,
});
```

## 6. معايير SEO والوصول (SEO & Accessibility Standards)

### 6.1 SEO Optimization

```javascript
// ✅ صحيح - SEO محسن
<SEO
  title={t('page.meta.title')}
  description={t('page.meta.description')}
  keywords={t('page.meta.keywords')}
  image="/images/page-image.jpg"
/>

// ❌ خطأ - SEO غير محسن
<title>Page Title</title>
<meta name="description" content="Page description" />
```

### 6.2 Accessibility

```javascript
// ✅ صحيح - إمكانية وصول محسنة
<button
  onClick={handleClick}
  aria-label="Button description"
  className="focus:outline-none focus:ring-2 focus:ring-primary-500"
>

// ❌ خطأ - إمكانية وصول غير محسنة
<button onClick={handleClick}>
```

## 7. معايير الأداء الإضافية (Additional Performance Standards)

### 7.1 Image Optimization

```javascript
// ✅ صحيح - صور محسنة
<img
  src="/images/image.jpg"
  alt="Description"
  loading="lazy"
  className="w-full h-auto"
/>

// ❌ خطأ - صور غير محسنة
<img src="/images/image.jpg" />
```

### 7.2 Bundle Optimization

```javascript
// ✅ صحيح - استيراد محسن
import { Button } from '../components/ui/Button/ButtonSimple';

// ❌ خطأ - استيراد غير محسن
import { Button, Card, Input, Modal } from '../components/ui';
```

## 8. قائمة التحقق (Checklist)

### 8.1 قبل النشر

- [ ] استخدام React.memo لجميع المكونات
- [ ] تطبيق الألوان المعتمدة فقط
- [ ] تقليل أحجام الخطوط والأيقونات
- [ ] تسريع الحركات والانتقالات
- [ ] إضافة loading states محسنة
- [ ] تحسين SEO والوصول
- [ ] اختبار الأداء

### 8.2 بعد النشر

- [ ] مراقبة أداء الصفحة
- [ ] اختبار تجربة المستخدم
- [ ] جمع الملاحظات
- [ ] تطبيق التحسينات الإضافية

## 9. أمثلة تطبيقية (Practical Examples)

### 9.1 مثال صفحة محسنة

```javascript
import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const Section1 = memo(() => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="py-16 bg-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-dark-500 mb-4">
          العنوان
        </h2>
        <p className="text-base md:text-lg text-dark-600">المحتوى</p>
      </div>
    </motion.section>
  );
});

const Page = memo(() => {
  return (
    <>
      <SEO
        title="Page Title"
        description="Page description"
        keywords="keywords"
      />
      <main>
        <Section1 />
      </main>
    </>
  );
});

export default Page;
```

## 10. الخلاصة

هذه الإرشادات تضمن:

- ⚡ **أداء محسن** ومتسق
- 🎨 **تصميم موحد** مع الهوية المعتمدة
- 🛠️ **كود منظم** وقابل للصيانة
- 🎯 **تجربة مستخدم ممتازة**

يجب تطبيق هذه المعايير على جميع الصفحات الجديدة والمحدثة في الموقع.
