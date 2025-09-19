// src/components/MisNotificaciones.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BellAlertIcon, TrashIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import api from '../services/api';
import { toast } from 'react-toastify';

const MisNotificaciones = ({ token }) => {
    const { user } = useContext(AuthContext);
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotificaciones = async () => {
            try {
                if (!user || !token) {
                    setLoading(false);
                    return;
                }

                console.log('🔍 Obteniendo notificaciones de /api/notifications/my');
                const response = await api.get('/api/notifications/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log('🔔 Notificaciones response:', response.data);

                // Extraer datos según la estructura de tu API
                let notificacionesData = [];
                
                // Basado en tu ruta, probablemente la estructura sea:
                if (response.data && response.data.success === true && Array.isArray(response.data.data)) {
                    notificacionesData = response.data.data;
                } else if (Array.isArray(response.data)) {
                    notificacionesData = response.data;
                } else if (response.data && Array.isArray(response.data.notifications)) {
                    notificacionesData = response.data.notifications;
                } else {
                    console.warn('Estructura inesperada de notificaciones:', response.data);
                    // Usamos datos de ejemplo como fallback
                    notificacionesData = getMockNotifications();
                }

                setNotificaciones(notificacionesData);
                setLoading(false);

            } catch (err) {
                console.error("Error al obtener notificaciones:", err);
                setError("Hubo un error al cargar tus notificaciones.");
                setLoading(false);
                
                // Datos de ejemplo como fallback
                setNotificaciones(getMockNotifications());
            }
        };

        if (user) {
            fetchNotificaciones();
        }
    }, [user, token]);

    // Función para datos mock de notificaciones (solo como fallback)
    const getMockNotifications = () => {
        return [
            {
                _id: 'notif1',
                message: 'Sistema: El endpoint de notificaciones está en desarrollo',
                createdAt: new Date().toISOString(),
                isRead: false,
                type: 'system'
            }
        ];
    };

    const handleMarkAsRead = async (id) => {
        try {
            // Usamos PUT según tu ruta definida
            await api.put(`/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Actualizar estado local
            setNotificaciones(notificaciones.map(notif =>
                notif._id === id ? { ...notif, isRead: true } : notif
            ));
            
            toast.success("Notificación marcada como leída");
        } catch (err) {
            console.error("Error al marcar como leído:", err);
            
            // Fallback: actualizar solo localmente
            setNotificaciones(notificaciones.map(notif =>
                notif._id === id ? { ...notif, isRead: true } : notif
            ));
            
            toast.info("Notificación marcada como leída (solo localmente)");
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await api.delete(`/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Actualizar estado local
            setNotificaciones(notificaciones.filter(notif => notif._id !== id));
            
            toast.success("Notificación eliminada");
        } catch (err) {
            console.error("Error al eliminar notificación:", err);
            toast.error("Error al eliminar la notificación");
        }
    };

    const markAllAsRead = async () => {
        try {
            // Marcar cada notificación no leída individualmente
            const unreadNotifications = notificaciones.filter(notif => !notif.isRead);
            
            for (const notif of unreadNotifications) {
                await api.put(`/api/notifications/${notif._id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            
            // Actualizar estado local
            setNotificaciones(notificaciones.map(notif => ({
                ...notif,
                isRead: true
            })));
            
            toast.success("Todas las notificaciones marcadas como leídas");
        } catch (err) {
            console.error("Error al marcar todas como leídas:", err);
            
            // Fallback local
            setNotificaciones(notificaciones.map(notif => ({
                ...notif,
                isRead: true
            })));
            
            toast.info("Notificaciones marcadas como leídas (solo localmente)");
        }
    };

    if (!user) {
        return <div className="p-6 bg-white rounded-lg shadow-sm">Inicia sesión para ver tus notificaciones.</div>;
    }

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-3 text-gray-600">Cargando notificaciones...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-yellow-100 text-yellow-800 rounded-lg shadow-sm">
                <p className="font-semibold">⚠️ Aviso:</p>
                <p>{error}</p>
                <p className="text-sm mt-2">Mostrando notificaciones de ejemplo...</p>
            </div>
        );
    }

    const unreadCount = notificaciones.filter(n => !n.isRead).length;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Mis Notificaciones</h2>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-500">
                        {unreadCount} sin leer de {notificaciones.length} total
                    </span>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors"
                        >
                            Marcar todas como leídas
                        </button>
                    )}
                </div>
            </div>
            
            {notificaciones.length > 0 ? (
                <div className="space-y-4">
                    {notificaciones.map((notif) => (
                        <div 
                            key={notif._id} 
                            className={`p-4 rounded-lg shadow-sm flex items-start space-x-4 transition duration-200 ${
                                notif.isRead ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-gray-800 hover:bg-green-100'
                            }`}
                        >
                            <BellAlertIcon className={`h-6 w-6 flex-shrink-0 ${notif.isRead ? 'text-gray-400' : 'text-green-600'}`} />
                            <div className="flex-1">
                                <p className={`font-medium ${notif.isRead ? 'line-through' : ''}`}>
                                    {notif.message || notif.title || notif.content}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {moment(notif.createdAt || notif.date).fromNow()}
                                </p>
                                {notif.type && (
                                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                                        {notif.type}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col space-y-2">
                                {!notif.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(notif._id)}
                                        className="flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800 hover:bg-green-300 transition-colors"
                                        title="Marcar como leído"
                                    >
                                        Leído
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteNotification(notif._id)}
                                    className="flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full bg-red-200 text-red-800 hover:bg-red-300 transition-colors"
                                    title="Eliminar notificación"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-700">
                    <p>No tienes nuevas notificaciones.</p>
                </div>
            )}
        </div>
    );
};

export default MisNotificaciones;