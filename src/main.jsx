// src/main.jsx (o src/index.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext'; // ⭐ Importa tu AuthProvider ⭐

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* ⭐ Envuelve tu App con AuthProvider ⭐ */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);