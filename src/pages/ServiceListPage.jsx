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
        if (service.user && service.user.phoneNumber) {
            // Abre WhatsApp si hay un número de teléfono
            const whatsappMessage = `Hola, estoy interesado en tu servicio: ${service.name} (ID: ${service._id}). ¿Podrías darme más información?`;
            window.open(
                `https://wa.me/${service.user.phoneNumber}?text=${encodeURIComponent(
                    whatsappMessage
                )}`,
                "_blank"
            );
        } else if (service.user && service.user.email) {
            // Fallback a email si no hay número de teléfono
            alert(`Simulando contacto con ${service.user.name || 'el proveedor'} al email: ${service.user.email}`);
            // O podrías abrir un cliente de correo: window.location.href = `mailto:${service.user.email}?subject=Interés en ${service.name}`;
        } else {
            alert('Funcionalidad de contacto en desarrollo o sin datos de contacto.');
        }
    };

    const handleAddToCart = (service) => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para añadir al carrito.");
            navigate("/login");
            return;
        }
        // Aquí iría la lógica real para añadir al carrito.
        // Podrías usar un contexto de carrito, Redux, o una llamada a la API.
        console.log(`Añadiendo ${service.name} (ID: ${service._id}) al carrito.`);
        alert(`"${service.name}" ha sido añadido al carrito (funcionalidad en desarrollo).`);
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
                                src={service.imageUrl || '/no-image.png'} // Usar la ruta relativa para la imagen por defecto
                                alt={service.name}
                                className="w-full h-full object-cover rounded-t-xl"
                                onError={(e) => { e.target.onerror = null; e.target.src = '/no-image.png'; }} // Fallback final si la imagen es inaccesible
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
                                    <>
                                        {service.user && service.user.phoneNumber ? (
                                            <button
                                                onClick={() => handleContactMe(service)}
                                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M12.035 1.5C6.065 1.5 1.25 6.31 1.25 12.28c0 2.21.655 4.31 1.83 6.13l-1.31 4.77 4.9-1.29c1.78.97 3.8.7 5.51.7 5.97 0 10.79-4.81 10.79-10.78C22.75 6.31 17.94 1.5 12.035 1.5zm-.01 19.5c-1.63 0-3.2-.42-4.57-1.2L5 20l.96-3.56c-.95-1.3-1.48-2.83-1.48-4.46C4.48 7.6 8.01 4.07 12.02 4.07c3.96 0 7.23 3.25 7.23 7.23 0 4-3.27 7.23-7.23 7.23zm3.17-5.11c-.18-.09-.96-.48-1.11-.53-.15-.05-.26-.07-.37.07-.12.15-.46.53-.56.64-.09.12-.18.12-.34.05-.15-.07-.63-.23-1.2-.74-.45-.4-.75-.67-.89-.92-.15-.26-.01-.22.1-.33.09-.09.2-.23.3-.34.09-.09.12-.15.18-.26.07-.1.04-.18-.02-.26-.05-.07-.37-.9-.51-1.22-.12-.26-.26-.23-.37-.23-.12 0-.26-.03-.4-.03-.15 0-.34.05-.51.23-.15.15-.57.56-.57 1.36 0 .8.59 1.57.67 1.68.09.12 1.16 1.77 2.82 2.45.38.15.68.23.91.28.37.07.96.34 1.16.2.19-.15.26-.18.3-.28.05-.09.18-.53.26-.99.09-.45.09-.84.07-.92z" />
                                                </svg>
                                                <span>WhatsApp</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleContactMe(service)}
                                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                                            >
                                                Comunícate Conmigo
                                            </button>
                                        )}
                                        {!isMyServicesPage && ( // Mostrar "Añadir al Carrito" solo en la página principal, no en "Mis Servicios"
                                            <button
                                                onClick={() => handleAddToCart(service)}
                                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                                            >
                                                Añadir al Carrito
                                            </button>
                                        )}
                                    </>
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