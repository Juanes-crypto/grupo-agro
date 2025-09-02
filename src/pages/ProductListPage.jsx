// frontend/src/pages/ProductListPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiShoppingCart,
  FiRefreshCw,
  FiHeart,
  FiShield,
  FiAward,
} from "react-icons/fi";
import { FaLeaf, FaExchangeAlt, FaCrown } from "react-icons/fa";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isTradableFilter, setIsTradableFilter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [locationFilter, setLocationFilter] = useState("all");
  const { user, token, isAuthenticated, addToCart } = useContext(AuthContext);
  const navigate = useNavigate();
  const [addedToCartMessages, setAddedToCartMessages] = useState({});
  const location = useLocation();
  const isMyProductsPage = location.pathname === "/my-products";

  // Debug: monitorear cambios en products
  useEffect(() => {
    console.log("🔄 Products state updated:", products);
    console.log("📋 Products type:", typeof products);
    console.log("🔢 Products length:", Array.isArray(products) ? products.length : "Not array");
  }, [products]);

  // Filtrar productos según selección de ubicación
  const filteredProducts = Array.isArray(products) 
    ? products.filter((product) => {
        if (!product) return false;
        if (locationFilter === "all") return true;
        if (locationFilter === "nearby" && product.distance <= 50) return true;
        if (locationFilter === "city" && product.location?.city === user?.location?.city) return true;
        if (locationFilter === "other" && product.location?.city !== user?.location?.city) return true;
        return false;
      })
    : [];

  // Separate premium and regular products
  const premiumProducts = Array.isArray(filteredProducts)
    ? filteredProducts.filter((product) => product && product.user?.isPremium)
    : [];

  const regularProducts = Array.isArray(filteredProducts)
    ? filteredProducts.filter((product) => product && !product.user?.isPremium)
    : [];

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounce effect for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      console.log("🔐 Token actual:", token);
      console.log("👤 User actual:", user);
      console.log("🔐 Is authenticated:", isAuthenticated);
      
      let url = "https://grupo-agro-backend.onrender.com/api/products";
      const params = new URLSearchParams();

      // Agregar parámetros de ubicación
      if (user && user.location && user.location.coordinates && !isMyProductsPage) {
        params.append("latitude", user.location.coordinates[1]);
        params.append("longitude", user.location.coordinates[0]);
        params.append("maxDistance", 50);
      }

      if (isMyProductsPage) {
        url = "https://grupo-agro-backend.onrender.com/api/products/my-products";
        if (!isAuthenticated || !token) {
          setError("Debes iniciar sesión para ver tus productos.");
          setLoading(false);
          return;
        }
      } else {
        if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
        if (selectedCategory) params.append("category", selectedCategory);
        if (isTradableFilter) params.append("isTradable", "true");
      }

      const queryString = params.toString();
      if (queryString) url = `${url}?${queryString}`;

      try {
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        
        console.log("🌐 Fetching from URL:", url);
        const response = await api.get(url, { headers });
        
        console.log("🔍 ProductListPage - Response:", response);
        console.log("📊 ProductListPage - Response data:", response.data);

        // ✅ MANEJO ESPECÍFICO PARA MY-PRODUCTS
        if (isMyProductsPage) {
          console.log("🛒 Fetching MY PRODUCTS endpoint");
          if (response.data && response.data.success && Array.isArray(response.data.data)) {
            setProducts(response.data.data);
            console.log("✅ My Products - Datos extraídos correctamente:", response.data.data.length);
          } else {
            console.error("❌ Formato inválido para my-products:", response.data);
            setProducts([]);
            setError("Formato de respuesta inválido del servidor");
          }
        } else {
          // ✅ MANEJO PARA PRODUCTOS NORMALES
          let productsData = [];
          
          if (Array.isArray(response.data)) {
            productsData = response.data;
            console.log("✅ Caso 1 - Array directo");
          } 
          else if (response.data && Array.isArray(response.data.data)) {
            productsData = response.data.data;
            console.log("✅ Caso 2 - response.data.data");
          }
          else if (response.data && Array.isArray(response.data.products)) {
            productsData = response.data.products;
            console.log("✅ Caso 3 - response.data.products");
          }
          else {
            console.error("❌ Formato inválido:", response.data);
            productsData = [];
          }
          
          setProducts(productsData);
        }
        
      } catch (err) {
        console.error('Error al cargar productos:', err);
        console.error('Error details:', err.response?.data);
        
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Error desconocido al cargar los productos.");
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [isMyProductsPage, isAuthenticated, token, debouncedSearchTerm, selectedCategory, isTradableFilter, user]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      navigate("/login");
      return;
    }
    if (product.stock === 0) {
      setAddedToCartMessages((prevMessages) => ({
        ...prevMessages,
        [product._id]: "❌ ¡Producto agotado!",
      }));
      setTimeout(() => {
        setAddedToCartMessages((prevMessages) => ({
          ...prevMessages,
          [product._id]: "",
        }));
      }, 2000);
      return;
    }
    addToCart(product);
    setAddedToCartMessages((prevMessages) => ({
      ...prevMessages,
      [product._id]: "✔️ ¡Añadido al carrito!",
    }));
    setTimeout(() => {
      setAddedToCartMessages((prevMessages) => ({
        ...prevMessages,
        [product._id]: "",
      }));
    }, 2000);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await api.delete(`/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(products.filter((p) => p._id !== productId));
        alert("Producto eliminado con éxito.");
      } catch (err) {
        console.error("Error eliminando producto:", err);
        alert("Error al eliminar el producto.");
      }
    }
  };

  const categories = [
    "Frutas", "Verduras", "Granos", "Lácteos", "Carnes", "Cereales", 
    "Legumbres", "Pescados", "Huevos", "Miel", "Plantas", "Semillas", 
    "Fitosanitarios", "Fertilizantes", "Maquinaria", "Otros",
  ];

  // Render product card with validation
  const renderProductCard = (product, isPremium = false) => {
    if (!product || !product._id) {
      console.warn("Producto inválido:", product);
      return null;
    }
    
    return (
      <div key={product._id} className={`relative rounded-xl overflow-hidden flex flex-col transition-all duration-300 transform hover:scale-[1.02] group ${
        isPremium ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-300 shadow-xl" : "bg-white border border-gray-200 shadow-md hover:shadow-lg"
      }`}>
        {/* Premium badge */}
        {isPremium && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              <FaCrown className="mr-1" /> PREMIUM
            </div>
          </div>
        )}
        
        {/* Product image */}
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={product.imageUrl || "https://via.placeholder.com/400x300?text=Producto+Agro"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400x300?text=Imagen+No+Disponible";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        
        {/* Product details */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h2>
            {product.isTradable ? (
              <span className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold">
                <FaExchangeAlt className="mr-1" /> TRUEQUE
              </span>
            ) : (
              <span className="text-xl font-extrabold text-green-700">
                ${product.price ? product.price.toFixed(2) : "N/A"}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{product.description}</p>
          
          <div className="flex justify-between items-center mb-3 text-xs">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{product.category}</span>
            <span className={`px-2 py-1 rounded ${
              product.stock === 0 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
            }`}>
              {product.stock === 0 ? "AGOTADO" : `STOCK: ${product.stock} ${product.unit}`}
            </span>
          </div>
          
          {product.user && (
            <div className="flex items-center text-xs text-gray-500 mb-4">
              <span className="font-medium text-gray-700">Vendedor: {product.user.name || "Anónimo"}</span>
              {product.user.isPremium && <FiStar className="ml-1 text-yellow-500" />}
            </div>
          )}
          
          {product.distance && (
            <div className="flex items-center text-xs text-gray-600 mb-2">
              <FiHeart className="mr-1 text-red-500" />A {product.distance.toFixed(1)} km de ti
            </div>
          )}
          
          {product.location?.city && (
            <div className="flex items-center text-xs text-gray-600 mb-4">
              <FiShield className="mr-1 text-blue-500" />
              {product.location.city}
            </div>
          )}
          
          <div className="mt-auto flex flex-col space-y-2 w-full">
            <Link to={`/products/${product._id}`} className={`text-center py-2 px-4 rounded-lg transition duration-300 text-sm font-semibold ${
              isPremium ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}>
              Ver Detalles
            </Link>
            
            {isAuthenticated && user && (
              <>
                {isMyProductsPage ? (
                  <>
                    <Link to={`/edit-product/${product._id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-2 px-4 rounded-lg text-center transition duration-300">
                      Editar Producto
                    </Link>
                    <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300">
                      Eliminar Producto
                    </button>
                  </>
                ) : (
                  product.user && user && product.user._id !== user._id && (
                    <>
                      {product.stock > 0 ? (
                        <button onClick={() => handleAddToCart(product)} className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300">
                          <FiShoppingCart className="mr-2" /> Añadir al Carrito
                        </button>
                      ) : (
                        <button className="bg-gray-400 text-white text-sm font-semibold py-2 px-4 rounded-lg cursor-not-allowed" disabled>
                          Producto Agotado
                        </button>
                      )}
                      
                      {addedToCartMessages[product._id] && (
                        <p className={`text-center text-xs font-semibold mt-1 animate-pulse ${
                          addedToCartMessages[product._id].includes("❌") ? "text-red-600" : "text-green-600"
                        }`}>
                          {addedToCartMessages[product._id]}
                        </p>
                      )}
                      
                      {product.isTradable && (
                        <Link to={`/create-barter-proposal/${product._id}`} className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300">
                          <FaExchangeAlt className="mr-2" /> Proponer Trueque
                        </Link>
                      )}
                    </>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-r from-green-600 to-emerald-700 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? "pt-16" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-md">
            {isMyProductsPage ? "Mis Productos" : "Mercado Agrícola Premium"}
          </h1>
          <p className="text-xl text-center text-green-100 max-w-3xl mx-auto mb-8">
            {isMyProductsPage ? "Administra tus productos publicados" : "Productos frescos directamente del productor"}
          </p>
          
          {/* Search Bar */}
          {!isMyProductsPage && (
            <div className="max-w-3xl mx-auto relative">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Buscar productos (ej. tomates orgánicos, miel pura...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-full border-none focus:ring-4 focus:ring-green-300 focus:outline-none text-gray-800 shadow-lg"
                />
                <button onClick={() => setShowFilters(!showFilters)} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full flex items-center justify-center">
                  <FiFilter className="text-lg" />
                </button>
              </div>
              
              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 bg-white rounded-xl shadow-xl p-6 animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiFilter className="mr-2" /> Filtros Avanzados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="">Todas las categorías</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-between pt-6">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <div className="relative">
                          <input type="checkbox" className="sr-only" checked={isTradableFilter} onChange={(e) => setIsTradableFilter(e.target.checked)} />
                          <div className={`block w-14 h-8 rounded-full transition ${isTradableFilter ? "bg-purple-600" : "bg-gray-300"}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${isTradableFilter ? "translate-x-6" : ""}`}></div>
                        </div>
                        <span className="text-gray-700 font-medium">Solo truequeables</span>
                      </label>
                      <button onClick={() => { setSelectedCategory(""); setIsTradableFilter(false); setLocationFilter("all"); }} className="text-sm text-green-600 hover:text-green-800 flex items-center">
                        <FiRefreshCw className="mr-1" /> Limpiar filtros
                      </button>
                    </div>
                  </div>
                  
                  {/* Filtros de ubicación */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Ubicación</label>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setLocationFilter("all")} className={`px-3 py-2 rounded-full text-sm font-medium ${locationFilter === "all" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                        🌎 Todos
                      </button>
                      <button onClick={() => setLocationFilter("nearby")} className={`px-3 py-2 rounded-full text-sm font-medium ${locationFilter === "nearby" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                        📍 Cercanos (50km)
                      </button>
                      <button onClick={() => setLocationFilter("city")} className={`px-3 py-2 rounded-full text-sm font-medium ${locationFilter === "city" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                        🏙️ Mi ciudad
                      </button>
                      <button onClick={() => setLocationFilter("other")} className={`px-3 py-2 rounded-full text-sm font-medium ${locationFilter === "other" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                        🗺️ Otras ciudades
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
            <p className="text-gray-700 text-lg">Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="CurrentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">Error: {error}</p>
              </div>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <FaLeaf className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500 mb-6">No hay productos que coincidan con tu búsqueda.</p>
            {!isMyProductsPage && (
              <Link to="/create-product" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Publicar un nuevo producto
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* VIP Premium Section */}
            {!isMyProductsPage && premiumProducts.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FiAward className="text-yellow-500 mr-2" /> Productos Premium
                  </h2>
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    <FiShield className="mr-1" /> Calidad Verificada
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {premiumProducts.map((product) => renderProductCard(product, true))}
                </div>
              </div>
            )}
            
            {/* Regular Products Section */}
            {regularProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaLeaf className="text-green-500 mr-2" />
                  {isMyProductsPage ? "Todos mis productos" : "Todos los productos"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {regularProducts.map((product) => renderProductCard(product))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Call to Action */}
      {!isMyProductsPage && (
        <div className="bg-gradient-to-r from-green-700 to-emerald-800 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">¿Eres productor agrícola?</h2>
            <p className="text-xl text-green-100 mb-8">Únete a nuestra comunidad premium y destaca tus productos con beneficios exclusivos.</p>
            <Link to="/premium" className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-bold rounded-full shadow-sm text-green-900 bg-yellow-400 hover:bg-yellow-300 transition duration-300 transform hover:scale-105">
              <FaCrown className="mr-2" /> Conviértete en Premium
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductListPage;