// فحص متغيرات البيئة
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

console.log('🔍 فحص متغيرات البيئة...\n');

const requiredVars = [
    'RESEND_API_KEY',
    'SENDER_EMAIL',
    'SENDER_NAME',
    'RESET_LINK_BASE',
    'TOKEN_TTL_MINUTES'
];

console.log('📋 المتغيرات المطلوبة:');
requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}: ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`);
    } else {
        console.log(`❌ ${varName}: غير محدد`);
    }
});

console.log('\n🔧 إعدادات البريد الإلكتروني:');
console.log(`📧 SENDER_EMAIL: ${process.env.SENDER_EMAIL || 'غير محدد'}`);
console.log(`👤 SENDER_NAME: ${process.env.SENDER_NAME || 'غير محدد'}`);
console.log(`🔑 RESEND_API_KEY: ${process.env.RESEND_API_KEY ? 'محدد' : 'غير محدد'}`);
console.log(`🔗 RESET_LINK_BASE: ${process.env.RESET_LINK_BASE || 'غير محدد'}`);

console.log('\n💡 الحل:');
console.log('1. أنشئ ملف .env في المجلد الجذر');
console.log('2. أضف المتغيرات المطلوبة');
console.log('3. أعد تشغيل الخادم');
