const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect: auth } = require('../middleware/auth');

// Create a new booking
router.post('/', auth, async (req, res) => {
    try {
        const {
            carId,
            carName,
            carType,
            carImage,
            pickupDate,
            returnDate,
            pickupLocation,
            fullName,
            email,
            phone,
            totalPrice,
            totalDays,
            paymentMethod,
            transactionId
        } = req.body;

        const newBooking = new Booking({
            user: req.user.id, // From auth middleware
            carId,
            carName,
            carType,
            carImage,
            pickupDate,
            returnDate,
            pickupLocation,
            fullName,
            email,
            phone,
            totalPrice,
            totalDays,
            paymentMethod,
            transactionId
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error while creating booking' });
    }
});

// Get bookings for the logged-in user
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error while fetching bookings' });
    }
});

// Cancel a booking
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check user
        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json(booking);
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a booking
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check user
        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await booking.deleteOne();

        res.json({ message: 'Booking removed' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
