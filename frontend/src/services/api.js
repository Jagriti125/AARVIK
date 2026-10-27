import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT token if logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aarvik_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized, notify or clear
    if (error.response && error.response.status === 401) {
      // If we are currently holding an invalid token, remove it
      if (localStorage.getItem('aarvik_admin_token')) {
        localStorage.removeItem('aarvik_admin_token');
        localStorage.removeItem('aarvik_admin_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
