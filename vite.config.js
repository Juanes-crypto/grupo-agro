import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'https://grupo-agro-backend.onrender.com',
        changeOrigin: true,
        secure: true // Asegura conexión HTTPS
      }
    }
  }
});