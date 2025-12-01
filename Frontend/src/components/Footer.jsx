import React from 'react';
import { Link } from 'react-router-dom';
import { footerStyles as styles } from '../assets/dummyStyles';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import logocar from '../assets/logocar.png';

const Footer = () => {
  return (
    <footer className={styles.container}>
      <div className={styles.topElements}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.roadLine}></div>
      </div>

      <div className={styles.innerContainer}>
        <div className={styles.grid}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <img src={logocar} alt="KARZONE Logo" className="h-10 w-auto mb-2" />
              <span className={styles.logoText}>KARZONE</span>
            </div>
            <p className={styles.description}>
              Premium car rental service with the latest models and exceptional customer service. Drive your dream car today!
            </p>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon} aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" className={styles.socialIcon} aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className={styles.sectionTitle}>
              Contact Us
              <span className={styles.underline}></span>
            </h3>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.contactIcon} />
                <span>173 Drive Avenue, Auto City, CA 90210</span>
              </div>
              <div className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} />
                <span>+01 8290431275</span>
              </div>
              <div className={styles.contactItem}>
                <FaEnvelope className={styles.contactIcon} />
                <span>info@hexagonsservices.com</span>
              </div>
            </div>
            <div className={styles.hoursContainer}>
              <p className={styles.hoursTitle}>Business Hours:</p>
              <div className={styles.hoursText}>
                <p>Monday - Friday: 8:00 AM - 9:00 PM</p>
                <p>Saturday: 9:00 AM - 6:00 PM</p>
                <p>Sunday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={styles.sectionTitle}>
              Quick Links
              <span className={styles.underline}></span>
            </h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/" className={styles.linkItem}>
                  <span className={styles.bullet}></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cars" className={styles.linkItem}>
                  <span className={styles.bullet}></span>
                  Cars
                </Link>
              </li>
              <li>
                <Link to="/contact" className={styles.linkItem}>
                  <span className={styles.bullet}></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={styles.sectionTitle}>
              Newsletter
              <span className={styles.underline}></span>
            </h3>
            <p className={styles.newsletterText}>
              Subscribe for special offers and updates.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your Email Address"
                className={styles.input}
              />
              <button type="submit" className={styles.subscribeButton}>
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>© 2025 KARZONE. All rights reserved.</p>
          <p>
            Designed by{' '}
            <a href="#" className={styles.designerLink}>
              Hexagon Digital Services
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


