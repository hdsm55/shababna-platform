// اختبار API الفعاليات
const testEventsAPI = async () => {
    try {
        console.log('🔍 اختبار API الفعاليات...');

        const response = await fetch('http://localhost:5000/api/events');
        const data = await response.json();

        console.log('📊 استجابة API:', data);
        console.log('📋 عدد الفعاليات:', data.data?.events?.length || 0);

        if (data.data?.events) {
            data.data.events.forEach((event, index) => {
                console.log(`  ${index + 1}. ${event.title} - ${event.status}`);
            });
        }

    } catch (error) {
        console.error('❌ خطأ في اختبار API:', error);
    }
};

testEventsAPI();