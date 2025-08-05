import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعداد multer للصور
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../public/uploads');

        // إنشاء المجلد إذا لم يكن موجوداً
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // إنشاء اسم فريد للملف
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// فلتر الملفات
const fileFilter = (req, file, cb) => {
    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('نوع الملف غير مدعوم. يرجى اختيار صورة بصيغة JPG أو PNG أو WebP.'), false);
    }
};

// إعداد multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    }
});

// POST /api/upload/image
router.post('/image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'لم يتم اختيار ملف'
            });
        }

        // إنشاء URL للصورة
        const imageUrl = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            message: 'تم رفع الصورة بنجاح',
            url: imageUrl,
            filename: req.file.filename,
            size: req.file.size
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء رفع الصورة'
        });
    }
});

// GET /api/upload/images - للحصول على قائمة الصور (اختياري)
router.get('/images', (req, res) => {
    try {
        const uploadDir = path.join(__dirname, '../public/uploads');

        if (!fs.existsSync(uploadDir)) {
            return res.json({
                success: true,
                images: []
            });
        }

        const files = fs.readdirSync(uploadDir);
        const images = files
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
            })
            .map(file => ({
                filename: file,
                url: `/uploads/${file}`,
                size: fs.statSync(path.join(uploadDir, file)).size
            }));

        res.json({
            success: true,
            images: images
        });

    } catch (error) {
        console.error('Error getting images:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب الصور'
        });
    }
});

// DELETE /api/upload/image/:filename - لحذف صورة
router.delete('/image/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../public/uploads', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'تم حذف الصورة بنجاح'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'الصورة غير موجودة'
            });
        }

    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء حذف الصورة'
        });
    }
});

export default router;