# إعداد قاعدة البيانات المحلية للتطوير

## المتطلبات الأساسية

1. **PostgreSQL** مثبت على جهازك
2. **Node.js** و **npm** مثبتان

## خطوات الإعداد

### 1. تثبيت PostgreSQL

#### على Windows:
```bash
# تحميل من الموقع الرسمي
https://www.postgresql.org/download/windows/

# أو استخدام Chocolatey
choco install postgresql
```

#### على macOS:
```bash
# استخدام Homebrew
brew install postgresql
brew services start postgresql
```

#### على Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. إنشاء مستخدم قاعدة البيانات

```bash
# الدخول إلى PostgreSQL
sudo -u postgres psql

# إنشاء مستخدم جديد
CREATE USER postgres WITH PASSWORD 'postgres';

# منح الصلاحيات
ALTER USER postgres WITH SUPERUSER;

# الخروج
\q
```

### 3. إعداد قاعدة البيانات

```bash
# تشغيل سكريبت الإعداد
npm run db:setup-postgres
```

### 4. تشغيل الخادم

```bash
# تشغيل الخادم في وضع التطوير
npm run dev:server
```

## استكشاف الأخطاء

### مشكلة الاتصال:
```bash
# التحقق من حالة PostgreSQL
sudo systemctl status postgresql

# إعادة تشغيل الخدمة
sudo systemctl restart postgresql
```

### مشكلة الصلاحيات:
```bash
# تعديل ملف pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf

# إضافة السطر التالي:
local   all             postgres                                peer
local   all             all                                     md5

# إعادة تشغيل PostgreSQL
sudo systemctl restart postgresql
```

## معلومات الاتصال المحلية

- **Host**: localhost
- **Port**: 5432
- **Database**: shababna_dev
- **User**: postgres
- **Password**: postgres

## ملاحظات مهمة

1. تأكد من أن `NODE_ENV=development` في سكريبت التطوير
2. قاعدة البيانات المحلية تستخدم `shababna_dev` كاسم
3. لا يتم استخدام SSL في البيئة المحلية
4. البيانات التجريبية تُضاف تلقائياً عند الإعداد الأول
