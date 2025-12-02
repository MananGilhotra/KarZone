const express = require('express');
const router = express.Router();
const {
    createReview,
    getCarReviews,
    getMyReviews,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/car/:carId', getCarReviews);
router.get('/my-reviews', protect, getMyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
