import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function setupPostgreSQL() {
    console.log('🚀 بدء إعداد PostgreSQL...');

    try {
        // التحقق من وجود Docker
        console.log('🔍 التحقق من وجود Docker...');
        await execAsync('docker --version');
        console.log('✅ Docker موجود');

        // إيقاف أي containers موجودة
        console.log('🛑 إيقاف أي containers موجودة...');
        try {
            await execAsync('docker stop shababna-postgres');
            await execAsync('docker rm shababna-postgres');
        } catch (error) {
            console.log('ℹ️ لا توجد containers للوقف');
        }

        // تشغيل PostgreSQL container
        console.log('🐳 تشغيل PostgreSQL container...');
        await execAsync(`
      docker run -d \
        --name shababna-postgres \
        -e POSTGRES_DB=shababna \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=your_password_here \
        -p 5432:5432 \
        -v postgres_data:/var/lib/postgresql/data \
        postgres:15-alpine
    `);

        console.log('⏳ انتظار تشغيل PostgreSQL...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // اختبار الاتصال
        console.log('🔍 اختبار الاتصال بقاعدة البيانات...');
        await execAsync(`
      docker exec shababna-postgres psql -U postgres -d shababna -c "SELECT version();"
    `);

        console.log('✅ تم إعداد PostgreSQL بنجاح!');
        console.log('📊 معلومات الاتصال:');
        console.log('   - Host: localhost');
        console.log('   - Port: 5432');
        console.log('   - Database: shababna');
        console.log('   - User: postgres');
        console.log('   - Password: your_password_here');

    } catch (error) {
        console.error('❌ خطأ في إعداد PostgreSQL:', error.message);
        console.log('💡 تأكد من تثبيت Docker Desktop أولاً');
    }
}

setupPostgreSQL();