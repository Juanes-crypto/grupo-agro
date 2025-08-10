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
} from "@heroicons/react/24/outline";

function TopNavbar() {
  const { isAuthenticated, user, cartItems } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();

  const totalCartItems = cartItems
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  // Generar breadcrumbs dinámicos
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];
    
    let accumulatedPath = "";
    paths.forEach((path, index) => {
      accumulatedPath += `/${path}`;
      const isLast = index === paths.length - 1;
      
      // Formatear el nombre para mostrar
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
        {/* Logo, breadcrumbs y navegación */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/images/AgroApp-logo.png"
              alt="AgroApp Logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
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
          )}

          {/* Botones de navegación */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              title="Atrás"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              title="Adelante"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="flex items-center space-x-2">
          {isAuthenticated && (
            <>
              <Link
                to="/create-product"
                className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Producto
              </Link>
              <Link
                to="/create-service"
                className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-green-50 text-green-700 hover:bg-green-100"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Servicio
              </Link>
              <Link
                to="/create-rental"
                className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Renta
              </Link>
            </>
          )}
        </div>

        {/* User actions */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && (
            <>
              <Link
                to="/notifications"
                className="p-1.5 relative rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="p-1.5 relative rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {totalCartItems}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* User profile */}
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
                className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
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
