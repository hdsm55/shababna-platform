# 📧 دليل إعداد البريد الإلكتروني

## 🚀 الخيارات المتاحة

### 1. Gmail (موصى به للتطوير)

#### الخطوات:

1. **تفعيل المصادقة الثنائية:**

   - اذهب إلى [حساب Google](https://myaccount.google.com/)
   - اختر **الأمان (Security)**
   - فعّل **المصادقة الثنائية (2-Step Verification)**

2. **إنشاء كلمة مرور للتطبيق:**

   - اذهب إلى **كلمات مرور التطبيقات (App passwords)**
   - اختر **تطبيق آخر**
   - اكتب اسم مثل "Shababna Global"
   - انسخ كلمة المرور المولدة (16 حرف)

3. **إعداد متغيرات البيئة:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
FROM_EMAIL=your_email@gmail.com
FROM_NAME=Shababna Global
ADMIN_EMAILS=your_email@gmail.com
```

### 2. SendGrid (موصى به للإنتاج)

#### الخطوات:

1. **إنشاء حساب:**

   - اذهب إلى [SendGrid](https://sendgrid.com/)
   - أنشئ حساب مجاني (100 إيميل/يوم)

2. **إنشاء مفتاح API:**

   - اذهب إلى **Settings > API Keys**
   - اختر **Full Access** أو **Restricted Access**
   - انسخ المفتاح

3. **إعداد متغيرات البيئة:**

```env
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=your_verified_sender@yourdomain.com
FROM_NAME=Shababna Global
ADMIN_EMAILS=admin@yourdomain.com
```

### 3. Mailgun

#### الخطوات:

1. **إنشاء حساب:**

   - اذهب إلى [Mailgun](https://www.mailgun.com/)
   - أنشئ حساب مجاني

2. **إعداد متغيرات البيئة:**

```env
MAILGUN_USERNAME=your_mailgun_username
MAILGUN_PASSWORD=your_mailgun_password
FROM_EMAIL=your_verified_sender@yourdomain.com
FROM_NAME=Shababna Global
ADMIN_EMAILS=admin@yourdomain.com
```

### 4. Outlook/Hotmail

#### الخطوات:

1. **إنشاء كلمة مرور للتطبيق:**

   - اذهب إلى [حساب Microsoft](https://account.microsoft.com/)
   - اختر **الأمان**
   - فعّل **المصادقة الثنائية**
   - أنشئ كلمة مرور للتطبيق

2. **إعداد متغيرات البيئة:**

```env
OUTLOOK_USER=your_email@outlook.com
OUTLOOK_PASS=your_app_password
FROM_EMAIL=your_email@outlook.com
FROM_NAME=Shababna Global
ADMIN_EMAILS=your_email@outlook.com
```

## 🔧 إعداد ملف .env

أنشئ ملف `.env` في مجلد `server/` وأضف المتغيرات المطلوبة:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shababna_global
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (اختر واحدة من الخيارات أعلاه)
# Gmail
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
FROM_EMAIL=your_email@gmail.com
FROM_NAME=Shababna Global

# أو SendGrid
# SENDGRID_API_KEY=your_sendgrid_api_key
# FROM_EMAIL=your_verified_sender@yourdomain.com
# FROM_NAME=Shababna Global

# Admin Configuration
ADMIN_EMAILS=your_email@gmail.com,admin@shababna-global.com
```

## 🧪 اختبار الإعداد

### 1. تشغيل الخادم:

```bash
cd server
npm start
```

### 2. مراقبة السجلات:

- إذا كانت الإعدادات صحيحة، ستظهر رسالة: `📧 Email service is enabled`
- إذا كانت الإعدادات مفقودة، ستظهر رسالة: `📧 Email service is disabled`

### 3. اختبار إرسال إيميل:

- اذهب إلى صفحة الاتصال
- املأ النموذج وأرسله
- تحقق من إيميلك (أو مجلد الرسائل غير المرغوب فيها)

## 🔍 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ "Invalid login":**

   - تأكد من تفعيل المصادقة الثنائية
   - تأكد من استخدام كلمة مرور التطبيق وليس كلمة المرور العادية

2. **خطأ "Authentication failed":**

   - تحقق من صحة اسم المستخدم وكلمة المرور
   - تأكد من أن مزود البريد يدعم SMTP

3. **الإيميلات لا تصل:**

   - تحقق من مجلد الرسائل غير المرغوب فيها
   - تأكد من صحة عنوان البريد الإلكتروني

4. **خطأ "Connection timeout":**
   - تحقق من إعدادات الجدار الناري
   - تأكد من صحة المنفذ (587 أو 465)

## 📊 مراقبة الإيميلات

جميع الإيميلات مسجلة في قاعدة البيانات في جدول `email_logs`:

```sql
-- عرض جميع الإيميلات المرسلة
SELECT * FROM email_logs ORDER BY sent_at DESC;

-- عرض الإيميلات الفاشلة
SELECT * FROM email_logs WHERE status = 'failed';

-- إحصائيات الإيميلات
SELECT
  email_type,
  status,
  COUNT(*) as count
FROM email_logs
GROUP BY email_type, status;
```

## 🚀 للإنتاج

للإنتاج، يُنصح باستخدام:

1. **SendGrid** أو **Mailgun** (خدمات احترافية)
2. **نطاق مخصص** للبريد الإلكتروني
3. **تسجيل SPF و DKIM** لتحسين التسليم
4. **مراقبة معدل التسليم** والارتداد
