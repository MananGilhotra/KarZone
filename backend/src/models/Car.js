const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Car name is required'],
            trim: true,
        },
        type: {
            type: String,
            required: [true, 'Car type is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price per day is required'],
            min: [0, 'Price cannot be negative'],
        },
        image: {
            type: String,
            required: [true, 'Car image URL is required'],
        },
        seats: {
            type: Number,
            required: [true, 'Number of seats is required'],
            min: [1, 'Must have at least 1 seat'],
        },
        fuel: {
            type: String,
            required: [true, 'Fuel type is required'],
            trim: true,
        },
        mileage: {
            type: String,
            required: [true, 'Mileage is required'],
            trim: true,
        },
        transmission: {
            type: String,
            required: [true, 'Transmission type is required'],
            enum: ['Automatic', 'Manual'],
            default: 'Automatic',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Car', carSchema);
