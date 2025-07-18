// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Recupera usuario desde localStorage al montar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error al interpretar el usuario guardado:", err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // ✅ Login: guardar usuario y actualizar estado
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // 🔒 Logout: limpiar usuario
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // 🧠 Valor del contexto
  const authContextValue = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isPremium: user?.isPremium || false, // <- limpio y seguro
  };

  // ⏳ Render provisional mientras carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-medium">
        Cargando autenticación...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};