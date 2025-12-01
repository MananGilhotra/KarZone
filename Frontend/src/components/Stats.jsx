import React, { useEffect, useRef, useState } from 'react';
import { testimonialStyles as styles } from '../assets/dummyStyles';

const Stats = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ customers: 0, vehicles: 0, locations: 0 });

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

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setCounts({
          customers: Math.floor(10000 * easeOut),
          vehicles: Math.floor(250 * easeOut),
          locations: Math.floor(50 * easeOut),
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounts({ customers: 10000, vehicles: 250, locations: 50 });
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  const stats = [
    { value: `${counts.customers.toLocaleString()}+`, label: 'Happy Customers', color: 'text-cyan-400' },
    { value: `${counts.vehicles}+`, label: 'Luxury Vehicles', color: 'text-amber-400' },
    { value: '24/7', label: 'Support', color: 'text-violet-400' },
    { value: `${counts.locations}+`, label: 'Locations', color: 'text-emerald-400' },
  ];

  return (
    <div ref={sectionRef} className={styles.statsContainer}>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${styles.statItem} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            style={{
              transitionDelay: `${index * 100}ms`,
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className={`${styles.statValue(stat.color)}`}>{stat.value}</div>
            <div className={`${styles.statLabel(stat.color)}`}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;


