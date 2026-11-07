import axios from 'axios';

// Single shared Axios instance for the whole app
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://i7-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT token to every request automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;