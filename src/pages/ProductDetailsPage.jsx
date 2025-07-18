// src/pages/ProductDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Asegúrate de que el backend está poblando el campo 'user' con 'isPremium'
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setError('No se pudo cargar el producto.');
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post('/cart', { productId: product._id, quantity: 1 });
      setMessage('Producto añadido al carrito!');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error al añadir al carrito.';
      setMessage(errMsg);
      console.error('Error al añadir al carrito:', err);
    }
  };

  // ✨ NUEVA FUNCIÓN: Manejar solicitud de trueque ✨
  const handleRequestTrade = () => {
    // Lógica para iniciar un trueque. Esto podría navegar a una página de trueque
    // o abrir un modal para seleccionar productos para el trueque.
    // Por ahora, simplemente navegaremos a una URL de ejemplo.
    alert('Funcionalidad de trueque en desarrollo. Producto: ' + product.name);
    // navigate(`/trade/${product._id}`); // Puedes implementar una ruta de trueque real
  };


  if (error) {
    return (
      <div className="text-center text-red-600 font-medium py-20">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-gray-600 font-medium py-20">
        Cargando detalles del producto...
      </div>
    );
  }

  // Determinar si el producto es de un usuario premium y si es truequeable
  // `product.user` ahora debe contener el objeto de usuario con `isPremium`
  const isPremiumProductOwner = product.user?.isPremium;
  const showTradeOption = isPremiumProductOwner && product.isTradable;
  const showAddToCartOption = !isPremiumProductOwner; // Si no es premium, mostrar carrito


  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-6 py-12 font-inter"
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 font-semibold hover:underline"
      >
        ← Volver
      </button>

      <div className="bg-white border rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8">
        <img
          src={product.imageUrl || 'https://placehold.co/300x220?text=Sin+Imagen'}
          alt={product.name}
          className="w-full md:w-1/2 object-cover rounded-lg border h-64"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-green-800 mb-2">{product.name}</h1>

          {isPremiumProductOwner && ( // Usar la nueva variable
            <div className="mb-2">
              <span className="inline-block bg-yellow-400 text-white text-xs px-2 py-1 rounded font-bold shadow">
                PREMIUM
              </span>
            </div>
          )}

          <p className="text-gray-700 text-sm mb-4">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
            <div>
              💲 <strong>{product.price.toLocaleString()} COP</strong>
            </div>
            <div>
              📦 {product.quantity} disponibles
            </div>
            <div>
              🔁 Truequeable: <strong className={product.isTradable ? 'text-green-600' : 'text-red-500'}>
                {product.isTradable ? 'Sí' : 'No'}
              </strong>
            </div>
            <div>
              📂 Categoría: {product.category || 'N/A'}
            </div>
          </div>

          {/* ✨ Lógica condicional para mostrar botones ✨ */}
          {showTradeOption ? (
            <button
              onClick={handleRequestTrade}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-bold transition"
            >
              Solicitar Trueque 🤝
            </button>
          ) : showAddToCartOption ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-bold transition"
            >
              Añadir al carrito 🛒
            </button>
          ) : (
            // Caso: Producto Premium pero NO Truequeable (o alguna otra combinación inesperada)
            <p className="text-center text-gray-500 mt-4">Este producto no está disponible para compra ni trueque.</p>
          )}

          {message && (
            <p className="mt-4 text-center text-sm font-medium text-green-700">
              {message}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProductDetailsPage;
