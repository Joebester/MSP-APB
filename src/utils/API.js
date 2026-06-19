// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_DEFUALT_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;