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
  FaChevronDown,
  FaEdit,
  FaStar
} from 'react-icons/fa';
import { bookingsAPI, reviewsAPI } from '../utils/api';
import { ToastContainer, useToast } from '../components/Toast';

const MyBookings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    bookingId: null,
    pickupLocation: '',
    phone: ''
  });
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    isEdit: false,
    reviewId: null,
    bookingId: null,
    carName: '',
    rating: 5,
    comment: ''
  });
  const [reviews, setReviews] = useState([]);

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

    // Fetch user reviews
    const fetchReviews = async () => {
      try {
        const data = await reviewsAPI.getMyReviews();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();

    // Show success message if redirected from payment
    if (searchParams.get('success') === 'true') {
      showSuccess('Payment successful! Your booking has been confirmed.');
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
        showError('Failed to cancel booking');
      }
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        await bookingsAPI.deleteBooking(bookingId);
        const data = await bookingsAPI.getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error deleting booking:', error);
        showError('Failed to delete booking');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookingsAPI.updateBooking(editModal.bookingId, {
        pickupLocation: editModal.pickupLocation,
        phone: editModal.phone
      });
      setEditModal({ isOpen: false, bookingId: null, pickupLocation: '', phone: '' });
      const data = await bookingsAPI.getMyBookings();
      setBookings(data);
      showSuccess('Booking updated successfully!');
    } catch (error) {
      console.error('Error updating booking:', error);
      showError('Failed to update booking');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (reviewModal.isEdit) {
        await reviewsAPI.updateReview(reviewModal.reviewId, {
          rating: reviewModal.rating,
          comment: reviewModal.comment
        });
      } else {
        await reviewsAPI.createReview({
          bookingId: reviewModal.bookingId,
          rating: reviewModal.rating,
          comment: reviewModal.comment
        });
      }
      setReviewModal({ isOpen: false, isEdit: false, reviewId: null, bookingId: null, carName: '', rating: 5, comment: '' });
      const data = await reviewsAPI.getMyReviews();
      setReviews(data);
      showSuccess(reviewModal.isEdit ? 'Review updated successfully!' : 'Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      showError(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewsAPI.deleteReview(reviewId);
        const data = await reviewsAPI.getMyReviews();
        setReviews(data);
        showSuccess('Review deleted successfully!');
      } catch (error) {
        console.error('Error deleting review:', error);
        showError('Failed to delete review');
      }
    }
  };

  const hasReviewed = (bookingId) => {
    return reviews.some(review => review.booking === bookingId);
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
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen bg-linear-to-b from-gray-950 to-black">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-orange-400 to-orange-600 mb-4">
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
            <button
              onClick={() => setFilter('reviews')}
              className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${filter === 'reviews'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              <FaStar className="text-sm" />
              My Reviews
            </button>
          </div>

          {/* No Bookings/Reviews Message */}
          {filter !== 'reviews' && filteredBookings.length === 0 && (
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
          {filter !== 'reviews' && filteredBookings.length > 0 && (
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
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setExpandedBooking(expandedBooking === booking._id ? null : booking._id)}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all text-sm"
                        >
                          {expandedBooking === booking._id ? 'Hide Details' : 'View Details'}
                        </button>
                        {new Date(booking.pickupDate) > new Date() && booking.status !== 'cancelled' && (
                          <>
                            <button
                              onClick={() => setEditModal({
                                isOpen: true,
                                bookingId: booking._id,
                                pickupLocation: booking.pickupLocation,
                                phone: booking.phone
                              })}
                              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all border border-blue-500/30 flex items-center gap-2"
                              title="Edit Booking"
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleCancel(booking._id)}
                              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all border border-red-500/30 flex items-center gap-2"
                              title="Cancel Booking"
                            >
                              <FaTimesCircle /> Cancelled
                            </button>
                          </>
                        )}
                        {booking.status === 'cancelled' && (
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all border border-red-500/30 flex items-center gap-2"
                            title="Delete Booking"
                          >
                            <FaTrash /> Delete
                          </button>
                        )}
                        {new Date(booking.returnDate) < new Date() && booking.status !== 'cancelled' && !hasReviewed(booking._id) && (
                          <button
                            onClick={() => setReviewModal({
                              isOpen: true,
                              isEdit: false,
                              reviewId: null,
                              bookingId: booking._id,
                              carName: booking.carName,
                              rating: 5,
                              comment: ''
                            })}
                            className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all border border-yellow-500/30 flex items-center gap-2"
                            title="Write Review"
                          >
                            <FaStar /> Write Review
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

          {/* Reviews Section */}
          {filter === 'reviews' && (
            <div className="space-y-6 mb-12">
              {reviews.length === 0 ? (
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-12 text-center">
                  <FaStar className="text-6xl text-orange-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No reviews yet</h3>
                  <p className="text-gray-400 mb-6">
                    Complete a booking to write a review!
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 hover:border-orange-500/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{review.carName}</h3>
                        <div className="flex items-center gap-1 text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={star <= review.rating ? 'text-yellow-400' : 'text-gray-600'}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setReviewModal({
                            isOpen: true,
                            isEdit: true,
                            reviewId: review._id,
                            bookingId: review.booking,
                            carName: review.carName,
                            rating: review.rating,
                            comment: review.comment
                          })}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all border border-blue-500/30"
                          title="Edit Review"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all border border-red-500/30"
                          title="Delete Review"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">{review.comment}</p>
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
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

        {/* Edit Modal */}
        {editModal.isOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Edit Booking Details</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={editModal.pickupLocation}
                    onChange={(e) => setEditModal({ ...editModal, pickupLocation: e.target.value })}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editModal.phone}
                    onChange={(e) => setEditModal({ ...editModal, phone: e.target.value })}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setEditModal({ isOpen: false, bookingId: null, pickupLocation: '', phone: '' })}
                    className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-medium"
                  >
                    Update Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {reviewModal.isOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-2">
                {reviewModal.isEdit ? 'Edit Review' : 'Write a Review'}
              </h2>
              <p className="text-gray-400 mb-6">How was your experience with {reviewModal.carName}?</p>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewModal({ ...reviewModal, rating: star })}
                        className={`text-2xl transition-colors ${star <= reviewModal.rating ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Comment</label>
                  <textarea
                    value={reviewModal.comment}
                    onChange={(e) => setReviewModal({ ...reviewModal, comment: e.target.value })}
                    required
                    rows="4"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Share your experience..."
                  ></textarea>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setReviewModal({ isOpen: false, isEdit: false, reviewId: null, bookingId: null, carName: '', rating: 5, comment: '' })}
                    className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-medium"
                  >
                    {reviewModal.isEdit ? 'Update Review' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default MyBookings;


