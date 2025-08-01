# Build stage
FROM node:18-alpine as build

WORKDIR /app

# نسخ ملفات التبعيات
COPY package*.json ./

# تثبيت التبعيات
RUN npm ci

# نسخ الكود
COPY . .

# Build التطبيق
RUN npm run build

# Production stage
FROM nginx:alpine

# نسخ ملفات الـ build
COPY --from=build /app/dist /usr/share/nginx/html

# نسخ إعدادات Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# فتح المنفذ
EXPOSE 80

# تشغيل Nginx
CMD ["nginx", "-g", "daemon off;"]