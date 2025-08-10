import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FiSearch, FiFilter, FiStar, FiShoppingCart, FiRefreshCw, FiPhone, FiMail, FiTrash2, FiEdit } from 'react-icons/fi';
import { FaWhatsapp, FaCrown, FaSeedling, FaChalkboardTeacher } from 'react-icons/fa';

function ServiceListPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isMyServicesPage = location.pathname === '/my-services';
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Separate premium and regular services
    const premiumServices = services.filter(service => service.user?.isPremium);
    const regularServices = services.filter(service => !service.user?.isPremium);

    const serviceCategories = [
        'Análisis de Suelos', 'Asesoría Agrícola', 'Transporte de Productos',
        'Mantenimiento de Maquinaria', 'Control de Plagas', 'Diseño de Paisajes',
        'Cursos y Capacitación', 'Servicios de Cosecha', 'Riego y Drenaje', 'Otros'
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

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            setError(null);

            let url = 'https://grupo-agro-backend.onrender.com/api/services';
            const params = new URLSearchParams();

            if (isMyServicesPage) {
                url = 'https://grupo-agro-backend.onrender.com/api/services/my-services';
                if (!isAuthenticated || !token) {
                    setError('Debes iniciar sesión para ver tus servicios.');
                    setLoading(false);
                    return;
                }
            } else {
                if (debouncedSearchTerm) {
                    params.append('search', debouncedSearchTerm);
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

                // Sort services by creation date (newest first)
                const sortedServices = response.data.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setServices(sortedServices);

            } catch (err) {
                console.error("Error fetching services:", err);
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                } else {
                    setError('Error desconocido al cargar los servicios.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [isMyServicesPage, isAuthenticated, token, debouncedSearchTerm, selectedCategory]);

    const handleContactMe = (service) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para contactar al proveedor.');
            navigate('/login');
            return;
        }

        if (service.user && service.user.phoneNumber && service.user.showPhoneNumber) {
            const whatsappMessage = `Hola, estoy interesado en tu servicio: ${service.name} (ID: ${service._id}). ¿Podrías darme más información?`;
            window.open(
                `https://wa.me/${service.user.phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`,
                "_blank"
            );
        } else if (service.user && service.user.email) {
            window.location.href = `mailto:${service.user.email}?subject=Interés en ${service.name}`;
        } else {
            alert('Funcionalidad de contacto no disponible públicamente para este proveedor.');
        }
    };

    const handleAddToCart = async (service) => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para añadir al carrito.");
            navigate("/login");
            return;
        }

        try {
            const response = await api.post('/cart/add', {
                itemId: service._id,
                itemType: 'service',
                quantity: 1,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert(response.data.message || `"${service.name}" ha sido añadido al carrito.`);
        } catch (err) {
            console.error("Error al añadir servicio al carrito:", err);
            if (err.response?.data?.message) {
                alert(`Error al añadir al carrito: ${err.response.data.message}`);
            } else {
                alert('Error desconocido al añadir el servicio al carrito.');
            }
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

    // Render service card with premium styling
    const renderServiceCard = (service, isPremium = false) => (
        <div
            key={service._id}
            className={`relative rounded-xl overflow-hidden flex flex-col transition-all duration-300 transform hover:scale-[1.02] group
                ${isPremium ? 
                    'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-300 shadow-xl' : 
                    'bg-white border border-gray-200 shadow-md hover:shadow-lg'
                }`}
        >
            {/* Premium badge */}
            {isPremium && (
                <div className="absolute top-3 left-3 z-10">
                    <div className="flex items-center bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        <FaCrown className="mr-1" /> PREMIUM
                    </div>
                </div>
            )}

            {/* Service image */}
            <div className="relative w-full h-48 overflow-hidden">
                <img
                    src={service.imageUrl || 'https://via.placeholder.com/400x300?text=Servicio+Agro'}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+No+Disponible'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Service details */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{service.name}</h2>
                    <span className="text-xl font-extrabold text-blue-700">
                        ${service.price ? service.price.toLocaleString('es-CO') : 'N/A'}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{service.description}</p>
                
                <div className="flex justify-between items-center mb-3 text-xs">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{service.category}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {service.duration || 'FLEXIBLE'}
                    </span>
                </div>

                {service.user && (
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                        <span className="font-medium text-gray-700">Proveedor: {service.user.name || 'Anónimo'}</span>
                        {service.user.isPremium && <FiStar className="ml-1 text-yellow-500" />}
                    </div>
                )}

                <div className="mt-auto flex flex-col space-y-2 w-full">
                    <Link
                        to={`/services/${service._id}`}
                        className={`text-center py-2 px-4 rounded-lg transition duration-300 text-sm font-semibold
                            ${isPremium ? 
                                'bg-amber-600 hover:bg-amber-700 text-white' : 
                                'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        Ver Detalles
                    </Link>

                    {isAuthenticated && user && (
                        <>
                            {isMyServicesPage ? (
                                <>
                                    <Link
                                        to={`/edit-service/${service._id}`}
                                        className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
                                    >
                                        <FiEdit className="mr-2" /> Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteService(service._id)}
                                        className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
                                    >
                                        <FiTrash2 className="mr-2" /> Eliminar
                                    </button>
                                </>
                            ) : (
                                service.user && user && service.user._id !== user._id && (
                                    <>
                                        {service.user && service.user.phoneNumber && service.user.showPhoneNumber ? (
                                            <button
                                                onClick={() => handleContactMe(service)}
                                                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
                                            >
                                                <FaWhatsapp className="mr-2" /> WhatsApp
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleContactMe(service)}
                                                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
                                            >
                                                <FiMail className="mr-2" /> Contactar
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleAddToCart(service)}
                                            className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
                                        >
                                            <FiShoppingCart className="mr-2" /> Añadir al Carrito
                                        </button>
                                    </>
                                )
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Hero Section */}
            <div className={`relative bg-gradient-to-r from-teal-600 to-teal-800 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'pt-16' : ''}`}>
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-md">
                        {isMyServicesPage ? "Mis Servicios" : "Servicios Agrícolas Profesionales"}
                    </h1>
                    <p className="text-xl text-teal-100 text-center max-w-3xl mx-auto mb-8">
                        {isMyServicesPage ? 
                            "Administra tus servicios ofrecidos" : 
                            "Encuentra los mejores servicios para tu producción agrícola"}
                    </p>

                    {/* Search Bar */}
                    {!isMyServicesPage && (
                        <div className="max-w-3xl mx-auto relative">
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                <input
                                    type="text"
                                    placeholder="Buscar servicios (ej. análisis de suelos, control de plagas...)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 rounded-full border-none focus:ring-4 focus:ring-teal-300 focus:outline-none text-gray-800 shadow-lg"
                                />
                                <button 
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full flex items-center justify-center"
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
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                            >
                                                <option value="">Todas las categorías</option>
                                                {serviceCategories.map(cat => (
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
                                                className="text-sm text-teal-600 hover:text-teal-800 flex items-center"
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
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 mb-4"></div>
                        <p className="text-gray-700 text-lg">Cargando servicios...</p>
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
                ) : services.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                            <FaSeedling className="w-full h-full" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron servicios</h3>
                        <p className="text-gray-500 mb-6">No hay servicios que coincidan con tu búsqueda.</p>
                        {!isMyServicesPage && (
                            <Link
                                to="/create-service"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                                Ofrecer un nuevo servicio
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        {/* VIP Premium Section */}
                        {!isMyServicesPage && premiumServices.length > 0 && (
                            <div className="mb-12">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <FaCrown className="text-yellow-500 mr-2" /> Servicios Premium
                                    </h2>
                                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                        <FiStar className="mr-1" /> Profesionales Certificados
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {premiumServices.map(service => renderServiceCard(service, true))}
                                </div>
                            </div>
                        )}

                        {/* Regular Services Section */}
                        {regularServices.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <FaChalkboardTeacher className="text-teal-500 mr-2" /> 
                                    {isMyServicesPage ? 'Todos mis servicios' : 'Todos los servicios disponibles'}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {regularServices.map(service => renderServiceCard(service))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Call to Action */}
            {!isMyServicesPage && (
                <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">¿Ofreces servicios agrícolas?</h2>
                        <p className="text-xl text-teal-100 mb-8">
                            Únete a nuestro programa premium y destaca tus servicios con beneficios exclusivos.
                        </p>
                        <Link
                            to="/premium"
                            className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-bold rounded-full shadow-sm text-teal-900 bg-yellow-400 hover:bg-yellow-300 transition duration-300 transform hover:scale-105"
                        >
                            <FaCrown className="mr-2" /> Conviértete en Proveedor Premium
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServiceListPage;