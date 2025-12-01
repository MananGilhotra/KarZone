import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { contactPageStyles as styles } from '../assets/dummyStyles';
import { 
  FaWhatsapp, 
  FaEnvelope, 
  FaClock, 
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaCar,
  FaCommentDots,
  FaPaperPlane
} from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    carType: '',
    message: ''
  });
  const [activeField, setActiveField] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will get back to you soon.');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      carType: '',
      message: ''
    });
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.content}>
        {/* Title Section */}
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Contact Our Team</h1>
          <div className={styles.divider}></div>
          <p className={styles.subtitle}>
            Have questions about our premium fleet? Our team is ready to assist with your car rental needs.
          </p>
        </div>

        {/* Main Content Cards */}
        <div className={styles.cardContainer}>
          {/* Our Information Card */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardCircle1}></div>
            <div className={styles.infoCardCircle2}></div>
            
            <h2 className={styles.infoTitle}>
              <FaEnvelope className={styles.infoIcon} />
              Our Information
            </h2>

            <div className={styles.infoItemContainer}>
              <div className={styles.infoItem}>
                <div className={styles.iconContainer('bg-green-500/20')}>
                  <FaWhatsapp className="text-green-400 text-xl" />
                </div>
                <div>
                  <p className={styles.infoLabel}>WhatsApp</p>
                  <p className={styles.infoValue}>+91 8299431275</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.iconContainer('bg-orange-500/20')}>
                  <FaEnvelope className="text-orange-400 text-xl" />
                </div>
                <div>
                  <p className={styles.infoLabel}>Email</p>
                  <p className={styles.infoValue}>contact@hexagonsservices.com</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.iconContainer('bg-orange-500/20')}>
                  <FaClock className="text-orange-400 text-xl" />
                </div>
                <div>
                  <p className={styles.infoLabel}>Hours</p>
                  <p className={styles.infoValue}>Mon-Sat: 8AM-8PM</p>
                  <p className={styles.infoValue}>Sunday: 10AM-6PM</p>
                </div>
              </div>

              <div className={styles.offerContainer}>
                <div className="flex items-center">
                  <FaCalendarAlt className={styles.offerIcon} />
                  <p className={styles.offerTitle}>Special Offer!</p>
                </div>
                <p className={styles.offerText}>
                  Book for 3+ days and get 10% discount
                </p>
              </div>
            </div>
          </div>

          {/* Send Your Inquiry Form Card */}
          <div className={styles.formCard}>
            <div className={styles.formCircle1}></div>
            <div className={styles.formCircle2}></div>
            
            <h2 className={styles.formTitle}>
              <FaPaperPlane className={styles.infoIcon} />
              Send Your Inquiry
            </h2>
            <p className={styles.formSubtitle}>
              Fill out the form and we'll get back to you promptly.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.inputContainer}>
                  <FaUser className={styles.inputIcon} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onFocus={() => setActiveField('fullName')}
                    onBlur={() => setActiveField('')}
                    placeholder="Full Name"
                    className={styles.input(activeField === 'fullName')}
                    required
                  />
                </div>

                <div className={styles.inputContainer}>
                  <FaEnvelope className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField('')}
                    placeholder="Email Address"
                    className={styles.input(activeField === 'email')}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputContainer}>
                  <FaPhone className={styles.inputIcon} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setActiveField('phone')}
                    onBlur={() => setActiveField('')}
                    placeholder="Phone Number"
                    className={styles.input(activeField === 'phone')}
                    required
                  />
                </div>

                <div className={styles.inputContainer}>
                  <FaCar className={styles.inputIcon} />
                  <select
                    name="carType"
                    value={formData.carType}
                    onChange={handleChange}
                    onFocus={() => setActiveField('carType')}
                    onBlur={() => setActiveField('')}
                    className={styles.select(activeField === 'carType')}
                    required
                  >
                    <option value="">Select Car Type</option>
                    <option value="luxury">Luxury</option>
                    <option value="sports">Sports</option>
                    <option value="suv">SUV</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputContainer}>
                <FaCommentDots className={styles.textareaIcon} />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setActiveField('message')}
                  onBlur={() => setActiveField('')}
                  placeholder="Tell us about your rental needs..."
                  rows="4"
                  className={styles.textarea(activeField === 'message')}
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.submitButton}>
                Send Message
                <FaPaperPlane className={styles.whatsappIcon} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
