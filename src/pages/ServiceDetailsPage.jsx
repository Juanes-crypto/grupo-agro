import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FaWhatsapp } from 'react-icons/fa';

function ServiceDetailsPage() {
    const { id } = useParams();
    const { isAuthenticated, user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contactMessage, setContactMessage] = useState('');
    const [providerServices, setProviderServices] = useState([]);
    const [categoryServices, setCategoryServices] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            setLoading(true);
            setError(null);
            try {
                const headers = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await api.get(`/api/services/${id}`, { headers });
                setService(response.data);

                // Obtener otros servicios del mismo proveedor
                if (response.data.user && response.data.user._id) {
                    const providerResponse = await api.get(`/api/services?user=${response.data.user._id}&limit=4`, { headers });
                    setProviderServices(providerResponse.data.filter(s => s._id !== response.data._id));
                }

                // Obtener servicios de la misma categoría
                if (response.data.category) {
                    const categoryResponse = await api.get(`/api/services?category=${response.data.category}&limit=4`, { headers });
                    setCategoryServices(categoryResponse.data.filter(s => s._id !== response.data._id));
                }
            } catch (err) {
                setError('Error al cargar los detalles del servicio.');
                console.error("Error fetching service details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id, token]);

    const handleContactMe = () => {
        if (!isAuthenticated) {
            setContactMessage('Debes iniciar sesión para contactar al proveedor.');
            setTimeout(() => setContactMessage(''), 3000);
            navigate('/login');
            return;
        }

        if (service && service.user && service.user.phoneNumber && service.user.showPhoneNumber) {
            const whatsappMessage = `Hola, estoy interesado en tu servicio: ${service.name} (ID: ${service._id}). ¿Podrías darme más información?`;
            window.open(
                `https://wa.me/${service.user.phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`,
                "_blank"
            );
            setContactMessage('');
        } else if (service && service.user && service.user.email) {
            window.location.href = `mailto:${service.user.email}?subject=Interés en ${service.name}`;
        } else {
            setContactMessage('El proveedor no ha habilitado opciones de contacto público.');
            setTimeout(() => setContactMessage(''), 5000);
        }
    };

    const handleDeleteService = async () => {
        try {
            await api.delete(`/services/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/my-services');
        } catch (err) {
            console.error("Error eliminando servicio:", err);
            setError('Error al eliminar el servicio.');
        }
    };

    const renderServiceCard = (serviceItem) => {
        return (
            <div key={serviceItem._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 relative">
                {serviceItem.user?.isPremium && (
                    <span className="absolute top-3 right-3 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
                        ⭐ Premium
                    </span>
                )}
                
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <img
                        src={serviceItem.imageUrl || 'https://placehold.co/400x300?text=Servicio'}
                        alt={serviceItem.name}
                        className="w-full h-full object-cover rounded-t-xl"
                    />
                </div>
                
                <div className="p-5 flex flex-col flex-grow min-h-[200px]">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{serviceItem.name}</h2>
                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{serviceItem.description}</p>
                    
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-md font-semibold text-gray-700">
                            <span className="text-green-700">Categoría:</span> {serviceItem.category}
                        </p>
                        <p className="text-md font-semibold text-gray-700">
                            <span className="text-green-700">Experiencia:</span> {serviceItem.experience}
                        </p>
                    </div>
                    
                    <p className="text-xl font-extrabold text-green-700 mb-4">
                        COP {serviceItem.price?.toLocaleString('es-CO')}
                    </p>
                    
                    {serviceItem.user && (
                        <p className="text-sm text-gray-500 mb-4">
                            Publicado por: <span className="font-medium text-gray-700">{serviceItem.user.name || 'Desconocido'}</span>
                        </p>
                    )}
                    
                    <div className="mt-auto">
                        <Link
                            to={`/services/${serviceItem._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center block transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Ver Detalles
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Cargando detalles del servicio...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <div className="max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <Link
                        to="/services"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Volver a Servicios
                    </Link>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <div className="max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Servicio no encontrado</h2>
                    <p className="text-gray-700 mb-6">El servicio que buscas no existe o ha sido eliminado.</p>
                    <Link
                        to="/services"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Explorar Servicios
                    </Link>
                </div>
            </div>
        );
    }

    const isMyService = isAuthenticated && user && service.user && service.user._id === user._id;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600">
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <Link to="/services" className="ml-1 text-sm font-medium text-gray-700 hover:text-green-600 md:ml-2">
                                    Servicios
                                </Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{service.name}</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                {/* Main Service Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                        {/* Service Images */}
                        <div className="space-y-4">
                            <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={service.imageUrl || 'https://placehold.co/600x400?text=Servicio'}
                                    alt={service.name}
                                    className="w-full h-full object-cover"
                                />
                                {service.user?.isPremium && (
                                    <span className="absolute top-4 right-4 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                                        ⭐ Proveedor Premium
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Service Info */}
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                            
                            <div className="flex items-center mb-4">
                                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                    {service.category}
                                </span>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-700">{service.description}</p>
                                <p className="text-gray-700 mt-2">Experiencia: {service.experience}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Precio</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        COP {service.price?.toLocaleString('es-CO')}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Ubicación</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {service.location || 'No especificada'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Publicado</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {new Date(service.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Disponibilidad</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {service.availability || 'Consultar'}
                                    </p>
                                </div>
                            </div>

                            {/* Provider Info */}
                            {service.user && (
                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Proveedor</h3>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-12 w-12 rounded-full object-cover"
                                                src={service.user.avatar || '/images/default-profile.png'}
                                                alt={service.user.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/default-profile.png';
                                                }}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {service.user.name}
                                                {service.user.isPremium && (
                                                    <span className="ml-2 text-yellow-500">⭐</span>
                                                )}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {service.user.email}
                                            </p>
                                            {service.user.phoneNumber && service.user.showPhoneNumber && (
                                                <p className="text-sm text-gray-500">
                                                    Teléfono: {service.user.phoneNumber}
                                                </p>
                                            )}
                                        </div>
                                        {!isMyService && (
                                            <div className="ml-auto">
                                                <Link
                                                    to={`/services`}
                                                    className="text-sm font-medium text-green-600 hover:text-green-800"
                                                >
                                                    Ver más servicios
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            {isAuthenticated ? (
                                isMyService ? (
                                    <div className="mt-auto space-y-4">
                                        <Link
                                            to={`/edit-service/${service._id}`}
                                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg text-center block transition duration-300"
                                        >
                                            Editar Servicio
                                        </Link>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                                        >
                                            Eliminar Servicio
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-auto space-y-4">
                                        {service.user && service.user.phoneNumber && service.user.showPhoneNumber ? (
                                            <button
                                                onClick={handleContactMe}
                                                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                                            >
                                                <FaWhatsapp className="text-xl" />
                                                <span>Contactar por WhatsApp</span>
                                            </button>
                                        ) : service.user && service.user.email ? (
                                            <button
                                                onClick={handleContactMe}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-300"
                                            >
                                                Contactar por Email
                                            </button>
                                        ) : (
                                            <p className="text-center text-gray-500">
                                                El proveedor no ha habilitado opciones de contacto
                                            </p>
                                        )}

                                        {contactMessage && (
                                            <p className={`text-center font-medium ${contactMessage.includes('Debes iniciar sesión') ? 'text-red-600' : 'text-green-600'}`}>
                                                {contactMessage}
                                            </p>
                                        )}
                                    </div>
                                )
                            ) : (
                                <div className="mt-auto">
                                    <p className="text-center text-gray-500 mb-4">
                                        Inicia sesión para contactar al proveedor
                                    </p>
                                    <Link
                                        to="/login"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center block transition duration-300"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* More from this provider */}
                {providerServices.length > 0 && !isMyService && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Más servicios de este proveedor
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {providerServices.map(serviceItem => renderServiceCard(serviceItem))}
                        </div>
                    </div>
                )}

                {/* More from this category */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Más servicios en {service.category}
                    </h2>
                    {categoryServices.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryServices.map(serviceItem => renderServiceCard(serviceItem))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-8 rounded-xl shadow-md">
                            <p className="text-gray-600 mb-4">
                                No hay más servicios en esta categoría.
                            </p>
                            <Link
                                to="/services"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg inline-block transition duration-300"
                            >
                                Explorar todos los servicios
                            </Link>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Confirmar eliminación
                            </h3>
                            <p className="text-gray-700 mb-6">
                                ¿Estás seguro de que quieres eliminar este servicio? Esta acción
                                no se puede deshacer.
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDeleteService}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServiceDetailsPage;