import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { FaTimes, FaCreditCard, FaSpinner } from 'react-icons/fa';
import { bookingsAPI } from '../utils/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Q...');

const PaymentModal = ({ isOpen, onClose, bookingData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'upi'
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Validation
      if (paymentMethod === 'card') {
        if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
          throw new Error('Please fill in all card details');
        }
      } else {
        if (!paymentDetails.upiId) {
          throw new Error('Please enter your UPI ID');
        }
        if (!paymentDetails.upiId.includes('@')) {
          throw new Error('Invalid UPI ID format');
        }
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create booking object
      const bookingPayload = {
        carId: bookingData.carId,
        carName: bookingData.carName,
        carType: bookingData.carType,
        carImage: bookingData.carImage,
        pickupDate: bookingData.pickupDate,
        returnDate: bookingData.returnDate,
        pickupLocation: bookingData.pickupLocation,
        fullName: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        totalPrice: bookingData.totalPrice,
        totalDays: bookingData.totalDays,
        paymentMethod: paymentMethod,
        transactionId: `demo_${Date.now()}`,
      };

      // Call backend API
      const response = await bookingsAPI.createBooking(bookingPayload);

      setLoading(false);
      onSuccess(response.transactionId);
      onClose();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Complete Payment</h2>
          <p className="text-gray-400 text-sm">Secure payment gateway</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Car</span>
              <span className="text-white font-semibold">{bookingData.carName}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Duration</span>
              <span className="text-white">{bookingData.totalDays} {bookingData.totalDays === 1 ? 'day' : 'days'}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-600">
              <span className="text-gray-400">Total Amount</span>
              <span className="text-orange-400 font-bold text-xl">₹{bookingData.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="flex gap-2 p-1 bg-gray-700 rounded-lg">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${paymentMethod === 'card'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Card Payment
            </button>
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${paymentMethod === 'upi'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              UPI ID
            </button>
          </div>

          {/* Payment Fields */}
          <div className="space-y-3">
            {paymentMethod === 'card' ? (
              <>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Card Number</label>
                  <div className="relative">
                    <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={handleInputChange}
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={paymentDetails.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="3"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs text-gray-400 mb-1">UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={paymentDetails.upiId}
                  onChange={handleInputChange}
                  placeholder="username@bank"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Enter your VPA (Virtual Payment Address)</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {paymentMethod === 'card' ? <FaCreditCard /> : <span className="font-bold">UPI</span>}
                Pay ₹{bookingData.totalPrice.toLocaleString()}
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your payment is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;

