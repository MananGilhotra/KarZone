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

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`, config);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log(`Response status: ${response.status}`, response);
    
    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Server error' }));
      console.error('API error response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    return data;
  } catch (error) {
    console.error('API request error:', error);
    // Provide more detailed error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      throw new Error(`Cannot connect to server at ${API_BASE_URL}. If this is production, make sure the backend (https://karzone.onrender.com) is running and Vercel env 'VITE_API_BASE_URL' points to it.`);
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  signup: async (userData) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return apiRequest('/auth/me');
  },
};

export default apiRequest;

