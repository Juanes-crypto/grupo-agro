// src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Importa el hook de autenticación

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth(); // Obtén el estado de autenticación

  // Si aún estamos cargando el usuario desde localStorage, muestra un cargador
  if (loading) {
    return <div>Cargando...</div>; // Puedes reemplazar esto por un spinner real
  }

  // Si no está autenticado, redirige a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos, verifica si el usuario tiene alguno de ellos
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      // Si el usuario no tiene el rol permitido, puedes redirigirlo a una página de "acceso denegado"
      // o a la raíz, o simplemente mostrar un mensaje.
      console.log('Acceso denegado. Rol del usuario:', user.role, 'Roles permitidos:', allowedRoles);
      return <Navigate to="/" replace />; // Redirige a la página de inicio
    }
  }

  // Si está autenticado y tiene el rol correcto, renderiza los componentes hijos
  return children ? children : <Outlet />;
};

export default PrivateRoute;