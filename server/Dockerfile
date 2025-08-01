FROM node:18-alpine

# إنشاء مجلد العمل
WORKDIR /app

# نسخ ملفات التبعيات
COPY package*.json ./

# تثبيت التبعيات
RUN npm ci --only=production

# نسخ الكود
COPY . .

# إنشاء مجلد للـ logs
RUN mkdir -p /app/logs

# فتح المنفذ
EXPOSE 5000

# تشغيل التطبيق
CMD ["node", "index.js"]