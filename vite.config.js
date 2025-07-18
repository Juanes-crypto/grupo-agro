import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': { // Si la URL de la petición empieza con /api
        target: 'http://localhost:5000', // Redirige a tu servidor backend
        changeOrigin: true, // Necesario para que el host del backend sea el destino
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Opcional: reescribe la ruta (en este caso, la mantiene igual)
      },
    },
  },
});
