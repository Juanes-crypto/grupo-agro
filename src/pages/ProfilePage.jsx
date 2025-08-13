// src/pages/ProfilePage.jsx
import React, { useState, useContext } from 'react';
import { UserCircleIcon, Cog6ToothIcon, BellIcon, HomeIcon, ShoppingCartIcon, TagIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';
import DashboardOverview from '../components/DashboardOverview';
import MisPublicaciones from '../components/MisPublicaciones';
import MisPedidos from '../components/MisPedidos';
import MisNotificaciones from '../components/MisNotificaciones';
import Configuracion from '../components/Configuracion'; // Nuevo componente para la configuración

// Un componente de ejemplo para la sección de Mi Perfil
const MiPerfil = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        console.log("Datos a actualizar:", formData);

        setTimeout(() => {
            setMessage('¡Perfil actualizado con éxito!');
            setUser({ ...user, ...formData });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Mi Perfil y Configuración</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
            {message && (
                <div className="mt-4 p-3 rounded-md bg-green-100 text-green-700">
                    {message}
                </div>
            )}
        </div>
    );
};

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const { user } = useContext(AuthContext);

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return <DashboardOverview />;
            case 'profile':
                return <MiPerfil />;
            case 'publications':
                return <MisPublicaciones />;
            case 'orders':
                return <MisPedidos />;
            case 'notifications':
                return <MisNotificaciones />;
            case 'settings':
                return <Configuracion />; // Ahora renderiza el componente de configuración
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
                    <button
                        onClick={() => setActiveSection('settings')}
                        className={`w-full text-left px-4 py-2 rounded-md transition duration-200 flex items-center ${
                            activeSection === 'settings' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Cog6ToothIcon className="h-5 w-5 mr-2" />
                        Configuración
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
