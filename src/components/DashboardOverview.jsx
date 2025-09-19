import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import MisPublicaciones from './MisPublicaciones';
import MisPedidos from './MisPedidos';
import MisNotificaciones from './MisNotificaciones';
import api from '../services/api';
import { toast } from "react-toastify";

const DashboardOverview = () => {
    const { user, token } = useContext(AuthContext);

    const [stats, setStats] = useState({
        activeListings: 0,
        barterProposals: 0,
        receivedOrders: 0,
        products: [],
        services: [],
        rentals: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user || !token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const [
                    productsResponse,
                    servicesResponse,
                    rentalsResponse,
                    barterResponse,
                    ordersResponse
                ] = await Promise.allSettled([
                    api.get('/api/products/my-products', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/api/services/my-services', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/api/rentals/my-rentals', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/api/barter/myproposals', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/api/orders/my-orders', { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                // ⭐⭐ FUNCIÓN MEJORADA PARA EXTRAER DATOS ⭐⭐
                const extractData = (result) => {
                    if (result.status === 'fulfilled') {
                        const response = result.value;
                        
                        console.log('🔍 Response data:', response.data); // Para debug
                        
                        // Estructura: { success: true, data: [...] }
                        if (response.data && response.data.success === true && Array.isArray(response.data.data)) {
                            return response.data.data;
                        }
                        // Estructura: { data: [...] } (sin success property)
                        if (response.data && Array.isArray(response.data.data)) {
                            return response.data.data;
                        }
                        // Estructura: array directo
                        if (Array.isArray(response.data)) {
                            return response.data;
                        }
                        // Estructura: { products: [...] }, { services: [...] }, etc.
                        if (response.data && typeof response.data === 'object') {
                            for (const key in response.data) {
                                if (Array.isArray(response.data[key])) {
                                    return response.data[key];
                                }
                            }
                        }
                    }
                    return [];
                };

                const productsData = extractData(productsResponse);
                const servicesData = extractData(servicesResponse);
                const rentalsData = extractData(rentalsResponse);
                const barterData = extractData(barterResponse);
                const ordersData = extractData(ordersResponse);

                console.log('📊 Extracted data:', {
                    products: productsData,
                    services: servicesData,
                    rentals: rentalsData,
                    barter: barterData,
                    orders: ordersData
                });

                setStats({
                    activeListings: productsData.length + servicesData.length + rentalsData.length,
                    barterProposals: barterData.length,
                    receivedOrders: ordersData.length,
                    products: productsData,
                    services: servicesData,
                    rentals: rentalsData
                });

            } catch (error) {
                console.error("Error al obtener datos del dashboard:", error);
                toast.error("Error al cargar tus datos del dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, token]);

    const quickStats = [
        { label: "Publicaciones Activas", value: stats.activeListings },
        { label: "Propuestas de Trueque", value: stats.barterProposals },
        { label: "Órdenes Recibidas", value: stats.receivedOrders },
        { label: "Reputación", value: user?.reputation ? `${user.reputation} / 5` : 'Próximamente' },
    ];

    if (loading) {
        return <div className="text-center p-8">Cargando datos del dashboard...</div>;
    }

    return (
        <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
            {/* Sección de Bienvenida y Estadísticas */}
            <div className="bg-white rounded-lg p-6 shadow-md flex flex-col sm:flex-row items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        ¡Hola de nuevo, {user?.name || 'Usuario'}!
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Aquí tienes un resumen rápido de tu actividad en CampoBit.
                    </p>
                </div>
                {user?.profilePicture && (
                    <img
                        src={user.profilePicture}
                        alt="Foto de perfil"
                        className="w-20 h-20 rounded-full object-cover mt-4 sm:mt-0 sm:ml-4 border-2 border-green-500"
                    />
                )}
            </div>

            {/* Estadísticas Rápidas */}
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Estadísticas Rápidas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickStats.map((stat, index) => (
                        <div key={index} className="bg-green-100 p-4 rounded-lg shadow-sm text-center">
                            <p className="text-3xl font-bold text-green-700">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="my-8 border-gray-200" />


            {/* Contenedor principal de las secciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Notificaciones */}
                <div className="lg:col-span-1">
                    <MisNotificaciones token={token} />
                </div>

                {/* Publicaciones y Pedidos */}
                <div className="lg:col-span-1 space-y-8">
                    <MisPublicaciones
                        products={stats.products}
                        services={stats.services}
                        rentals={stats.rentals}
                        token={token}
                    />
                    <MisPedidos token={token} />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;