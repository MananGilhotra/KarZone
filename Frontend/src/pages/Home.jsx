import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Welcome to KARZONE
        </h1>
        <p className="text-gray-300 text-center text-lg">
          Your premium mobility experience awaits
        </p>
      </div>
    </div>
  );
};

export default Home;

