import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, Cog6ToothIcon, BellIcon, HomeIcon, CurrencyDollarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import TopNavbar from '../components/TopNavbar';
import Navbar from '../components/Navbar';
import DashboardOverview from '../components/DashboardOverview'; // Componente de ejemplo
import MyProfileSettings from '../components/MyProfileSettings'; // Componente de ejemplo
// Importa los demás componentes para cada sección

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('overview'); // Estado para la sección activa

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return <DashboardOverview />;
            case 'profile':
                return <MyProfileSettings />;
            // Agrega más casos para cada sección que crees
            case 'notifications':
                return <div>Página de Notificaciones</div>;
            case 'orders':
                return <div>Historial de Órdenes</div>;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar de navegación del dashboard */}
            <aside className="w-64 bg-white p-6 shadow-md hidden md:block">
                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveSection('overview')}
                        className={`w-full text-left px-4 py-2 rounded-md transition duration-200 ${
                            activeSection === 'overview' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <HomeIcon className="h-5 w-5 inline-block mr-2" />
                        Vista General
                    </button>
                    <button
                        onClick={() => setActiveSection('profile')}
                        className={`w-full text-left px-4 py-2 rounded-md transition duration-200 ${
                            activeSection === 'profile' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <UserCircleIcon className="h-5 w-5 inline-block mr-2" />
                        Mi Perfil
                    </button>
                    {/* ... Más botones para cada sección ... */}
                    <button
                        onClick={() => setActiveSection('orders')}
                        className={`w-full text-left px-4 py-2 rounded-md transition duration-200 ${
                            activeSection === 'orders' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <ShoppingCartIcon className="h-5 w-5 inline-block mr-2" />
                        Mis Órdenes
                    </button>
                </nav>
            </aside>

            {/* Contenido principal del dashboard */}
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard de Usuario</h1>
                {renderContent()}
            </main>
        </div>
    );
};

export default ProfilePage;