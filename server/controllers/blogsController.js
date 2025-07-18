import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAllBlogs = async (req, res) => {
    try {
        const result = await query('SELECT * FROM blogs ORDER BY created_at DESC');
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
        const { title, content, image_url, author_id } = req.body;
        const result = await query(
            'INSERT INTO blogs (title, content, image_url, author_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, content, image_url, author_id]
        );
        return successResponse(res, result.rows[0], 'تم إنشاء التدوينة بنجاح');
    } catch (error) {
        return errorResponse(res, error, 'حدث خطأ أثناء إنشاء التدوينة');
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, image_url, author_id } = req.body;
        const result = await query(
            'UPDATE blogs SET title = $1, content = $2, image_url = $3, author_id = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
            [title, content, image_url, author_id, id]
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