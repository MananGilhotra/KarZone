const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });
const Car = require('../models/Car');

const allCarsData = [
    // 6 Cars from Home Page (HcarsData.js)
    {
        name: "Toyota Corolla",
        type: "Compact Sedan",
        price: 3000,
        image: "https://images.unsplash.com/photo-1590362891991-f200c922572b?w=800&q=80",
        seats: 5,
        fuel: "Gasoline",
        mileage: "30 MPG",
        transmission: "Automatic"
    },
    {
        name: "Honda Civic",
        type: "Compact Sedan",
        price: 2500,
        image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80",
        seats: 5,
        fuel: "Gasoline",
        mileage: "32 MPG",
        transmission: "Automatic"
    },
    {
        name: "Volkswagen Golf",
        type: "Hatchback",
        price: 5000,
        image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
        seats: 5,
        fuel: "Gasoline",
        mileage: "29 MPG",
        transmission: "Manual"
    },
    {
        name: "Hyundai Elantra",
        type: "Compact Sedan",
        price: 2000,
        image: "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?w=800&q=80",
        seats: 5,
        fuel: "Gasoline",
        mileage: "33 MPG",
        transmission: "Automatic"
    },
    {
        name: "Nissan Altima",
        type: "Midsize Sedan",
        price: 7000,
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
        seats: 5,
        fuel: "Gasoline",
        mileage: "31 MPG",
        transmission: "Automatic"
    },
    {
        name: "Chevrolet Cruze",
        type: "Compact Sedan",
        price: 10000,
        image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80",
        seats: 5,
        fuel: "Diesel",
        mileage: "34 MPG",
        transmission: "Manual"
    },
    // 12 Cars from Cars Page (carsData.js)
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
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
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

const seedCars = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing cars
        await Car.deleteMany({});
        console.log('Deleted existing cars collection');

        const result = await Car.insertMany(allCarsData);
        console.log(`✅ Successfully seeded ${result.length} cars into the database!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};

seedCars();
