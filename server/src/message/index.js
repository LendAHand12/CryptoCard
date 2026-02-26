module.exports = {
    success: (res, message, data) => res.json({
        message: message,
        data: data,
        status: true,
        code : 1
    }).status(200),
    error_500: (res, e) => res.status(500).json({
        message: "Có lỗi trong quá trình xử lý",
        errors: e,
        status: false
    }),
    error_400: (res, message, e) => res.status(400).json({
        message: message,
        errors: e,
        status: false
    }),
     error_503: (res, message, e) => res.status(503).json({
         message: message,
         errors: e,
         status: false
     }),
}