/**
 * Seed script to populate the Car collection with the exact cars
 * that appear on the Home page and Cars page.
 * Run: node src/scripts/seedCars.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const Car = require('../models/Car');

// Home Page Cars (HcarsData.js - ids 1-6)
const homeCars = [
    {
        name: 'Toyota Corolla',
        type: 'Compact Sedan',
        price: 3000,
        image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&q=80',
        seats: 5,
        fuel: 'Gasoline',
        mileage: '30 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Honda Civic',
        type: 'Compact Sedan',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1679508056690-81bc0555f8a2?w=800&q=80',
        seats: 5,
        fuel: 'Gasoline',
        mileage: '32 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Volkswagen Golf',
        type: 'Hatchback',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80',
        seats: 5,
        fuel: 'Gasoline',
        mileage: '29 MPG',
        transmission: 'Manual',
    },
    {
        name: 'Hyundai Elantra',
        type: 'Compact Sedan',
        price: 2000,
        image: 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=800&q=80',
        seats: 5,
        fuel: 'Gasoline',
        mileage: '33 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Nissan Altima',
        type: 'Midsize Sedan',
        price: 7000,
        image: 'https://images.unsplash.com/photo-1625231334401-4abc4ae74d7d?w=800&q=80',
        seats: 5,
        fuel: 'Gasoline',
        mileage: '31 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Chevrolet Cruze',
        type: 'Compact Sedan',
        price: 10000,
        image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80',
        seats: 5,
        fuel: 'Diesel',
        mileage: '34 MPG',
        transmission: 'Manual',
    },
];

// Cars Page Cars (carsData.js - ids 7-18)
const carPageCars = [
    {
        name: 'Tesla Model S',
        type: 'Luxury Electric',
        price: 30000,
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
        seats: 5,
        fuel: 'Electric',
        mileage: 'Unlimited',
        transmission: 'Automatic',
    },
    {
        name: 'BMW M5',
        type: 'Sports Sedan',
        price: 24000,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
        seats: 5,
        fuel: 'Premium',
        mileage: '22 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Mercedes G-Class',
        type: 'Luxury SUV',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80',
        seats: 5,
        fuel: 'Diesel',
        mileage: '18 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Audi R8',
        type: 'Sports Car',
        price: 50000,
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80',
        seats: 2,
        fuel: 'Premium',
        mileage: '15 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Range Rover Velar',
        type: 'Premium SUV',
        price: 40000,
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
        seats: 5,
        fuel: 'Diesel',
        mileage: '28 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Porsche 911',
        type: 'Sports Car',
        price: 42500,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        seats: 4,
        fuel: 'Premium',
        mileage: '23 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Lamborghini Huracán',
        type: 'Supercar',
        price: 100000,
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
        seats: 2,
        fuel: 'Premium',
        mileage: '13 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Ferrari F8 Tributo',
        type: 'Supercar',
        price: 150000,
        image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',
        seats: 2,
        fuel: 'Premium',
        mileage: '15 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'McLaren 720S',
        type: 'Supercar',
        price: 90000,
        image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800&q=80',
        seats: 2,
        fuel: 'Premium',
        mileage: '14 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Jaguar F-Type',
        type: 'Sports Car',
        price: 50000,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
        seats: 2,
        fuel: 'Gasoline',
        mileage: '21 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Chevrolet Corvette',
        type: 'Sports Car',
        price: 150000,
        image: 'https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800&q=80',
        seats: 2,
        fuel: 'Premium',
        mileage: '19 MPG',
        transmission: 'Automatic',
    },
    {
        name: 'Ford Mustang GT',
        type: 'Muscle Car',
        price: 200000,
        image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
        seats: 4,
        fuel: 'Gasoline',
        mileage: '18 MPG',
        transmission: 'Manual',
    },
];

const allCars = [...homeCars, ...carPageCars];

const seedCars = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete ALL existing cars
        const deleted = await Car.deleteMany({});
        console.log(`🗑️  Deleted ${deleted.deletedCount} existing cars.`);

        // Insert the exact 18 cars from Home + Cars pages
        const result = await Car.insertMany(allCars);
        console.log(`\n✅ Successfully seeded ${result.length} cars into the database!\n`);

        console.log('--- Home Page Cars (6) ---');
        result.slice(0, 6).forEach((car) => {
            console.log(`  - ${car.name} (${car.type}) - ₹${car.price.toLocaleString()}/day`);
        });

        console.log('\n--- Cars Page Cars (12) ---');
        result.slice(6).forEach((car) => {
            console.log(`  - ${car.name} (${car.type}) - ₹${car.price.toLocaleString()}/day`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};

seedCars();
