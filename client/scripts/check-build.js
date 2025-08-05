#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 فحص الـ build...');

const distPath = join(process.cwd(), 'dist');

// Check if dist folder exists
if (!existsSync(distPath)) {
    console.error('❌ مجلد dist غير موجود. قم بتشغيل npm run build أولاً');
    process.exit(1);
}

// Check for required files
const requiredFiles = [
    'index.html',
    'static.json',
    'assets'
];

const missingFiles = [];

for (const file of requiredFiles) {
    const filePath = join(distPath, file);
    if (!existsSync(filePath)) {
        missingFiles.push(file);
    }
}

if (missingFiles.length > 0) {
    console.error('❌ الملفات المفقودة:', missingFiles.join(', '));
    process.exit(1);
}

// Check index.html content
const indexPath = join(distPath, 'index.html');
const indexContent = readFileSync(indexPath, 'utf8');

if (!indexContent.includes('<div id="root"></div>')) {
    console.error('❌ index.html لا يحتوي على root div');
    process.exit(1);
}

// Check static.json content
const staticPath = join(distPath, 'static.json');
const staticContent = readFileSync(staticPath, 'utf8');
const staticConfig = JSON.parse(staticContent);

if (!staticConfig.routes || !staticConfig.routes['/**']) {
    console.error('❌ static.json لا يحتوي على routes صحيحة');
    process.exit(1);
}

// Check assets folder
const assetsPath = join(distPath, 'assets');
if (existsSync(assetsPath)) {
    const assets = readdirSync(assetsPath);
    console.log('📦 Assets found:', assets.length);
}

console.log('✅ الـ build صحيح!');
console.log('📁 الملفات المطلوبة موجودة');
console.log('🔧 SPA routing مُعد بشكل صحيح');
console.log('🚀 جاهز للـ deployment على Render');