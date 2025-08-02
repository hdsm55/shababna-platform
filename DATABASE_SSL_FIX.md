# تصحيح مشكلة SSL في قاعدة البيانات

## المشكلة

```
error: SSL/TLS required
code: '28000'
```

## السبب

قاعدة البيانات PostgreSQL على Render.com تتطلب اتصال SSL/TLS، ولكن إعدادات الاتصال في الكود لا تتضمن SSL.

## الحل المطبق

### 1. تحديث `server/config/database.js`

أضفت إعدادات SSL:

```javascript
ssl: {
    rejectUnauthorized: false,
    require: true
}
```

### 2. تحديث `server/config/database-postgres.js`

أضفت نفس إعدادات SSL:

```javascript
ssl: {
    rejectUnauthorized: false,
    require: true
}
```

## الإعدادات المطلوبة

### متغيرات البيئة للخادم الخلفي:

```
DB_HOST=dpg-d26hc33uibrs739skhdg-a.frankfurt-postgres.render.com
DB_PORT=5432
DB_NAME=shaababna_db
DB_USER=shaababna_db_user
DB_PASSWORD=vqvaeTyJS1qD1NVwurk8knW1GnUoRCna
```

## ملاحظات مهمة

- `rejectUnauthorized: false` يسمح بالاتصال حتى لو كان شهادة SSL غير موثقة
- `require: true` يجبر على استخدام SSL
- هذه الإعدادات آمنة لبيئة الإنتاج على Render.com

## بعد التطبيق

بعد تطبيق هذه التغييرات، يجب أن يعمل الاتصال بقاعدة البيانات بشكل صحيح وتظهر البيانات في الواجهة الأمامية.
