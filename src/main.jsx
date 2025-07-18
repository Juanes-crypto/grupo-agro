import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Tu archivo CSS global, si tienes uno
// ELIMINAR: import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // Importa AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ELIMINAR: <BrowserRouter> */}
      {/* AuthProvider debe envolver App para que AuthContext esté disponible */}
      <AuthProvider>
        <App />
      </AuthProvider>
    {/* ELIMINAR: </BrowserRouter> */}
  </React.StrictMode>,
);