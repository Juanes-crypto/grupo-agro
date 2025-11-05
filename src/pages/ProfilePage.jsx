import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  HomeIcon,
  ShoppingCartIcon,
  TagIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

// Importar los componentes hijos
import DashboardOverview from '../components/DashboardOverview';
import MisPublicaciones from '../components/MisPublicaciones';
import MisPedidos from '../components/MisPedidos';
import MisNotificaciones from '../components/MisNotificaciones';
import MyProfileSettings from '../components/MyProfileSettings';

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    const navigationItems = [
        { id: 'overview', label: 'Vista General', icon: HomeIcon, color: 'text-blue-600' },
        { id: 'profile', label: 'Mi Perfil', icon: UserCircleIcon, color: 'text-purple-600' },
        { id: 'publications', label: 'Mis Publicaciones', icon: TagIcon, color: 'text-green-600' },
        { id: 'orders', label: 'Mis Órdenes', icon: ShoppingCartIcon, color: 'text-orange-600' },
        { id: 'notifications', label: 'Notificaciones', icon: BellIcon, color: 'text-red-600' },
    ];

    const handleSectionChange = (sectionId) => {
        setActiveSection(sectionId);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header con navegación móvil */}
            <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40 md:hidden">
                <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">CampoBit</h1>
                            <p className="text-xs text-gray-500">Panel de Control</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <XMarkIcon className="w-6 h-6 text-gray-600" />
                        ) : (
                            <Bars3Icon className="w-6 h-6 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-white/20 shadow-xl">
                        <nav className="px-4 py-4 space-y-1">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSectionChange(item.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3 ${
                                            activeSection === item.id
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-[1.02]'
                                                : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                                        }`}
                                    >
                                        <Icon className={`w-5 h-5 ${activeSection === item.id ? 'text-white' : item.color}`} />
                                        <span className="font-medium">{item.label}</span>
                                        {activeSection === item.id && (
                                            <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </header>

            <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="hidden md:flex w-80 bg-white/80 backdrop-blur-lg border-r border-white/20 min-h-screen sticky top-0">
                    <div className="flex flex-col w-full p-8">
                        {/* Logo y título */}
                        <div className="mb-8">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <SparklesIcon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">CampoBit</h1>
                                    <p className="text-sm text-gray-500">Panel Profesional</p>
                                </div>
                            </div>

                            {/* User info card */}
                            {user && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100/50">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                            {user.profilePicture ? (
                                                <img
                                                    src={user.profilePicture}
                                                    alt="Perfil"
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            ) : (
                                                <UserCircleIcon className="w-6 h-6 text-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {user.name || 'Usuario'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        {user.isPremium && (
                                            <div className="flex-shrink-0">
                                                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                                    <SparklesIcon className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSectionChange(item.id)}
                                        className={`group w-full text-left px-4 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-4 relative overflow-hidden ${
                                            activeSection === item.id
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl transform scale-[1.02]'
                                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-lg hover:transform hover:scale-[1.01]'
                                        }`}
                                    >
                                        {/* Background decoration */}
                                        <div className={`absolute inset-0 opacity-10 ${
                                            activeSection === item.id
                                                ? 'bg-white'
                                                : 'bg-gradient-to-r from-gray-100 to-blue-100'
                                        }`}></div>

                                        {/* Icon */}
                                        <div className={`relative z-10 p-2 rounded-xl ${
                                            activeSection === item.id
                                                ? 'bg-white/20'
                                                : 'bg-gray-100 group-hover:bg-blue-100'
                                        }`}>
                                            <Icon className={`w-5 h-5 ${
                                                activeSection === item.id ? 'text-white' : item.color
                                            }`} />
                                        </div>

                                        {/* Label */}
                                        <span className={`relative z-10 font-medium ${
                                            activeSection === item.id ? 'text-white' : 'text-gray-700'
                                        }`}>
                                            {item.label}
                                        </span>

                                        {/* Active indicator */}
                                        {activeSection === item.id && (
                                            <div className="relative z-10 ml-auto">
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            </div>
                                        )}

                                        {/* Hover effect */}
                                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200/50">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-2">Versión 2.0</p>
                                <div className="flex items-center justify-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-gray-600">Sistema operativo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-h-screen">
                    <div className="p-4 md:p-8 lg:p-12">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
                                </div>
                                <p className="mt-6 text-lg font-medium text-gray-700">Cargando tu panel...</p>
                                <p className="mt-2 text-sm text-gray-500">Preparando una experiencia excepcional</p>
                            </div>
                        ) : (
                            <div className="max-w-7xl mx-auto">
                                {renderContent()}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;