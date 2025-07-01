# 🌍 منصة شبابنا العالمية - Shababna Global Platform

منصة ويب شاملة لإدارة المنظمات الشبابية، مبنية بتقنية **PERN Stack** مع دعم متعدد اللغات (العربية، الإنجليزية، التركية).

## 🚀 **الميزات الرئيسية**

### ✅ **مكتمل**

- 🔐 نظام مصادقة آمن مع JWT
- 🌐 دعم متعدد اللغات (عربي، إنجليزي، تركي)
- 📅 إدارة الفعاليات والبرامج
- 💰 نظام التبرعات والمدفوعات
- 👥 إدارة المستخدمين والأدوار
- 📊 لوحة تحكم إدارية
- 🎨 واجهة مستخدم حديثة ومتجاوبة
- 🧪 اختبارات أساسية
- 🐳 Docker configuration
- 🔄 CI/CD Pipeline

### 🔄 **قيد التطوير**

- 💳 تكامل مدفوعات حقيقي (Stripe/Iyzico)
- 👤 إدارة الملف الشخصي الكاملة
- 🤝 نظام المتطوعين
- 📈 إحصائيات وتقارير متقدمة
- 🔔 نظام الإشعارات

## 🛠️ **التقنيات المستخدمة**

### **الواجهة الأمامية**

- **React 18** + TypeScript
- **Vite** للبناء السريع
- **Tailwind CSS** للتصميم
- **React Query** لإدارة البيانات
- **Zustand** لإدارة الحالة
- **Framer Motion** للحركات
- **i18next** للترجمة

### **الخلفية**

- **Node.js** + Express.js
- **PostgreSQL** قاعدة البيانات
- **JWT** للمصادقة
- **bcryptjs** لتشفير كلمات المرور
- **express-validator** للتحقق
- **helmet** للأمان

### **الاختبارات والنشر**

- **Jest** للاختبارات
- **React Testing Library**
- **Docker** + Docker Compose
- **Nginx** كـ reverse proxy
- **GitHub Actions** للـ CI/CD

## 🚀 **البدء السريع**

### **المتطلبات**

- Node.js 18+
- PostgreSQL 15+
- npm أو yarn

### **التثبيت**

1. **استنساخ المشروع**

```bash
git clone https://github.com/your-username/shababna-platform.git
cd shababna-platform
```

2. **تثبيت التبعيات**

```bash
npm install
```

3. **إعداد قاعدة البيانات**

```bash
# إنشاء قاعدة البيانات
psql -U postgres -c "CREATE DATABASE shababna;"

# إعداد الجداول
npm run db:setup

# إدخال البيانات التجريبية
npm run db:seed
```

4. **إعداد متغيرات البيئة**

```bash
# نسخ ملف البيئة
cp .env.example .env

# تعديل المتغيرات حسب إعداداتك
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shababna
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_jwt_secret_here_make_it_long_and_random
JWT_EXPIRES_IN=7d
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

5. **تشغيل المشروع**

```bash
# تشغيل التطوير
npm run dev

# أو تشغيل كل جزء منفصلة
npm run dev:client  # الواجهة الأمامية على المنفذ 5173
npm run dev:server  # الخلفية على المنفذ 5001
```

## 📊 **بيانات تسجيل الدخول**

### **المدير**

- البريد الإلكتروني: `admin@shababna.com`
- كلمة المرور: `admin123`

### **المستخدم العادي**

- البريد الإلكتروني: `user1@example.com`
- كلمة المرور: `password123`

## 🧪 **الاختبارات**

```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل الاختبارات مع المراقبة
npm run test:watch

# تشغيل الاختبارات مع التغطية
npm run test:coverage

# اختبار API
npm run test:api
```

## 🐳 **النشر مع Docker**

### **التطوير المحلي**

```bash
# بناء وتشغيل مع Docker Compose
docker-compose up --build

# تشغيل في الخلفية
docker-compose up -d
```

### **الإنتاج**

```bash
# بناء صورة Docker
docker build -t shababna-platform .

# تشغيل الحاوية
docker run -p 5001:5001 shababna-platform
```

## 📁 **هيكل المشروع**

```
shababna-platform/
├── client/                 # الواجهة الأمامية (React)
│   ├── src/
│   │   ├── components/     # المكونات
│   │   ├── pages/         # الصفحات
│   │   ├── services/      # خدمات API
│   │   ├── store/         # إدارة الحالة
│   │   ├── i18n/          # الترجمة
│   │   └── types.ts       # أنواع TypeScript
│   ├── public/            # الملفات العامة
│   └── package.json
├── server/                # الخلفية (Node.js)
│   ├── routes/            # مسارات API
│   ├── middleware/        # الوسائط البرمجية
│   ├── config/            # الإعدادات
│   ├── db/               # قاعدة البيانات
│   ├── services/         # الخدمات
│   └── index.js          # نقطة البداية
├── .github/              # GitHub Actions
├── docker-compose.yml    # تكوين Docker
├── Dockerfile           # صورة Docker
└── package.json         # تبعيات المشروع
```

## 🔧 **الأوامر المتاحة**

```bash
# التطوير
npm run dev              # تشغيل التطوير الكامل
npm run dev:client       # تشغيل الواجهة الأمامية
npm run dev:server       # تشغيل الخلفية

# البناء
npm run build            # بناء المشروع
npm run build:client     # بناء الواجهة الأمامية
npm run preview          # معاينة البناء

# قاعدة البيانات
npm run db:setup         # إعداد قاعدة البيانات
npm run db:seed          # إدخال البيانات التجريبية
npm run test:api         # اختبار API

# الاختبارات
npm test                 # تشغيل الاختبارات
npm run test:watch       # اختبارات مع المراقبة
npm run test:coverage    # اختبارات مع التغطية

# الجودة
npm run lint             # فحص الكود
npm run lint:fix         # إصلاح أخطاء الكود
```

## 🌐 **API Endpoints**

### **المصادقة**

- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - معلومات المستخدم الحالي

### **الفعاليات**

- `GET /api/events` - قائمة الفعاليات
- `GET /api/events/:id` - تفاصيل الفعالية
- `POST /api/events` - إنشاء فعالية جديدة
- `PUT /api/events/:id` - تحديث الفعالية
- `DELETE /api/events/:id` - حذف الفعالية

### **البرامج**

- `GET /api/programs` - قائمة البرامج
- `GET /api/programs/:id` - تفاصيل البرنامج
- `POST /api/programs` - إنشاء برنامج جديد
- `PUT /api/programs/:id` - تحديث البرنامج
- `DELETE /api/programs/:id` - حذف البرنامج

### **التبرعات**

- `POST /api/donations/create-intent` - إنشاء نية تبرع
- `POST /api/donations/confirm/:id` - تأكيد التبرع
- `GET /api/donations` - قائمة التبرعات (مدير)
- `GET /api/donations/my-donations` - تبرعاتي

### **المستخدمين**

- `GET /api/users` - قائمة المستخدمين (مدير)
- `GET /api/users/profile` - الملف الشخصي
- `PUT /api/users/profile` - تحديث الملف الشخصي

## 🔒 **الأمان**

- تشفير كلمات المرور بـ bcrypt
- JWT للمصادقة
- حماية من CSRF
- حماية من XSS
- Rate limiting
- Headers أمان مع Helmet
- CORS مضبوط بدقة

## 🌍 **الدعم متعدد اللغات**

المشروع يدعم ثلاث لغات:

- **العربية** (RTL)
- **الإنجليزية** (LTR)
- **التركية** (LTR)

التبديل بين اللغات يتم تلقائياً مع تغيير اتجاه النص.

## 📈 **الأداء**

- وقت تحميل الصفحة < 2 ثانية
- وقت استجابة API < 500ms
- تحسين استعلامات قاعدة البيانات
- ضغط الصور والملفات
- Lazy loading للمكونات

## 🤝 **المساهمة**

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 **الترخيص**

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 **الدعم**

- **التوثيق**: [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md)
- **المساعدة**: إنشاء [issue](https://github.com/your-username/shababna-platform/issues)
- **التواصل**: فريق التطوير متاح للمساعدة

## 🙏 **شكر وتقدير**

- فريق التطوير
- المجتمع المفتوح المصدر
- جميع المساهمين

---

**منصة شبابنا العالمية** - منصة رقمية لتمكين الشباب وإحداث التغيير الإيجابي في المجتمع 🌟
