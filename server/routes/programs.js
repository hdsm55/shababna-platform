import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database-sqlite.js';
import { getAllPrograms, getProgramById, registerForProgram, createProgram, updateProgram, deleteProgram, supportProgram } from '../controllers/programsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// إعداد multer لحفظ الصور في مجلد uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'server', 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Get all programs (public)
router.get('/', getAllPrograms);

// Get single program (public)
router.get('/:id', getProgramById);

// تسجيل مستخدم في برنامج
router.post('/:id/register', registerForProgram);

// Add a new program (admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createProgram);

// Update a program (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateProgram);

// Delete a program (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProgram);

// Add support for a program (public)
router.post('/:id/support', supportProgram);

export default router;