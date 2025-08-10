import axios from 'axios';

const api = axios.create({
  baseURL: 'https://grupo-agro-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept' : 'application/json'
  },
  withCredentials: true // Añade esto para enviar cookies
});

//interceptor para errores CORS especificos
api.interceptors.response.use(
  response => response,
  error => {
    if (error.message === 'Network Error' && !error.response) {
      // Probable error CORS
      window.location.reload(); // Fuerza recarga como último recurso
    }
    return Promise.reject(error);
  }
);

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