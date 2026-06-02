const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { adminProtect } = require('../middleware/adminAuth');

// @desc    Get all active cars
// @route   GET /api/cars
// @access  Public
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: cars.length,
            cars,
        });
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching cars',
        });
    }
});

// @desc    Get all cars (including inactive) - Admin only
// @route   GET /api/cars/all
// @access  Admin
router.get('/all', adminProtect, async (req, res) => {
    try {
        const cars = await Car.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: cars.length,
            cars,
        });
    } catch (error) {
        console.error('Error fetching all cars:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching cars',
        });
    }
});

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found',
            });
        }

        res.status(200).json({
            success: true,
            car,
        });
    } catch (error) {
        console.error('Error fetching car:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching car',
        });
    }
});

// @desc    Create a car
// @route   POST /api/cars
// @access  Admin
router.post('/', adminProtect, async (req, res) => {
    try {
        const { name, type, price, image, seats, fuel, mileage, transmission } = req.body;

        const car = await Car.create({
            name,
            type,
            price,
            image,
            seats,
            fuel,
            mileage,
            transmission: transmission || 'Automatic',
        });

        res.status(201).json({
            success: true,
            car,
        });
    } catch (error) {
        console.error('Error creating car:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error creating car',
        });
    }
});

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Admin
router.put('/:id', adminProtect, async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found',
            });
        }

        res.status(200).json({
            success: true,
            car,
        });
    } catch (error) {
        console.error('Error updating car:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error updating car',
        });
    }
});

// @desc    Delete a car (hard delete)
// @route   DELETE /api/cars/:id
// @access  Admin
router.delete('/:id', adminProtect, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found',
            });
        }

        await car.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Car deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting car',
        });
    }
});

module.exports = router;
