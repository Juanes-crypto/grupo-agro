// frontend/src/pages/OrderDetailsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Tu instancia de Axios configurada
import { AuthContext } from '../context/AuthContext'; // Para acceder al usuario autenticado

function OrderDetailsPage() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id: orderId } = useParams(); // Obtener el ID del pedido de la URL
    const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                setError('Debes iniciar sesión para ver los detalles del pedido.');
                navigate('/login'); // Redirigir al login si no está autenticado
                return;
            }
            try {
                setLoading(true);
                // Asegúrate de que el token se esté enviando con la petición si `api` no lo hace automáticamente
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // O de tu AuthContext
                    },
                };
                const response = await api.get(`/orders/${orderId}`, config); // Usar la configuración de headers
                setOrder(response.data);
                setError('');
            } catch (err) {
                console.error('Error al obtener los detalles del pedido:', err);
                if (err.response && err.response.data && err.response.data.message) {
                    setError(`Error al cargar el pedido: ${err.response.data.message}`);
                } else {
                    setError('Error desconocido al cargar los detalles del pedido.');
                }
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && orderId) {
            fetchOrder();
        }
    }, [orderId, isAuthenticated, authLoading, navigate]); // Añadir navigate a las dependencias

    if (loading || authLoading) {
        return (
            <div className="text-center text-xl py-8">Cargando detalles del pedido...</div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
                {error.includes('inicia sesión') && (
                     <p className="text-center mt-4">
                        Por favor, <Link to="/login" className="text-blue-600 hover:underline font-bold">inicia sesión</Link> para ver este pedido.
                    </p>
                )}
                {!isAuthenticated && !error.includes('inicia sesión') && ( // Si no es un error de autenticación explícito
                    <p className="text-center mt-4">
                        <Link to="/" className="text-blue-600 hover:underline font-bold">Volver a Productos</Link>
                    </p>
                )}
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Detalles del Pedido</h2>
                <p className="text-lg text-gray-700 mb-6">Pedido no encontrado o no autorizado para ver.</p>
                <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                    Volver a Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Detalles del Pedido #{order._id}</h2>

            <div className="flex flex-col gap-6">
                {/* Sección de Envío */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Dirección de Envío</h3>
                    <p className="mb-2"><strong>Dirección:</strong> {order.shippingAddress.address}</p>
                    <p className="mb-2"><strong>Ciudad:</strong> {order.shippingAddress.city}</p>
                    <p className="mb-2"><strong>Código Postal:</strong> {order.shippingAddress.postalCode}</p>
                    <p><strong>País:</strong> {order.shippingAddress.country}</p>
                </div>

                {/* Sección de Pago */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Método de Pago</h3>
                    <p className="mb-2"><strong>Método:</strong> {order.paymentMethod}</p>
                    {order.isPaid ? (
                        <p className="text-green-600 font-bold mt-2">Pagado el {new Date(order.paidAt).toLocaleDateString()}</p>
                    ) : (
                        <p className="text-yellow-600 font-bold mt-2">No Pagado</p>
                    )}
                </div>

                {/* Sección de Productos del Pedido */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Productos del Pedido</h3>
                    <div className="flex flex-col gap-3">
                        {order.orderItems.map((item) => (
                            <div key={item.product._id} className="flex items-center gap-4 pb-3 border-b border-dashed border-gray-200 last:border-b-0 last:pb-0">
                                <img
                                    src={item.image || 'https://via.placeholder.com/60?text=No+Image'}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60?text=No+Image'; }}
                                />
                                <div className="flex-grow">
                                    <Link to={`/products/${item.product._id}`} className="text-blue-600 hover:underline font-bold text-lg">
                                        {item.name}
                                    </Link>
                                    <p className="text-gray-600 text-sm">
                                        {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sección de Resumen de Precios */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Resumen de Precios</h3>
                    <div className="flex justify-between mb-2 text-gray-700">
                        <span>Items:</span>
                        <span>${order.orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-gray-700">
                        <span>Envío:</span>
                        <span>${order.shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-gray-700">
                        <span>Impuestos:</span>
                        <span>${order.taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mt-4 pt-4 border-t-2 border-blue-600 text-xl font-bold text-gray-800">
                        <span>Total:</span>
                        <span>${order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {/* Sección de Estado de Entrega */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Estado de Entrega</h3>
                    {order.isDelivered ? (
                        <p className="text-green-600 font-bold mt-2">Entregado el {new Date(order.deliveredAt).toLocaleDateString()}</p>
                    ) : (
                        <p className="text-red-600 font-bold mt-2">No Entregado</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderDetailsPage;
