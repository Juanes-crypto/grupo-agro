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

        // MODIFICADO: Lógica para "Comunícate Conmigo" con WhatsApp y showPhoneNumber
        // Verificar rental.owner en lugar de rental.user
        if (rental && rental.owner && rental.owner.phoneNumber && rental.owner.showPhoneNumber) {
            const whatsappMessage = `Hola, estoy interesado en tu equipo en renta: ${rental.name} (ID: ${rental._id}). ¿Podrías darme más información?`;
            window.open(
                `https://wa.me/${rental.owner.phoneNumber}?text=${encodeURIComponent(
                    whatsappMessage
                )}`,
                "_blank"
            );
            setContactMessage(''); // Limpiar el mensaje si se abre WhatsApp
        } else if (rental && rental.owner && rental.owner.email) {
            setContactMessage(`Puedes contactar a ${rental.owner.name || 'el proveedor'} al email: ${rental.owner.email}. (Simulado)`);
            // O podrías abrir un cliente de correo: window.location.href = `mailto:${rental.owner.email}?subject=Interés en ${rental.name}`;
            setTimeout(() => setContactMessage(''), 5000);
        } else {
            setContactMessage('Funcionalidad de contacto no disponible públicamente para este proveedor.');
            setTimeout(() => setContactMessage(''), 5000);
        }
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
    // MODIFICADO: Verificar rental.owner en lugar de rental.user
    const isMyRental = isAuthenticated && user && rental.owner && rental.owner._id === user._id;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
            <div className="md:w-1/2">
                <img src={rental.imageUrl || 'https://placehold.co/400x300?text=Renta'} alt={rental.name} className="w-full h-auto object-cover rounded-lg shadow-sm" />
            </div>
            <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{rental.name}</h2>
                {rental.owner && rental.owner.isPremium && ( // MODIFICADO: rental.user.isPremium por rental.owner.isPremium
                    <span className="bg-yellow-500 text-white text-sm font-bold px-2 py-1 rounded-full mb-2 inline-block">
                        Proveedor Premium
                    </span>
                )}
                <p className="text-green-700 text-lg font-semibold mb-2">Categoría: {rental.category}</p> {/* Cambié 'type' por 'category' asumiendo que es el campo correcto */}
                <p className="text-gray-700 text-lg mb-4">{rental.description}</p>
                <div className="text-4xl font-extrabold text-blue-800 mb-6">
                    COP {rental.pricePerDay.toLocaleString('es-CO')} / día
                </div>

                {/* Botón de Contacto (MODIFICADO) */}
                {!isMyRental ? (
                    <>
                        {rental.owner && rental.owner.phoneNumber && rental.owner.showPhoneNumber ? (
                            <button
                                onClick={handleContactMe}
                                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
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
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                            >
                                Comunícate Conmigo
                            </button>
                        )}
                    </>
                ) : (
                    <p className="text-gray-500 text-md text-center">Esta es tu maquinaria en renta. Puedes gestionarla desde tu panel.</p>
                )}

                {contactMessage && (
                    <p className={`text-center mt-3 font-medium ${contactMessage.includes('Debes iniciar sesión') || contactMessage.includes('no disponible') ? 'text-red-600' : 'text-green-600'}`}>
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