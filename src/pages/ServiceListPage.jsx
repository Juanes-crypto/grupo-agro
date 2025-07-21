// src/pages/ServiceListPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function ServiceListPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const isMyServicesPage = location.pathname === '/my-services';

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const serviceCategories = [
        'Análisis de Suelos', 'Asesoría Agrícola', 'Transporte de Productos',
        'Mantenimiento de Maquinaria', 'Control de Plagas', 'Diseño de Paisajes',
        'Cursos y Capacitación', 'Servicios de Cosecha', 'Riego y Drenaje', 'Otros'
    ];

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            setError(null);

            let url = 'http://localhost:5000/api/services';
            const params = new URLSearchParams();

            if (isMyServicesPage) {
                url = 'http://localhost:5000/api/services/my-services';
                if (!isAuthenticated || !token) {
                    setError('Debes iniciar sesión para ver tus servicios.');
                    setLoading(false);
                    return;
                }
            } else {
                if (searchTerm) {
                    params.append('search', searchTerm);
                }
                if (selectedCategory) {
                    params.append('category', selectedCategory);
                }
            }

            const queryString = params.toString();
            if (queryString) {
                url = `${url}?${queryString}`;
            }

            try {
                const headers = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await api.get(url, { headers });

                // Ordenar los servicios por fecha de creación (createdAt) descendente
                const sortedServices = response.data.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setServices(sortedServices);

            } catch (err) {
                console.error("Error fetching services:", err);
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError('Error desconocido al cargar los servicios.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [isMyServicesPage, isAuthenticated, token, searchTerm, selectedCategory]);

    const handleContactMe = (service) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para contactar al proveedor.');
            navigate('/login');
            return;
        }
        if (service.user && service.user.email) {
            alert(`Simulando contacto con ${service.user.name || 'el proveedor'} al email: ${service.user.email}`);
        } else {
            alert('Funcionalidad de contacto en desarrollo.');
        }
    };

    const handleDeleteService = async (serviceId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
            try {
                await api.delete(`/services/${serviceId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setServices(services.filter(s => s._id !== serviceId));
                alert('Servicio eliminado con éxito.');
            } catch (err) {
                console.error("Error eliminando servicio:", err);
                alert('Error al eliminar el servicio.');
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-700 text-2xl animate-pulse">Cargando servicios...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen bg-red-50 text-red-700 text-xl font-semibold">Error: {error}</div>;
    }

    if (services.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-700 text-xl p-4">
                <p className="mb-4 text-2xl font-semibold">
                    🌱 ¡No se encontraron servicios que coincidan con tu búsqueda!
                    {isMyServicesPage && " Publica uno para que aparezca aquí."}
                </p>
                <Link to="/create-service" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-lg hover:shadow-xl">
                    Ofrece tu Servicio Ahora
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-10 drop-shadow-md">
                {isMyServicesPage ? "Mis Servicios Ofrecidos" : "Servicios Agrícolas Disponibles"}
            </h1>

            {!isMyServicesPage && (
                <div className="max-w-4xl mx-auto mb-10 p-6 bg-white rounded-2xl shadow-xl border border-green-100">
                    <h2 className="text-2xl font-bold text-green-700 mb-5 text-center">Filtra tus Servicios</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre o descripción</label>
                            <input
                                id="search"
                                type="text"
                                placeholder="Ej: Análisis de suelos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-400 transition duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Categoría</label>
                            <div className="relative">
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="block w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-400 transition duration-200 bg-white text-gray-700 appearance-none pr-8 shadow-sm"
                                >
                                    <option value="">Todas las categorías</option>
                                    {serviceCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {services.map(service => (
                    <div
                        key={service._id}
                        className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 relative
                            ${service.user && service.user.isPremium ? 'border-4 border-yellow-400 ring-4 ring-yellow-200' : 'border border-gray-200'}`}
                    >
                        {service.user && service.user.isPremium && (
                            <span className="absolute top-3 right-3 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
                                ⭐ Proveedor Premium
                            </span>
                        )}
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <img
                                src={service.imageUrl || 'https://via.placeholder.com/400x300?text=Servicio'}
                                alt={service.name}
                                className="w-full h-full object-cover rounded-t-xl"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                            />
                        </div>
                        <div className="p-5 flex flex-col flex-grow min-h-[180px]">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{service.name}</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{service.description.substring(0, 100)}{service.description.length > 100 ? '...' : ''}</p>
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                <span className="text-green-700">Categoría:</span> {service.category}
                            </p>
                            <p className="text-xl font-extrabold text-blue-700 mb-4">
                                COP {service.price ? service.price.toLocaleString('es-CO') : 'N/A'}
                            </p>
                            
                            <div className="mt-auto flex flex-col space-y-3 w-full">
                                <Link
                                    to={`/services/${service._id}`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
                                >
                                    Ver Detalles
                                </Link>

                                {isAuthenticated && user && service.user && service.user._id === user._id ? (
                                    <>
                                        <Link
                                            to={`/edit-service/${service._id}`}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
                                        >
                                            Editar Servicio
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteService(service._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                                        >
                                            Eliminar Servicio
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleContactMe(service)}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                                    >
                                        Comunícate Conmigo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServiceListPage;
