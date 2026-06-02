const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Car = require('../models/Car');

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('Admin credentials not configured in .env');
            return res.status(500).json({
                success: false,
                message: 'Admin login is not configured',
            });
        }

        if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials',
            });
        }

        const token = jwt.sign(
            { email: adminEmail, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            token,
            admin: {
                email: adminEmail,
                role: 'admin',
            },
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during admin login',
        });
    }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Admin
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalBookings, totalReviews, totalCars] = await Promise.all([
            User.countDocuments(),
            Booking.countDocuments(),
            Review.countDocuments(),
            Car.countDocuments({ isActive: true }),
        ]);

        const revenueResult = await Booking.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        const bookingsByStatus = await Booking.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'fullName email');

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('-password');

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalBookings,
                totalReviews,
                totalCars,
                totalRevenue,
                bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
            },
            recentBookings,
            recentUsers,
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching dashboard stats',
        });
    }
};

/**
 * @desc    Get all bookings
 * @route   GET /api/admin/bookings
 * @access  Admin
 */
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .sort({ createdAt: -1 })
            .populate('user', 'fullName email');

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching bookings',
        });
    }
};

/**
 * @desc    Update booking status
 * @route   PUT /api/admin/bookings/:id/status
 * @access  Admin
 */
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: confirmed, cancelled, or completed',
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'fullName email');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        res.status(200).json({
            success: true,
            booking,
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating booking',
        });
    }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching users',
        });
    }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting user',
        });
    }
};

/**
 * @desc    Get all reviews
 * @route   GET /api/admin/reviews
 * @access  Admin
 */
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .sort({ createdAt: -1 })
            .populate('user', 'fullName email');

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews,
        });
    } catch (error) {
        console.error('Get all reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching reviews',
        });
    }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/admin/reviews/:id
 * @access  Admin
 */
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting review',
        });
    }
};
