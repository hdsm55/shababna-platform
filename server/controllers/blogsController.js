import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAllBlogs = async (req, res) => {
    try {
        const { search } = req.query;

        let queryText = 'SELECT * FROM blogs';
        const params = [];

        if (search) {
            queryText += ' WHERE title ILIKE $1 OR content ILIKE $1';
            params.push(`%${search}%`);
        }

        queryText += ' ORDER BY created_at DESC';

        const result = await query(queryText, params);
        return successResponse(res, result.rows, 'تم جلب جميع التدوينات بنجاح');
    } catch (error) {
        return errorResponse(res, error, 'حدث خطأ أثناء جلب التدوينات');
    }
};

export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM blogs WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'لم يتم العثور على التدوينة' });
        }
        return successResponse(res, result.rows[0], 'تم جلب التدوينة بنجاح');
    } catch (error) {
        return errorResponse(res, error, 'حدث خطأ أثناء جلب التدوينة');
    }
};

export const createBlog = async (req, res) => {
    try {
        const { title, content, author, image_url } = req.body;
        // استخدام الصورة الافتراضية للمقالات
        const finalImageUrl = image_url && image_url.trim() !== '' ? image_url : '/images/blog-default.jpg';
        const result = await query(
            'INSERT INTO blogs (title, content, author, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, content, author, finalImageUrl]
        );
        return successResponse(res, result.rows[0], 'تم إنشاء التدوينة بنجاح');
    } catch (error) {
        return errorResponse(res, error, 'حدث خطأ أثناء إنشاء التدوينة');
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author, image_url } = req.body;
        // استخدام الصورة الافتراضية للمقالات
        const finalImageUrl = image_url && image_url.trim() !== '' ? image_url : '/images/blog-default.jpg';
        const result = await query(
            'UPDATE blogs SET title = $1, content = $2, author = $3, image_url = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
            [title, content, author, finalImageUrl, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'لم يتم العثور على التدوينة' });
        }
        return successResponse(res, result.rows[0], 'تم تحديث التدوينة بنجاح');
    } catch (error) {
        return errorResponse(res, error, 'حدث خطأ أثناء تحديث التدوينة');
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'لم يتم العثور على التدوينة' });
        }
        return successResponse(res, result.rows[0], 'تم حذف التدوينة بنجاح');
    } catch (error) {
        return errorResponse(res, error, 'حدث خطأ أثناء حذف التدوينة');
    }
};