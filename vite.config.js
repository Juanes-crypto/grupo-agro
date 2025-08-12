import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096, // Cambiado a valor recomendado
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`, // Añade hash
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  },
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'https://grupo-agro-backend.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  },
  optimizeDeps: {
    include: [
      '@heroicons/react/outline',
      '@heroicons/react/solid', // Añadido para v2
      'react',
      'react-dom'
    ]
  }
});