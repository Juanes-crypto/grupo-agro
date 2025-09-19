import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  BellIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  ChevronRightIcon,
  HomeIcon,
  Bars3Icon,
  InformationCircleIcon // Añadido para el enlace "Conócenos"
} from "@heroicons/react/24/outline";

function TopNavbar({ onMenuClick }) {
  const { isAuthenticated, user, cartItems } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();

  const totalCartItems = cartItems
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const generateBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];
    
    let accumulatedPath = "";
    paths.forEach((path, index) => {
      accumulatedPath += `/${path}`;
      const isLast = index === paths.length - 1;
      
      let displayName = path;
      if (path === "create-product") displayName = "Crear producto";
      else if (path === "create-service") displayName = "Crear servicio";
      else if (path === "create-rental") displayName = "Crear renta";
      else if (path === "products") displayName = "Productos";
      else if (path === "services") displayName = "Servicios";
      else if (path === "rentals") displayName = "Rentas";
      else if (path === "cart") displayName = "Carrito";
      else if (path === "profile") displayName = "Perfil";
      else if (path === "notifications") displayName = "Notificaciones";
      else if (path === "nosotros") displayName = "Conócenos"; // Nuevo
      else displayName = path.split("-").map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" ");

      breadcrumbs.push({
        path: accumulatedPath,
        name: displayName,
        isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-stone-50 shadow-sm border-b border-amber-200 md:ml-64">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Parte izquierda - Menú y logo */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Menú hamburguesa */}
          <button
            onClick={onMenuClick}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 md:hidden"
            aria-label="Abrir menú"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/images/CampoBit-logo.png"
              alt="CampoBit Logo"
              className="h-8 w-auto"
              />
          </Link>

          {/* Breadcrumbs - Versión móvil con scroll horizontal */}
          {breadcrumbs.length > 0 && (
            <div className="relative flex-1 max-w-xs md:max-w-none">
              <div className="md:hidden absolute inset-0 flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="flex items-center text-sm text-gray-600 space-x-2 px-2">
                  <Link to="/" className="text-green-600 hover:text-green-700">
                    <HomeIcon className="h-4 w-4" />
                  </Link>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                      <ChevronRightIcon className="h-3 w-3 mx-1 text-gray-400 flex-shrink-0" />
                      {crumb.isLast ? (
                        <span className="text-gray-800 font-medium">{crumb.name}</span>
                      ) : (
                        <Link 
                          to={crumb.path} 
                          className="text-green-600 hover:text-green-700 hover:underline"
                        >
                          {crumb.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Breadcrumbs - Versión desktop */}
              <div className="hidden md:flex items-center text-sm text-gray-600">
                <Link to="/" className="text-green-600 hover:text-green-700">
                  <HomeIcon className="h-4 w-4" />
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <ChevronRightIcon className="h-3 w-3 mx-2 text-gray-400" />
                    {crumb.isLast ? (
                      <span className="text-gray-800 font-medium">{crumb.name}</span>
                    ) : (
                      <Link 
                        to={crumb.path} 
                        className="text-green-600 hover:text-green-700 hover:underline"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Parte central - Acciones rápidas (scroll horizontal en móviles) */}
        <div className="flex-1 mx-2 md:mx-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center justify-center space-x-2 min-w-max">
              <>
                <Link
                  to="/create-product"
                  className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 whitespace-nowrap"
                >
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Producto
                </Link>
                <Link
                  to="/create-service"
                  className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-green-50 text-green-700 hover:bg-green-100 whitespace-nowrap"
                >
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Servicio
                </Link>
                <Link
                  to="/create-rental"
                  className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 whitespace-nowrap"
                >
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Renta
                </Link>
                
                <Link
                  to="/nosotros"
                  className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 whitespace-nowrap"
                >
                  <InformationCircleIcon className="h-4 w-4 mr-1.5" />
                  Conócenos
                </Link>
              </>
          </div>
        </div>

        {/* Parte derecha - Acciones de usuario */}
        <div className="flex items-center space-x-2 md:space-x-3">

          {isAuthenticated && (
            <>
              <Link
                to="/notifications"
                className="p-1.5 relative rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                aria-label="Notificaciones"
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="p-1.5 relative rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                aria-label="Carrito"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {totalCartItems > 9 ? "9+" : totalCartItems}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Perfil de usuario */}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-full"
              title={user?.email}
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-700 hidden md:inline">
                {user?.name || "Mi cuenta"}
              </span>
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 whitespace-nowrap"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 whitespace-nowrap"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;