import axios from "axios";

// Configuración automática para desarrollo/producción - CORREGIDO para Vite
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

console.log("Axios Base URL:", baseURL);

const api = axios.create({
  // 2. Usa la variable 'baseURL' en el objeto de configuración
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para requests - añadir token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("AgroNet_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Para FormData, usar el content-type adecuado
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => {
    console.error("Error en interceptor de request:", error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error" && !error.response) {
      // Probable error CORS o de conexión
      console.error("Error de red - Verifica la conexión o CORS");

      // Solo recargar si es un error crítico
      if (!window.location.href.includes("/login")) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("AgroNet_token");
      // Redirigir a login solo si no está ya en la página de login
      if (!window.location.href.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Manejar errores de reCAPTCHA específicos
    if (
      error.response?.data?.message?.includes("CAPTCHA") ||
      error.response?.data?.message?.includes("reCAPTCHA")
    ) {
      console.error("Error de reCAPTCHA:", error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default api;
