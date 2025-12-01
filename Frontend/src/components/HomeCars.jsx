import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import homeCarsData from '../assets/HcarsData';
import { homeCarsStyles as styles } from '../assets/dummyStyles';
import { FaUsers, FaGasPump, FaTachometerAlt, FaCog } from 'react-icons/fa';

const HomeCars = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
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

  return (
    <section ref={sectionRef} className={styles.container}>
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>
          Luxury Car Collection
        </h2>
        <p className={styles.subtitle}>
          Discover premium vehicles with exceptional performance and comfort for your next journey.
        </p>
      </div>

      <div className={styles.grid}>
        {homeCarsData.map((car, index) => (
          <div
            key={car.id}
            className={`${styles.card} premium-card ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{
              transitionDelay: `${index * 100}ms`,
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={() => setHoveredCard(car.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={styles.imageContainer}>
              <img
                src={car.image}
                alt={car.name}
                className={`w-full h-full object-cover transition-transform duration-700 ${hoveredCard === car.id ? 'scale-110' : 'scale-100'}`}
              />
              <div className={styles.priceBadge}>
                <span className={styles.priceText}>₹{car.price.toLocaleString()}/day</span>
              </div>
              <div className={styles.accentBlur}></div>
            </div>

            <div className={styles.content}>
              <h3 className={styles.carName}>{car.name}</h3>
              <div className={styles.carInfoContainer}>
                <span className={styles.carTypeBadge}>{car.type}</span>
              </div>

              <div className={styles.specsGrid}>
                <div className={styles.specItem}>
                  <div className={styles.specIconContainer(hoveredCard === car.id)}>
                    <FaUsers className={styles.specIcon(hoveredCard === car.id)} />
                  </div>
                  <span className={styles.specValue}>{car.seats}</span>
                  <span className={styles.specLabel}>Seats</span>
                </div>

                <div className={styles.specItem}>
                  <div className={styles.specIconContainer(hoveredCard === car.id)}>
                    <FaGasPump className={styles.specIcon(hoveredCard === car.id)} />
                  </div>
                  <span className={styles.specValue}>{car.fuel}</span>
                  <span className={styles.specLabel}>Fuel</span>
                </div>

                <div className={styles.specItem}>
                  <div className={styles.specIconContainer(hoveredCard === car.id)}>
                    <FaTachometerAlt className={styles.specIcon(hoveredCard === car.id)} />
                  </div>
                  <span className={styles.specValue}>{car.mileage}</span>
                  <span className={styles.specLabel}>Mileage</span>
                </div>

                <div className={styles.specItem}>
                  <div className={styles.specIconContainer(hoveredCard === car.id)}>
                    <FaCog className={styles.specIcon(hoveredCard === car.id)} />
                  </div>
                  <span className={styles.specValue}>{car.transmission}</span>
                  <span className={styles.specLabel}>Gear</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  const token = localStorage.getItem('token');
                  if (token) {
                    navigate(`/cars/${car.id}`);
                  } else {
                    localStorage.setItem('redirectAfterLogin', `/cars/${car.id}`);
                    navigate('/login');
                  }
                }}
                className={styles.bookButton}
              >
                <span className={styles.buttonText}>Book Now</span>
              </button>
            </div>

            <div className={styles.borderOverlay}></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeCars;

