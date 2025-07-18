// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';

function NotificationsPage({ userId }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simular la carga de notificaciones
        const fetchNotifications = async () => {
            setLoading(true);
            setError(null);
            try {
                // Simula un retraso de red
                await new Promise(resolve => setTimeout(resolve, 1200));

                // Datos de notificaciones de ejemplo
                const dummyNotifications = [
                    { id: 'n1', type: 'Trueque', message: 'Tu propuesta de trueque por "Semillas de Maíz" ha sido aceptada.', date: '2025-07-15', read: false },
                    { id: 'n2', type: 'Orden', message: 'Tu orden #12345 ha sido enviada.', date: '2025-07-14', read: true },
                    { id: 'n3', type: 'Nuevo Producto', message: '¡Un nuevo producto "Miel Orgánica" ha sido publicado en tu categoría favorita!', date: '2025-07-13', read: false },
                    { id: 'n4', type: 'Sistema', message: 'Actualización importante: Términos y Condiciones de AgroApp.', date: '2025-07-10', read: true },
                ];

                // Filtra las notificaciones si se necesita una lógica por userId, de lo contrario, muestra todas.
                // Por ahora, mostraremos todas las simuladas.
                setNotifications(dummyNotifications);

            } catch (err) {
                setError('Error desconocido al cargar tus notificaciones.');
                console.error("Error fetching dummy notifications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userId]); // Dependencia del userId

    const handleMarkAsRead = (id) => {
        // Simular marcar como leída
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
        console.log(`Notificación ${id} marcada como leída.`);
        // Aquí eventualmente llamarías a tu API para actualizar el estado de la notificación
    };

    const getNotificationClass = (read) => {
        return read ? 'bg-gray-50 text-gray-700' : 'bg-blue-50 text-blue-800 font-semibold';
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Mis Notificaciones</h2>
            {loading && <p className="text-center text-gray-600">Cargando notificaciones...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!loading && !error && notifications.length === 0 && (
                <p className="text-center text-gray-600">No tienes notificaciones nuevas.</p>
            )}

            <div className="space-y-4">
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className={`flex justify-between items-center p-4 rounded-lg shadow-sm border border-gray-200 ${getNotificationClass(notif.read)}`}
                    >
                        <div>
                            <p className="text-lg mb-1">{notif.message}</p>
                            <p className="text-sm text-gray-500">({notif.type}) - {notif.date}</p>
                        </div>
                        {!notif.read && (
                            <button
                                onClick={() => handleMarkAsRead(notif.id)}
                                className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                            >
                                Marcar como leída
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NotificationsPage;