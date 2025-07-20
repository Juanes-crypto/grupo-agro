// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ¡ESTA LÍNEA ES FUNDAMENTAL!
  ],
  theme: {
    extend: {
      // ... tus personalizaciones (colores, sombras, etc.)
    },
  },
  plugins: [],
};