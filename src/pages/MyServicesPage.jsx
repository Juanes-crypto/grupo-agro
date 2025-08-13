import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiEdit, FiTrash2, FiEye, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

const MyServicesPage = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services/my-services', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServices(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar tus servicios');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchServices();
    }
  }, [user, token]);

  const handleDelete = async (serviceId) => {
    if (window.confirm('¿Estás seguro de eliminar este servicio?')) {
      try {
        await api.delete(`/services/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServices(services.filter(s => s._id !== serviceId));
        toast.success('Servicio eliminado correctamente');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error al eliminar el servicio');
      }
    }
  };

  const togglePublishStatus = async (serviceId, currentStatus) => {
    try {
      const response = await api.put(
        `/services/${serviceId}`,
        { isPublished: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setServices(services.map(s => 
        s._id === serviceId ? { ...s, isPublished: response.data.isPublished } : s
      ));
      
      toast.success(
        `Servicio ${!currentStatus ? 'publicado' : 'ocultado'} correctamente`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar el servicio');
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
        <h1 className="text-2xl font-bold text-gray-800">Mis Servicios</h1>
        <button
          onClick={() => navigate('/create-service')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <span>+ Nuevo Servicio</span>
        </button>
      </div>

      {services.length === 0 ? (
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <p className="text-blue-800">Aún no has creado ningún servicio</p>
          <button
            onClick={() => navigate('/create-service')}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Crear mi primer servicio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              {service.imageUrl && (
                <img 
                  src={service.imageUrl} 
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{service.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    ${service.price?.toLocaleString('es-CO')}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{service.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {service.category}
                  </span>
                  {service.duration && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {service.duration}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => togglePublishStatus(service._id, service.isPublished)}
                    className={`flex items-center text-sm ${
                      service.isPublished ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {service.isPublished ? (
                      <FiToggleRight className="mr-1 text-green-500" size={18} />
                    ) : (
                      <FiToggleLeft className="mr-1 text-gray-500" size={18} />
                    )}
                    {service.isPublished ? 'Publicado' : 'Oculto'}
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/services/${service._id}`)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Ver detalles"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      onClick={() => navigate(`/edit-service/${service._id}`)}
                      className="text-yellow-500 hover:text-yellow-700"
                      title="Editar"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
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

export default MyServicesPage;