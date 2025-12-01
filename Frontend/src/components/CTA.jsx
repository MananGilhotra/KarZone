import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { testimonialStyles as styles } from '../assets/dummyStyles';

const CTA = () => {
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
    <section ref={sectionRef} className={styles.ctaContainer}>
      <h2 className={`${styles.ctaTitle} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        Ready for Your Premium Experience?
      </h2>
      <p className={`${styles.ctaText} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transitionDelay: '200ms', transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        Join thousands of satisfied customers who have experienced the best in luxury car rentals.
      </p>
      <Link to="/cars">
        <button className={`${styles.ctaButton} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          style={{ transitionDelay: '400ms', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          Book Your Luxury Ride
        </button>
      </Link>
    </section>
  );
};

export default CTA;


