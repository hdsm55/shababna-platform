# 🎨 دليل الظلال المخصصة - منصة شبابنا

## 📋 نظرة عامة

تم إنشاء نظام ظلال مخصص باستخدام ألوان هوية المنصة لضمان التناسق البصري والهوية الموحدة.

## 🌈 الألوان المستخدمة في الظلال

### 🔵 اللون الأساسي (Primary)

- **Hex**: `#27548A` (YInMn Blue)
- **RGB**: `39, 84, 138`
- **الاستخدام**: العناصر الرئيسية، الأزرار، الروابط

### 🔷 اللون الثانوي (Secondary)

- **Hex**: `#183B4E` (Japanese Indigo)
- **RGB**: `24, 59, 78`
- **الاستخدام**: العناصر الثانوية، الخلفيات، الحدود

### 🟡 اللون المميز (Accent)

- **Hex**: `#DDA853` (Indian Yellow)
- **RGB**: `221, 168, 83`
- **الاستخدام**: التأكيد، التنبيهات، العناصر المهمة

## 🎯 أحجام الظلال المتاحة

### 📏 أحجام قياسية

- **sm**: ظلال خفيفة (1-2px)
- **md**: ظلال متوسطة (4-6px)
- **lg**: ظلال كبيرة (10-15px)
- **xl**: ظلال كبيرة جداً (20-25px)
- **2xl**: ظلال ضخمة (25-50px)

## 🚀 كيفية الاستخدام

### 1️⃣ في ملفات CSS

```css
/* ظلال أساسية */
.shadow-primary {
  /* ظلال باللون الأساسي */
}
.shadow-secondary {
  /* ظلال باللون الثانوي */
}
.shadow-accent {
  /* ظلال باللون المميز */
}

/* ظلال بأحجام مختلفة */
.shadow-primary-md {
  /* ظلال متوسطة باللون الأساسي */
}
.shadow-secondary-lg {
  /* ظلال كبيرة باللون الثانوي */
}
.shadow-accent-xl {
  /* ظلال كبيرة جداً باللون المميز */
}

/* ظلال تفاعلية */
.shadow-primary-hover {
  /* ظلال تفاعلية باللون الأساسي */
}
.shadow-secondary-hover {
  /* ظلال تفاعلية باللون الثانوي */
}
.shadow-accent-hover {
  /* ظلال تفاعلية باللون المميز */
}
```

### 2️⃣ في ملفات Tailwind CSS

```jsx
// ظلال أساسية
<div className="shadow-brand-sm">ظلال خفيفة</div>
<div className="shadow-brand-md">ظلال متوسطة</div>
<div className="shadow-brand-lg">ظلال كبيرة</div>
<div className="shadow-brand-xl">ظلال كبيرة جداً</div>
<div className="shadow-brand-2xl">ظلال ضخمة</div>

// ظلال ثانوية
<div className="shadow-secondary-sm">ظلال ثانوية خفيفة</div>
<div className="shadow-secondary-md">ظلال ثانوية متوسطة</div>
<div className="shadow-secondary-lg">ظلال ثانوية كبيرة</div>
<div className="shadow-secondary-xl">ظلال ثانوية كبيرة جداً</div>
<div className="shadow-secondary-2xl">ظلال ثانوية ضخمة</div>

// ظلال مميزة
<div className="shadow-accent-sm">ظلال مميزة خفيفة</div>
<div className="shadow-accent-md">ظلال مميزة متوسطة</div>
<div className="shadow-accent-lg">ظلال مميزة كبيرة</div>
<div className="shadow-accent-xl">ظلال مميزة كبيرة جداً</div>
<div className="shadow-accent-2xl">ظلال مميزة ضخمة</div>

// ظلال تفاعلية
<div className="shadow-brand-hover">ظلال تفاعلية أساسية</div>
<div className="shadow-secondary-hover">ظلال تفاعلية ثانوية</div>
<div className="shadow-accent-hover">ظلال تفاعلية مميزة</div>
```

## 📱 أمثلة عملية

### 🎨 البطاقات

```jsx
// بطاقة عادية
<div className="bg-white rounded-lg shadow-brand-md p-6">
  محتوى البطاقة
</div>

// بطاقة مع تأثير تفاعلي
<div className="bg-white rounded-lg shadow-brand-md hover:shadow-brand-hover transition-shadow duration-300 p-6">
  بطاقة تفاعلية
</div>
```

### 🔘 الأزرار

```jsx
// زر أساسي
<button className="bg-primary-500 text-white px-6 py-3 rounded-lg shadow-brand-md hover:shadow-brand-hover transition-all duration-300">
  زر أساسي
</button>

// زر ثانوي
<button className="bg-secondary-500 text-white px-6 py-3 rounded-lg shadow-secondary-md hover:shadow-secondary-hover transition-all duration-300">
  زر ثانوي
</button>

// زر مميز
<button className="bg-accent-500 text-white px-6 py-3 rounded-lg shadow-accent-md hover:shadow-accent-hover transition-all duration-300">
  زر مميز
</button>
```

### 📋 النماذج

```jsx
// نموذج مع ظلال
<form className="bg-white rounded-xl shadow-secondary-lg p-8">
  <input className="w-full p-3 border border-gray-300 rounded-lg shadow-accent-sm focus:shadow-accent-md transition-shadow duration-300" />
</form>
```

### 🖼️ الصور

```jsx
// صورة مع ظلال
<img
  src="/path/to/image.jpg"
  className="rounded-lg shadow-brand-lg hover:shadow-brand-hover transition-shadow duration-300"
  alt="صورة"
/>
```

## ⚡ نصائح للاستخدام

### ✅ أفضل الممارسات

1. **استخدم الظلال الخفيفة** للعناصر الصغيرة
2. **استخدم الظلال المتوسطة** للبطاقات والنماذج
3. **استخدم الظلال الكبيرة** للعناصر المهمة
4. **استخدم الظلال التفاعلية** للعناصر القابلة للنقر
5. **حافظ على التناسق** في نفس الصفحة

### ❌ تجنب

1. **لا تخلط** بين أحجام الظلال بشكل عشوائي
2. **لا تستخدم** ظلال كثيرة في نفس العنصر
3. **لا تنس** إضافة انتقالات سلسة للظلال التفاعلية

## 🔧 تخصيص الظلال

### إضافة ظلال جديدة

```css
/* في ملف CSS */
.shadow-custom {
  box-shadow: 0 4px 6px -1px rgba(YOUR_COLOR, 0.1), 0 2px 4px -1px rgba(YOUR_COLOR, 0.06);
}
```

### في Tailwind Config

```js
// في tailwind.config.js
boxShadow: {
  'custom': '0 4px 6px -1px rgba(YOUR_COLOR, 0.1), 0 2px 4px -1px rgba(YOUR_COLOR, 0.06)',
}
```

## 📊 جدول مرجعي سريع

| النوع           | CSS Class               | Tailwind Class       | الاستخدام     |
| --------------- | ----------------------- | -------------------- | ------------- |
| أساسي خفيف      | `.shadow-primary`       | `shadow-brand-sm`    | عناصر صغيرة   |
| أساسي متوسط     | `.shadow-primary-md`    | `shadow-brand-md`    | بطاقات، أزرار |
| أساسي كبير      | `.shadow-primary-lg`    | `shadow-brand-lg`    | عناصر مهمة    |
| أساسي كبير جداً | `.shadow-primary-xl`    | `shadow-brand-xl`    | عناصر رئيسية  |
| أساسي ضخم       | `.shadow-primary-2xl`   | `shadow-brand-2xl`   | عناصر مميزة   |
| تفاعلي أساسي    | `.shadow-primary-hover` | `shadow-brand-hover` | تأثيرات hover |

---

**ملاحظة**: تأكد من إعادة تشغيل الخادم بعد تحديث ملفات التكوين لتفعيل الظلال الجديدة.
