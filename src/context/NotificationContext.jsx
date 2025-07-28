import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api'; // Tu instancia de Axios configurada
import { AuthContext } from './AuthContext'; // Para acceder al token de autenticación

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { isAuthenticated, token } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [errorNotifications, setErrorNotifications] = useState(null);

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated || !token) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        setLoadingNotifications(true);
        setErrorNotifications(null);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await api.get('/notifications/my', config);
            setNotifications(response.data);
            setUnreadCount(response.data.filter(notif => !notif.isRead).length);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setErrorNotifications('Error al cargar notificaciones.');
        } finally {
            setLoadingNotifications(false);
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        fetchNotifications();
        // Opcional: Polling para nuevas notificaciones cada cierto tiempo (ej. 30 segundos)
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, [fetchNotifications]);

    const markNotificationAsRead = async (id) => {
        if (!token) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await api.put(`/notifications/${id}/read`, {}, config);
            setNotifications(prevNotifications =>
                prevNotifications.map(notif =>
                    notif._id === id ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
        } catch (err) {
            console.error('Error marking notification as read:', err);
            // Manejar error (ej. toast)
        }
    };

    const deleteNotification = async (id) => {
        if (!token) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await api.delete(`/notifications/${id}`, config);
            setNotifications(prevNotifications =>
                prevNotifications.filter(notif => notif._id !== id)
            );
            setUnreadCount(prevCount => {
                const deletedNotif = notifications.find(n => n._id === id);
                return (deletedNotif && !deletedNotif.isRead) ? prevCount - 1 : prevCount;
            });
        } catch (err) {
            console.error('Error deleting notification:', err);
            // Manejar error (ej. toast)
        }
    };

    // Puedes añadir una función para añadir una notificación al estado local si se recibe por WebSocket/Socket.IO
    // const addNotification = (newNotification) => {
    //   setNotifications(prev => [newNotification, ...prev]);
    //   if (!newNotification.isRead) setUnreadCount(prev => prev + 1);
    // };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loadingNotifications,
                errorNotifications,
                fetchNotifications,
                markNotificationAsRead,
                deleteNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};