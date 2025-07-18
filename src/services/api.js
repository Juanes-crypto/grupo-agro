// src/services/api.js
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
    // ¡CAMBIA ESTA LÍNEA! Leer de 'user' para que coincida con AuthContext
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;