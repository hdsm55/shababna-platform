async function testAPI() {
    try {
        console.log('🔍 اختبار API للفعالية رقم 5...');

        const response = await fetch('http://localhost:5000/api/events/5');
        const data = await response.json();

        console.log('📊 استجابة API:', JSON.stringify(data, null, 2));

        if (data.success) {
            console.log('✅ API يعمل بشكل صحيح');
            console.log('📋 بيانات الفعالية:', {
                id: data.data.id,
                title: data.data.title,
                status: data.data.status
            });
        } else {
            console.log('❌ خطأ في API:', data.message);
        }
    } catch (error) {
        console.error('❌ خطأ في الاتصال:', error.message);
    }
}

testAPI();