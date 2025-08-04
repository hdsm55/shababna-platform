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

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'حدث خطأ غير متوقع',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}