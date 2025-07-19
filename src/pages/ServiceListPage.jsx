// src/pages/ServiceListPage.jsx
import React, { useState, useEffect, useContext } from 'react'; // Importa useContext
import { Link, useNavigate } from 'react-router-dom'; // Importa Link y useNavigate
import { AuthContext } from '../context/AuthContext'; // Importa AuthContext
import api from '../services/api'; // Importa tu instancia de Axios

function ServiceListPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useContext(AuthContext); // Obtener estado de autenticación y usuario
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/services'); // Usar tu instancia de Axios
                setServices(response.data);
            } catch (err) {
                setError('Error al cargar los servicios desde el servidor.');
                console.error("Error fetching services from backend:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleContactMe = (service) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para contactar al proveedor.');
            navigate('/login');
            return;
        }
        // ⭐ Lógica para "Comunícate Conmigo" ⭐
        // Aquí podrías redirigir a una página de chat, o mostrar un modal con info de contacto.
        // Por ahora, un simple alert para demostración.
        if (service.user && service.user.email) {
            alert(`Simulando contacto con ${service.user.name || 'el proveedor'} al email: ${service.user.email}`);
        } else {
            alert('Funcionalidad de contacto en desarrollo.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Servicios Agrícolas Disponibles</h2>
            {loading && <p className="text-center text-gray-600">Cargando servicios...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!loading && !error && services.length === 0 && (
                <p className="text-center text-gray-600">No hay servicios disponibles en este momento.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div key={service._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                        {service.user && service.user.isPremium && (
                            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Proveedor Premium
                            </span>
                        )}
                        <img src={service.imageUrl || 'https://placehold.co/400x300?text=Servicio'} alt={service.name} className="w-full h-48 object-cover"/>
                        <div className="p-4 flex-grow flex flex-col">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                            <p className="text-gray-700 text-sm mb-3 flex-grow">{service.description.substring(0, 100)}{service.description.length > 100 ? '...' : ''}</p>
                            <p className="text-lg font-bold text-green-700 mb-4">COP {service.price.toLocaleString('es-CO')}</p>
                            
                            <div className="mt-auto flex flex-col space-y-2">
                                {/* Botón Ver Detalles */}
                                <Link
                                    to={`/services/${service._id}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center"
                                >
                                    Ver Detalles
                                </Link>

                                {/* Botón Comunícate Conmigo (condicional) */}
                                {isAuthenticated && user && service.user && service.user._id === user._id ? (
                                    <p className="text-gray-500 text-sm text-center">Este es tu servicio.</p>
                                ) : (
                                    <button
                                        onClick={() => handleContactMe(service)}
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

export default ServiceListPage;
