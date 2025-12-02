import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FaCar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaCreditCard,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown
} from 'react-icons/fa';
import { bookingsAPI } from '../utils/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [expandedBooking, setExpandedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingsAPI.getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();

    // Show success message if redirected from payment
    if (searchParams.get('success') === 'true') {
      alert('Payment successful! Your booking has been confirmed.');
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const filteredBookings = bookings.filter(booking => {
    const now = new Date();
    const returnDate = new Date(booking.returnDate);

    switch (filter) {
      case 'upcoming':
        return new Date(booking.pickupDate) > now && booking.status !== 'cancelled';
      case 'completed':
        return returnDate < now && booking.status !== 'cancelled';
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingsAPI.cancelBooking(bookingId);
        // Refetch bookings to ensure data is synced with MongoDB
        const data = await bookingsAPI.getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  const getStatusBadge = (booking) => {
    const now = new Date();
    const pickupDate = new Date(booking.pickupDate);
    const returnDate = new Date(booking.returnDate);

    if (booking.status === 'cancelled') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
          <FaTimesCircle className="mr-1" />
          Cancelled
        </span>
      );
    }

    if (returnDate < now) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
          <FaCheckCircle className="mr-1" />
          Completed
        </span>
      );
    }

    if (pickupDate > now) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <FaClock className="mr-1" />
          Upcoming
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
        <FaClock className="mr-1" />
        Active
      </span>
    );
  };

  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => {
      const returnDate = new Date(b.returnDate);
      return returnDate < new Date() && b.status !== 'cancelled';
    }).length,
    upcoming: bookings.filter(b => {
      const pickupDate = new Date(b.pickupDate);
      return pickupDate > new Date() && b.status !== 'cancelled';
    }).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600 mb-4">
            My Bookings
          </h1>
          <p className="text-gray-400 text-lg">
            View and manage all your current and past car rental bookings.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${filter === 'all'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
          >
            All Bookings
            {filter === 'all' && <FaChevronDown className="text-xs" />}
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${filter === 'upcoming'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
          >
            <FaClock className="text-sm" />
            Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${filter === 'completed'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
          >
            <FaCheckCircle className="text-sm" />
            Completed
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${filter === 'cancelled'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
          >
            <FaTimesCircle className="text-sm" />
            Cancelled
          </button>
        </div>

        {/* No Bookings Message */}
        {filteredBookings.length === 0 && (
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-12 text-center mb-8">
            <FaCar className="text-6xl text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No bookings found</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all'
                ? "You haven't made any bookings yet. Browse our collection to get started!"
                : `No ${filter} bookings found.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/cars')}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-all"
              >
                <FaCar />
                Browse Cars
              </button>
            )}
          </div>
        )}

        {/* Booking Cards */}
        {filteredBookings.length > 0 && (
          <div className="space-y-6 mb-12">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-orange-500/50 transition-all"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Side - Car Info */}
                    <div className="flex gap-4 flex-1">
                      <img
                        src={booking.carImage}
                        alt={booking.carName}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{booking.carName}</h3>
                          {getStatusBadge(booking)}
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{booking.carType}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-orange-400" />
                            {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-orange-400" />
                            {booking.pickupLocation}
                          </span>
                          <span className="text-orange-400 font-semibold">
                            ₹{booking.totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExpandedBooking(expandedBooking === booking._id ? null : booking._id)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all text-sm"
                      >
                        {expandedBooking === booking._id ? 'Hide Details' : 'View Details'}
                      </button>
                      {new Date(booking.pickupDate) > new Date() && booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all border border-red-500/30 flex items-center gap-2"
                          title="Cancel Booking"
                        >
                          <FaTimesCircle /> Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedBooking === booking._id && (
                    <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                          <FaCalendarAlt className="text-orange-400" />
                          Booking Dates
                        </h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p>Pickup: {new Date(booking.pickupDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          <p>Return: {new Date(booking.returnDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          <p>Duration: {booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                          <FaUser className="text-orange-400" />
                          User Information
                        </h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p>{booking.fullName}</p>
                          <p>{booking.email}</p>
                          <p>{booking.phone}</p>
                        </div>
                      </div>

                      {booking.transactionId && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                            <FaCreditCard className="text-orange-400" />
                            Payment Details
                          </h4>
                          <div className="space-y-2 text-sm text-gray-300">
                            <p>Payment Method: Credit Card</p>
                            <p className="text-xs text-gray-500">Transaction ID: {booking.transactionId}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6 text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">{stats.total}</div>
            <div className="text-gray-400">Total Bookings</div>
          </div>
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{stats.completed}</div>
            <div className="text-gray-400">Completed Trips</div>
          </div>
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{stats.upcoming}</div>
            <div className="text-gray-400">Upcoming Trips</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;

