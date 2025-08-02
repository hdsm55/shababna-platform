import fs from 'fs';
import path from 'path';

function checkBuild() {
    try {
        console.log('🔍 التحقق من ملفات البناء...');

        const currentDir = process.cwd();
        console.log('📁 المجلد الحالي:', currentDir);

        // التحقق من وجود مجلد client
        const clientDir = path.join(currentDir, 'client');
        if (fs.existsSync(clientDir)) {
            console.log('✅ مجلد client موجود');

            // التحقق من وجود dist
            const distDir = path.join(clientDir, 'dist');
            if (fs.existsSync(distDir)) {
                console.log('✅ مجلد dist موجود');

                // التحقق من وجود index.html
                const indexPath = path.join(distDir, 'index.html');
                if (fs.existsSync(indexPath)) {
                    console.log('✅ ملف index.html موجود');
                    console.log('📄 حجم الملف:', fs.statSync(indexPath).size, 'bytes');
                } else {
                    console.log('❌ ملف index.html غير موجود');
                }

                // عرض محتويات مجلد dist
                const distFiles = fs.readdirSync(distDir);
                console.log('📋 ملفات dist:', distFiles);
            } else {
                console.log('❌ مجلد dist غير موجود');
            }
        } else {
            console.log('❌ مجلد client غير موجود');
        }

        // عرض محتويات المجلد الحالي
        const currentFiles = fs.readdirSync(currentDir);
        console.log('📋 ملفات المجلد الحالي:', currentFiles);

    } catch (error) {
        console.error('❌ خطأ في التحقق من البناء:', error);
    }
}

checkBuild();