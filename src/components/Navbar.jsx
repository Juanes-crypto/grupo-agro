// src/components/Navbar.jsx

import React, { useContext, useState } from 'react'; // Importa useState
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    FaSignInAlt, FaUser, FaSeedling, FaStore, FaHandshake, FaPlus, FaSignOutAlt,
    FaSun, FaBell, FaShoppingCart, FaExchangeAlt, FaListAlt, FaBox, FaWrench, FaBuilding
} from 'react-icons/fa';

function Navbar() { // Cambiado a Navbar
    const { isAuthenticated, isPremium, logout, cartItems } = useContext(AuthContext);
    const navigate = useNavigate();

    // Estado para controlar qué elemento está siendo hovereado
    const [hoveredItem, setHoveredItem] = useState(null);

    const onLogout = () => {
        logout();
        navigate('/');
    };

    const totalCartItems = cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

    return (
        <aside className="w-72 bg-gradient-to-b from-green-900 via-green-800 to-green-700 text-white min-h-screen p-6 shadow-xl fixed top-0 left-0 z-50 font-sans border-r-2 border-green-600">
            <Link
                to="/"
                className="text-3xl font-bold mb-10 block text-lime-300 hover:text-yellow-300 transition transform hover:scale-105 duration-300 tracking-wide"
            >
                🌾 AgroApp
            </Link>

            <nav className="flex flex-col space-y-4 text-[1.05rem]">
                {/* Navegación principal con efecto hover */}

                {/* Productos */}
                <div
                    onMouseEnter={() => setHoveredItem('products')}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative"
                >
                    <SidebarLink to="/products" icon={<FaStore />}>Productos</SidebarLink>
                    {isAuthenticated && hoveredItem === 'products' && (
                        <div className="pl-8 pt-2 pb-1 transition-all duration-300 ease-in-out">
                            <SidebarLink to="/my-products" icon={<FaBox />} className="text-sm font-light opacity-80 hover:opacity-100">Mis Productos</SidebarLink>
                        </div>
                    )}
                </div>

                {/* Servicios */}
                <div
                    onMouseEnter={() => setHoveredItem('services')}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative"
                >
                    <SidebarLink to="/services" icon={<FaHandshake />}>Servicios</SidebarLink>
                    {isAuthenticated && hoveredItem === 'services' && (
                        <div className="pl-8 pt-2 pb-1 transition-all duration-300 ease-in-out">
                            <SidebarLink to="/my-services" icon={<FaWrench />} className="text-sm font-light opacity-80 hover:opacity-100">Mis Servicios</SidebarLink>
                        </div>
                    )}
                </div>

                {/* Rentas */}
                <div
                    onMouseEnter={() => setHoveredItem('rentals')}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative"
                >
                    <SidebarLink to="/rentals" icon={<FaSun />}>Rentas</SidebarLink>
                    {isAuthenticated && hoveredItem === 'rentals' && (
                        <div className="pl-8 pt-2 pb-1 transition-all duration-300 ease-in-out">
                            <SidebarLink to="/my-rentals" icon={<FaBuilding />} className="text-sm font-light opacity-80 hover:opacity-100">Mis Rentas</SidebarLink>
                        </div>
                    )}
                </div>

                <SidebarLink to="/my-barter-proposals" icon={<FaExchangeAlt />}>Trueques</SidebarLink>
                <SidebarLink to="/my-orders" icon={<FaListAlt />}>Pedidos</SidebarLink>
                <SidebarLink to="/notifications" icon={<FaBell />}>Notificaciones</SidebarLink>

                {/* Carrito con contador */}
                <div className="relative">
                    <SidebarLink to="/cart" icon={<FaShoppingCart />}>Carrito</SidebarLink>
                    {totalCartItems > 0 && (
                        <span className="absolute top-0 left-28 bg-red-600 text-xs font-bold rounded-full px-2 py-1 animate-pulse">
                            {totalCartItems}
                        </span>
                    )}
                </div>

                <hr className="my-4 border-green-500" />

                {/* Acciones del usuario */}
                {isAuthenticated ? (
                    <>
                        {/* Las secciones "Mis..." ya no son enlaces directos aquí, sino sub-enlaces */}
                        {/* <SidebarLink to="/my-products" icon={<FaBox />}>Mis Productos</SidebarLink>
                        <SidebarLink to="/my-services" icon={<FaWrench />}>Mis Servicios</SidebarLink>
                        <SidebarLink to="/my-rentals" icon={<FaBuilding />}>Mis Rentas</SidebarLink>
                        <hr className="my-4 border-green-500" /> */}

                        <SidebarLink to="/create-product" icon={<FaPlus />}>Ofrecer Producto</SidebarLink>
                        <SidebarLink to="/create-service" icon={<FaPlus />}>Ofrecer Servicio</SidebarLink>
                        <SidebarLink to="/create-rental" icon={<FaPlus />}>Ofrecer Renta</SidebarLink>

                        {isPremium && (
                            <SidebarLink to="/premium-inventory" icon={<FaSeedling />}>Inventario Premium</SidebarLink>
                        )}
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-3 text-red-300 hover:text-red-400 transition transform hover:scale-105 duration-300 font-semibold"
                        >
                            <FaSignOutAlt /> Salir
                        </button>
                    </>
                ) : (
                    <>
                        <SidebarLink to="/login" icon={<FaSignInAlt />}>Iniciar Sesión</SidebarLink>
                        <SidebarLink to="/register" icon={<FaUser />}>Registrarse</SidebarLink>
                        <SidebarLink
                            to="/premium-upsell"
                            icon={null}
                            className="text-yellow-300 font-bold hover:text-yellow-400"
                        >
                            🌟 Hazte Premium
                        </SidebarLink>
                    </>
                )}
            </nav>
        </aside>
    );
}

function SidebarLink({ to, icon, children, className = '' }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-2 py-2 rounded-md hover:bg-green-600 transition duration-300 transform hover:scale-105 ${className}`}
        >
            {icon && <span className="text-lg">{icon}</span>}
            <span>{children}</span>
        </Link>
    );
}

export default Navbar; // Cambiado a Navbar
