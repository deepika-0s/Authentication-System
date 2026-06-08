import axios from 'axios';

/**
 * Base URL strategy:
 * - Development: empty string → Vite proxy forwards /api/* to localhost:5000
 * - Production:  set VITE_API_BASE_URL=https://your-backend.com/api in frontend .env
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout — prevents hanging requests
});

// ─── Request Interceptor ───────────────────────────────────────────────────
// Automatically attach JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────
// Handle token expiry globally: clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED'
    ) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      // Safe browser-only redirect
      if (typeof window !== 'undefined') {
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API calls ────────────────────────────────────────────────────────
export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login:  (data) => api.post('/auth/login', data),
  getMe:  ()     => api.get('/auth/me'),
};

export default api;
