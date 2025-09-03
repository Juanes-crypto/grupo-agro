import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FiEdit, FiTrash2, FiEye, FiToggleLeft, FiToggleRight, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { FaCrown, FaTractor, FaWarehouse } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyRentalsPage = () => {
  const { user, token, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await api.get('/api/rentals/my-rentals', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRentals(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar tus rentas');
        console.error('Error fetching rentals:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && token) {
      fetchRentals();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, token, navigate]);

  const handleDelete = async (rentalId) => {
    if (window.confirm('¿Estás seguro de eliminar esta renta?')) {
      try {
        await api.delete(`/api/rentals/${rentalId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRentals(rentals.filter(r => r._id !== rentalId));
        toast.success('Renta eliminada correctamente');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error al eliminar la renta');
      }
    }
  };

  const togglePublishStatus = async (rentalId, currentStatus) => {
    try {
      const response = await api.put(
        `/api/rentals/${rentalId}`,
        { isPublished: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setRentals(rentals.map(r => 
        r._id === rentalId ? { ...r, isPublished: response.data.isPublished } : r
      ));
      
      toast.success(
        `Renta ${!currentStatus ? 'publicada' : 'ocultada'} correctamente`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar la renta');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'pt-16' : ''}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
            Mis Rentas de Equipos y Espacios
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Administra tus equipos y espacios disponibles para renta
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaTractor className="text-blue-500 mr-2" /> Todas mis rentas
          </h2>
          <Link
            to="/create-rental"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center transition duration-300 transform hover:scale-105"
          >
            <FiPlus className="mr-2" /> Nueva Renta
          </Link>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">Error: {error}</p>
              </div>
            </div>
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md p-8">
            <div className="mx-auto h-24 w-24 text-blue-400 mb-4">
              <FaWarehouse className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes rentas publicadas</h3>
            <p className="text-gray-500 mb-6">Comienza ofreciendo en renta tus equipos o espacios agrícolas</p>
            <Link
              to="/create-rental"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" /> Crear mi primera renta
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rentals.map(rental => (
              <div
                key={rental._id}
                className={`relative rounded-xl overflow-hidden flex flex-col transition-all duration-300 transform hover:scale-[1.02] group
                  ${rental.user?.isPremium ? 
                    'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-300 shadow-xl' : 
                    'bg-white border border-gray-200 shadow-md hover:shadow-lg'
                  }`}
              >
                {/* Premium badge */}
                {rental.user?.isPremium && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="flex items-center bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      <FaCrown className="mr-1" /> PREMIUM
                    </div>
                  </div>
                )}

                {/* Rental image */}
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={rental.imageUrl || 'https://via.placeholder.com/400x300?text=Renta+Agro'}
                    alt={rental.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+No+Disponible'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Rental details */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{rental.name}</h2>
                    <span className="text-xl font-extrabold text-blue-700">
                      ${rental.pricePerDay?.toLocaleString('es-CO')}/día
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{rental.description}</p>
                  
                  <div className="flex justify-between items-center mb-3 text-xs">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{rental.category}</span>
                    <span className={`px-2 py-1 rounded ${rental.isPublished ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {rental.isPublished ? 'PUBLICADO' : 'OCULTO'}
                    </span>
                  </div>

                  <div className="mt-auto flex flex-col space-y-2 w-full">
                    <Link
                      to={`/rentals/${rental._id}`}
                      className="text-center py-2 px-4 rounded-lg transition duration-300 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Ver Detalles
                    </Link>

                    <div className="grid grid-cols-2 gap-2">

                      <div className="flex space-x-2">
                        <Link
                          to={`/edit-rental/${rental._id}`}
                          className="flex-1 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
                        >
                          <FiEdit className="mr-1" /> Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(rental._id)}
                          className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
                        >
                          <FiTrash2 className="mr-1" /> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentalsPage;