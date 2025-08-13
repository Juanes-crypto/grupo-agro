import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiEdit, FiTrash2, FiEye, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

const MyRentalsPage = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await api.get('/rentals/my-rentals', {
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

    if (user && token) {
      fetchRentals();
    }
  }, [user, token]);

  const handleDelete = async (rentalId) => {
    if (window.confirm('¿Estás seguro de eliminar esta renta?')) {
      try {
        await api.delete(`/rentals/${rentalId}`, {
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
        `/rentals/${rentalId}`,
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mis Rentas</h1>
        <button
          onClick={() => navigate('/create-rental')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <span>+ Nueva Renta</span>
        </button>
      </div>

      {rentals.length === 0 ? (
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <p className="text-blue-800">Aún no has creado ninguna renta</p>
          <button
            onClick={() => navigate('/create-rental')}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Crear mi primera renta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.map(rental => (
            <div key={rental._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              {rental.imageUrl && (
                <img 
                  src={rental.imageUrl} 
                  alt={rental.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{rental.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    ${rental.pricePerDay?.toLocaleString('es-CO')}/día
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{rental.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {rental.category}
                  </span>
                  {rental.availability && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {rental.availability}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => togglePublishStatus(rental._id, rental.isPublished)}
                    className={`flex items-center text-sm ${
                      rental.isPublished ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {rental.isPublished ? (
                      <FiToggleRight className="mr-1 text-green-500" size={18} />
                    ) : (
                      <FiToggleLeft className="mr-1 text-gray-500" size={18} />
                    )}
                    {rental.isPublished ? 'Publicado' : 'Oculto'}
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/rentals/${rental._id}`)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Ver detalles"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      onClick={() => navigate(`/edit-rental/${rental._id}`)}
                      className="text-yellow-500 hover:text-yellow-700"
                      title="Editar"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(rental._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRentalsPage;