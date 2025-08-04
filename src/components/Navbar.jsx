import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { toast } from 'react-toastify';
import {
    ArrowRightIcon,
    ArrowLeftOnRectangleIcon,
    UserIcon,
    ShoppingCartIcon,
    BellIcon,
    PlusIcon,
    SparklesIcon,
    SunIcon,
    WrenchIcon,
    BuildingStorefrontIcon,
    BuildingOfficeIcon,
    ArrowsRightLeftIcon,
    ListBulletIcon,
    CubeIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';
import {
    ArrowRightIcon as ArrowRightSolid,
    ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleSolid,
    UserIcon as UserSolid,
    ShoppingCartIcon as ShoppingCartSolid,
    BellIcon as BellSolid,
    PlusIcon as PlusSolid,
    SparklesIcon as SparklesSolid,
    SunIcon as SunSolid,
    WrenchIcon as WrenchSolid,
    BuildingStorefrontIcon as BuildingStorefrontSolid,
    BuildingOfficeIcon as BuildingOfficeSolid,
    ArrowsRightLeftIcon as ArrowsRightLeftSolid,
    ListBulletIcon as ListBulletSolid,
    CubeIcon as CubeSolid,
    UserCircleIcon as UserCircleSolid
} from '@heroicons/react/24/solid';

import defaultProfilePicture from '../assets/default-profile.png';

function Navbar() {
    const { isAuthenticated, isPremium, logout, cartItems, user } = useContext(AuthContext);
    const { unreadCount } = useContext(NotificationContext);
    const navigate = useNavigate();
    const [hoveredItem, setHoveredItem] = useState(null);

    const onLogout = () => {
        logout();
        toast.success('Sesión cerrada con éxito');
        navigate('/');
    };

    const totalCartItems = cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-primary-800 to-primary-900 text-white shadow-2xl border-r border-primary-600/30 overflow-y-auto">
            {/* Logo */}
            <Link
                to="/"
                className="flex items-center px-6 py-8 gap-3 group"
            >
                <div className="relative">
                    <div className="absolute -inset-2 bg-primary-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                    <div className="relative bg-primary-500 text-white p-3 rounded-xl shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-200 to-primary-300">
                    AgroApp
                </h1>
            </Link>

            {/* User Profile */}
            {isAuthenticated && user && (
                <div className="px-6 pb-6">
                    <div className="flex items-center gap-4 bg-primary-700/30 backdrop-blur-sm p-4 rounded-xl border border-primary-500/20">
                        <img
                            src={user.profilePicture || defaultProfilePicture}
                            alt="Profile"
                            className="w-12 h-12 rounded-full border-2 border-primary-300 object-cover"
                        />
                        <div>
                            <h3 className="font-medium text-white">{user.name || 'Usuario'}</h3>
                            <p className="text-xs text-primary-200">{user.email}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="px-4 pb-8 space-y-1">
                {/* Products Section */}
                <div className="relative">
                    <SidebarLink 
                        to="/products" 
                        icon={<BuildingStorefrontIcon className="h-5 w-5" />}
                        activeIcon={<BuildingStorefrontSolid className="h-5 w-5" />}
                        onMouseEnter={() => setHoveredItem('products')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        Productos
                    </SidebarLink>
                    {isAuthenticated && hoveredItem === 'products' && (
                        <div className="ml-8 mt-1 space-y-1 animate-fadeIn">
                            <SidebarLink 
                                to="/my-products" 
                                icon={<CubeIcon className="h-4 w-4" />}
                                activeIcon={<CubeSolid className="h-4 w-4" />}
                                className="text-sm text-primary-200 hover:text-white"
                            >
                                Mis Productos
                            </SidebarLink>
                        </div>
                    )}
                </div>

                {/* Services Section */}
                <div className="relative">
                    <SidebarLink 
                        to="/services" 
                        icon={<WrenchIcon className="h-5 w-5" />}
                        activeIcon={<WrenchSolid className="h-5 w-5" />}
                        onMouseEnter={() => setHoveredItem('services')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        Servicios
                    </SidebarLink>
                    {isAuthenticated && hoveredItem === 'services' && (
                        <div className="ml-8 mt-1 space-y-1 animate-fadeIn">
                            <SidebarLink 
                                to="/my-services" 
                                icon={<WrenchIcon className="h-4 w-4" />}
                                activeIcon={<WrenchSolid className="h-4 w-4" />}
                                className="text-sm text-primary-200 hover:text-white"
                            >
                                Mis Servicios
                            </SidebarLink>
                        </div>
                    )}
                </div>

                {/* Rentals Section */}
                <div className="relative">
                    <SidebarLink 
                        to="/rentals" 
                        icon={<BuildingOfficeIcon className="h-5 w-5" />}
                        activeIcon={<BuildingOfficeSolid className="h-5 w-5" />}
                        onMouseEnter={() => setHoveredItem('rentals')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        Rentas
                    </SidebarLink>
                    {isAuthenticated && hoveredItem === 'rentals' && (
                        <div className="ml-8 mt-1 space-y-1 animate-fadeIn">
                            <SidebarLink 
                                to="/my-rentals" 
                                icon={<BuildingOfficeIcon className="h-4 w-4" />}
                                activeIcon={<BuildingOfficeSolid className="h-4 w-4" />}
                                className="text-sm text-primary-200 hover:text-white"
                            >
                                Mis Rentas
                            </SidebarLink>
                        </div>
                    )}
                </div>

                {/* Other Links */}
                <SidebarLink 
                    to="/my-barter-proposals" 
                    icon={<ArrowsRightLeftIcon className="h-5 w-5" />}
                    activeIcon={<ArrowsRightLeftSolid className="h-5 w-5" />}
                >
                    Permutas
                </SidebarLink>

                <SidebarLink 
                    to="/my-orders" 
                    icon={<ListBulletIcon className="h-5 w-5" />}
                    activeIcon={<ListBulletSolid className="h-5 w-5" />}
                >
                    Pedidos
                </SidebarLink>

                {/* Notifications */}
                {isAuthenticated && (
                    <SidebarLink 
                        to="/notifications" 
                        icon={<BellIcon className="h-5 w-5" />}
                        activeIcon={<BellSolid className="h-5 w-5" />}
                        badge={unreadCount > 0 ? unreadCount : null}
                    >
                        Notificaciones
                    </SidebarLink>
                )}

                {/* Cart */}
                <SidebarLink 
                    to="/cart" 
                    icon={<ShoppingCartIcon className="h-5 w-5" />}
                    activeIcon={<ShoppingCartSolid className="h-5 w-5" />}
                    badge={totalCartItems > 0 ? totalCartItems : null}
                >
                    Carrito
                </SidebarLink>

                <div className="pt-4">
                    <div className="border-t border-primary-600/30 my-4"></div>
                </div>

                {/* Create Links */}
                {isAuthenticated ? (
                    <>
                        <SidebarLink 
                            to="/create-product" 
                            icon={<PlusIcon className="h-5 w-5" />}
                            activeIcon={<PlusSolid className="h-5 w-5" />}
                            className="bg-primary-700/50 hover:bg-primary-700"
                        >
                            Nuevo Producto
                        </SidebarLink>

                        <SidebarLink 
                            to="/create-service" 
                            icon={<PlusIcon className="h-5 w-5" />}
                            activeIcon={<PlusSolid className="h-5 w-5" />}
                            className="bg-primary-700/50 hover:bg-primary-700"
                        >
                            Nuevo Servicio
                        </SidebarLink>

                        <SidebarLink 
                            to="/create-rental" 
                            icon={<PlusIcon className="h-5 w-5" />}
                            activeIcon={<PlusSolid className="h-5 w-5" />}
                            className="bg-primary-700/50 hover:bg-primary-700"
                        >
                            Nueva Renta
                        </SidebarLink>

                        {/* Premium */}
                        <SidebarLink 
                            to="/premium-inventory" 
                            icon={<SparklesIcon className="h-5 w-5" />}
                            activeIcon={<SparklesSolid className="h-5 w-5" />}
                            className="bg-gradient-to-r from-premium-600 to-premium-700 hover:from-premium-500 hover:to-premium-600 text-white"
                        >
                            Inventario Premium
                        </SidebarLink>

                        {!isPremium && (
                            <SidebarLink 
                                to="/premium-upsell" 
                                icon={<SparklesIcon className="h-5 w-5" />}
                                activeIcon={<SparklesSolid className="h-5 w-5" />}
                                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white shadow-lg"
                            >
                                Hazte Premium
                            </SidebarLink>
                        )}

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-300 hover:text-red-200 rounded-lg transition-colors duration-200"
                        >
                            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <>
                        <SidebarLink 
                            to="/login" 
                            icon={<ArrowRightIcon className="h-5 w-5" />}
                            activeIcon={<ArrowRightSolid className="h-5 w-5" />}
                        >
                            Iniciar Sesión
                        </SidebarLink>

                        <SidebarLink 
                            to="/register" 
                            icon={<UserIcon className="h-5 w-5" />}
                            activeIcon={<UserSolid className="h-5 w-5" />}
                        >
                            Registrarse
                        </SidebarLink>

                        <SidebarLink 
                            to="/premium-upsell" 
                            icon={<SparklesIcon className="h-5 w-5" />}
                            activeIcon={<SparklesSolid className="h-5 w-5" />}
                            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white shadow-lg"
                        >
                            Hazte Premium
                        </SidebarLink>
                    </>
                )}
            </nav>
        </aside>
    );
}

function SidebarLink({ to, icon, activeIcon, children, className = '', badge = null, ...props }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 relative group ${className}`}
            {...props}
        >
            <span className="text-primary-200 group-hover:text-white">
                {icon}
            </span>
            <span className="flex-1">{children}</span>
            {badge !== null && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {badge}
                </span>
            )}
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary-400 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
        </Link>
    );
}

export default Navbar;