import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Asegúrate de que los íconos de FontAwesome estén instalados:
// npm install react-icons
import { FaSignInAlt, FaUser, FaSeedling, FaStore, FaHandshake, FaPlus, FaSignOutAlt, FaSun, FaTachometerAlt, FaBell, FaShoppingCart, FaExchangeAlt, FaListAlt } from 'react-icons/fa';

function Navbar() {
    const { isAuthenticated, user, isPremium, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/');
    };

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

                    {isAuthenticated ? (
                        <>
                            {/* ELIMINAR/COMENTAR ESTE ENLACE */}
                            {/* <li>
                                <Link to="/dashboard" className="flex items-center hover:text-green-200 transition">
                                    <FaTachometerAlt className="mr-1" /> Dashboard
                                </Link>
                            </li> */}
                            <li>
                                <Link to="/my-barter-proposals" className="flex items-center hover:text-green-200 transition">
                                    <FaExchangeAlt className="mr-1" /> Mis Trueques
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-orders" className="flex items-center hover:text-green-200 transition">
                                    <FaListAlt className="mr-1" /> Mis Órdenes
                                </Link>
                            </li>
                            <li>
                                <Link to="/notifications" className="flex items-center hover:text-green-200 transition">
                                    <FaBell className="mr-1" /> Notificaciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="flex items-center hover:text-green-200 transition">
                                    <FaShoppingCart className="mr-1" /> Carrito
                                </Link>
                            </li>
                            {isPremium && (
                                <>
                                    <li>
                                        <Link to="/premium-inventory" className="flex items-center hover:text-green-200 transition">
                                            <FaSeedling className="mr-1" /> Mi Inventario Premium
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/create-service" className="flex items-center hover:text-green-200 transition bg-green-700 px-3 py-1 rounded-full">
                                            <FaPlus className="mr-1" /> Ofrecer Servicio
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/create-product" className="flex items-center hover:text-green-200 transition bg-green-700 px-3 py-1 rounded-full">
                                            <FaPlus className="mr-1" /> Ofrecer Producto
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/create-rental" className="flex items-center hover:text-green-200 transition bg-green-700 px-3 py-1 rounded-full">
                                            <FaPlus className="mr-1" /> Ofrecer Renta
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