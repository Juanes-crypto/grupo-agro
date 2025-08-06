// frontend/src/pages/RentalDetailsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function RentalDetailsPage() {
    const { id } = useParams();
    const { isAuthenticated, user, token, addToCart } = useContext(AuthContext);
    const navigate = useNavigate();

    const [rental, setRental] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contactMessage, setContactMessage] = useState('');
    const [addedToCartMessage, setAddedToCartMessage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [ownerRentals, setOwnerRentals] = useState([]);
    const [categoryRentals, setCategoryRentals] = useState([]);

    useEffect(() => {
        const fetchRental = async () => {
            setLoading(true);
            setError(null);
            try {
                const headers = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await api.get(`/rentals/${id}`, { headers });
                setRental(response.data);

                // Obtener otras rentas del mismo dueño
                if (response.data.owner && response.data.owner._id) {
                    const ownerResponse = await api.get(`/rentals?owner=${response.data.owner._id}&limit=4`, { headers });
                    setOwnerRentals(ownerResponse.data.filter(r => r._id !== response.data._id));
                }

                // Obtener rentas de la misma categoría
                if (response.data.category) {
                    const categoryResponse = await api.get(`/rentals?category=${response.data.category}&limit=4`, { headers });
                    setCategoryRentals(categoryResponse.data.filter(r => r._id !== response.data._id));
                }
            } catch (err) {
                setError('Error al cargar los detalles de la renta.');
                console.error("Error fetching rental details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRental();
    }, [id, token]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            setAddedToCartMessage('❌ Debes iniciar sesión para añadir al carrito');
            setTimeout(() => setAddedToCartMessage(''), 3000);
            navigate('/login');
            return;
        }

        const rentalToAdd = { 
            ...rental, 
            quantity,
            price: rental.pricePerDay,
            isRental: true
        };
        addToCart(rentalToAdd);

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

        if (rental && rental.owner && rental.owner.phoneNumber && rental.owner.showPhoneNumber) {
            const whatsappMessage = `Hola, estoy interesado en tu equipo en renta: ${rental.name} (ID: ${rental._id}). ¿Podrías darme más información?`;
            window.open(
                `https://wa.me/${rental.owner.phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`,
                "_blank"
            );
            setContactMessage('');
        } else if (rental && rental.owner && rental.owner.email) {
            setContactMessage(`Puedes contactar a ${rental.owner.name || 'el proveedor'} al email: ${rental.owner.email}.`);
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

    const renderRentalCard = (rentalItem) => {
        return (
            <div key={rentalItem._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 relative">
                {rentalItem.owner?.isPremium && (
                    <span className="absolute top-3 right-3 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
                        ⭐ Premium
                    </span>
                )}
                
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <img
                        src={rentalItem.imageUrl || 'https://placehold.co/400x300?text=Renta'}
                        alt={rentalItem.name}
                        className="w-full h-full object-cover rounded-t-xl"
                    />
                </div>
                
                <div className="p-5 flex flex-col flex-grow min-h-[200px]">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{rentalItem.name}</h2>
                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{rentalItem.description}</p>
                    
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-md font-semibold text-gray-700">
                            <span className="text-green-700">Categoría:</span> {rentalItem.category}
                        </p>
                    </div>
                    
                    <p className="text-xl font-extrabold text-green-700 mb-4">
                        COP {rentalItem.pricePerDay?.toLocaleString('es-CO')} / día
                    </p>
                    
                    {rentalItem.owner && (
                        <p className="text-sm text-gray-500 mb-4">
                            Publicado por: <span className="font-medium text-gray-700">{rentalItem.owner.name || 'Desconocido'}</span>
                        </p>
                    )}
                    
                    <div className="mt-auto flex flex-col space-y-3 w-full">
                        <Link
                            to={`/rentals/${rentalItem._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Ver Detalles
                        </Link>
                        
                        {isAuthenticated && user && rentalItem.owner && rentalItem.owner._id !== user._id && (
                            <>
                                <button
                                    onClick={() => {
                                        const rentalToAdd = { ...rentalItem, quantity: 1, price: rentalItem.pricePerDay, isRental: true };
                                        addToCart(rentalToAdd);
                                        setAddedToCartMessages(prev => ({ ...prev, [rentalItem._id]: '✔️ ¡Añadido al carrito!' }));
                                        setTimeout(() => setAddedToCartMessages(prev => ({ ...prev, [rentalItem._id]: '' })), 2000);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                                >
                                    🛒 Añadir al Carrito
                                </button>
                                
                                {addedToCartMessages[rentalItem._id] && (
                                    <p className="text-center text-sm font-semibold text-green-600 animate-pulse">
                                        {addedToCartMessages[rentalItem._id]}
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
                    <p className="text-lg text-gray-700">Cargando detalles de la renta...</p>
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
                        to="/rentals"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Volver a Rentas
                    </Link>
                </div>
            </div>
        );
    }

    if (!rental) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <div className="max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Renta no encontrada</h2>
                    <p className="text-gray-700 mb-6">La renta que buscas no existe o ha sido eliminada.</p>
                    <Link
                        to="/rentals"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Explorar Rentas
                    </Link>
                </div>
            </div>
        );
    }

    const isMyRental = isAuthenticated && user && rental.owner && rental.owner._id === user._id;

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
                                <Link to="/rentals" className="ml-1 text-sm font-medium text-gray-700 hover:text-green-600 md:ml-2">
                                    Rentas
                                </Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{rental.name}</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                {/* Main Rental Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                        {/* Rental Images */}
                        <div className="space-y-4">
                            <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={rental.imageUrl || 'https://placehold.co/600x400?text=Renta'}
                                    alt={rental.name}
                                    className="w-full h-full object-cover"
                                />
                                {rental.owner?.isPremium && (
                                    <span className="absolute top-4 right-4 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                                        ⭐ Proveedor Premium
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Rental Info */}
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{rental.name}</h1>
                            
                            <div className="flex items-center mb-4">
                                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                    {rental.category}
                                </span>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-700">{rental.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Precio por día</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        COP {rental.pricePerDay?.toLocaleString('es-CO')}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Ubicación</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {rental.location || 'No especificada'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Publicado</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {new Date(rental.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Disponibilidad</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {rental.availability || 'Consultar'}
                                    </p>
                                </div>
                            </div>

                            {/* Owner Info */}
                            {rental.owner && (
                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Proveedor</h3>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={rental.owner.avatar || 'https://via.placeholder.com/40?text=P'}
                                                alt={rental.owner.name}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-semibold text-gray-900">
                                                {rental.owner.name}
                                                {rental.owner.isPremium && (
                                                    <span className="ml-2 text-yellow-500">⭐</span>
                                                )}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {rental.owner.email}
                                            </p>
                                        </div>
                                        {!isMyRental && (
                                            <div className="ml-auto">
                                                <Link
                                                    to={`/seller-rentals/${rental.owner._id}`}
                                                    className="text-sm font-medium text-green-600 hover:text-green-800"
                                                >
                                                    Ver más rentas
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            {isAuthenticated ? (
                                isMyRental ? (
                                    <div className="mt-auto space-y-4">
                                        <Link
                                            to={`/edit-rental/${rental._id}`}
                                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg text-center block transition duration-300"
                                        >
                                            Editar Renta
                                        </Link>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                                        >
                                            Eliminar Renta
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

                                        {rental.owner && rental.owner.phoneNumber && rental.owner.showPhoneNumber ? (
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
                                        Inicia sesión para interactuar con esta renta
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

                {/* More from this owner */}
                {ownerRentals.length > 0 && !isMyRental && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Más rentas de este proveedor
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {ownerRentals.map(rentalItem => renderRentalCard(rentalItem))}
                        </div>
                    </div>
                )}

                {/* More from this category */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Más rentas en {rental.category}
                    </h2>
                    {categoryRentals.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryRentals.map(rentalItem => renderRentalCard(rentalItem))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-8 rounded-xl shadow-md">
                            <p className="text-gray-600 mb-4">
                                No hay más rentas en esta categoría.
                            </p>
                            <Link
                                to="/rentals"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg inline-block transition duration-300"
                            >
                                Explorar todas las rentas
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RentalDetailsPage;