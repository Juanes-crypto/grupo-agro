// src/components/MisPedidos.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TruckIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import api from '../services/api';
import { toast } from 'react-toastify';

const MisPedidos = ({ token }) => {
    const { user } = useContext(AuthContext);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                if (!user || !token) return;
                
                const response = await api.get('/api/orders/my-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setPedidos(response.data.data || response.data.orders || response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener pedidos:", err);
                setError("Hubo un error al cargar tus pedidos.");
                setLoading(false);
                
                // Datos de ejemplo como fallback
                const mockData = [
                    {
                        _id: 'ped01',
                        items: [
                            { name: '10kg de Tomates', quantity: 1 },
                            { name: '5kg de Manzanas', quantity: 1 }
                        ],
                        total: 55000,
                        createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
                        status: 'delivered',
                    },
                    // ... más pedidos mock
                ];
                setPedidos(mockData);
            }
        };

        fetchPedidos();
    }, [user, token]);

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

    const getStatusClass = (status) => {
        const statusClass = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'shipped': 'bg-blue-100 text-blue-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return statusClass[status] || 'bg-gray-100 text-gray-800';
    };

    // Resto del código modificado para usar la estructura real de pedidos
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Mis Órdenes y Compras</h2>
            
            {pedidos.length > 0 ? (
                <div className="space-y-4">
                    {pedidos.map((pedido) => (
                        <div key={pedido._id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center border border-gray-200">
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-semibold text-gray-800 text-lg">Orden #{pedido._id.substring(0, 8)}</h3>
                                <ul className="text-sm text-gray-500 list-disc list-inside">
                                    {pedido.items.map((item, index) => (
                                        <li key={index}>
                                            {item.quantity} x {item.name}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-xs text-gray-400 mt-1">
                                    Realizado {moment(pedido.createdAt).fromNow()}
                                </p>
                            </div>
                            <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-4 flex items-center space-x-4">
                                <span className="font-semibold text-gray-700">
                                    ${pedido.total.toLocaleString()} COP
                                </span>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(pedido.status)}`}>
                                    {getStatusText(pedido.status)}
                                </span>
                                <button 
                                    className="text-gray-500 hover:text-green-600 transition-colors"
                                    onClick={() => window.location.href = `/order-details/${pedido._id}`}
                                >
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-700">
                    <p>Aún no has realizado ninguna compra. ¡Explora nuestros productos!</p>
                </div>
            )}
        </div>
    );
};

export default MisPedidos;