// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import { FaSignInAlt, FaUser, FaSeedling, FaStore, FaHandshake, FaPlus, FaSignOutAlt, FaSun, FaBell, FaShoppingCart, FaExchangeAlt, FaListAlt } from 'react-icons/fa';

function Navbar() {
    const { isAuthenticated, user, isPremium, logout, cartItems } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/');
    };

    const totalCartItems = cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

    return (
        <header className="bg-green-800 text-white p-4 shadow-lg">
            <nav className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold font-lilita hover:text-green-200 transition">
                    AgroApp 🌾
                </Link>
                <ul className="flex space-x-6 items-center">
                    <li>
                        <Link to="/products" className="flex items-center hover:text-green-200 transition">
                            <FaStore className="mr-1" /> Productos
                        </Link>
                    </li>
                    <li>
                        <Link to="/services" className="flex items-center hover:text-green-200 transition">
                            <FaHandshake className="mr-1" /> Servicios
                        </Link>
                    </li>
                    <li>
                        <Link to="/rentals" className="flex items-center hover:text-green-200 transition">
                            <FaSun className="mr-1" /> Rentas
                        </Link>
                    </li>

                    {/* Enlaces para trueques, pedidos y notificaciones */}
                    <li>
                        <Link to="/my-barter-proposals" className="flex items-center hover:text-green-200 transition">
                            <FaExchangeAlt className="mr-1" /> Trueques
                        </Link>
                    </li>
                    <li>
                        <Link to="/my-orders" className="flex items-center hover:text-green-200 transition">
                            <FaListAlt className="mr-1" /> Pedidos
                        </Link>
                    </li>
                    <li>
                        <Link to="/notifications" className="flex items-center hover:text-green-200 transition">
                            <FaBell className="mr-1" /> Notificaciones
                        </Link>
                    </li>

                    {/* Enlace al Carrito con contador */}
                    <li>
                        <Link to="/cart" className="relative flex items-center hover:text-green-200 transition">
                            <FaShoppingCart className="mr-1" /> Carrito
                            {totalCartItems > 0 && (
                                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalCartItems}
                                </span>
                            )}
                        </Link>
                    </li>

                    {isAuthenticated ? (
                        <>
                            {/* ⭐ CAMBIO AQUÍ: Estos enlaces ahora son visibles para CUALQUIER usuario autenticado ⭐ */}
                            <li>
                                <Link to="/create-product" className="flex items-center hover:text-green-200 transition bg-green-700 px-3 py-1 rounded-full">
                                    <FaPlus className="mr-1" /> Ofrecer Producto
                                </Link>
                            </li>
                            <li>
                                <Link to="/create-service" className="flex items-center hover:text-green-200 transition bg-green-700 px-3 py-1 rounded-full">
                                    <FaPlus className="mr-1" /> Ofrecer Servicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/create-rental" className="flex items-center hover:text-green-200 transition bg-green-700 px-3 py-1 rounded-full">
                                    <FaPlus className="mr-1" /> Ofrecer Renta
                                </Link>
                            </li>
                            {isPremium && (
                                <>
                                    <li>
                                        <Link to="/premium-inventory" className="flex items-center hover:text-green-200 transition">
                                            <FaSeedling className="mr-1" /> Mi Inventario Premium
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <button onClick={onLogout} className="flex items-center hover:text-green-200 transition bg-red-600 px-3 py-1 rounded-full">
                                    <FaSignOutAlt className="mr-1" /> Salir
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="flex items-center hover:text-green-200 transition">
                                    <FaSignInAlt className="mr-1" /> Iniciar Sesión
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="flex items-center hover:text-green-200 transition">
                                    <FaUser className="mr-1" /> Registrarse
                                </Link>
                            </li>
                            <li>
                                <Link to="/premium-upsell" className="flex items-center hover:text-green-200 transition bg-yellow-500 text-green-900 px-3 py-1 rounded-full font-bold">
                                    🌟 Hazte Premium
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;