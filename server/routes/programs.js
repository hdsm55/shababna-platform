import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { getAllPrograms, getProgramById, registerForProgram, createProgram, updateProgram, deleteProgram, supportProgram, getProgramSupporters } from '../controllers/programsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// إعداد multer لحفظ الصور في مجلد uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), 'server', 'public', 'uploads');
        // إنشاء المجلد إذا لم يكن موجوداً
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'program-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage });

// Get all programs (public)
router.get('/', getAllPrograms);

// Get program supporters (admin only) - يجب أن يكون قبل /:id
router.get('/supporters', authMiddleware, adminMiddleware, getProgramSupporters);

// Get single program (public)
router.get('/:id', getProgramById);

// تسجيل مستخدم في برنامج
router.post('/:id/register', registerForProgram);

// Add a new program (admin only)
router.post('/', authMiddleware, adminMiddleware, createProgram);

// Update a program (admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateProgram);

// Delete a program (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProgram);

// Add support for a program (public)
router.post('/:id/support', supportProgram);

export default router;