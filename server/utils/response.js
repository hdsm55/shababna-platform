export function successResponse(res, data = {}, message = 'تمت العملية بنجاح', status = 200) {
    return res.status(status).json({ success: true, message, data });
}

export function errorResponse(res, message = 'حدث خطأ ما', status = 500, error = null) {
    return res.status(status).json({ success: false, message, error });
}