import { testConnection } from './config/database.js';

console.log('🔍 اختبار الاتصال بقاعدة البيانات...');

testConnection()
    .then((success) => {
        if (success) {
            console.log('✅ الاتصال بقاعدة البيانات ناجح!');
        } else {
            console.log('❌ فشل الاتصال بقاعدة البيانات');
        }
    })
    .catch((error) => {
        console.error('❌ خطأ في اختبار الاتصال:', error);
    });