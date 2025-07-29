import { getDatabase } from './config/database.js';

async function checkUsers() {
    try {
        console.log('🔍 التحقق من المستخدمين الموجودين...');
        const database = await getDatabase();

        const users = await database.all('SELECT id, first_name, last_name, email, role FROM users');

        console.log('👥 المستخدمين الموجودين:');
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.first_name} ${user.last_name} (${user.email}) - ${user.role}`);
        });

        console.log(`📊 إجمالي المستخدمين: ${users.length}`);

    } catch (error) {
        console.error('❌ خطأ في التحقق من المستخدمين:', error);
    }
}

checkUsers();