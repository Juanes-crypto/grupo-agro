// frontend/src/pages/ServiceDetailsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // Asegúrate de que tu instancia de Axios 'api' esté configurada

function ServiceDetailsPage() {
    const { id } = useParams(); // Obtener el ID del servicio de la URL
    const { isAuthenticated, user } = useContext(AuthContext); // Necesitamos saber si el usuario está logueado y quién es
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contactMessage, setContactMessage] = useState(''); // Para mensajes de contacto

    useEffect(() => {
        const fetchService = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/services/${id}`); // Usar tu instancia de Axios
                setService(response.data);
            } catch (err) {
                setError('Error al cargar los detalles del servicio.');
                console.error("Error fetching service details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    const handleContactMe = () => {
        if (!isAuthenticated) {
            setContactMessage('Debes iniciar sesión para contactar al proveedor.');
            setTimeout(() => setContactMessage(''), 3000);
            navigate('/login'); // Redirigir al login
            return;
        }

        // ⭐ Lógica para "Comunícate Conmigo" ⭐
        // Aquí puedes implementar:
        // 1. Un modal con un formulario de contacto.
        // 2. Un enlace a un chat interno (si lo implementas).
        // 3. Mostrar la información de contacto del usuario (si el backend la provee y es pública/premium).

        // Por ahora, mostraremos un mensaje simple y simularemos un contacto.
        // Idealmente, aquí harías un `fetch` a tu backend para iniciar un chat o enviar un mensaje.
        
        // Si el servicio tiene un 'user' populado con detalles como email/phone:
        if (service && service.user) {
            setContactMessage(`Puedes contactar a ${service.user.name || 'el proveedor'} al email: ${service.user.email || 'No disponible'}. (Simulado)`);
        } else {
            setContactMessage('Funcionalidad de contacto en desarrollo. (Simulado)');
        }
        setTimeout(() => setContactMessage(''), 5000); // Ocultar mensaje después de 5 segundos
    };

    if (loading) {
        return <div className="text-center text-gray-600">Cargando detalles del servicio...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    if (!service) {
        return <div className="text-center text-gray-600">Servicio no disponible.</div>;
    }

    // Determinar si el servicio es del usuario logueado
    const isMyService = isAuthenticated && user && service.user && service.user._id === user._id;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
            <div className="md:w-1/2">
                <img src={service.imageUrl || 'https://placehold.co/400x300?text=Servicio'} alt={service.name} className="w-full h-auto object-cover rounded-lg shadow-sm" />
            </div>
            <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{service.name}</h2>
                {service.user && service.user.isPremium && (
                    <span className="bg-yellow-500 text-white text-sm font-bold px-2 py-1 rounded-full mb-2 inline-block">
                        Proveedor Premium
                    </span>
                )}
                <p className="text-green-700 text-lg font-semibold mb-2">Categoría: {service.category}</p>
                <p className="text-gray-700 text-lg mb-4">{service.description}</p>
                <p className="text-gray-700 text-lg mb-4">Experiencia: {service.experience}</p>
                <div className="text-4xl font-extrabold text-green-800 mb-6">
                    COP {service.price.toLocaleString('es-CO')}
                </div>
                
                {/* Botón de Contacto */}
                {!isMyService ? ( // Solo mostrar si NO es mi propio servicio
                    <button
                        onClick={handleContactMe}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                    >
                        Comunícate Conmigo
                    </button>
                ) : (
                    <p className="text-gray-500 text-md text-center">Este es tu servicio. Puedes gestionarlo desde tu panel.</p>
                )}

                {contactMessage && (
                    <p className={`text-center mt-3 font-medium ${contactMessage.includes('Debes iniciar sesión') ? 'text-red-600' : 'text-green-600'}`}>
                        {contactMessage}
                    </p>
                )}

                <Link to="/services" className="block text-center text-blue-600 hover:underline mt-4">
                    Volver a la lista de servicios
                </Link>
            </div>
        </div>
    );
}

export default ServiceDetailsPage;
