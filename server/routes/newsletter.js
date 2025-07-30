import express from 'express';
import { subscribeToNewsletter, unsubscribeFromNewsletter, getNewsletterSubscribers } from '../controllers/newsletterController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

// الاشتراك في النشرة البريدية (عام)
router.post('/subscribe', subscribeToNewsletter);

// إلغاء الاشتراك من النشرة البريدية (عام)
router.post('/unsubscribe', unsubscribeFromNewsletter);

// جلب قائمة المشتركين (للمديرين فقط)
router.get('/subscribers', authMiddleware, adminMiddleware, getNewsletterSubscribers);

export default router;