import axios from 'axios';

const api = axios.create({
  baseURL: 'https://grupo-agro-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Añade esto para enviar cookies
});

// Interceptor para añadir token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agroapp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Error en interceptor de request:', error);
  return Promise.reject(error);
});

// Interceptor para respuestas
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('agroapp_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;