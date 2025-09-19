import { getRows } from './server/config/database.js';

async function checkTokens() {
    try {
        console.log('🔍 فحص التوكنات في قاعدة البيانات...\n');

        const tokens = await getRows(`
      SELECT
        prt.id,
        prt.token,
        prt.expires_at,
        prt.used_at,
        prt.created_at,
        u.email,
        u.first_name,
        u.last_name
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      ORDER BY prt.created_at DESC
      LIMIT 10
    `);

        if (tokens.length === 0) {
            console.log('❌ لا يوجد توكنات في قاعدة البيانات');
            return;
        }

        console.log(`✅ تم العثور على ${tokens.length} توكن:`);
        console.log('─'.repeat(100));

        tokens.forEach((token, index) => {
            const isExpired = new Date(token.expires_at) < new Date();
            const isUsed = token.used_at !== null;
            const status = isUsed ? '🔴 مستخدم' : isExpired ? '⏰ منتهي' : '🟢 نشط';

            console.log(`${index + 1}. ${token.first_name} ${token.last_name}`);
            console.log(`   📧 البريد: ${token.email}`);
            console.log(`   🔑 التوكن: ${token.token.substring(0, 20)}...`);
            console.log(`   📊 الحالة: ${status}`);
            console.log(`   ⏰ ينتهي في: ${new Date(token.expires_at).toLocaleString('ar-SA')}`);
            console.log(`   📅 تم الإنشاء: ${new Date(token.created_at).toLocaleString('ar-SA')}`);
            if (token.used_at) {
                console.log(`   ✅ تم الاستخدام: ${new Date(token.used_at).toLocaleString('ar-SA')}`);
            }
            console.log('─'.repeat(100));
        });

        // إحصائيات
        const activeTokens = tokens.filter(t => !t.used_at && new Date(t.expires_at) > new Date());
        const expiredTokens = tokens.filter(t => new Date(t.expires_at) < new Date());
        const usedTokens = tokens.filter(t => t.used_at !== null);

        console.log('\n📊 إحصائيات التوكنات:');
        console.log(`🟢 نشط: ${activeTokens.length}`);
        console.log(`⏰ منتهي: ${expiredTokens.length}`);
        console.log(`🔴 مستخدم: ${usedTokens.length}`);

        if (activeTokens.length > 0) {
            console.log('\n💡 يمكنك استخدام أحد هذه التوكنات النشطة للاختبار:');
            activeTokens.forEach((token, index) => {
                const resetLink = `https://shaababna-frontend.onrender.com/reset-password?token=${token.token}`;
                console.log(`${index + 1}. ${token.email}: ${resetLink}`);
            });
        }

    } catch (error) {
        console.error('❌ خطأ في فحص التوكنات:', error);
    }
}

checkTokens()
    .then(() => {
        console.log('\n✅ انتهى فحص التوكنات');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ فشل فحص التوكنات:', error);
        process.exit(1);
    });
