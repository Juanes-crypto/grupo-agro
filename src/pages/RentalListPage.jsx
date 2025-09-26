import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { FiSearch, FiFilter, FiStar, FiRefreshCw } from 'react-icons/fi';
import { FaWhatsapp, FaCrown, FaTractor, FaTools } from 'react-icons/fa';
import RentalCard from "../components/RentalCard"; // Asegúrate de que la ruta sea correcta

function RentalListPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isMyRentalsPage = location.pathname === "/my-rentals";
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Memoización de los alquileres premium y regulares para evitar recálculos innecesarios
  const premiumRentals = rentals.filter(rental => rental.owner?.isPremium);
  const regularRentals = rentals.filter(rental => !rental.owner?.isPremium);

  const rentalCategories = [
    "Tractores",
    "Arados",
    "Sembradoras",
    "Cosechadoras",
    "Sistemas de Riego",
    "Herramientas Manuales",
    "Vehículos Utilitarios",
    "Drones Agrícolas",
    "Equipos de Fumigación",
    "Otros",
  ];

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Use useCallback para memorizar la función y evitar que se recree en cada render
  const fetchRentals = useCallback(async () => {
    setLoading(true);
    setError(null);

    let url = "https://grupo-agro-backend.onrender.com/api/rentals";
    const params = new URLSearchParams();

    if (isMyRentalsPage) {
      url = "https://grupo-agro-backend.onrender.com/api/rentals/my-rentals";
      if (!isAuthenticated || !token) {
        setError("Debes iniciar sesión para ver tus rentas.");
        setLoading(false);
        return;
      }
    } else {
      if (debouncedSearchTerm) {
        params.append("search", debouncedSearchTerm);
      }
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
    }

    const queryString = params.toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }

    try {
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await api.get(url, { headers });
      const sortedRentals = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setRentals(sortedRentals);
    } catch (err) {
      console.error("Error fetching rentals:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error desconocido al cargar las rentas.");
      }
    } finally {
      setLoading(false);
    }
  }, [isMyRentalsPage, isAuthenticated, token, debouncedSearchTerm, selectedCategory]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]); // La dependencia es la función memorizada

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'pt-16' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-md">
            {isMyRentalsPage ? "Mis Rentas" : "Maquinaria Agrícola en Renta"}
          </h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto mb-8">
            {isMyRentalsPage ?
              "Administra tus equipos en renta" :
              "Encuentra la mejor maquinaria agrícola para tus necesidades"}
          </p>

          {/* Search Bar */}
          {!isMyRentalsPage && (
            <div className="max-w-3xl mx-auto relative">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Buscar maquinaria (ej. tractor, sistema de riego...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-full border-none focus:ring-4 focus:ring-blue-300 focus:outline-none text-gray-800 shadow-lg"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full flex items-center justify-center"
                >
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
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Todas las categorías</option>
                        {rentalCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-between pt-6">
                      <button
                        onClick={() => {
                          setSelectedCategory('');
                          setSearchTerm('');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FiRefreshCw className="mr-1" /> Limpiar filtros
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
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-700 text-lg">Cargando maquinaria en renta...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">Error: {error}</p>
              </div>
            </div>
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <FaTractor className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron equipos en renta</h3>
            <p className="text-gray-500 mb-6">No hay maquinaria que coincida con tu búsqueda.</p>
            {!isMyRentalsPage && (
              <Link
                to="/create-rental"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Publicar un nuevo equipo
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* VIP Premium Section */}
            {!isMyRentalsPage && premiumRentals.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FaCrown className="text-yellow-500 mr-2" /> Rentas Premium
                  </h2>
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    <FiStar className="mr-1" /> Proveedores Verificados
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {premiumRentals.map(rental => (
                    <RentalCard
                      key={rental._id}
                      rental={rental}
                      isPremium={true}
                      isMyRentalsPage={isMyRentalsPage}
                      setRentals={setRentals}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Rentals Section */}
            {regularRentals.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaTools className="text-blue-500 mr-2" />
                  {isMyRentalsPage ? 'Todos mis equipos' : 'Todos los equipos en renta'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {regularRentals.map(rental => (
                    <RentalCard
                      key={rental._id}
                      rental={rental}
                      isMyRentalsPage={isMyRentalsPage}
                      setRentals={setRentals}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Call to Action */}
      {!isMyRentalsPage && (
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">¿Tienes maquinaria agrícola?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Únete a nuestro programa premium y destaca tus equipos con beneficios exclusivos.
            </p>
            <Link
              to="/premium"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-bold rounded-full shadow-sm text-blue-900 bg-yellow-400 hover:bg-yellow-300 transition duration-300 transform hover:scale-105"
            >
              <FaCrown className="mr-2" /> Conviértete en Proveedor Premium
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default RentalListPage;