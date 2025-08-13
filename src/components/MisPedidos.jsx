// src/components/MisPedidos.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TruckIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

const MisPedidos = () => {
    const { user } = useContext(AuthContext);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulamos la carga de datos de pedidos desde una API
    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                // Simulación de una llamada a la API
                setTimeout(() => {
                    // Datos simulados. En un caso real, reemplazarías esto con un fetch a tu backend.
                    const mockData = [
                        {
                            id: 'ped01',
                            products: ['10kg de Tomates', '5kg de Manzanas'],
                            total: 55000,
                            date: moment().subtract(5, 'days'),
                            status: 'Entregado',
                        },
                        {
                            id: 'ped02',
                            products: ['Lechugas', 'Zanahorias'],
                            total: 28000,
                            date: moment().subtract(2, 'weeks'),
                            status: 'En camino',
                        },
                        {
                            id: 'ped03',
                            products: ['20kg de Papas'],
                            total: 40000,
                            date: moment().subtract(1, 'month'),
                            status: 'Cancelado',
                        },
                    ];
                    setPedidos(mockData);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError("Hubo un error al cargar tus pedidos.");
                setLoading(false);
            }
        };

        if (user) {
            fetchPedidos();
        }
    }, [user]);

    if (!user) {
        return <div className="p-6 bg-white rounded-lg shadow-sm">Inicia sesión para ver tus pedidos.</div>;
    }

    if (loading) {
        return <div className="p-6 bg-white rounded-lg shadow-sm">Cargando pedidos...</div>;
    }

    if (error) {
        return <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-sm">{error}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Mis Órdenes y Compras</h2>
            
            {pedidos.length > 0 ? (
                <div className="space-y-4">
                    {pedidos.map((pedido) => (
                        <div key={pedido.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center border border-gray-200">
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-semibold text-gray-800 text-lg">Orden #{pedido.id}</h3>
                                <ul className="text-sm text-gray-500 list-disc list-inside">
                                    {pedido.products.map((product, index) => (
                                        <li key={index}>{product}</li>
                                    ))}
                                </ul>
                                <p className="text-xs text-gray-400 mt-1">Realizado hace {pedido.date.fromNow()}</p>
                            </div>
                            <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-4 flex items-center space-x-4">
                                <span className="font-semibold text-gray-700">${pedido.total.toLocaleString()} COP</span>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                    pedido.status === 'Entregado' ? 'bg-green-100 text-green-800' :
                                    pedido.status === 'En camino' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {pedido.status}
                                </span>
                                <button className="text-gray-500 hover:text-green-600 transition-colors">
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
