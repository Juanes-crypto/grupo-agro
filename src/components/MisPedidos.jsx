import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    TruckIcon,
    ShoppingBagIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    SparklesIcon,
    EyeIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const MisPedidos = ({ pedidos: initialPedidos, loading }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Estado local para manejar los pedidos recibidos
    const [pedidos, setPedidos] = useState(initialPedidos || []);

    // Sincronizar estado local cuando las props cambien
    useEffect(() => {
        setPedidos(initialPedidos || []);
    }, [initialPedidos]);

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmado',
            'shipped': 'En camino',
            'delivered': 'Entregado',
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return ClockIcon;
            case 'confirmed':
                return CheckCircleIcon;
            case 'shipped':
                return TruckIcon;
            case 'delivered':
                return CheckCircleIcon;
            case 'cancelled':
                return XCircleIcon;
            default:
                return ClockIcon;
        }
    };

    const getStatusColors = (status) => {
        switch (status) {
            case 'pending':
                return {
                    bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
                    border: 'border-yellow-200',
                    iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
                    iconColor: 'text-white',
                    text: 'text-yellow-800',
                    badge: 'bg-yellow-100 text-yellow-800'
                };
            case 'confirmed':
                return {
                    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
                    border: 'border-blue-200',
                    iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
                    iconColor: 'text-white',
                    text: 'text-blue-800',
                    badge: 'bg-blue-100 text-blue-800'
                };
            case 'shipped':
                return {
                    bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
                    border: 'border-purple-200',
                    iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
                    iconColor: 'text-white',
                    text: 'text-purple-800',
                    badge: 'bg-purple-100 text-purple-800'
                };
            case 'delivered':
                return {
                    bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
                    border: 'border-green-200',
                    iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
                    iconColor: 'text-white',
                    text: 'text-green-800',
                    badge: 'bg-green-100 text-green-800'
                };
            case 'cancelled':
                return {
                    bg: 'bg-gradient-to-r from-red-50 to-pink-50',
                    border: 'border-red-200',
                    iconBg: 'bg-gradient-to-r from-red-500 to-pink-500',
                    iconColor: 'text-white',
                    text: 'text-red-800',
                    badge: 'bg-red-100 text-red-800'
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
                    border: 'border-gray-200',
                    iconBg: 'bg-gradient-to-r from-gray-500 to-slate-500',
                    iconColor: 'text-white',
                    text: 'text-gray-800',
                    badge: 'bg-gray-100 text-gray-800'
                };
        }
    };

    if (!user) {
        return (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
                <div className="text-center">
                    <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Inicia sesión para ver tus pedidos.</p>
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
                    <span className="ml-3 text-gray-600">Cargando pedidos...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <ShoppingBagIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Mis Órdenes y Compras</h1>
                            <p className="text-green-100">
                                {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} realizados
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            {pedidos.length > 0 ? (
                <div className="space-y-4">
                    {pedidos.map((pedido) => {
                        const StatusIcon = getStatusIcon(pedido.status);
                        const colors = getStatusColors(pedido.status);

                        return (
                            <div
                                key={pedido._id}
                                className={`relative overflow-hidden ${colors.bg} border ${colors.border} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                            >
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                                    <div className={`w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 rounded-full transform translate-x-8 -translate-y-8`}></div>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                                        {/* Order Info */}
                                        <div className="flex-1 mb-4 lg:mb-0">
                                            <div className="flex items-start space-x-4">
                                                {/* Status Icon */}
                                                <div className={`flex-shrink-0 w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                                                    <StatusIcon className={`w-6 h-6 ${colors.iconColor}`} />
                                                </div>

                                                {/* Order Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="font-bold text-gray-900 text-lg">
                                                            Orden #{pedido._id.substring(0, 8)}
                                                        </h3>
                                                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${colors.badge}`}>
                                                            {getStatusText(pedido.status)}
                                                        </span>
                                                    </div>

                                                    {/* Items List */}
                                                    <div className="mb-3">
                                                        <ul className="text-sm text-gray-600 space-y-1">
                                                            {pedido.items.slice(0, 3).map((item, index) => (
                                                                <li key={index} className="flex items-center">
                                                                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2 flex-shrink-0"></span>
                                                                    {item.quantity} x {item.name}
                                                                </li>
                                                            ))}
                                                            {pedido.items.length > 3 && (
                                                                <li className="text-gray-500 italic">
                                                                    +{pedido.items.length - 3} productos más...
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>

                                                    {/* Date */}
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <ClockIcon className="w-4 h-4 mr-1" />
                                                        Realizado {moment(pedido.createdAt).fromNow()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price and Actions */}
                                        <div className="flex items-center justify-between lg:justify-end lg:flex-col lg:items-end space-y-3 lg:space-y-3 lg:ml-6">
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ${pedido.total.toLocaleString()} COP
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => navigate(`/order-details/${pedido._id}`)}
                                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            >
                                                <EyeIcon className="w-4 h-4 mr-2" />
                                                Ver Detalles
                                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                                            </button>
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
                            <ShoppingBagIcon className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">¡Comienza tu primera compra!</h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                            Aún no has realizado ninguna compra. Explora nuestros productos y comienza tu experiencia de compra.
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Explorar Productos
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisPedidos;
