// src/pages/RentalPage.jsx
import React, { useState, useEffect, useContext } from 'react'; // Importa useContext
import { Link, useNavigate } from 'react-router-dom'; // Importa Link y useNavigate
import { AuthContext } from '../context/AuthContext'; // Importa AuthContext
import api from '../services/api'; // Importa tu instancia de Axios

function RentalPage() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useContext(AuthContext); // Obtener estado de autenticación y usuario
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRentals = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/rentals'); // Usar tu instancia de Axios
                setRentals(response.data);
            } catch (err) {
                setError('Error al cargar las rentas desde el servidor.');
                console.error("Error fetching rentals from backend:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, []);

    const handleContactMe = (rental) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para contactar al proveedor.');
            navigate('/login');
            return;
        }
        // ⭐ Lógica para "Comunícate Conmigo" ⭐
        if (rental.user && rental.user.email) {
            alert(`Simulando contacto con ${rental.user.name || 'el proveedor'} al email: ${rental.user.email}`);
        } else {
            alert('Funcionalidad de contacto en desarrollo.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Maquinaria y Herramientas en Renta</h2>
            {loading && <p className="text-center text-gray-600">Cargando rentas...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!loading && !error && rentals.length === 0 && (
                <p className="text-center text-gray-600">No hay equipos en renta disponibles en este momento.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentals.map(rental => (
                    <div key={rental._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                        {rental.user && rental.user.isPremium && (
                            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Proveedor Premium
                            </span>
                        )}
                        <img src={rental.imageUrl || 'https://placehold.co/400x300?text=Renta'} alt={rental.name} className="w-full h-48 object-cover"/>
                        <div className="p-4 flex-grow flex flex-col">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{rental.name}</h3>
                            <p className="text-gray-700 text-sm mb-3 flex-grow">{rental.description.substring(0, 100)}{rental.description.length > 100 ? '...' : ''}</p>
                            <p className="text-lg font-bold text-blue-700 mb-4">COP {rental.pricePerDay.toLocaleString('es-CO')} / día</p>
                            
                            <div className="mt-auto flex flex-col space-y-2">
                                {/* Botón Ver Detalles */}
                                <Link
                                    to={`/rentals/${rental._id}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center"
                                >
                                    Ver Detalles
                                </Link>

                                {/* Botón Comunícate Conmigo (condicional) */}
                                {isAuthenticated && user && rental.user && rental.user._id === user._id ? (
                                    <p className="text-gray-500 text-sm text-center">Esta es tu maquinaria en renta.</p>
                                ) : (
                                    <button
                                        onClick={() => handleContactMe(rental)}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
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

export default RentalPage;
