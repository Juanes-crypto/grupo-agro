// src/pages/DashboardPage.jsx

import React from 'react';
import { useAuth } from '../hooks/useAuth';

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-agro-gray-light flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-elevated w-full max-w-md md:max-w-lg lg:max-w-xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-agro-black-primary mb-6 animate-fade-in-down">
          Dashboard de Usuario
        </h2>

        {user ? (
          <div className="space-y-4 animate-fade-in-up">
            <p className="text-lg text-agro-gray-dark">
              ¡Bienvenido, <strong className="text-agro-green-dark">{user.name}</strong> (<span className="text-agro-blue-DEFAULT">{user.email}</span>)!
            </p>
            <p className="text-md text-agro-gray-medium">
              Tu rol es: <strong className="text-agro-green-DEFAULT capitalize">{user.role}</strong>
            </p>
            <button
              onClick={logout}
              className="mt-6 w-full py-3 px-4 bg-agro-red-error text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <p className="text-lg text-agro-red-error animate-bounce-in">
            No hay usuario logueado. Por favor, inicia sesión.
          </p>
        )}

        <h3 className="text-2xl font-semibold text-agro-black-primary mt-8 mb-4 border-t pt-6 border-agro-gray-medium animate-fade-in-up">
          Funcionalidades disponibles:
        </h3>
        <ul className="space-y-3 text-lg">
          <li>
            <a
              href="/create-product"
              className="text-agro-blue-DEFAULT hover:text-agro-blue-light transition duration-300 ease-in-out font-medium hover:underline block py-2 px-4 bg-agro-green-light bg-opacity-10 rounded-md hover:bg-opacity-20"
            >
              Crear Nuevo Producto
            </a>
          </li>
          <li>
            <a
              href="/products"
              className="text-agro-orange-DEFAULT hover:text-agro-orange-DEFAULT transition duration-300 ease-in-out font-medium hover:underline block py-2 px-4 bg-agro-yellow-light bg-opacity-10 rounded-md hover:bg-opacity-20"
            >
              Ver Mis Productos (próximamente)
            </a>
          </li>
          {/* Aquí puedes añadir más enlaces según el rol del usuario, con estilos similares */}
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;
