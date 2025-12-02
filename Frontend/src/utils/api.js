import axios from 'axios';

// Resolve API base URL for both local dev and production (Vercel)
// Priority:
// 1) VITE_API_BASE_URL env (recommended for Vercel)
// 2) LocalStorage override (allow runtime hotfix without rebuild)
// 3) If not localhost in browser, use same-origin /api (for reverse-proxy scenarios)
// 4) Fallback to localhost:3001 for local dev
const PROD_BACKEND_URL = 'https://karzone.onrender.com/api';

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string') return envUrl.replace(/\/+$/, '');

  if (typeof window !== 'undefined') {
    const lsUrl = localStorage.getItem('API_BASE_URL');
    if (lsUrl && /^https?:\/\//.test(lsUrl)) return lsUrl.replace(/\/+$/, '');

    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    const isVercel = window.location.hostname === 'kar-zone.vercel.app' ||
      window.location.hostname.endsWith('.vercel.app');
    if (isVercel) {
      return PROD_BACKEND_URL;
    }

    if (!isLocal) {
      // Try same-origin /api (works if frontend is proxying to backend)
      return `${window.location.origin}/api`;
    }
  }
  return 'http://localhost:3001/api';
};

const API_BASE_URL = resolveApiBaseUrl();

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Making API request to: ${config.baseURL}${config.url}`, config);
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log(`Response status: ${response.status}`, response);
    console.log('API response data:', response.data);
    return response.data;
  },
  (error) => {
    console.error('API response error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      const message = error.response.data.message || 'Server error';
      throw new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error(`Cannot connect to server at ${API_BASE_URL}. If this is production, make sure the backend is running.`);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      throw error;
    }
  }
);

// Helper function to keep consistent API with previous implementation
const apiRequest = async (endpoint, options = {}) => {
  // Axios handles method, body (as data), and headers differently than fetch
  // This wrapper adapts the old style calls to axios
  const method = options.method || 'GET';
  const data = options.body ? JSON.parse(options.body) : undefined;
  const headers = options.headers || {};

  return api({
    url: endpoint,
    method,
    data,
    headers,
  });
};

// Auth API
export const authAPI = {
  signup: async (userData) => {
    return api.post('/auth/signup', userData);
  },

  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  getMe: async () => {
    return api.get('/auth/me');
  },
};

// Bookings API
export const bookingsAPI = {
  createPaymentIntent: async (bookingData) => {
    return api.post('/bookings/create-payment-intent', bookingData);
  },

  createBooking: async (bookingData) => {
    return api.post('/bookings', bookingData);
  },

  getMyBookings: async () => {
    return api.get('/bookings/my-bookings');
  },

  cancelBooking: async (bookingId) => {
    return api.put(`/bookings/${bookingId}/cancel`);
  },

  deleteBooking: async (bookingId) => {
    return api.delete(`/bookings/${bookingId}`);
  },
};

export default api;
