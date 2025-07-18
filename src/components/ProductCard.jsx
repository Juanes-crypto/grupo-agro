// src/components/ProductCard.jsx

import React, { useState } from 'react'; // Importa useState
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Importa el servicio de la API

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
  const [message, setMessage] = useState(''); // Estado para mensajes de feedback

  const handleAddToCart = async () => {
    try {
      // Asume que siempre se añade 1 unidad por ahora
      await api.post('/cart', { productId: productId, quantity: 1 });
      setMessage('¡Producto añadido al carrito!');
      // Opcional: limpiar el mensaje después de un tiempo
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error al añadir producto al carrito:', error);
      setMessage('Error al añadir al carrito.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border rounded-xl shadow-md p-5 font-inter transition ${
        isPremium ? 'border-green-500 shadow-green-200' : 'border-gray-200'
      }`}
    >
      <div className="mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover rounded-lg border"
        />
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-2">{name}</h2>

      <p className="text-gray-600 text-sm line-clamp-3 mb-3">{description}</p>

      <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
        <span>💲 <strong>{price.toLocaleString()} COP</strong></span>
        <span>📦 {quantity} disponibles</span>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span>
          🔁 Truequeable:{' '}
          <span className={isTradable ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
            {isTradable ? 'Sí' : 'No'}
          </span>
        </span>

        {isPremium && (
          <span className="bg-yellow-400 text-white px-2 py-1 rounded text-xs font-bold shadow">
            PREMIUM
          </span>
        )}
      </div>

      <div className="mt-5 flex gap-3"> {/* Contenedor para los dos botones */}
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-bold transition text-sm"
        >
          Añadir al carrito
        </button>
        <Link to={`/products/${productId}`} className="flex-1">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-bold transition text-sm">
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
