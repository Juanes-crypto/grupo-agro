// src/components/MisNotificaciones.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BellAlertIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

const MisNotificaciones = () => {
    const { user } = useContext(AuthContext);
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulamos la carga de datos de notificaciones desde una API
    useEffect(() => {
        const fetchNotificaciones = async () => {
            try {
                // Simulación de una llamada a la API
                setTimeout(() => {
                    // Datos simulados
                    const mockData = [
                        {
                            id: 'notif1',
                            message: 'Tu publicación "Tomates Orgánicos" ha recibido un nuevo comentario.',
                            date: moment().subtract(30, 'minutes'),
                            read: false,
                        },
                        {
                            id: 'notif2',
                            message: 'Tu pedido #ped01 ha sido marcado como "Entregado".',
                            date: moment().subtract(2, 'hours'),
                            read: true,
                        },
                        {
                            id: 'notif3',
                            message: '¡Felicitaciones! Has recibido una nueva propuesta para tu publicación de "Manzanas Verdes".',
                            date: moment().subtract(1, 'day'),
                            read: false,
                        },
                        {
                            id: 'notif4',
                            message: 'Se ha completado una transacción con el usuario Juanito.',
                            date: moment().subtract(3, 'days'),
                            read: true,
                        },
                    ];
                    setNotificaciones(mockData);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError("Hubo un error al cargar tus notificaciones.");
                setLoading(false);
            }
        };

        if (user) {
            fetchNotificaciones();
        }
    }, [user]);

    if (!user) {
        return <div className="p-6 bg-white rounded-lg shadow-sm">Inicia sesión para ver tus notificaciones.</div>;
    }

    if (loading) {
        return <div className="p-6 bg-white rounded-lg shadow-sm">Cargando notificaciones...</div>;
    }

    if (error) {
        return <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-sm">{error}</div>;
    }

    const handleMarkAsRead = (id) => {
        // En un caso real, harías una llamada a la API para marcar la notificación como leída
        setNotificaciones(notificaciones.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Mis Notificaciones</h2>
                <span className="text-sm font-medium text-gray-500">
                    Tienes {notificaciones.filter(n => !n.read).length} notificaciones sin leer
                </span>
            </div>
            
            {notificaciones.length > 0 ? (
                <div className="space-y-4">
                    {notificaciones.map((notif) => (
                        <div 
                            key={notif.id} 
                            className={`p-4 rounded-lg shadow-sm flex items-start space-x-4 transition duration-200 ${
                                notif.read ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-gray-800 hover:bg-green-100'
                            }`}
                        >
                            <BellAlertIcon className={`h-6 w-6 flex-shrink-0 ${notif.read ? 'text-gray-400' : 'text-green-600'}`} />
                            <div className="flex-1">
                                <p className={`font-medium ${notif.read ? 'line-through' : ''}`}>{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {moment(notif.date).fromNow()}
                                </p>
                            </div>
                            {!notif.read && (
                                <button
                                    onClick={() => handleMarkAsRead(notif.id)}
                                    className="flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800 hover:bg-green-300 transition-colors"
                                >
                                    Marcar como leído
                                </button>
                            )}
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
