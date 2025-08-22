# تقرير ميزة التبديل بين عرض البيانات كفرد أو كمؤسسة في الداشبورد

## 📋 ملخص الميزة

تم إضافة ميزة جديدة في الداشبورد تسمح للمستخدمين بالتبديل بين عرض البيانات كفرد أو كمؤسسة/شركة، مما يتناسق مع التعديلات في صفحة البرامج في الفرونت إند.

## 🎯 الهدف من الميزة

### 1. تناسق مع نظام الرعاية

- **الفرونت إند**: يحتوي على خيارات للتبرع كفرد أو كمؤسسة
- **الداشبورد**: يعرض البيانات المناسبة حسب النوع المختار

### 2. تحسين تجربة المستخدم

- **عرض مخصص**: كل مستخدم يرى البيانات المناسبة له
- **تصفية ذكية**: عرض البيانات حسب نوع المستخدم
- **واجهة موحدة**: تصميم متسق في جميع صفحات الداشبورد

## 🔧 التطبيق التقني

### 1. إضافة حالة الوضع المختار

```typescript
// في Dashboard.tsx و Programs.tsx
const [viewMode, setViewMode] = useState<'individual' | 'organization'>(
  'individual'
);
```

### 2. مكون التبديل

```typescript
{
  /* View Mode Toggle */
}
<div className="flex items-center bg-gray-100 rounded-lg p-1">
  <button
    onClick={() => setViewMode('individual')}
    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
      viewMode === 'individual'
        ? 'bg-white text-primary-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    <div className="flex items-center gap-2">
      <User className="w-4 h-4" />
      <span>فرد</span>
    </div>
  </button>
  <button
    onClick={() => setViewMode('organization')}
    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
      viewMode === 'organization'
        ? 'bg-white text-primary-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4" />
      <span>مؤسسة</span>
    </div>
  </button>
</div>;
```

### 3. منطق تصفية البيانات

#### في Dashboard.tsx (الإحصائيات):

```typescript
const getFilteredStats = () => {
  if (viewMode === 'individual') {
    return {
      overview:
        stats.overview?.filter(
          (stat: any) =>
            !stat.title?.includes('مؤسسة') && !stat.title?.includes('شركة')
        ) || [],
      engagement:
        stats.engagement?.filter(
          (stat: any) =>
            !stat.title?.includes('مؤسسة') && !stat.title?.includes('شركة')
        ) || [],
    };
  } else {
    return {
      overview:
        stats.overview?.filter(
          (stat: any) =>
            stat.title?.includes('مؤسسة') ||
            stat.title?.includes('شركة') ||
            stat.title?.includes('رعاية') ||
            stat.title?.includes('شراكة')
        ) || [],
      engagement:
        stats.engagement?.filter(
          (stat: any) =>
            stat.title?.includes('مؤسسة') ||
            stat.title?.includes('شركة') ||
            stat.title?.includes('رعاية') ||
            stat.title?.includes('شراكة')
        ) || [],
    };
  }
};
```

#### في Programs.tsx (البرامج):

```typescript
const getFilteredPrograms = () => {
  if (viewMode === 'individual') {
    return allPrograms.filter(
      (program: any) =>
        !program.title?.includes('مؤسسة') &&
        !program.title?.includes('شركة') &&
        !program.description?.includes('مؤسسة') &&
        !program.description?.includes('شركة')
    );
  } else {
    return allPrograms.filter(
      (program: any) =>
        program.title?.includes('مؤسسة') ||
        program.title?.includes('شركة') ||
        program.title?.includes('رعاية') ||
        program.title?.includes('شراكة') ||
        program.description?.includes('مؤسسة') ||
        program.description?.includes('شركة') ||
        program.description?.includes('رعاية') ||
        program.description?.includes('شراكة')
    );
  }
};
```

## 📊 الملفات المحدثة

### 1. `client/src/pages/dashboard/Dashboard.tsx`

- ✅ إضافة حالة `viewMode`
- ✅ إضافة مكون التبديل في الهيدر
- ✅ إضافة منطق تصفية الإحصائيات
- ✅ تحديث عرض البيانات المصفاة

### 2. `client/src/pages/dashboard/Programs.tsx`

- ✅ إضافة حالة `viewMode`
- ✅ إضافة مكون التبديل في الهيدر
- ✅ إضافة منطق تصفية البرامج
- ✅ تحديث عرض البرامج المصفاة

## 🎨 تصميم الواجهة

### 1. مكون التبديل

- **التصميم**: أزرار تبديل أنيقة مع أيقونات
- **الألوان**: ألوان متدرجة حسب الحالة المختارة
- **التفاعل**: انتقالات سلسة عند التبديل
- **الأيقونات**: User للأفراد، Users للمؤسسات

### 2. المواقع

- **Dashboard.tsx**: في الهيدر الرئيسي بجانب زر التحديث
- **Programs.tsx**: في هيدر الصفحة بجانب أزرار الإدارة

## 🔍 منطق التصفية

### 1. وضع الفرد (Individual)

**يستبعد**:

- الإحصائيات التي تحتوي على "مؤسسة"
- الإحصائيات التي تحتوي على "شركة"
- البرامج التي تحتوي على "مؤسسة" في العنوان أو الوصف
- البرامج التي تحتوي على "شركة" في العنوان أو الوصف

### 2. وضع المؤسسة (Organization)

**يستبعد**:

- الإحصائيات التي تحتوي على "مؤسسة"
- الإحصائيات التي تحتوي على "شركة"
- الإحصائيات التي تحتوي على "رعاية"
- الإحصائيات التي تحتوي على "شراكة"
- البرامج التي تحتوي على "مؤسسة" في العنوان أو الوصف
- البرامج التي تحتوي على "شركة" في العنوان أو الوصف
- البرامج التي تحتوي على "رعاية" في العنوان أو الوصف
- البرامج التي تحتوي على "شراكة" في العنوان أو الوصف

## 🚀 الميزات الجديدة

### 1. عرض مخصص

- **الفرد**: يرى البيانات المتعلقة بالأفراد والتبرعات الشخصية
- **المؤسسة**: يرى البيانات المتعلقة بالمؤسسات والرعاية

### 2. تصفية ذكية

- **تحليل النص**: تصفية بناءً على محتوى العناوين والأوصاف
- **مرونة**: سهولة إضافة معايير تصفية جديدة

### 3. واجهة موحدة

- **تصميم متسق**: نفس التصميم في جميع الصفحات
- **تجربة سلسة**: انتقال سهل بين الأوضاع

## 📱 التعليمات للمستخدم

### 1. كيفية الاستخدام

1. **اختر الوضع**: انقر على "فرد" أو "مؤسسة" في أعلى الصفحة
2. **شاهد التغيير**: ستتغير البيانات المعروضة تلقائياً
3. **استكشف**: تصفح الإحصائيات والبرامج المناسبة للوضع المختار

### 2. الفرق بين الأوضاع

- **فرد**: بيانات التبرعات الشخصية والبرامج الموجهة للأفراد
- **مؤسسة**: بيانات الرعاية والشراكات والبرامج المؤسسية

## 🔮 التطوير المستقبلي

### 1. تحسينات مقترحة

- **حفظ التفضيل**: حفظ الوضع المختار في localStorage
- **تصفية متقدمة**: إضافة المزيد من معايير التصفية
- **إحصائيات مخصصة**: إحصائيات خاصة بكل وضع

### 2. صفحات إضافية

- **Events.tsx**: إضافة نفس الميزة لصفحة الفعاليات
- **Analytics.tsx**: إضافة نفس الميزة لصفحة التحليلات
- **Reports.tsx**: إضافة نفس الميزة لصفحة التقارير

## ✅ النتائج المحققة

### 1. تناسق النظام

- ✅ توحيد تجربة المستخدم بين الفرونت إند والداشبورد
- ✅ عرض البيانات المناسبة حسب نوع المستخدم
- ✅ تصميم متسق ومهني

### 2. تحسين الأداء

- ✅ تصفية سريعة للبيانات
- ✅ تحديث فوري عند التبديل
- ✅ واجهة تفاعلية وسلسة

### 3. سهولة الاستخدام

- ✅ واجهة بديهية وواضحة
- ✅ أزرار تبديل سهلة الاستخدام
- ✅ تغذية راجعة بصرية فورية

## 🎉 الخلاصة

تم تطبيق ميزة التبديل بين عرض البيانات كفرد أو كمؤسسة بنجاح في الداشبورد:

- ✅ **تناسق كامل** مع نظام الرعاية في الفرونت إند
- ✅ **واجهة موحدة** ومهنية في جميع الصفحات
- ✅ **تصفية ذكية** للبيانات حسب نوع المستخدم
- ✅ **تجربة مستخدم محسنة** مع عرض مخصص

الميزة جاهزة للاستخدام والتطوير المستقبلي! 🚀
