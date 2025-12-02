import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';
import carsData from '../assets/carsData';
import homeCarsData from '../assets/HcarsData';
import { carDetailStyles as styles } from '../assets/dummyStyles';
import { 
  FaUsers, 
  FaGasPump, 
  FaTachometerAlt, 
  FaCog,
  FaBolt,
  FaStar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaArrowLeft
} from 'react-icons/fa';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [car, setCar] = useState(null);
  const [formData, setFormData] = useState({
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    fullName: '',
    email: '',
    phone: ''
  });
  const [activeField, setActiveField] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const allCars = [...carsData, ...homeCarsData];
    const foundCar = allCars.find(c => c.id === parseInt(id));
    if (foundCar) {
      setCar(foundCar);
      setTotalPrice(foundCar.price);
    } else {
      navigate('/cars');
    }

    // Check for Stripe payment success callback
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');
    
    if (success === 'true' && sessionId) {
      // This would be handled by Stripe redirect
      // For now, we handle it in PaymentModal
    }
  }, [id, navigate, searchParams]);

  useEffect(() => {
    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);
      const diffTime = Math.abs(returnDate - pickup);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setTotalDays(diffDays);
      if (car) {
        setTotalPrice(car.price * diffDays);
      }
    }
  }, [formData.pickupDate, formData.returnDate, car]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.pickupDate || !formData.returnDate) {
      setError('Please select pickup and return dates.');
      return;
    }

    if (new Date(formData.pickupDate) > new Date(formData.returnDate)) {
      setError('Return date cannot be before pickup date.');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', `/cars/${id}`);
      navigate('/login');
      return;
    }
    
    // Open payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (transactionId) => {
    // Create booking object
    const booking = {
      id: Date.now().toString(),
      carId: car.id,
      carName: car.name,
      carType: car.type,
      carImage: car.image,
      pickupDate: formData.pickupDate,
      returnDate: formData.returnDate,
      pickupLocation: formData.pickupLocation,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      totalPrice: totalPrice,
      totalDays: totalDays,
      status: 'confirmed',
      transactionId: transactionId,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('userBookings', JSON.stringify(existingBookings));

    // Clear form and redirect
    setShowPaymentModal(false);
    navigate('/bookings?success=true');
  };

  const getFuelIcon = (fuel) => {
    switch (fuel.toLowerCase()) {
      case 'electric':
        return <FaBolt className="text-green-400 text-2xl" />;
      case 'premium':
        return <FaStar className="text-orange-400 text-2xl" />;
      default:
        return <FaGasPump className="text-green-400 text-2xl" />;
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.contentContainer}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/cars')}
          className={styles.backButton}
        >
          <FaArrowLeft className={styles.backButtonIcon} />
        </button>

        <div className={styles.mainLayout}>
          {/* Left Column - Car Details */}
          <div className={styles.leftColumn}>
            {/* Car Image */}
            <div className={styles.imageCarousel}>
              <img
                src={car.image}
                alt={car.name}
                className={styles.carImage}
              />
            </div>

            {/* Car Name and Price */}
            <div>
              <h1 className={styles.carName}>{car.name}</h1>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={styles.carPrice}>₹{car.price.toLocaleString()}</span>
                <span className={styles.pricePerDay}>/ day</span>
              </div>
            </div>

            {/* Car Specifications */}
            <div className={styles.specsGrid}>
              <div className={styles.specCard}>
                <FaUsers className={`${styles.specIcon} text-blue-400`} />
                <span className={styles.specLabel}>Seats</span>
                <span className={styles.specValue}>{car.seats}</span>
              </div>

              <div className={styles.specCard}>
                {getFuelIcon(car.fuel)}
                <span className={styles.specLabel}>Fuel</span>
                <span className={styles.specValue}>{car.fuel}</span>
              </div>

              <div className={styles.specCard}>
                <FaTachometerAlt className={`${styles.specIcon} text-yellow-400`} />
                <span className={styles.specLabel}>Mileage</span>
                <span className={styles.specValue}>{car.mileage}</span>
              </div>

              <div className={styles.specCard}>
                <FaCog className={`${styles.specIcon} text-purple-400`} />
                <span className={styles.specLabel}>Transmission</span>
                <span className={styles.specValue}>{car.transmission}</span>
              </div>
            </div>

            {/* About Section */}
            <div className={styles.aboutSection}>
              <h3 className={styles.aboutTitle}>About this car</h3>
              <p className={styles.aboutText}>
                Experience luxury in the {car.name}. With its {car.transmission.toLowerCase()} transmission and seating for {car.seats}, every journey is exceptional. {car.type} designed for those who demand the best in performance and comfort.
              </p>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className={styles.rightColumn}>
            <div className={styles.bookingCard}>
              <h2 className={styles.bookingTitle}>
                Reserve Your <span className="text-orange-500">Drive</span>
              </h2>
              <p className={styles.bookingSubtitle}>Fast · Secure · Easy</p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-300 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Pickup Date */}
                <div>
                  <label className={styles.formLabel}>Pickup Date</label>
                  <div className={styles.inputContainer(activeField === 'pickupDate')}>
                    <FaCalendarAlt className={styles.inputIcon} />
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      onFocus={() => setActiveField('pickupDate')}
                      onBlur={() => setActiveField('')}
                      className={styles.inputField}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                {/* Return Date */}
                <div>
                  <label className={styles.formLabel}>Return Date</label>
                  <div className={styles.inputContainer(activeField === 'returnDate')}>
                    <FaCalendarAlt className={styles.inputIcon} />
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      onFocus={() => setActiveField('returnDate')}
                      onBlur={() => setActiveField('')}
                      className={styles.inputField}
                      min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                {/* Pickup Location */}
                <div>
                  <label className={styles.formLabel}>Pickup Location</label>
                  <div className={styles.inputContainer(activeField === 'pickupLocation')}>
                    <FaMapMarkerAlt className={styles.inputIcon} />
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      onFocus={() => setActiveField('pickupLocation')}
                      onBlur={() => setActiveField('')}
                      placeholder="Enter pickup location"
                      className={styles.textInputField}
                      required
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className={styles.formLabel}>Full Name</label>
                  <div className={styles.inputContainer(activeField === 'fullName')}>
                    <FaUser className={styles.inputIcon} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onFocus={() => setActiveField('fullName')}
                      onBlur={() => setActiveField('')}
                      placeholder="Your full name"
                      className={styles.textInputField}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={styles.formLabel}>Email Address</label>
                  <div className={styles.inputContainer(activeField === 'email')}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setActiveField('email')}
                      onBlur={() => setActiveField('')}
                      placeholder="Your email"
                      className={styles.textInputField}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className={styles.formLabel}>Phone Number</label>
                  <div className={styles.inputContainer(activeField === 'phone')}>
                    <FaPhone className={styles.inputIcon} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setActiveField('phone')}
                      onBlur={() => setActiveField('')}
                      placeholder="Your phone number"
                      className={styles.textInputField}
                      required
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className={styles.priceBreakdown}>
                  <div className={styles.priceRow}>
                    <span>Rate/day</span>
                    <span>₹{car.price.toLocaleString()}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Total ({totalDays} {totalDays === 1 ? 'day' : 'days'})</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className={styles.submitButton}>
                  <FaCalendarAlt className="mr-2" />
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && car && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          bookingData={{
            carId: car.id,
            car: car,
            carName: car.name,
            carImage: car.image,
            carType: car.type,
            pickupDate: formData.pickupDate,
            returnDate: formData.returnDate,
            pickupLocation: formData.pickupLocation,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            totalPrice: totalPrice,
            totalDays: totalDays,
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <Footer />
    </div>
  );
};

export default Booking;

