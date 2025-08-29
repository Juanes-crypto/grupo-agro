import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { isAuthenticated, token } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [errorNotifications, setErrorNotifications] = useState(null);

    const fetchNotifications = useCallback(async () => {
        // ✅ COMENTADO TEMPORALMENTE: Si no tienes endpoint de notificaciones
        setNotifications([]);
        setUnreadCount(0);
        setLoadingNotifications(false);
        return;

        /*
        if (!isAuthenticated || !token) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        setLoadingNotifications(true);
        setErrorNotifications(null);
        try {
            // ✅ Si tienes notificaciones, usa la ruta correcta con /api/
            const response = await api.get('/api/notifications/my');
            setNotifications(response.data);
            setUnreadCount(response.data.filter(notif => !notif.isRead).length);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setErrorNotifications('Error al cargar notificaciones.');
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoadingNotifications(false);
        }
        */
    }, [isAuthenticated, token]);

    useEffect(() => {
        fetchNotifications();
        // Comenta el polling si no tienes notificaciones implementadas
        // const interval = setInterval(fetchNotifications, 30000);
        // return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markNotificationAsRead = async (id) => {
        // Comentado temporalmente
        return;
    };

    const deleteNotification = async (id) => {
        // Comentado temporalmente
        return;
    };

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