import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getToken } from '../utils/auth'; // Asume que tienes una función para obtener el token
import moment from 'moment'; // Importar moment.js para formatear fechas

// Componente para mostrar una notificación individual
const NotificationItem = ({ notification, onMarkAsRead }) => {
    return (
        <div 
            key={notification._id} 
            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ${
                !notification.isRead ? 'bg-indigo-50 border-l-4 border-indigo-500 shadow-md' : 'bg-gray-50 border border-gray-200'
            }`}
        >
            <div className={`p-2 rounded-full ${!notification.isRead ? 'bg-indigo-200 text-indigo-700' : 'bg-gray-200 text-gray-500'}`}>
                {/* Icono basado en el tipo de notificación. Aquí se usa un icono genérico. */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            </div>
            <div className="flex-1">
                <h4 className={`text-lg font-semibold ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>{notification.title}</h4>
                <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'}`}>{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                    {moment(notification.createdAt).fromNow()}
                </p>
            </div>
            {!notification.isRead && (
                <button 
                    onClick={() => onMarkAsRead(notification._id)}
                    className="flex-shrink-0 px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none"
                >
                    Marcar como leído
                </button>
            )}
        </div>
    );
};

// Componente principal
const MisNotificaciones = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    // Función para obtener las notificaciones del backend
    const fetchMyNotifications = async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const token = getToken();
        if (!token) {
            setError("No se encontró token de autenticación.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/notifications/my', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('No se pudo obtener las notificaciones.');
            }

            const data = await response.json();
            setNotifications(data);
        } catch (err) {
            console.error("Error al obtener mis notificaciones:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Función para marcar una notificación como leída
    const handleMarkAsRead = async (notificationId) => {
        const token = getToken();
        if (!token) {
            console.error("No se encontró token de autenticación para marcar como leído.");
            return;
        }
        
        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Actualizar el estado local para reflejar el cambio
                setNotifications(prevNotifications => 
                    prevNotifications.map(n => 
                        n._id === notificationId ? { ...n, isRead: true } : n
                    )
                );
            } else {
                throw new Error('No se pudo marcar la notificación como leída.');
            }
        } catch (err) {
            console.error("Error al marcar como leído:", err);
        }
    };

    useEffect(() => {
        fetchMyNotifications();
    }, [user]); // Dependencia en el usuario para recargar si cambia el estado de login

    if (isLoading) {
        return <div className="text-center text-gray-500 p-8">Cargando tus notificaciones...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    }

    if (notifications.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600">No tienes notificaciones por el momento.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Mis Notificaciones</h2>
            <div className="grid grid-cols-1 gap-4">
                {notifications.map(n => (
                    <NotificationItem 
                        key={n._id} 
                        notification={n} 
                        onMarkAsRead={handleMarkAsRead}
                    />
                ))}
            </div>
        </div>
    );
};

export default MisNotificaciones;
