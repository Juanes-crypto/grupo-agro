// src/pages/WelcomePage.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function WelcomePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isPremium = user?.isPremium;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-10 font-inter"
    >
      <div className="max-w-3xl w-full bg-white border rounded-xl shadow-xl p-8 text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          ¡Bienvenido a Agroapp, {user?.username}!
        </h1>

        <p className="text-gray-700 text-lg mb-8">
          {isPremium
            ? 'Tu cuenta premium está activa. Puedes publicar automáticamente y gestionar tu inventario visual.'
            : 'Explora productos, trueques y renta espacios. ¡Activa Premium para más funciones exclusivas!'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Link to="/create-product" className="btn-green">Publicar Producto</Link>
          <Link to="/create-barter" className="btn-yellow">Proponer Trueque</Link>
          <Link to="/rent-space" className="btn-blue">Rentar un Espacio</Link>
          <Link to="/myorders" className="btn-gray">Ver Mis Pedidos</Link>
        </div>

        {!isPremium && (
          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-2">
              ¿Quieres publicar automáticamente y destacar tus productos?
            </p>
            <Link to="/premium" className="btn-purple">Activar Plan Premium</Link>
          </div>
        )}

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 text-red-600 hover:text-red-700 font-semibold transition"
        >
          Cerrar sesión
        </motion.button>
      </div>
    </motion.div>
  );
}

export default WelcomePage;