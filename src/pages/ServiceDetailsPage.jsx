// frontend/src/pages/ServiceDetailsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function ServiceDetailsPage() {
    const { id } = useParams();
    const { isAuthenticated, user, token, addToCart } = useContext(AuthContext);
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contactMessage, setContactMessage] = useState('');
    const [addedToCartMessage, setAddedToCartMessage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [providerServices, setProviderServices] = useState([]);
    const [categoryServices, setCategoryServices] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addedToCartMessages, setAddedToCartMessages] = useState({});

    useEffect(() => {
        const fetchService = async () => {
            setLoading(true);
            setError(null);
            try {
                const headers = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await api.get(`/services/${id}`, { headers });
                setService(response.data);

                // Obtener otros servicios del mismo proveedor
                if (response.data.user && response.data.user._id) {
                    const providerResponse = await api.get(`/services?user=${response.data.user._id}&limit=4`, { headers });
                    setProviderServices(providerResponse.data.filter(s => s._id !== response.data._id));
                }

                // Obtener servicios de la misma categoría
                if (response.data.category) {
                    const categoryResponse = await api.get(`/services?category=${response.data.category}&limit=4`, { headers });
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

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            setAddedToCartMessage('❌ Debes iniciar sesión para añadir al carrito');
            setTimeout(() => setAddedToCartMessage(''), 3000);
            navigate('/login');
            return;
        }

        const serviceToAdd = { 
            ...service, 
            quantity,
            isService: true
        };
        addToCart(serviceToAdd);

        setAddedToCartMessage('✔️ ¡Añadido al carrito!');
        setTimeout(() => setAddedToCartMessage(''), 3000);
    };

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
            setContactMessage(`Puedes contactar a ${service.user.name || 'el proveedor'} al email: ${service.user.email}.`);
            setTimeout(() => setContactMessage(''), 5000);
        } else {
            setContactMessage('Funcionalidad de contacto no disponible públicamente para este proveedor.');
            setTimeout(() => setContactMessage(''), 5000);
        }
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
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
                    
                    <div className="mt-auto flex flex-col space-y-3 w-full">
                        <Link
                            to={`/services/${serviceItem._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Ver Detalles
                        </Link>
                        
                        {isAuthenticated && user && serviceItem.user && serviceItem.user._id !== user._id && (
                            <>
                                <button
                                    onClick={() => {
                                        const serviceToAdd = { ...serviceItem, quantity: 1, isService: true };
                                        addToCart(serviceToAdd);
                                        setAddedToCartMessages(prev => ({ ...prev, [serviceItem._id]: '✔️ ¡Añadido al carrito!' }));
                                        setTimeout(() => setAddedToCartMessages(prev => ({ ...prev, [serviceItem._id]: '' })), 2000);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                                >
                                    🛒 Añadir al Carrito
                                </button>
                                
                                {addedToCartMessages[serviceItem._id] && (
                                    <p className="text-center text-sm font-semibold text-green-600 animate-pulse">
                                        {addedToCartMessages[serviceItem._id]}
                                    </p>
                                )}
                            </>
                        )}
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
                                                className="h-10 w-10 rounded-full"
                                                src={service.user.avatar || 'https://via.placeholder.com/40?text=P'}
                                                alt={service.user.name}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-semibold text-gray-900">
                                                {service.user.name}
                                                {service.user.isPremium && (
                                                    <span className="ml-2 text-yellow-500">⭐</span>
                                                )}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {service.user.email}
                                            </p>
                                        </div>
                                        {!isMyService && (
                                            <div className="ml-auto">
                                                <Link
                                                    to={`/provider-services/${service.user._id}`}
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
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center border border-gray-300 rounded-lg">
                                                <button
                                                    onClick={decrementQuantity}
                                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                                                    disabled={quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-2 text-gray-900 font-medium">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={incrementQuantity}
                                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={handleAddToCart}
                                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex-1 ml-4"
                                            >
                                                🛒 Añadir al Carrito
                                            </button>
                                        </div>

                                        {service.user && service.user.phoneNumber && service.user.showPhoneNumber ? (
                                            <button
                                                onClick={handleContactMe}
                                                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M12.035 1.5C6.065 1.5 1.25 6.31 1.25 12.28c0 2.21.655 4.31 1.83 6.13l-1.31 4.77 4.9-1.29c1.78.97 3.8.7 5.51.7 5.97 0 10.79-4.81 10.79-10.78C22.75 6.31 17.94 1.5 12.035 1.5zm-.01 19.5c-1.63 0-3.2-.42-4.57-1.2L5 20l.96-3.56c-.95-1.3-1.48-2.83-1.48-4.46C4.48 7.6 8.01 4.07 12.02 4.07c3.96 0 7.23 3.25 7.23 7.23 0 4-3.27 7.23-7.23 7.23zm3.17-5.11c-.18-.09-.96-.48-1.11-.53-.15-.05-.26-.07-.37.07-.12.15-.46.53-.56.64-.09.12-.18.12-.34.05-.15-.07-.63-.23-1.2-.74-.45-.4-.75-.67-.89-.92-.15-.26-.01-.22.1-.33.09-.09.2-.23.3-.34.09-.09.12-.15.18-.26.07-.1.04-.18-.02-.26-.05-.07-.37-.9-.51-1.22-.12-.26-.26-.23-.37-.23-.12 0-.26-.03-.4-.03-.15 0-.34.05-.51.23-.15.15-.57.56-.57 1.36 0 .8.59 1.57.67 1.68.09.12 1.16 1.77 2.82 2.45.38.15.68.23.91.28.37.07.96.34 1.16.2.19-.15.26-.18.3-.28.05-.09.18-.53.26-.99.09-.45.09-.84.07-.92z" />
                                                </svg>
                                                <span>Contactar por WhatsApp</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleContactMe}
                                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                                            >
                                                Comunícate Conmigo
                                            </button>
                                        )}

                                        {addedToCartMessage && (
                                            <p className={`text-center font-semibold ${addedToCartMessage.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>
                                                {addedToCartMessage}
                                            </p>
                                        )}
                                        {contactMessage && (
                                            <p className={`text-center font-medium ${contactMessage.includes('Debes iniciar sesión') || contactMessage.includes('no disponible') ? 'text-red-600' : 'text-green-600'}`}>
                                                {contactMessage}
                                            </p>
                                        )}
                                    </div>
                                )
                            ) : (
                                <div className="mt-auto">
                                    <p className="text-center text-gray-500 mb-4">
                                        Inicia sesión para interactuar con este servicio
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
                                    onClick={() => {
                                        // Implementar lógica de eliminación
                                        setShowDeleteModal(false);
                                    }}
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