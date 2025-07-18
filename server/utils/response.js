const messages = {
    success: {
        ar: 'تمت العملية بنجاح',
        en: 'Operation completed successfully'
    },
    error: {
        ar: 'حدث خطأ ما',
        en: 'An error occurred'
    },
    validation: {
        ar: 'البيانات المدخلة غير صالحة',
        en: 'Invalid input data'
    },
    notFound: {
        ar: 'العنصر غير موجود',
        en: 'Resource not found'
    }
};

function getLang(req) {
    return (req.headers['accept-language'] || req.query.lang || 'ar').toLowerCase().startsWith('en') ? 'en' : 'ar';
}

export function successResponse(res, data = {}, messageKey = 'success', status = 200) {
    const lang = getLang(res.req);
    const message = messages[messageKey]?.[lang] || messageKey;
    return res.status(status).json({ success: true, message, data });
}

export function errorResponse(res, messageKey = 'error', status = 500, error = null) {
    const lang = getLang(res.req);
    const message = messages[messageKey]?.[lang] || messageKey;
    return res.status(status).json({ success: false, message, error });
}