const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Also check for token in cookies as a fallback
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token || token === 'undefined' || token === 'null') {
        return res.status(401).json({
            success: false,
            message: 'Please log in to continue',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Please sign up or log in again.',
            });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error.name, error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please log in again.',
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid session. Please log in again.',
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Authentication failed. Please log in again.',
        });
    }
};
