// frontend/src/pages/RentalDetailsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // Asegúrate de que tu instancia de Axios 'api' esté configurada

function RentalDetailsPage() {
    const { id } = useParams(); // Obtener el ID de la renta de la URL
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [rental, setRental] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contactMessage, setContactMessage] = useState('');

    useEffect(() => {
        const fetchRental = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/rentals/${id}`); // Usar tu instancia de Axios
                setRental(response.data);
            } catch (err) {
                setError('Error al cargar los detalles de la renta.');
                console.error("Error fetching rental details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRental();
    }, [id]);

    const handleContactMe = () => {
        if (!isAuthenticated) {
            setContactMessage('Debes iniciar sesión para contactar al proveedor.');
            setTimeout(() => setContactMessage(''), 3000);
            navigate('/login');
            return;
        }

        // ⭐ Lógica para "Comunícate Conmigo" (similar a ServiceDetailsPage) ⭐
        if (rental && rental.user) {
            setContactMessage(`Puedes contactar a ${rental.user.name || 'el proveedor'} al email: ${rental.user.email || 'No disponible'}. (Simulado)`);
        } else {
            setContactMessage('Funcionalidad de contacto en desarrollo. (Simulado)');
        }
        setTimeout(() => setContactMessage(''), 5000);
    };

    if (loading) {
        return <div className="text-center text-gray-600">Cargando detalles de la renta...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    if (!rental) {
        return <div className="text-center text-gray-600">Renta no disponible.</div>;
    }

    // Determinar si la renta es del usuario logueado
    const isMyRental = isAuthenticated && user && rental.user && rental.user._id === user._id;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
            <div className="md:w-1/2">
                <img src={rental.imageUrl || 'https://placehold.co/400x300?text=Renta'} alt={rental.name} className="w-full h-auto object-cover rounded-lg shadow-sm" />
            </div>
            <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{rental.name}</h2>
                {rental.user && rental.user.isPremium && (
                    <span className="bg-yellow-500 text-white text-sm font-bold px-2 py-1 rounded-full mb-2 inline-block">
                        Proveedor Premium
                    </span>
                )}
                <p className="text-green-700 text-lg font-semibold mb-2">Tipo: {rental.type}</p> {/* Asumiendo un campo 'type' para rentas */}
                <p className="text-gray-700 text-lg mb-4">{rental.description}</p>
                <div className="text-4xl font-extrabold text-blue-800 mb-6">
                    COP {rental.pricePerDay.toLocaleString('es-CO')} / día
                </div>
                
                {/* Botón de Contacto */}
                {!isMyRental ? (
                    <button
                        onClick={handleContactMe}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                    >
                        Comunícate Conmigo
                    </button>
                ) : (
                    <p className="text-gray-500 text-md text-center">Esta es tu maquinaria en renta. Puedes gestionarla desde tu panel.</p>
                )}

                {contactMessage && (
                    <p className={`text-center mt-3 font-medium ${contactMessage.includes('Debes iniciar sesión') ? 'text-red-600' : 'text-green-600'}`}>
                        {contactMessage}
                    </p>
                )}

                <Link to="/rentals" className="block text-center text-blue-600 hover:underline mt-4">
                    Volver a la lista de rentas
                </Link>
            </div>
        </div>
    );
}

export default RentalDetailsPage;
