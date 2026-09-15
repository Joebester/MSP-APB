import axios from 'axios';
import { getAccessToken } from './auth';

// Single MSP Register API base — matches the OpenAPI server url
// `.../api/v1/msp/signup`. Every path is relative to it: `public/...` for the
// open endpoints, `auth/...`, `check/...` and `address/...` for the rest.
const api = axios.create({
  baseURL: import.meta.env.VITE_DEFUALT_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // A langCode passed per request wins, so callers that need the raw
    // lowercase code (address lookups) can opt out of the LO/EN mapping.
    if (!config.headers.has('langCode')) {
      config.headers['langCode'] = localStorage.getItem('lang') === 'la' ? 'LO' : 'EN';
    }

    const token = getAccessToken();
    if (token && !config.headers.has('Authorization')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
