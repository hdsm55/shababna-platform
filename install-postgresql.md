# دليل تثبيت PostgreSQL

## الطريقة الأولى: تثبيت مباشر

### 1. تحميل PostgreSQL

- اذهب إلى: https://www.postgresql.org/download/windows/
- حمل أحدث إصدار (PostgreSQL 15 أو أحدث)
- شغل الملف المحمل

### 2. إعداد التثبيت

- **Password:** `123456` (كلمة المرور الافتراضية)
- **Port:** `5432` (المنفذ الافتراضي)
- **Locale:** `Default locale`
- **Stack Builder:** لا حاجة (اختر Skip)

### 3. تأكيد التثبيت

```bash
# افتح PowerShell واكتب:
psql --version
```

## الطريقة الثانية: استخدام Docker

### 1. تثبيت Docker Desktop

- اذهب إلى: https://www.docker.com/products/docker-desktop/
- حمل Docker Desktop
- شغل الملف المحمل

### 2. تشغيل PostgreSQL في Docker

```bash
# تشغيل PostgreSQL
docker run --name postgres-shababna -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=shababna -p 5432:5432 -d postgres:15

# التحقق من التشغيل
docker ps
```

## الطريقة الثالثة: استخدام Chocolatey

### 1. تثبيت Chocolatey (إذا لم يكن مثبتاً)

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### 2. تثبيت PostgreSQL

```powershell
choco install postgresql
```

## بعد التثبيت

### 1. تشغيل خدمة PostgreSQL

```powershell
# إذا كان مثبتاً كخدمة
net start postgresql-x64-15

# أو تشغيل يدوي
"C:\Program Files\PostgreSQL\15\bin\pg_ctl.exe" -D "C:\Program Files\PostgreSQL\15\data" start
```

### 2. اختبار الاتصال

```bash
psql -h localhost -U postgres -d postgres
# كلمة المرور: 123456
```

### 3. إعداد قاعدة البيانات

```bash
# تشغيل سكريبت الإعداد
npm run db:setup-postgres
```

### 4. تشغيل التطبيق

```bash
npm run dev
```

## استكشاف الأخطاء

### إذا لم يعمل psql:

1. أضف PostgreSQL إلى PATH:
   - `C:\Program Files\PostgreSQL\15\bin`
2. أعد تشغيل PowerShell

### إذا لم يعمل الاتصال:

1. تأكد من تشغيل خدمة PostgreSQL
2. تحقق من المنفذ 5432
3. تحقق من كلمة المرور

### إذا لم يعمل Docker:

1. تأكد من تشغيل Docker Desktop
2. أعد تشغيل Docker Desktop
3. جرب الأمر مرة أخرى

## معلومات الاتصال الافتراضية

- **Host:** localhost
- **Port:** 5432
- **Database:** shababna
- **Username:** postgres
- **Password:** 123456
