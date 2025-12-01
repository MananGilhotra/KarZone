import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import carsData from '../assets/carsData';
import { carPageStyles as styles } from '../assets/dummyStyles';
import { FaUsers, FaGasPump, FaLeaf, FaShieldAlt, FaBolt, FaStar, FaArrowRight } from 'react-icons/fa';

const Cars = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [filter, setFilter] = useState('all');
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const getFuelIcon = (fuel) => {
    switch (fuel.toLowerCase()) {
      case 'electric':
        return <FaBolt className="text-yellow-400" />;
      case 'premium':
        return <FaStar className="text-orange-400" />;
      default:
        return <FaGasPump className="text-blue-400" />;
    }
  };

  const filteredCars = filter === 'all' 
    ? carsData 
    : carsData.filter(car => {
        if (filter === 'electric') return car.fuel.toLowerCase() === 'electric';
        if (filter === 'sports') return car.type.toLowerCase().includes('sports') || car.type.toLowerCase().includes('supercar');
        if (filter === 'suv') return car.type.toLowerCase().includes('suv');
        return true;
      });

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.contentContainer}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title}>Premium Car Collection</h1>
          <p className={styles.subtitle}>
            Discover our exclusive fleet of luxury vehicles. Each car is meticulously maintained and ready for your journey.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'all'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Cars
          </button>
          <button
            onClick={() => setFilter('electric')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'electric'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Electric
          </button>
          <button
            onClick={() => setFilter('sports')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'sports'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Sports
          </button>
          <button
            onClick={() => setFilter('suv')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'suv'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            SUV
          </button>
        </div>

        <div ref={sectionRef} className={styles.gridContainer}>
          {filteredCars.map((car, index) => (
            <div
              key={car.id}
              className={`${styles.carCard} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                transitionDelay: `${index * 50}ms`,
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={() => setHoveredCard(car.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={styles.glowEffect}></div>
              
              <div className={styles.imageContainer}>
                <img
                  src={car.image}
                  alt={car.name}
                  className={`${styles.carImage} ${hoveredCard === car.id ? 'scale-110' : 'scale-100'}`}
                />
                <div className={styles.priceBadge}>
                  ₹{car.price.toLocaleString()}/day
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.headerRow}>
                  <div>
                    <h3 className={styles.carName}>{car.name}</h3>
                    <p className={styles.carType}>{car.type}</p>
                  </div>
                </div>

                <div className={styles.specsGrid}>
                  <div className={styles.specItem}>
                    <div className={styles.specIconContainer}>
                      <FaUsers className="text-orange-400" />
                    </div>
                    <span className="text-gray-300">{car.seats} Seats</span>
                  </div>

                  <div className={styles.specItem}>
                    <div className={styles.specIconContainer}>
                      {getFuelIcon(car.fuel)}
                    </div>
                    <span className="text-gray-300">{car.fuel}</span>
                  </div>

                  <div className={styles.specItem}>
                    <div className={styles.specIconContainer}>
                      <FaLeaf className="text-green-400" />
                    </div>
                    <span className="text-gray-300">{car.mileage}</span>
                  </div>

                  <div className={styles.specItem}>
                    <div className={styles.specIconContainer}>
                      <FaShieldAlt className="text-purple-400" />
                    </div>
                    <span className="text-gray-300">Premium</span>
                  </div>
                </div>

                <Link to={`/cars/${car.id}`} className="block mt-4">
                  <button className={styles.bookButton}>
                    <span className={styles.buttonText}>Book Now</span>
                    <FaArrowRight className={styles.buttonIcon} />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
