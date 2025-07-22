// src/components/Navbar.jsx

import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    FaSignInAlt, FaUser, FaSeedling, FaStore, FaHandshake, FaPlus, FaSignOutAlt,
    FaSun, FaBell, FaShoppingCart, FaExchangeAlt, FaListAlt, FaBox, FaWrench, FaBuilding
} from 'react-icons/fa';

// ⭐ Importa una imagen de perfil por defecto si no hay ninguna ⭐
// Puedes descargar una imagen genérica y colocarla en tu carpeta 'public' o 'src/assets'
// Por ejemplo, si la pones en 'src/assets/default-profile.png'
import defaultProfilePicture from '../assets/default-profile.png'; // Asegúrate de crear este archivo o ajustar la ruta

function Navbar() {
    const { isAuthenticated, isPremium, logout, cartItems, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [hoveredItem, setHoveredItem] = useState(null);

    const onLogout = () => {
        logout();
        navigate('/');
    };

    const totalCartItems = cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

    return (
        // ⭐ Clases añadidas: h-screen y overflow-y-auto ⭐
        <aside className="w-72 bg-gradient-to-b from-green-900 via-green-800 to-green-700 text-white h-screen p-6 shadow-xl fixed top-0 left-0 z-50 font-sans border-r-2 border-green-600 overflow-y-auto">
            <Link
                to="/"
                className="text-3xl font-bold mb-10 block text-lime-300 hover:text-yellow-300 transition transform hover:scale-105 duration-300 tracking-wide"
            >
                🌾 AgroApp
            </Link>

            {/* ⭐ Sección de perfil del usuario ⭐ */}
            {isAuthenticated && user && ( // Solo muestra si está autenticado y los datos de usuario están disponibles
                <div className="flex flex-col items-center mb-6 text-center">
                    <img
                        src={user.profilePicture || defaultProfilePicture} // Usa la imagen de perfil del usuario o una por defecto
                        alt="Foto de perfil"
                        className="w-24 h-24 rounded-full border-4 border-lime-300 object-cover shadow-lg mb-3" // Estilo circular
                    />
                    <h3 className="text-xl font-semibold text-white mb-1">
                        {user.name || 'Tu Canal'} {/* Muestra el nombre del usuario */}
                    </h3>
                    <p className="text-sm text-gray-300">
                        {user.email} {/* Muestra el email del usuario */}
                    </p>
                    <hr className="my-4 w-full border-green-500" /> {/* Separador */}
                </div>
            )}

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

export default Navbar;