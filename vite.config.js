import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [], // Vacío, no externalizamos nada
      output: {
        // Mantén tu configuración actual de output
      }
    }
  },
  resolve: {
    alias: {
      // Añade estos alias para asegurar la resolución
      '@heroicons/react/outline': '@heroicons/react/24/outline',
      '@heroicons/react/solid': '@heroicons/react/24/solid'
    }
  },
  optimizeDeps: {
    include: [
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid',
      'react',
      'react-dom'
    ],
    exclude: ['@heroicons/react'] // Excluye la versión genérica
  }
});