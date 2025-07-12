export default function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'حدث خطأ غير متوقع',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}