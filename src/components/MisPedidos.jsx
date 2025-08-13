import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getToken } from '../utils/auth'; // Asume que tienes una función para obtener el token
import moment from 'moment'; // Importar moment.js para formatear fechas

// Componente para mostrar un solo pedido
const OrderCard = ({ order }) => {
    // Determinar el estado del pedido
    const getStatusText = () => {
        if (order.isDelivered) {
            return "Entregado";
        }
        if (order.isPaid) {
            return "Pagado";
        }
        return "Pendiente de Pago";
    };

    const getStatusColor = () => {
        if (order.isDelivered) {
            return "bg-green-100 text-green-800";
        }
        if (order.isPaid) {
            return "bg-blue-100 text-blue-800";
        }
        return "bg-yellow-100 text-yellow-800";
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">Pedido #{order._id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Fecha: {moment(order.createdAt).format('DD/MM/YYYY')}
                    </p>
                </div>
                <div className="mt-3 sm:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor()}`}>
                        {getStatusText()}
                    </span>
                </div>
            </div>

            {/* Detalles de los productos en el pedido */}
            <div className="space-y-4">
                {order.orderItems.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-4">
                        <img
                            src={item.image || "https://placehold.co/64x64/e2e8f0/475569?text=Prod"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                            <h4 className="text-md font-semibold text-gray-700">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.quantity}</p>
                        </div>
                        <p className="text-md font-bold text-gray-900">${(item.price * parseInt(item.quantity)).toFixed(2)}</p>
                    </div>
                ))}
            </div>

            {/* Resumen de precios */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                <div className="text-sm text-gray-600">Total de ítems: ${(order.totalPrice - order.shippingPrice - order.taxPrice).toFixed(2)}</div>
                <div className="text-sm text-gray-600">Envío: ${(order.shippingPrice).toFixed(2)}</div>
                <div className="text-sm text-gray-600">Impuestos: ${(order.taxPrice).toFixed(2)}</div>
                <div className="text-xl font-bold text-gray-900 mt-2">Total: ${order.totalPrice.toFixed(2)}</div>
            </div>
        </div>
    );
};

// Componente principal
const MisPedidos = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchMyOrders = async () => {
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
                const response = await fetch('/api/orders/myorders', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('No se pudo obtener los pedidos.');
                }

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.error("Error al obtener mis pedidos:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyOrders();
    }, [user]); // Dependencia en el usuario para recargar si cambia el estado de login

    if (isLoading) {
        return <div className="text-center text-gray-500 p-8">Cargando tus pedidos...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600">Aún no tienes pedidos registrados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Mis Pedidos</h2>
            <div className="grid grid-cols-1 gap-6">
                {orders.map(order => (
                    <OrderCard key={order._id} order={order} />
                ))}
            </div>
        </div>
    );
};

export default MisPedidos;
