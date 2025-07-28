// src/pages/NotificationsPage.jsx
import React, { useContext, useEffect } from 'react';
import { NotificationContext } from '../context/NotificationContext'; // Importar el contexto de notificaciones
import { toast } from 'react-toastify'; // Importar toast para las notificaciones de usuario
import { Link } from 'react-router-dom'; // Para enlaces a entidades relacionadas

function NotificationsPage() {
    const {
        notifications,
        loadingNotifications,
        errorNotifications,
        fetchNotifications, // Función para recargar notificaciones
        markNotificationAsRead,
        deleteNotification,
    } = useContext(NotificationContext);

    // Cargar notificaciones al montar el componente y recargar si la dependencia cambia
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]); // fetchNotifications es una useCallback, así que es estable.

    const handleMarkAsRead = async (id) => {
        await markNotificationAsRead(id);
        toast.success('Notificación marcada como leída.');
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
            await deleteNotification(id);
            toast.info('Notificación eliminada.');
        }
    };

    // Helper para obtener el ícono según el tipo de notificación
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_barter_proposal':
                return '🤝'; // Manos de trueque
            case 'barter_accepted':
                return '✅'; // Checkmark
            case 'barter_rejected':
                return '❌'; // Cruz
            case 'barter_countered':
                return '🔄'; // Flechas de ciclo
            case 'order_status_update':
                return '📦'; // Caja
            case 'product_update':
                return '📝'; // Lápiz
            case 'general_message':
                return '💬'; // Burbuja de mensaje
            default:
                return '🔔'; // Campana por defecto
        }
    };

    // Helper para obtener la clase de color de fondo según el tipo
    const getNotificationColorClass = (type) => {
        switch (type) {
            case 'new_barter_proposal':
                return 'bg-blue-100 border-blue-400';
            case 'barter_accepted':
                return 'bg-green-100 border-green-400';
            case 'barter_rejected':
                return 'bg-red-100 border-red-400';
            case 'barter_countered':
                return 'bg-yellow-100 border-yellow-400';
            default:
                return 'bg-gray-100 border-gray-300';
        }
    };

    if (loadingNotifications) {
        return (
            <div className="flex justify-center items-center min-h-screen text-xl text-gray-700 animate-pulse">
                Cargando notificaciones...
            </div>
        );
    }

    if (errorNotifications) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-semibold">
                Error: {errorNotifications}
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
                <p className="text-2xl font-semibold text-gray-700 mb-4">No tienes notificaciones por el momento. ¡Todo tranquilo! 🎉</p>
                <Link to="/products" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-lg hover:shadow-xl">
                    Explorar Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10 drop-shadow-md">Tus Notificaciones</h1>
            <div className="max-w-3xl mx-auto space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification._id} // Usamos _id de la DB en lugar de 'id'
                        className={`p-5 rounded-lg shadow-md flex items-center space-x-4 transition-all duration-200
                                    ${notification.isRead ? 'bg-gray-200 text-gray-600' : `${getNotificationColorClass(notification.type)} text-gray-800 font-semibold border-l-8`}
                                    ${!notification.isRead ? 'hover:shadow-lg' : ''}`}
                    >
                        <div className={`text-4xl ${!notification.isRead ? 'text-gray-700' : 'text-gray-400'}`}>
                            {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow">
                            <h3 className={`text-lg font-bold ${notification.isRead ? 'text-gray-500' : 'text-gray-800'}`}>
                                {notification.title} {/* Usamos 'title' de la DB */}
                            </h3>
                            <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                                {notification.message} {/* Usamos 'message' de la DB */}
                            </p>
                            <span className="text-xs text-gray-400 mt-1 block">
                                {new Date(notification.createdAt).toLocaleString()} {/* Usamos 'createdAt' de la DB */}
                            </span>
                        </div>
                        <div className="flex flex-col space-y-2">
                            {!notification.isRead && (
                                <button
                                    onClick={() => handleMarkAsRead(notification._id)}
                                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-md transition duration-200 shadow-sm"
                                >
                                    Marcar Leída
                                </button>
                            )}
                            {/* Enlace condicional a la entidad relacionada */}
                            {notification.relatedEntityId && notification.relatedEntityType === 'BarterProposal' && (
                                <Link
                                    to={`/barter-details/${notification.relatedEntityId}`} // Ajusta esta ruta si tienes una página específica para ver los detalles de una propuesta de trueque
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md text-center transition duration-200 shadow-sm"
                                >
                                    Ver Detalles
                                </Link>
                            )}
                            <button
                                onClick={() => handleDelete(notification._id)}
                                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md transition duration-200 shadow-sm"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NotificationsPage;