import axios from 'axios';

const api = axios.create({
  baseURL: 'https://grupo-agro-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
    // Quita el Authorization de aquí, el interceptor lo manejará
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agroapp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;