import React, { useState, useContext, useEffect } from 'react'; // Importar hooks
import { Link } from 'react-router-dom';
import { UserCircleIcon, Cog6ToothIcon, CreditCardIcon, BellIcon, HomeIcon, ShoppingCartIcon, TagIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api'; // Importar api

// Importar los componentes hijos
import DashboardOverview from '../components/DashboardOverview';
import MisPublicaciones from '../components/MisPublicaciones';
import MisPedidos from '../components/MisPedidos';
import MisNotificaciones from '../components/MisNotificaciones';
// ⭐ REEMPLAZO: Usar el componente externo en lugar del local
import MyProfileSettings from '../components/MyProfileSettings'; 

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const { user, token } = useContext(AuthContext);

    // --- ⭐ INICIO: LÓGICA DE FETCHING CENTRALIZADA ⭐ ---
    const [dashboardData, setDashboardData] = useState({
        products: [],
        services: [],
        rentals: [],
        barterProposals: [],
        receivedOrders: [],
        notifications: []
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
                
                // Tu lógica de Promise.allSettled, ahora en el padre
                const [
                    productsResponse,
                    servicesResponse,
                    rentalsResponse,
                    barterResponse,
                    ordersResponse,
                    notificationsResponse // Añadimos notificaciones
                ] = await Promise.allSettled([
                    api.get('/api/products/my-products', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/api/services/my-services', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/api/rentals/my-rentals', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/api/barter/myproposals', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/api/orders/my-orders', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/api/notifications/my', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                // Tu función extractData (¡perfecta!)
                const extractData = (result) => {
                    if (result.status === 'fulfilled') {
                        const response = result.value;
                        if (response.data && response.data.success === true && Array.isArray(response.data.data)) return response.data.data;
                        if (response.data && Array.isArray(response.data.data)) return response.data.data;
                        if (Array.isArray(response.data)) return response.data;
                        if (response.data && typeof response.data === 'object') {
                            for (const key in response.data) {
                                if (Array.isArray(response.data[key])) return response.data[key];
                            }
                        }
                    }
                    console.warn('Fallo al extraer datos:', result.reason || 'Formato desconocido');
                    return [];
                };

                const productsData = extractData(productsResponse);
                const servicesData = extractData(servicesResponse);
                const rentalsData = extractData(rentalsResponse);
                const barterData = extractData(barterResponse);
                const ordersData = extractData(ordersResponse);
                const notificationsData = extractData(notificationsResponse);
                
                setDashboardData({
                    products: productsData,
                    services: servicesData,
                    rentals: rentalsData,
                    barterProposals: barterData,
                    receivedOrders: ordersData,
                    notifications: notificationsData
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
    // --- ⭐ FIN: LÓGICA DE FETCHING CENTRALIZADA ⭐ ---


    const renderContent = () => {
        // Pasamos los datos y el estado de carga a todos los hijos
        switch (activeSection) {
            case 'overview':
                return <DashboardOverview user={user} data={dashboardData} loading={loading} />;
            case 'profile':
                // ⭐ REEMPLAZO: Usamos el componente de settings
                return <MyProfileSettings />; 
            case 'publications':
                // ⭐ FIX: Ahora pasamos las props y el crash desaparece
                return <MisPublicaciones
                    products={dashboardData.products}
                    services={dashboardData.services}
                    rentals={dashboardData.rentals}
                    token={token}
                />;
            case 'orders':
                return <MisPedidos
                    pedidos={dashboardData.receivedOrders}
                    token={token}
                    loading={loading}
                />;
            case 'notifications':
                return <MisNotificaciones
                    notificaciones={dashboardData.notifications}
                    token={token}
                    loading={loading}
                />;
            case 'settings':
                // Puedes usar MyProfileSettings aquí también si "Configuración" y "Mi Perfil" son lo mismo
                // O crear un componente <Configuracion> separado
                return <MyProfileSettings />; // Usando MyProfileSettings para ambos
            default:
                return <DashboardOverview user={user} data={dashboardData} loading={loading} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar de navegación del dashboard */}
            <aside className="w-64 bg-white p-6 shadow-md hidden md:block">
                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveSection('overview')}
                        className={`w-full text-left px-4 py-2 rounded-md transition duration-200 flex items-center ${
                            activeSection === 'overview' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <HomeIcon className="h-5 w-5 mr-2" />
                        Vista General
                    </button>
                    <button
                        onClick={() => setActiveSection('profile')}
                        className={`w-full text-left px-4 py-2 rounded-md transition duration-200 flex items-center ${
                            activeSection === 'profile' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <UserCircleIcon className="h-5 w-5 mr-2" />
                        Mi Perfil
                    </button>
                    <button
                        onClick={() => setActiveSection('publications')}
                        className={`w-full text-left px-4 py-2 rounded-md transition duration-200 flex items-center ${
                            activeSection === 'publications' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <TagIcon className="h-5 w-5 mr-2" />
                        Mis Publicaciones
                    </button>
                    <button
                        onClick={() => setActiveSection('orders')}
                        className={`w-full text-left px-4 py-2 rounded-md transition duration-200 flex items-center ${
                            activeSection === 'orders' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Mis Órdenes
                    </button>
                    <button
                        onClick={() => setActiveSection('notifications')}
                        className={`w-full text-left px-4 py-2 rounded-md transition duration-200 flex items-center ${
                            activeSection === 'notifications' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <BellIcon className="h-5 w-5 mr-2" />
                        Notificaciones
                    </button>
                    {/* <button
                        onClick={() => setActiveSection('settings')}
                        className={`w-full text-left px-4 py-2 rounded-md transition duration-200 flex items-center ${
                            activeSection === 'settings' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Cog6ToothIcon className="h-5 w-5 mr-2" />
                        Configuración
                    </button> 
                    */}
                    
                    {/* ⭐ ELIMINADO: Link a Recibir Pagos ⭐ */}
                </nav>
            </aside>

            {/* Contenido principal del dashboard */}
            <main className="flex-1 p-8">
                {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Control</h1> 
                Quitamos el título duplicado, cada sección tendrá el suyo
                */}
                {loading ? (
                    <div className="text-center p-12">
                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
                         <p className="text-lg text-gray-700">Cargando datos del panel...</p>
                    </div>
                ) : renderContent()}
            </main>
        </div>
    );
};

export default ProfilePage;