// src/pages/RentalListPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function RentalListPage() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Estados para los filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const rentalCategories = [
        'Tractores', 'Arados', 'Sembradoras', 'Cosechadoras',
        'Sistemas de Riego', 'Herramientas Manuales', 'Vehículos Utilitarios',
        'Drones Agrícolas', 'Equipos de Fumigación', 'Otros'
    ];

    useEffect(() => {
        const fetchRentals = async () => {
            setLoading(true);
            setError(null);
            let url = 'http://localhost:5000/api/rentals';
            const params = new URLSearchParams();

            if (searchTerm) {
                params.append('search', searchTerm);
            }
            if (selectedCategory) {
                params.append('category', selectedCategory);
            }

            const queryString = params.toString();
            if (queryString) {
                url = `${url}?${queryString}`;
            }

            try {
                const response = await api.get(url);
                setRentals(response.data);
            } catch (err) {
                setError('Error al cargar las rentas desde el servidor.');
                console.error("Error fetching rentals from backend:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, [searchTerm, selectedCategory]); // Dependencias para re-fetch al cambiar filtros

    const handleContactMe = (rental) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para contactar al proveedor.');
            navigate('/login');
            return;
        }
        if (rental.user && rental.user.email) {
            alert(`Simulando contacto con ${rental.user.name || 'el proveedor'} al email: ${rental.user.email}`);
        } else {
            alert('Funcionalidad de contacto en desarrollo.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-700 text-2xl animate-pulse">Cargando rentas...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen bg-red-50 text-red-700 text-xl font-semibold">Error: {error}</div>;
    }

    return (
        // Contenedor principal de la página con fondo degradado y espaciado mejorado
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-10 drop-shadow-md">
                Maquinaria y Herramientas en Renta
            </h1>

            {/* Contenedor de filtros con diseño mejorado */}
            <div className="max-w-4xl mx-auto mb-10 p-6 bg-white rounded-2xl shadow-xl border border-green-100">
                <h2 className="text-2xl font-bold text-green-700 mb-5 text-center">Filtra tus Rentas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end"> {/* Reducido a 2 columnas para rentas */}
                    {/* Barra de búsqueda */}
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre o descripción</label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Ej: Tractor John Deere..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-400 transition duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
                        />
                    </div>
                    {/* Selector de categoría */}
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
                                {rentalCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {/* Icono de flecha personalizado */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de rentas con diseño de tarjeta mejorado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {rentals.length === 0 ? (
                    <div className="col-span-full text-center text-gray-600 text-xl p-4">
                        <p className="mb-4 text-2xl font-semibold">🌱 ¡No se encontraron equipos en renta que coincidan con tu búsqueda!</p>
                        <Link to="/create-rental" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-lg hover:shadow-xl">
                            Publica tu Maquinaria Ahora
                        </Link>
                    </div>
                ) : (
                    rentals.map(rental => (
                        <div
                            key={rental._id}
                            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 relative
                                ${rental.user && rental.user.isPremium ? 'border-4 border-yellow-400 ring-4 ring-yellow-200' : 'border border-gray-200'}`}
                        >
                            {/* Insignia de Proveedor Premium */}
                            {rental.user && rental.user.isPremium && (
                                <span className="absolute top-3 right-3 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
                                    ⭐ Proveedor Premium
                                </span>
                            )}
                            {/* Imagen de la renta */}
                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <img
                                    src={rental.imageUrl || 'https://via.placeholder.com/400x300?text=Renta'}
                                    alt={rental.name}
                                    className="w-full h-full object-cover rounded-t-xl"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }} // Fallback
                                />
                            </div>
                            {/* Contenido de la tarjeta */}
                            <div className="p-5 flex flex-col flex-grow min-h-[180px]"> {/* Ajustado min-h para rentas */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{rental.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{rental.description.substring(0, 100)}{rental.description.length > 100 ? '...' : ''}</p>
                                <p className="text-lg font-semibold text-gray-700 mb-2">
                                    <span className="text-green-700">Categoría:</span> {rental.category}
                                </p>
                                <p className="text-xl font-extrabold text-blue-700 mb-4">
                                    COP {rental.pricePerDay ? rental.pricePerDay.toLocaleString('es-CO') : 'N/A'} / día
                                </p>
                                
                                <div className="mt-auto flex flex-col space-y-3 w-full">
                                    {/* Botón Ver Detalles */}
                                    <Link
                                        to={`/rentals/${rental._id}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
                                    >
                                        Ver Detalles
                                    </Link>

                                    {/* Botón Comunícate Conmigo (condicional) */}
                                    {isAuthenticated && user && rental.user && rental.user._id === user._id ? (
                                        <p className="text-gray-500 text-center text-sm font-medium pt-2">Esta es tu maquinaria en renta.</p>
                                    ) : (
                                        <button
                                            onClick={() => handleContactMe(rental)}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                                        >
                                            Comunícate Conmigo
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default RentalListPage;
