const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server error';

    console.error(`[Error] ${req.method} ${req.originalUrl} - ${statusCode} - ${message}`);
    if (err && err.stack) {
        console.error(err.stack);
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }

    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value';
    }

    if (err.name === 'ValidationError') {
        statusCode = 400;
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(statusCode).json({ success: false, errors });
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Not authorized, token invalid';
    }

    const response = { success: false, error: message };

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
