const jwt = require('jsonwebtoken');

/**
 * Admin authentication middleware
 * Verifies the admin JWT token and checks for admin role
 */
exports.adminProtect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token === 'undefined' || token === 'null') {
        return res.status(401).json({
            success: false,
            message: 'Admin authentication required',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.',
            });
        }

        req.admin = {
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error.name, error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Admin session expired. Please log in again.',
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin session. Please log in again.',
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Admin authentication failed.',
        });
    }
};
