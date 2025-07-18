// src/pages/ProductListPage.jsx

import React, { useState, useEffect, useContext, useCallback } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion"; // Importar motion para animaciones

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const { user } = useContext(AuthContext);

  // ✨ NUEVOS ESTADOS PARA FILTROS ✨
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showTradableOnly, setShowTradableOnly] = useState(false);
  const [categories, setCategories] = useState([]); // Para poblar el select de categorías

  // Función para obtener productos con filtros
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Construir la URL con los parámetros de consulta
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      if (showTradableOnly) {
        params.append("tradable", "true");
      }

      const queryString = params.toString();
      const url = `/products${queryString ? `?${queryString}` : ""}`;

      const response = await api.get(url);
      setProducts(response.data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError(
        "Error al cargar los productos. Inténtalo de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, showTradableOnly]); // Dependencias para useCallback

  // Efecto para cargar categorías la primera vez
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // En un futuro, podrías tener un endpoint para listar categorías.
        // Por ahora, usamos un array fijo o extraemos de los productos existentes.
        // Para este ejemplo, haremos un endpoint ficticio o una lista base.
        // O: podrías obtener todas las categorías de tus productos existentes.
        const res = await api.get("/products"); // Una llamada inicial para obtener categorías únicas
        const uniqueCategories = [...new Set(res.data.map(p => p.category).filter(Boolean))];
        setCategories(['Todas', ...uniqueCategories]); // Añadir 'Todas' como opción
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategories();
  }, []); // Se ejecuta solo una vez al montar

  // Efecto para recargar productos cuando cambian los filtros
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Se ejecuta cuando fetchProducts cambia (debido a las dependencias de useCallback)

  const handleAddToCart = async (productId, quantity = 1) => {
    if (!user) {
      setCartMessage("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    try {
      const response = await api.post("/cart", { productId, quantity });
      console.log("Producto añadido al carrito:", response.data);
      setCartMessage("Producto añadido al carrito exitosamente!");
    } catch (err) {
      console.error("Error al añadir producto al carrito:", err);
      if (err.response?.data?.message) {
        setCartMessage(
          `Error al añadir al carrito: ${err.response.data.message}`
        );
      } else {
        setCartMessage(
          "Error desconocido al añadir al carrito. Inténtalo de nuevo."
        );
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 py-10 font-inter"
    >
      <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
        Productos Disponibles
      </h2>

      {cartMessage && (
        <div
          className={`text-center p-4 rounded mb-6 max-w-xl mx-auto font-medium ${
            cartMessage.includes("Error")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {cartMessage}
        </div>
      )}

      {/* ✨ SECCIÓN DE FILTROS ✨ */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center gap-4">
        {/* Búsqueda por Nombre */}
        <div className="flex-1 w-full md:w-auto">
          <label htmlFor="search" className="sr-only">Buscar Producto</label>
          <input
            type="text"
            id="search"
            placeholder="Buscar por nombre de producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Filtro por Categoría */}
        <div className="w-full md:w-auto">
          <label htmlFor="category" className="sr-only">Filtrar por Categoría</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value === 'Todas' ? '' : e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-md bg-white focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todas las Categorías</option>
            {/* Si tienes categorías dinámicas, itera aquí. Por ahora, un placeholder */}
            {categories.map((cat, index) => (
              <option key={index} value={cat === 'Todas' ? '' : cat}>{cat}</option>
            ))}
            {/* Puedes añadir más opciones hardcodeadas si es necesario, ej:
            <option value="Frutas">Frutas</option>
            <option value="Verduras">Verduras</option>
            <option value="Lacteos">Lácteos</option>
            */}
          </select>
        </div>

        {/* Filtro de Truequeable */}
        <div className="w-full md:w-auto flex items-center justify-center md:justify-start">
          <input
            type="checkbox"
            id="tradable"
            checked={showTradableOnly}
            onChange={(e) => setShowTradableOnly(e.target.checked)}
            className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="tradable" className="ml-2 text-base text-gray-900">Solo Truequeables 🤝</label>
        </div>

        {/* Botón de reset de filtros (Opcional, pero útil) */}
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedCategory('');
            setShowTradableOnly(false);
          }}
          className="w-full md:w-auto bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
        >
          Limpiar Filtros
        </button>
      </div>
      {/* ✨ FIN SECCIÓN DE FILTROS ✨ */}

      {loading ? (
        <div className="text-center text-gray-600 py-16 font-medium text-lg">
          Cargando productos filtrados...
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-20">
          No hay productos disponibles que coincidan con tus filtros.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              productId={product._id}
              image={product.imageUrl}
              name={product.name}
              description={product.description}
              price={product.price}
              quantity={product.quantity}
              isTradable={product.isTradable}
              // Asegúrate de que product.user.isPremium sea accedido correctamente
              // El backend debe popular 'user' para que esto funcione
              isPremium={product.user?.isPremium}
              onAddToCart={() => handleAddToCart(product._id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default ProductListPage;
