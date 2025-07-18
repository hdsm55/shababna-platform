import express from 'express';
import {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
} from '../controllers/blogsController.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// جلب جميع التدوينات
router.get('/', getAllBlogs);
// جلب تدوينة واحدة
router.get('/:id', getBlogById);
// إضافة تدوينة (يتطلب صلاحية أدمن)
router.post('/', authMiddleware, adminMiddleware, createBlog);
// تعديل تدوينة (يتطلب صلاحية أدمن)
router.put('/:id', authMiddleware, adminMiddleware, updateBlog);
// حذف تدوينة (يتطلب صلاحية أدمن)
router.delete('/:id', authMiddleware, adminMiddleware, deleteBlog);

export default router;