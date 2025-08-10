import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import { toast } from "react-toastify";
import {
  UserCircleIcon,
  ShoppingCartIcon,
  BellIcon,
  PlusIcon,
  SparklesIcon,
  WrenchIcon,
  BuildingStorefrontIcon,
  BuildingOfficeIcon,
  ArrowsRightLeftIcon,
  ListBulletIcon,
  CubeIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function Navbar() {
  const { isAuthenticated, isPremium, logout, cartItems } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    products: false,
    services: false,
    rentals: false
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onLogout = () => {
    logout();
    toast.success("Sesión cerrada con éxito");
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const totalCartItems = cartItems
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  useEffect(() => {
    // Cerrar el menú móvil al cambiar de ruta
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [navigate]);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Botón de hamburguesa visible solo en móviles */}
      <div className="fixed top-0 left-0 z-40 p-4 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white bg-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Overlay para móviles */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={closeMenu}
        ></div>
      )}

      {/* Barra lateral */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-green-800 to-green-900 text-white shadow-2xl border-r border-amber-100/10 overflow-y-auto pt-16
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:block`}
      >
        <div className="md:hidden p-4 text-right">
          <button
            onClick={closeMenu}
            className="p-2 text-white rounded-md hover:bg-green-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4 space-y-1">
          {/* Main Sections with collapsible functionality */}
          <div className="space-y-1">
            {/* Products Section */}
            <div>
              <button
                onClick={() => toggleSection('products')}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-green-700/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BuildingStorefrontIcon className="h-5 w-5 text-amber-200/80" />
                  <span>Productos</span>
                </div>
                <ChevronDownIcon className={`h-4 w-4 text-amber-200/70 transition-transform ${expandedSections.products ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedSections.products && (
                <div className="ml-2 pl-6 mt-1 space-y-1 border-l-2 border-amber-100/20">
                  <SidebarLink to="/products" icon={<BuildingStorefrontIcon className="h-4 w-4" />} onClick={closeMenu}>
                    Todos los productos
                  </SidebarLink>
                  {isAuthenticated && (
                    <SidebarLink to="/my-products" icon={<CubeIcon className="h-4 w-4" />} onClick={closeMenu}>
                      Mis productos
                    </SidebarLink>
                  )}
                  {isAuthenticated && (
                    <SidebarLink 
                      to="/create-product" 
                      icon={<PlusIcon className="h-4 w-4" />}
                      className="bg-green-700/50 hover:bg-green-700"
                      onClick={closeMenu}
                    >
                      Crear producto
                    </SidebarLink>
                  )}
                </div>
              )}
            </div>

            {/* Services Section */}
            <div>
              <button
                onClick={() => toggleSection('services')}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-green-700/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <WrenchIcon className="h-5 w-5 text-amber-200/80" />
                  <span>Servicios</span>
                </div>
                <ChevronDownIcon className={`h-4 w-4 text-amber-200/70 transition-transform ${expandedSections.services ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedSections.services && (
                <div className="ml-2 pl-6 mt-1 space-y-1 border-l-2 border-amber-100/20">
                  <SidebarLink to="/services" icon={<WrenchIcon className="h-4 w-4" />} onClick={closeMenu}>
                    Todos los servicios
                  </SidebarLink>
                  {isAuthenticated && (
                    <SidebarLink to="/my-services" icon={<WrenchIcon className="h-4 w-4" />} onClick={closeMenu}>
                      Mis servicios
                    </SidebarLink>
                  )}
                  {isAuthenticated && (
                    <SidebarLink 
                      to="/create-service" 
                      icon={<PlusIcon className="h-4 w-4" />}
                      className="bg-green-700/50 hover:bg-green-700"
                      onClick={closeMenu}
                    >
                      Crear servicio
                    </SidebarLink>
                  )}
                </div>
              )}
            </div>

            {/* Rentals Section */}
            <div>
              <button
                onClick={() => toggleSection('rentals')}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-green-700/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-amber-200/80" />
                  <span>Rentas</span>
                </div>
                <ChevronDownIcon className={`h-4 w-4 text-amber-200/70 transition-transform ${expandedSections.rentals ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedSections.rentals && (
                <div className="ml-2 pl-6 mt-1 space-y-1 border-l-2 border-amber-100/20">
                  <SidebarLink to="/rentals" icon={<BuildingOfficeIcon className="h-4 w-4" />} onClick={closeMenu}>
                    Todas las rentas
                  </SidebarLink>
                  {isAuthenticated && (
                    <SidebarLink to="/my-rentals" icon={<BuildingOfficeIcon className="h-4 w-4" />} onClick={closeMenu}>
                      Mis rentas
                    </SidebarLink>
                  )}
                  {isAuthenticated && (
                    <SidebarLink 
                      to="/create-rental" 
                      icon={<PlusIcon className="h-4 w-4" />}
                      className="bg-green-700/50 hover:bg-green-700"
                      onClick={closeMenu}
                    >
                      Crear renta
                    </SidebarLink>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Other Important Links */}
          <div className="pt-2">
            <SidebarLink 
              to="/my-barter-proposals" 
              icon={<ArrowsRightLeftIcon className="h-5 w-5" />}
              badge={isAuthenticated ? 3 : null} // Ejemplo de badge para propuestas nuevas
              onClick={closeMenu}
            >
              Permutas
            </SidebarLink>
            
            <SidebarLink 
              to="/my-orders" 
              icon={<ListBulletIcon className="h-5 w-5" />}
              onClick={closeMenu}
            >
              Mis Pedidos
            </SidebarLink>
            
            {isAuthenticated && (
              <SidebarLink 
                to="/notifications" 
                icon={<BellIcon className="h-5 w-5" />}
                badge={unreadCount > 0 ? unreadCount : null}
                onClick={closeMenu}
              >
                Notificaciones
              </SidebarLink>
            )}
            
            <SidebarLink 
              to="/cart" 
              icon={<ShoppingCartIcon className="h-5 w-5" />}
              badge={totalCartItems > 0 ? totalCartItems : null}
              onClick={closeMenu}
            >
              Mi Carrito
            </SidebarLink>
          </div>

          {/* Premium Section */}
          <div className="pt-4">
            <div className="border-t border-amber-100/20 my-2"></div>
            
            {isPremium ? (
              <SidebarLink
                to="/premium-inventory"
                icon={<SparklesIcon className="h-5 w-5" />}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white"
                onClick={closeMenu}
              >
                Beneficios Premium
              </SidebarLink>
            ) : (
              <SidebarLink
                to="/premium-upsell"
                icon={<SparklesIcon className="h-5 w-5" />}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white shadow-lg"
                onClick={closeMenu}
              >
                Hazte Premium
              </SidebarLink>
            )}
          </div>

          {/* User Actions */}
          <div className="pt-2">
            {isAuthenticated ? (
              <SidebarLink 
                to="/profile" 
                icon={<UserCircleIcon className="h-5 w-5" />}
                onClick={closeMenu}
              >
                Mi Perfil
              </SidebarLink>
            ) : (
              <>
                <SidebarLink 
                  to="/login" 
                  icon={<UserCircleIcon className="h-5 w-5" />}
                  onClick={closeMenu}
                >
                  Iniciar Sesión
                </SidebarLink>
                <SidebarLink 
                  to="/register" 
                  icon={<PlusIcon className="h-5 w-5" />}
                  onClick={closeMenu}
                >
                  Registrarse
                </SidebarLink>
              </>
            )}
            
            {isAuthenticated && (
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-amber-300 hover:text-amber-200 rounded-lg transition-colors duration-200 mt-2"
              >
                <UserCircleIcon className="h-5 w-5" />
                Cerrar Sesión
              </button>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}

function SidebarLink({
  to,
  icon,
  children,
  className = "",
  badge = null,
  ...props
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-green-700/20 relative ${className}`}
      {...props}
    >
      <span className="text-amber-200/80">{icon}</span>
      <span className="flex-1">{children}</span>
      {badge !== null && (
        <span className="bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default Navbar;