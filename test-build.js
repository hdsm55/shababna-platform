#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 اختبار البناء المحلي...');

try {
    // التأكد من وجود مجلد client
    if (!fs.existsSync('client')) {
        console.error('❌ مجلد client غير موجود');
        process.exit(1);
    }

    process.chdir('client');

    console.log('📦 تثبيت التبعيات...');
    execSync('npm ci', { stdio: 'inherit' });

    console.log('🏗️ بناء المشروع...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('📋 تشغيل postbuild script...');
    execSync('npm run postbuild', { stdio: 'inherit' });

    // التحقق من وجود ملفات dist
    const distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
        console.error('❌ مجلد dist لم يتم إنشاؤه');
        process.exit(1);
    }

    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.error('❌ ملف index.html غير موجود في dist');
        process.exit(1);
    }

    console.log('✅ البناء تم بنجاح!');
    console.log('📁 محتويات مجلد dist:');
    const files = fs.readdirSync(distPath);
    files.forEach(file => {
        console.log(`  - ${file}`);
    });

} catch (error) {
    console.error('❌ خطأ في البناء:', error.message);
    process.exit(1);
}
