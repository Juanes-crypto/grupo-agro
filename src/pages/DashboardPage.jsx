// src/pages/DashboardPage.jsx

import React from 'react';
import { useAuth } from '../hooks/useAuth'; // Para mostrar info del usuario

function DashboardPage() {
  const { user, logout } = useAuth(); // Obtén el usuario y la función logout

  return (
    <div>
      <h2>Dashboard de Usuario</h2>
      {user ? (
        <>
          <p>Bienvenido, {user.name} ({user.email})</p>
          <p>Tu rol es: <strong>{user.role}</strong></p>
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      ) : (
        <p>No hay usuario logueado.</p> // Esto no debería verse si PrivateRoute funciona
      )}
      <h3>Funcionalidades disponibles:</h3>
      <ul>
        <li><a href="/create-product">Crear Nuevo Producto</a></li>
        <li><a href="/products">Ver Mis Productos (próximamente)</a></li>
        {/* Aquí puedes añadir más enlaces según el rol del usuario */}
      </ul>
    </div>
  );
}

export default DashboardPage;