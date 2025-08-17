# منصة شبابنا العالمية

## 🚀 نظرة عامة

منصة رقمية تجمع الشباب المسلم في إسطنبول والعالم للإبداع والعمل التطوعي والتطوير.

## 🛠️ التقنيات المستخدمة

### Frontend

- **React 18** - مكتبة واجهة المستخدم
- **TypeScript** - لغة البرمجة
- **Vite** - أداة البناء
- **Tailwind CSS** - إطار العمل للتصميم
- **Framer Motion** - مكتبة الحركات
- **React Query** - إدارة حالة البيانات
- **React Router** - التوجيه

### Backend

- **Node.js** - بيئة التشغيل
- **Express.js** - إطار العمل
- **PostgreSQL** - قاعدة البيانات
- **JWT** - المصادقة
- **Multer** - رفع الملفات

## 📁 هيكل المشروع

```
client/
├── src/
│   ├── components/     # المكونات القابلة لإعادة الاستخدام
│   ├── pages/         # صفحات التطبيق
│   ├── services/      # خدمات API
│   ├── types/         # تعريفات TypeScript
│   └── utils/         # أدوات مساعدة
├── public/
│   └── images/        # الصور الثابتة
└── package.json
```

## 🎨 نظام التصميم

### الألوان الأساسية

- **Primary:** `slate-900` → `blue-900` → `indigo-900`
- **Text:** `slate-200`, `slate-300`, `slate-600`
- **Backgrounds:** `white`, `gray-50`

### المسافات

- **Sections:** `py-24` (6rem)
- **Containers:** `max-w-6xl` (72rem)
- **Gaps:** `gap-8` (2rem)

### الخطوط

- **H1:** `text-6xl` (3.75rem)
- **H2:** `text-5xl` (3rem)
- **H3:** `text-4xl` (2.25rem)
- **Body:** `text-xl` (1.25rem)

## 🚀 التشغيل

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

## 📝 الميزات

- ✅ تصميم متجاوب
- ✅ دعم RTL/LTR
- ✅ متعدد اللغات
- ✅ نظام مصادقة آمن
- ✅ رفع الصور
- ✅ إدارة المحتوى
- ✅ واجهة إدارية

## 🔧 التطوير

### إضافة صفحة جديدة

1. أنشئ ملف في `src/pages/`
2. أضف المسار في `App.tsx`
3. أضف الترجمة في `locales/`

### إضافة مكون جديد

1. أنشئ مجلد في `src/components/`
2. اتبع نمط المكونات الموجودة
3. استخدم نظام التصميم الموحد

## 📄 الترخيص

MIT License
