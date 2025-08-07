import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import { toast } from "react-toastify";
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
  UserCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
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
  UserCircleIcon as UserCircleSolid,
  ChevronRightIcon as ChevronRightSolid,
} from "@heroicons/react/24/solid";

import defaultProfilePicture from "../assets/default-profile.png";

function Navbar() {
  const { isAuthenticated, isPremium, logout, cartItems, user } =
    useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const onLogout = () => {
    logout();
    toast.success("Sesión cerrada con éxito");
    navigate("/");
  };

  const totalCartItems = cartItems
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-green-800 to-green-900 text-white shadow-2xl border-r border-amber-100/10 overflow-y-auto">
      {/* Logo */}
      <Link to="/" className="flex items-center px-6 py-8 gap-3 group">
        {/* Contenedor del logo con efectos */}
        <div className="relative">
          {/* Efecto de resplandor */}
          <div className="absolute -inset-2 bg-amber-200/10 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>

          {/* Logo personalizado */}
          <img
            src="/AgroApp-logo.png"
            alt="AgroApp Logo"
            className="relative h-12 w-auto object-contain"
          />
        </div>

        {/* Texto del logo */}
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-300">
          AgroApp
        </h1>
      </Link>

      {/* User Profile */}
      {isAuthenticated && user && (
        <div className="px-6 pb-6">
          <div className="flex items-center gap-4 bg-green-700/30 backdrop-blur-sm p-4 rounded-xl border border-amber-100/20">
            <img
              src={user.profilePicture || defaultProfilePicture}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-amber-200/50 object-cover"
            />
            <div>
              <h3 className="font-medium text-white">
                {user.name || "Usuario"}
              </h3>
              <p className="text-xs text-amber-100/80">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="px-4 pb-8 space-y-1">
        {/* Products Section */}
        <div
          className="relative group"
          onMouseEnter={() => setHoveredItem("products")}
          onMouseLeave={() =>
            hoveredItem === "products" && setHoveredItem(null)
          }
        >
          <SidebarLink
            to="/products"
            icon={<BuildingStorefrontIcon className="h-5 w-5" />}
            activeIcon={<BuildingStorefrontSolid className="h-5 w-5" />}
            className="group-hover:bg-green-700/20 transition-colors duration-200"
          >
            Productos
            <ChevronRightIcon className="ml-auto h-4 w-4 text-amber-200/70 group-hover:rotate-90 transition-transform" />
          </SidebarLink>

          {/* Submenú con "puente" invisible para mejor UX */}
          {isAuthenticated && (
            <div className={`absolute left-full top-0 h-full w-4`}></div>
          )}

          {isAuthenticated && hoveredItem === "products" && (
            <div className="ml-6 pl-2 mt-1 space-y-1 border-l-2 border-amber-100/20">
              <SidebarLink
                to="/my-products"
                icon={<CubeIcon className="h-4 w-4" />}
                activeIcon={<CubeSolid className="h-4 w-4" />}
                className="text-sm bg-green-900/50 hover:bg-green-800/50 rounded-r-lg -ml-2 pl-4 pr-3 py-2 transition-all"
                onMouseEnter={() => setHoveredItem("products")}
              >
                Mis Productos
              </SidebarLink>
            </div>
          )}
        </div>

        {/* Services Section */}
        <div
          className="relative group"
          onMouseEnter={() => setHoveredItem("services")}
          onMouseLeave={() =>
            hoveredItem === "services" && setHoveredItem(null)
          }
        >
          <SidebarLink
            to="/services"
            icon={<WrenchIcon className="h-5 w-5" />}
            activeIcon={<WrenchSolid className="h-5 w-5" />}
            className="group-hover:bg-green-700/20 transition-colors duration-200"
          >
            Servicios
            <ChevronRightIcon className="ml-auto h-4 w-4 text-amber-200/70 group-hover:rotate-90 transition-transform" />
          </SidebarLink>

          {isAuthenticated && (
            <div className={`absolute left-full top-0 h-full w-4`}></div>
          )}

          {isAuthenticated && hoveredItem === "services" && (
            <div className="ml-6 pl-2 mt-1 space-y-1 border-l-2 border-amber-100/20">
              <SidebarLink
                to="/my-services"
                icon={<WrenchIcon className="h-4 w-4" />}
                activeIcon={<WrenchSolid className="h-4 w-4" />}
                className="text-sm bg-green-900/50 hover:bg-green-800/50 rounded-r-lg -ml-2 pl-4 pr-3 py-2 transition-all"
                onMouseEnter={() => setHoveredItem("services")}
              >
                Mis Servicios
              </SidebarLink>
            </div>
          )}
        </div>

        {/* Rentals Section */}
        <div
          className="relative group"
          onMouseEnter={() => setHoveredItem("rentals")}
          onMouseLeave={() => hoveredItem === "rentals" && setHoveredItem(null)}
        >
          <SidebarLink
            to="/rentals"
            icon={<BuildingOfficeIcon className="h-5 w-5" />}
            activeIcon={<BuildingOfficeSolid className="h-5 w-5" />}
            className="group-hover:bg-green-700/20 transition-colors duration-200"
          >
            Rentas
            <ChevronRightIcon className="ml-auto h-4 w-4 text-amber-200/70 group-hover:rotate-90 transition-transform" />
          </SidebarLink>

          {isAuthenticated && (
            <div className={`absolute left-full top-0 h-full w-4`}></div>
          )}

          {isAuthenticated && hoveredItem === "rentals" && (
            <div className="ml-6 pl-2 mt-1 space-y-1 border-l-2 border-amber-100/20">
              <SidebarLink
                to="/my-rentals"
                icon={<BuildingOfficeIcon className="h-4 w-4" />}
                activeIcon={<BuildingOfficeSolid className="h-4 w-4" />}
                className="text-sm bg-green-900/50 hover:bg-green-800/50 rounded-r-lg -ml-2 pl-4 pr-3 py-2 transition-all"
                onMouseEnter={() => setHoveredItem("rentals")}
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
          <div className="border-t border-amber-100/20 my-4"></div>
        </div>
        
        {/* Create Links */}
        {isAuthenticated ? (
          <>
            <SidebarLink
              to="/create-product"
              icon={<PlusIcon className="h-5 w-5" />}
              activeIcon={<PlusSolid className="h-5 w-5" />}
              className="bg-green-700/50 hover:bg-green-700"
            >
              Nuevo Producto
            </SidebarLink>

            <SidebarLink
              to="/create-service"
              icon={<PlusIcon className="h-5 w-5" />}
              activeIcon={<PlusSolid className="h-5 w-5" />}
              className="bg-green-700/50 hover:bg-green-700"
            >
              Nuevo Servicio
            </SidebarLink>

            <SidebarLink
              to="/create-rental"
              icon={<PlusIcon className="h-5 w-5" />}
              activeIcon={<PlusSolid className="h-5 w-5" />}
              className="bg-green-700/50 hover:bg-green-700"
            >
              Nueva Renta
            </SidebarLink>

            {/* Premium */}
            <SidebarLink
              to="/premium-inventory"
              icon={<SparklesIcon className="h-5 w-5" />}
              activeIcon={<SparklesSolid className="h-5 w-5" />}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white"
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
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-amber-300 hover:text-amber-200 rounded-lg transition-colors duration-200"
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

function SidebarLink({
  to,
  icon,
  activeIcon,
  children,
  className = "",
  badge = null,
  ...props
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 relative group ${className}`}
      {...props}
    >
      <span className="text-amber-200/80 group-hover:text-white">{icon}</span>
      <span className="flex-1">{children}</span>
      {badge !== null && (
        <span className="bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {badge}
        </span>
      )}
      <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
    </Link>
  );
}

export default Navbar;