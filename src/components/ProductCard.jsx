// src/components/ProductCard.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';

function ProductCard({
  image,
  name,
  description,
  price,
  quantity,
  isTradable,
  isPremium,
  productId,
}) {
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    try {
      await api.post('/cart', { productId, quantity: 1 });
      setMessage('¡Producto añadido al carrito!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error al añadir producto al carrito:', error);
      setMessage('Error al añadir al carrito.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`bg-white rounded-xl shadow-lg p-5 font-inter transition-all duration-300 border ${
        isPremium ? 'border-lime-500 shadow-lime-200' : 'border-gray-200'
      } hover:shadow-xl`}
    >
      <div className="mb-4 relative">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover rounded-lg border border-gray-300"
        />
        {isPremium && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md animate-pulse">
            PREMIUM
          </span>
        )}
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-1 tracking-wide">{name}</h2>
      <p className="text-gray-600 text-sm line-clamp-3 mb-3">{description}</p>

      <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
        <span>💲 <strong>{price.toLocaleString()} COP</strong></span>
        <span>📦 {quantity} disponibles</span>
      </div>

      <div className="flex justify-between items-center text-sm mb-4">
        <span>
          🔁 Truequeable:{' '}
          <span className={isTradable ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
            {isTradable ? 'Sí' : 'No'}
          </span>
        </span>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-4 rounded-lg font-bold transition-all duration-300 shadow hover:shadow-md text-sm"
        >
          Añadir al carrito
        </button>
        <Link to={`/products/${productId}`} className="flex-1">
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg font-bold transition-all duration-300 shadow hover:shadow-md text-sm">
            Ver más
          </button>
        </Link>
      </div>

      {message && (
        <p className={`mt-3 text-center text-sm font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-700'}`}>
          {message}
        </p>
      )}
    </motion.div>
  );
}

export default ProductCard;