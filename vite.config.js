import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Asegura que todas las importaciones de heroicons usen la versión 24
      '@heroicons/react/outline': '@heroicons/react/24/outline',
      '@heroicons/react/solid': '@heroicons/react/24/solid',
      // Alias para rutas comunes
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages'
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid'
    ],
    exclude: ['@heroicons/react'] // Excluye la versión antigua
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      exclude: ['@heroicons/react']
    },
    rollupOptions: {
      external: [], // Vacío, no externalizamos nada
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['@heroicons/react/24/outline', '@heroicons/react/24/solid']
        }
      }
    }
  }
});