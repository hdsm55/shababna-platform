// اختبار End-to-End احترافي لمنصة شبابنا
import request from 'supertest';
import app from '../index.js'; // يفترض أن app هو express instance

describe('🧪 اختبارات منصة شبابنا - E2E', () => {
    let userToken, adminToken, eventId, programId;
    const testUser = {
        email: `testuser${Date.now()}@mail.com`,
        password: 'Test@1234',
        first_name: 'Test',
        last_name: 'User'
    };
    const adminLogin = {
        email: 'admin@shababna.com',
        password: 'Admin@1234'
    };

    it('تسجيل مستخدم جديد (Register)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser)
            .set('Accept-Language', 'ar');
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        userToken = res.body.data.token;
    });

    it('تسجيل الدخول (Login)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password })
            .set('Accept-Language', 'en');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        userToken = res.body.data.token;
    });

    it('تسجيل الدخول كأدمن (Admin Login)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send(adminLogin)
            .set('Accept-Language', 'ar');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        adminToken = res.body.data.token;
    });

    it('إنشاء فعالية جديدة (Create Event) [Admin]', async () => {
        const res = await request(app)
            .post('/api/events')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'فعالية اختبارية',
                description: 'وصف فعالية اختبارية طويلة بما يكفي',
                location: 'الرياض',
                start_date: '2024-07-01',
                end_date: '2024-07-02',
                category: 'workshop'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        eventId = res.body.data.id;
    });

    it('تسجيل مستخدم في فعالية (Register for Event)', async () => {
        const res = await request(app)
            .post(`/api/events/${eventId}/register`)
            .send({
                first_name: 'Test',
                last_name: 'User',
                email: testUser.email
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('إنشاء برنامج جديد (Create Program) [Admin]', async () => {
        const res = await request(app)
            .post('/api/programs')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'برنامج اختباري',
                description: 'وصف برنامج اختباري',
                start_date: '2024-07-10',
                end_date: '2024-07-20'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        programId = res.body.data.id;
    });

    it('تسجيل مستخدم في برنامج (Register for Program)', async () => {
        const res = await request(app)
            .post(`/api/programs/${programId}/register`)
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: testUser.email
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('حماية المسارات الإدارية (RBAC)', async () => {
        const res = await request(app)
            .get('/api/dashboard/stats')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
    });

    it('استعادة كلمة المرور (Forgot/Reset Password)', async () => {
        // طلب رمز استعادة
        const forgotRes = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: testUser.email });
        expect(forgotRes.statusCode).toBe(200);
        expect(forgotRes.body.success).toBe(true);
        // ملاحظة: في اختبار حقيقي يجب جلب الرمز من قاعدة البيانات أو البريد
    });

    it('إرسال مدخلات غير صالحة (Validation)', async () => {
        const res = await request(app)
            .post('/api/events')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ title: '', description: '', location: '', start_date: '', end_date: '', category: '' });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });
});