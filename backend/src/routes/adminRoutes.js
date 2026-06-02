const express = require('express');
const router = express.Router();
const {
    adminLogin,
    getDashboardStats,
    getAllBookings,
    updateBookingStatus,
    getAllUsers,
    deleteUser,
    getAllReviews,
    deleteReview,
} = require('../controllers/adminController');
const { adminProtect } = require('../middleware/adminAuth');

// Public
router.post('/login', adminLogin);

// Protected (admin only)
router.get('/dashboard', adminProtect, getDashboardStats);
router.get('/bookings', adminProtect, getAllBookings);
router.put('/bookings/:id/status', adminProtect, updateBookingStatus);
router.get('/users', adminProtect, getAllUsers);
router.delete('/users/:id', adminProtect, deleteUser);
router.get('/reviews', adminProtect, getAllReviews);
router.delete('/reviews/:id', adminProtect, deleteReview);

module.exports = router;
