const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ success: false, error: 'Not authorized, insufficient role' });
            return;
        }
        next();
    };
};

module.exports = authorize;
