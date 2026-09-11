// api.js
import axios from 'axios';
import { getAccessToken } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_DEFUALT_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to automatically attach language and authorization header
api.interceptors.request.use(
  (config) => {
    const lang = localStorage.getItem('lang') === "la" ? 'LO': 'EN';
    config.headers['langCode'] = lang;
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for generic error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;