// اختبار API المدونات
const testBlogsAPI = async () => {
    try {
        console.log('🔍 اختبار API المدونات...');

        // اختبار جلب جميع المدونات
        const blogsResponse = await fetch('http://localhost:5000/api/blogs');
        const blogsData = await blogsResponse.json();

        console.log('📊 استجابة المدونات:', blogsData);
        console.log('📋 عدد المدونات:', blogsData.data?.length || 0);

        if (blogsData.data && blogsData.data.length > 0) {
            blogsData.data.forEach((blog, index) => {
                console.log(`  ${index + 1}. ${blog.title} - ID: ${blog.id}`);
            });

            // اختبار جلب مدونة محددة
            const blogId = blogsData.data[0].id;
            console.log(`\n🔍 اختبار جلب المدونة رقم ${blogId}...`);

            const blogResponse = await fetch(`http://localhost:5000/api/blogs/${blogId}`);
            const blogData = await blogResponse.json();

            console.log('📊 استجابة المدونة المحددة:', blogData);

            if (blogData.success && blogData.data) {
                console.log('✅ المدونة تم جلبها بنجاح');
                console.log(`   العنوان: ${blogData.data.title}`);
                console.log(`   المحتوى: ${blogData.data.content?.substring(0, 100)}...`);
            }
        }

    } catch (error) {
        console.error('❌ خطأ في اختبار API المدونات:', error);
    }
};

testBlogsAPI();