import React, { useState } from 'react';
import { UserCircleIcon, Cog6ToothIcon, BellIcon, HomeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('overview'); // Estado para la sección activa

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Vista General del Perfil</h2>
                        <p>Aquí verás un resumen de tu actividad reciente, pedidos y notificaciones.</p>
                        {/* Aquí puedes agregar las tarjetas de resumen */}
                    </div>
                );
            case 'profile':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Mi Perfil y Configuración</h2>
                        <p>Edita tu información personal, cambia tu contraseña y gestiona tus direcciones.</p>
                        {/* Aquí irán los formularios para editar */}
                    </div>
                );
            case 'orders':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Mis Órdenes y Compras</h2>
                        <p>Consulta el historial de tus pedidos simulados.</p>
                        {/* Aquí se listarán los pedidos */}
                    </div>
                );
            case 'publications':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Mis Publicaciones</h2>
                        <p>Gestiona todos tus productos, servicios y rentas publicadas.</p>
                        {/* Aquí irán las pestañas para gestionar publicaciones */}
                    </div>
                );
            default:
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Vista General del Perfil</h2>
                        <p>Bienvenido de nuevo. Elige una opción del menú lateral.</p>
                    </div>
                );
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
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Mis Publicaciones
                    </button>
                     <button
                        onClick={() => setActiveSection('orders')}
                        className={`w-full text-left px-4 py-2 rounded-md transition duration-200 flex items-center ${
                            activeSection === 'orders' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Cog6ToothIcon className="h-5 w-5 mr-2" />
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
