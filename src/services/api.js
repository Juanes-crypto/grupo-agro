// frontend/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a cada petición si está disponible
api.interceptors.request.use(
  (config) => {
    // ⭐ CAMBIO CLAVE AQUÍ: Leer el token de la clave correcta 'agroapp_token' ⭐
    const token = localStorage.getItem('agroapp_token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
