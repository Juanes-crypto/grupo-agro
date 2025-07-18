// src/pages/MyOrdersPage.jsx
import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // Descomenta si necesitas enlaces a detalles de la orden

function MyOrdersPage({ userId }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simular la carga de órdenes
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                // Simula un retraso de red
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Datos de órdenes de ejemplo
                const dummyOrders = [
                    {
                        id: 'o1',
                        status: 'Completada',
                        items: [{ name: '10 kg de Aguacates', quantity: 1, price: 50000 }],
                        total: 50000,
                        date: '2025-06-28',
                        buyerId: 'user-current',
                        sellerId: 'user-seller-a'
                    },
                    {
                        id: 'o2',
                        status: 'En Proceso',
                        items: [{ name: '1 bulto de Maíz', quantity: 1, price: 80000 }, { name: '2 kg de Frijoles', quantity: 1, price: 15000 }],
                        total: 95000,
                        date: '2025-07-02',
                        buyerId: 'user-current',
                        sellerId: 'user-seller-b'
                    },
                    {
                        id: 'o3',
                        status: 'Cancelada',
                        items: [{ name: '5 kg de Tomates', quantity: 1, price: 20000 }],
                        total: 20000,
                        date: '2025-07-08',
                        buyerId: 'user-current',
                        sellerId: 'user-seller-c'
                    }
                ];

                // Filtra las órdenes si se necesita una lógica por userId, de lo contrario, muestra todas.
                // Por ahora, mostraremos todas las simuladas.
                setOrders(dummyOrders);

            } catch (err) {
                setError('Error desconocido al cargar tus órdenes.');
                console.error("Error fetching dummy orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]); // Dependencia del userId

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completada': return 'bg-green-100 text-green-800';
            case 'En Proceso': return 'bg-blue-100 text-blue-800';
            case 'Cancelada': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Mis Órdenes de Compra</h2>
            {loading && <p className="text-center text-gray-600">Cargando órdenes...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!loading && !error && orders.length === 0 && (
                <p className="text-center text-gray-600">No tienes órdenes en este momento.</p>
            )}

            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">Orden #{order.id.slice(1)}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-700 mb-1">
                            **Productos:** {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                        </p>
                        <p className="text-lg font-bold text-green-700 mb-3">
                            Total: COP {order.total.toLocaleString('es-CO')}
                        </p>
                        <p className="text-sm text-gray-500">Fecha: {order.date}</p>
                        {/* Puedes añadir un enlace para ver los detalles completos de la orden */}
                        {/* <Link to={`/order-details/${order.id}`} className="text-blue-600 hover:underline mt-2 inline-block">Ver detalles</Link> */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyOrdersPage;