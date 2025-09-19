import { query } from './config/database.js';

async function checkAndAddBlogs() {
    try {
        console.log('🔍 فحص جدول المدونة...');
        const result = await query('SELECT id, title, content, author, created_at FROM blogs ORDER BY created_at DESC LIMIT 5');

        if (result.rows.length === 0) {
            console.log('❌ لا توجد مقالات في قاعدة البيانات');

            // إضافة مقالات تجريبية
            console.log('➕ إضافة مقالات تجريبية...');

            const sampleBlogs = [
                {
                    title: 'ريادة الأعمال للشباب: من الفكرة إلى المشروع',
                    content: '<h2>مقدمة</h2><p>ريادة الأعمال هي طريق مميز للشباب لتحقيق أحلامهم وبناء مستقبلهم. في هذا المقال سنتعرف على كيفية تحويل الأفكار إلى مشاريع ناجحة.</p><h3>الخطوات الأساسية</h3><ul><li>تحديد الفكرة</li><li>إجراء دراسة الجدوى</li><li>وضع خطة العمل</li><li>البحث عن التمويل</li><li>تنفيذ المشروع</li></ul><p>ريادة الأعمال تتطلب شجاعة وإصرار، لكن النتائج تستحق الجهد المبذول.</p>',
                    author: 'سارة أحمد'
                },
                {
                    title: 'الصحة النفسية للشباب: دليل شامل',
                    content: '<h2>أهمية الصحة النفسية</h2><p>الصحة النفسية هي جزء أساسي من الصحة العامة، خاصة للشباب الذين يواجهون تحديات متعددة في حياتهم.</p><h3>علامات الصحة النفسية الجيدة</h3><ul><li>القدرة على التعامل مع التوتر</li><li>الحفاظ على العلاقات الاجتماعية</li><li>الشعور بالرضا عن النفس</li><li>القدرة على التركيز والإنتاجية</li></ul><h3>نصائح للحفاظ على الصحة النفسية</h3><p>1. ممارسة الرياضة بانتظام<br/>2. الحصول على قسط كاف من النوم<br/>3. تناول الطعام الصحي<br/>4. الحفاظ على العلاقات الاجتماعية<br/>5. طلب المساعدة عند الحاجة</p>',
                    author: 'على محمد'
                },
                {
                    title: 'التكنولوجيا الحديثة وتأثيرها على الشباب',
                    content: '<h2>عصر التكنولوجيا</h2><p>نعيش اليوم في عصر التكنولوجيا حيث تؤثر التقنيات الحديثة على جميع جوانب حياتنا، خاصة حياة الشباب.</p><h3>الإيجابيات</h3><ul><li>تسهيل التواصل</li><li>الوصول للمعلومات</li><li>تطوير المهارات</li><li>فرص العمل الجديدة</li></ul><h3>التحديات</h3><ul><li>الإدمان على الأجهزة</li><li>تأثير على العلاقات الاجتماعية</li><li>مشاكل صحية</li><li>الخصوصية والأمان</li></ul><p>يجب على الشباب الاستفادة من التكنولوجيا بحكمة ووعي.</p>',
                    author: 'محمد حسن'
                }
            ];

            for (const blog of sampleBlogs) {
                await query(
                    'INSERT INTO blogs (title, content, author, created_at) VALUES ($1, $2, $3, NOW())',
                    [blog.title, blog.content, blog.author]
                );
                console.log(`✅ تمت إضافة: ${blog.title}`);
            }

            console.log('🎉 تمت إضافة جميع المقالات التجريبية بنجاح!');

        } else {
            console.log(`✅ يوجد ${result.rows.length} مقال في قاعدة البيانات:`);
            result.rows.forEach((blog, index) => {
                console.log(`${index + 1}. ${blog.title} - ${blog.author}`);
                console.log(`   المحتوى: ${blog.content ? blog.content.substring(0, 100) + '...' : 'لا يوجد محتوى'}`);
                console.log('');
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ خطأ:', error);
        process.exit(1);
    }
}

checkAndAddBlogs();
