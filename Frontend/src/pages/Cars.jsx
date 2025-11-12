import React from 'react';
import Navbar from '../components/Navbar';

const Cars = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Our Cars
        </h1>
        <p className="text-gray-300 text-center text-lg">
          Explore our premium collection
        </p>
      </div>
    </div>
  );
};

export default Cars;

