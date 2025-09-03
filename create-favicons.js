#!/usr/bin/env node

/**
 * سكريبت إنشاء أيقونات المتصفح (Favicon)
 * يقوم بتحويل logo.jpg إلى جميع الأحجام المطلوبة
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎯 بدء إنشاء أيقونات المتصفح...\n');

// المسارات
const sourceImage = path.join(__dirname, 'client', 'public', 'images', 'logo.jpg');
const outputDir = path.join(__dirname, 'client', 'public', 'images');

// أحجام الأيقونات المطلوبة
const iconSizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

// التحقق من وجود الصورة المصدر
if (!fs.existsSync(sourceImage)) {
  console.error('❌ الصورة المصدر غير موجودة:', sourceImage);
  console.log('📁 يرجى التأكد من وجود logo.jpg في المسار الصحيح');
  process.exit(1);
}

console.log('✅ تم العثور على الصورة المصدر:', path.basename(sourceImage));
console.log('📁 مجلد الإخراج:', outputDir);

// إنشاء مجلد الإخراج إذا لم يكن موجوداً
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('📁 تم إنشاء مجلد الإخراج');
}

console.log('\n📋 الأيقونات المطلوبة:');
iconSizes.forEach(icon => {
  console.log(`   • ${icon.name} (${icon.size}x${icon.size})`);
});

console.log('\n⚠️  ملاحظة مهمة:');
console.log('   هذا السكريبت يحتاج إلى مكتبة sharp لمعالجة الصور');
console.log('   قم بتثبيتها باستخدام: npm install sharp');
console.log('\n🔧 طرق بديلة لإنشاء الأيقونات:');

console.log('\n1️⃣  استخدام أدوات عبر الإنترنت:');
console.log('   • https://realfavicongenerator.net/');
console.log('   • https://favicon.io/');
console.log('   • https://www.favicon-generator.org/');

console.log('\n2️⃣  استخدام برامج التصميم:');
console.log('   • Photoshop');
console.log('   • GIMP (مجاني)');
console.log('   • Canva');

console.log('\n3️⃣  استخدام سكريبت مع sharp:');
console.log('   npm install sharp');
console.log('   node create-favicons-with-sharp.js');

console.log('\n📁 بعد إنشاء الأيقونات، ضعها في:');
console.log('   client/public/images/');

console.log('\n🎯 الأيقونات المطلوبة:');
console.log('   • logo.ico (أيقونة أساسية)');
console.log('   • favicon-16x16.png');
console.log('   • favicon-32x32.png');
console.log('   • apple-touch-icon.png (180x180)');
console.log('   • android-chrome-192x192.png');
console.log('   • android-chrome-512x512.png');

console.log('\n✅ تم تحديث إعدادات HTML و PWA');
console.log('   • client/index.html');
console.log('   • client/public/site.webmanifest');

console.log('\n🚀 بعد وضع الأيقونات:');
console.log('   1. أعد تشغيل الخادم');
console.log('   2. امسح ذاكرة التخزين المؤقت للمتصفح');
console.log('   3. تحقق من ظهور الأيقونة في التبويب');

console.log('\n📚 للمزيد من المعلومات، راجع:');
console.log('   FAVICON_SETUP_INSTRUCTIONS.md');
