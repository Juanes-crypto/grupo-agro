import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    BellAlertIcon,
    TrashIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    SparklesIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import moment from 'moment';
import api from '../services/api';
import { toast } from 'react-toastify';

const MisNotificaciones = ({ notificaciones: initialNotificaciones, token, loading }) => {
    const { user } = useContext(AuthContext);

    // Estado local para manejar borrados y "marcar como leído"
    const [notificaciones, setNotificaciones] = useState(initialNotificaciones || []);

    // Sincronizar estado local cuando las props cambien
    useEffect(() => {
        setNotificaciones(initialNotificaciones || []);
    }, [initialNotificaciones]);

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNotificaciones(notificaciones.map(notif =>
                notif._id === id ? { ...notif, isRead: true } : notif
            ));

            toast.success("Notificación marcada como leída");
        } catch (err) {
            console.error("Error al marcar como leído:", err);
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

            setNotificaciones(notificaciones.filter(notif => notif._id !== id));
            toast.success("Notificación eliminada");
        } catch (err) {
            console.error("Error al eliminar notificación:", err);
            toast.error("Error al eliminar la notificación");
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadNotifications = notificaciones.filter(notif => !notif.isRead);

            for (const notif of unreadNotifications) {
                await api.put(`/api/notifications/${notif._id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setNotificaciones(notificaciones.map(notif => ({
                ...notif,
                isRead: true
            })));

            toast.success("Todas las notificaciones marcadas como leídas");
        } catch (err) {
            console.error("Error al marcar todas como leídas:", err);
            setNotificaciones(notificaciones.map(notif => ({
                ...notif,
                isRead: true
            })));
            toast.info("Notificaciones marcadas como leídas (solo localmente)");
        }
    };

    const getNotificationIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'warning':
            case 'alert':
                return ExclamationTriangleIcon;
            case 'success':
                return CheckCircleIcon;
            case 'info':
            default:
                return InformationCircleIcon;
        }
    };

    const getNotificationColors = (type, isRead) => {
        if (isRead) {
            return {
                bg: 'bg-gray-50',
                border: 'border-gray-200',
                iconBg: 'bg-gray-100',
                iconColor: 'text-gray-400',
                text: 'text-gray-500'
            };
        }

        switch (type?.toLowerCase()) {
            case 'warning':
            case 'alert':
                return {
                    bg: 'bg-gradient-to-r from-orange-50 to-red-50',
                    border: 'border-orange-200',
                    iconBg: 'bg-gradient-to-r from-orange-500 to-red-500',
                    iconColor: 'text-white',
                    text: 'text-gray-800'
                };
            case 'success':
                return {
                    bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
                    border: 'border-green-200',
                    iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
                    iconColor: 'text-white',
                    text: 'text-gray-800'
                };
            case 'info':
            default:
                return {
                    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
                    border: 'border-blue-200',
                    iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
                    iconColor: 'text-white',
                    text: 'text-gray-800'
                };
        }
    };

    if (!user) {
        return (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
                <div className="text-center">
                    <BellAlertIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Inicia sesión para ver tus notificaciones.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex justify-center items-center py-8">
                    <div className="relative">
                        <div className="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                    <span className="ml-3 text-gray-600">Cargando notificaciones...</span>
                </div>
            </div>
        );
    }

    const unreadCount = notificaciones.filter(n => !n.isRead).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <BellAlertIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Mis Notificaciones</h1>
                            <p className="text-blue-100">
                                {unreadCount} sin leer • {notificaciones.length} total
                            </p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
                        >
                            <CheckCircleIcon className="w-4 h-4" />
                            <span>Marcar todas</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            {notificaciones.length > 0 ? (
                <div className="space-y-4">
                    {notificaciones.map((notif) => {
                        const IconComponent = getNotificationIcon(notif.type);
                        const colors = getNotificationColors(notif.type, notif.isRead);

                        return (
                            <div
                                key={notif._id}
                                className={`relative overflow-hidden ${colors.bg} border ${colors.border} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                            >
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                                    <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full transform translate-x-8 -translate-y-8`}></div>
                                </div>

                                <div className="relative z-10 flex items-start space-x-4">
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                                        <IconComponent className={`w-6 h-6 ${colors.iconColor}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className={`font-semibold text-lg ${colors.text} ${notif.isRead ? 'line-through' : ''}`}>
                                                    {notif.message || notif.title || notif.content}
                                                </p>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <ClockIcon className="w-4 h-4 mr-1" />
                                                        {moment(notif.createdAt || notif.date).fromNow()}
                                                    </div>
                                                    {notif.type && (
                                                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                                                            notif.type.toLowerCase() === 'warning' || notif.type.toLowerCase() === 'alert'
                                                                ? 'bg-orange-100 text-orange-800'
                                                                : notif.type.toLowerCase() === 'success'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {notif.type}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col space-y-2 ml-4">
                                                {!notif.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notif._id)}
                                                        className="flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                                                        title="Marcar como leído"
                                                    >
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteNotification(notif._id)}
                                                    className="flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                                                    title="Eliminar notificación"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12 border border-gray-100">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <BellAlertIcon className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">¡Todo al día!</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            No tienes notificaciones pendientes. Te mantendremos informado de todas las actividades importantes.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisNotificaciones;
