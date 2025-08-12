import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { HashRouter } from 'react-router-dom'; // Importa HashRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter> {/* Envuelve todo con HashRouter */}
      <AuthProvider> 
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
);