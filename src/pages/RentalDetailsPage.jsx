import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FaWhatsapp } from 'react-icons/fa';

function RentalDetailsPage() {
    const { id } = useParams();
    const { isAuthenticated, user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [rental, setRental] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contactMessage, setContactMessage] = useState('');
    const [ownerRentals, setOwnerRentals] = useState([]);
    const [categoryRentals, setCategoryRentals] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
            window.location.href = `mailto:${rental.owner.email}?subject=Interés en ${rental.name}`;
        } else {
            setContactMessage('El proveedor no ha habilitado opciones de contacto público.');
            setTimeout(() => setContactMessage(''), 5000);
        }
    };

    const handleDeleteRental = async () => {
        try {
            await api.delete(`/rentals/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/my-rentals');
        } catch (err) {
            console.error("Error eliminando renta:", err);
            setError('Error al eliminar la renta.');
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
                    
                    <div className="mt-auto">
                        <Link
                            to={`/rentals/${rentalItem._id}`}
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
                                                className="h-12 w-12 rounded-full object-cover"
                                                src={rental.owner.avatar || '/images/default-profile.png'}
                                                alt={rental.owner.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/default-profile.png';
                                                }}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {rental.owner.name}
                                                {rental.owner.isPremium && (
                                                    <span className="ml-2 text-yellow-500">⭐</span>
                                                )}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {rental.owner.email}
                                            </p>
                                            {rental.owner.phoneNumber && rental.owner.showPhoneNumber && (
                                                <p className="text-sm text-gray-500">
                                                    Teléfono: {rental.owner.phoneNumber}
                                                </p>
                                            )}
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
                                        {rental.owner && rental.owner.phoneNumber && rental.owner.showPhoneNumber ? (
                                            <button
                                                onClick={handleContactMe}
                                                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                                            >
                                                <FaWhatsapp className="text-xl" />
                                                <span>Contactar por WhatsApp</span>
                                            </button>
                                        ) : rental.owner && rental.owner.email ? (
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

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Confirmar eliminación
                            </h3>
                            <p className="text-gray-700 mb-6">
                                ¿Estás seguro de que quieres eliminar esta renta? Esta acción
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
                                    onClick={handleDeleteRental}
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

export default RentalDetailsPage;