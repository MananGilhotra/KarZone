import React, { useEffect, useRef, useState } from 'react';
import testimonialsData from '../assets/Testimonialdata';
import { testimonialStyles as styles } from '../assets/dummyStyles';
import { FaQuoteLeft, FaStar, FaCar } from 'react-icons/fa';

const Testimonials = () => {
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
      <div className={styles.innerContainer}>
        <div className={styles.headerContainer}>
          <h2 className={styles.title}>
            Premium Drive <span className={styles.accentText}>Experiences</span>
          </h2>
          <p className={styles.subtitle}>
            Hear from our valued customers about their journey with our premium fleet.
          </p>
        </div>

        <div className={styles.grid}>
          {testimonialsData.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`${styles.card} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                transitionDelay: `${index * 150}ms`,
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div className={styles.cardContent}>
                <div className="flex justify-between items-start mb-4">
                  <FaQuoteLeft className={`${styles.quoteIcon} text-4xl`} />
                  <div className={styles.ratingContainer}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className={`${styles.star} text-orange-400`} />
                    ))}
                  </div>
                </div>

                <p className={styles.comment}>"{testimonial.comment}"</p>

                <div className={styles.carInfo}>
                  <FaCar className={styles.carIcon} />
                  <span className={styles.carText}>{testimonial.car}</span>
                </div>

                <div className={styles.authorContainer}>
                  <div className={styles.avatar}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className={styles.authorInfo}>
                    <p className={styles.authorName}>{testimonial.name}</p>
                    <p className={styles.authorRole}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;


