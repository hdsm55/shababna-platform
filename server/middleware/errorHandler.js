export default function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    // معالجة خاصة لأخطاء قاعدة البيانات
    if (err.message && (
        err.message.includes('Connection terminated') ||
        err.message.includes('timeout') ||
        err.message.includes('ECONNRESET') ||
        err.message.includes('ENOTFOUND')
    )) {
        return res.status(503).json({
            success: false,
            message: 'خطأ في الاتصال بقاعدة البيانات، يرجى المحاولة مرة أخرى',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }

    // معالجة أخطاء JSON parsing
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'بيانات غير صحيحة',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }

    // معالجة أخطاء قاعدة البيانات الأخرى
    if (err.code === '23505') { // unique constraint violation
        return res.status(400).json({
            success: false,
            message: 'البيانات موجودة مسبقاً'
        });
    }

    if (err.code === '23503') { // foreign key constraint violation
        return res.status(400).json({
            success: false,
            message: 'البيانات المرتبطة غير موجودة'
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'حدث خطأ غير متوقع',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}