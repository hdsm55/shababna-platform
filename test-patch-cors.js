import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { query } from './server/config/database.js';

async function testPatchCors() {
    try {
        console.log('🧪 اختبار PATCH method مع CORS...');

        // إنشاء token
        const userResult = await query('SELECT * FROM users WHERE role = $1 LIMIT 1', ['admin']);
        const user = userResult.rows[0];

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
            { expiresIn: '24h' }
        );

        // جلب رسالة للاختبار
        const formsResult = await query('SELECT * FROM contact_forms LIMIT 1');
        if (formsResult.rows.length === 0) {
            console.log('❌ لا توجد رسائل للاختبار');
            return;
        }

        const form = formsResult.rows[0];
        console.log('📋 الرسالة المختارة:', form.id, form.name, form.is_read);

        // اختبار PATCH method
        const newReadStatus = !form.is_read;
        console.log(`🔄 اختبار PATCH method - تحديث حالة القراءة إلى: ${newReadStatus}`);

        const response = await fetch(`http://localhost:5000/api/contact-forms/${form.id}/read`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ is_read: newReadStatus })
        });

        console.log('📊 Status:', response.status);
        console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            const data = await response.json();
            console.log('✅ PATCH method يعمل بنجاح!');
            console.log('📊 البيانات المُحدثة:', JSON.stringify(data, null, 2));
        } else {
            const errorData = await response.text();
            console.log('❌ PATCH method فشل:', errorData);
        }

    } catch (error) {
        console.error('❌ خطأ في اختبار PATCH method:', error);
    }
}

testPatchCors();
