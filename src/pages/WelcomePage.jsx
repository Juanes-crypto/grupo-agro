// src/pages/WelcomePage.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRightIcon,
  GiftIcon,
  SparklesIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  LogoutIcon 
} from '@heroicons/react/outline';

function WelcomePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isPremium = user?.isPremium;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-emerald-900 to-green-800 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 font-sans"
    >
      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-32 h-32 rounded-full bg-emerald-400/10 blur-3xl animate-float"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 rounded-full bg-amber-400/10 blur-3xl animate-float-delay"></div>
      
      {/* Main Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        {/* Premium Header */}
        {isPremium && (
          <div className="bg-gradient-to-r from-amber-400 to-yellow-500 py-3 px-6 flex items-center justify-center">
            <SparklesIcon className="h-6 w-6 text-white mr-2" />
            <span className="text-white font-bold text-sm uppercase tracking-wider">Cuenta Premium Activa</span>
          </div>
        )}

        <div className="p-8 sm:p-10">
          {/* Welcome Section */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-md"></div>
                <div className="relative bg-gradient-to-r from-emerald-600 to-green-700 text-white p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                  <UserCircleIcon className="h-12 w-12" />
                </div>
              </div>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              ¡Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-700">AgroApp</span>, {user?.username}!
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isPremium
                ? 'Disfruta de todas las ventajas de tu cuenta Premium. Publica sin límites y accede a herramientas exclusivas.'
                : 'Explora el mercado agrícola más completo. Actualiza a Premium para desbloquear funciones avanzadas.'}
            </p>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Product Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-emerald-100 p-3 rounded-lg mr-4">
                    <ShoppingBagIcon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Publicar Producto</h3>
                </div>
                <p className="text-gray-600 mb-6">Ofrece tus productos agrícolas a la comunidad.</p>
                <Link 
                  to="/create-product" 
                  className="inline-flex items-center text-emerald-600 font-medium group"
                >
                  <span>Publicar ahora</span>
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Trade Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 p-3 rounded-lg mr-4">
                    <GiftIcon className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Proponer Trueque</h3>
                </div>
                <p className="text-gray-600 mb-6">Intercambia productos con otros agricultores.</p>
                <Link 
                  to="/products" 
                  className="inline-flex items-center text-amber-600 font-medium group"
                >
                  <span>Explorar trueques</span>
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Rentals Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Rentar Espacio</h3>
                </div>
                <p className="text-gray-600 mb-6">Encuentra o ofrece espacios para cultivo.</p>
                <Link 
                  to="/rentals" 
                  className="inline-flex items-center text-blue-600 font-medium group"
                >
                  <span>Ver espacios</span>
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Orders Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Mis Pedidos</h3>
                </div>
                <p className="text-gray-600 mb-6">Revisa el estado de tus compras y ventas.</p>
                <Link 
                  to="/my-orders" 
                  className="inline-flex items-center text-purple-600 font-medium group"
                >
                  <span>Ver mis pedidos</span>
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Premium Upsell */}
          {!isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white mb-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <h3 className="text-xl font-bold mb-2">Desbloquea todo el potencial</h3>
                  <p className="text-purple-100 max-w-lg">
                    Con Premium, publica sin límites, destaca tus productos y accede a herramientas exclusivas para hacer crecer tu negocio agrícola.
                  </p>
                </div>
                <Link 
                  to="/premium-upsell" 
                  className="whitespace-nowrap bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 flex items-center"
                >
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  <span>Activar Premium</span>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-gray-500 hover:text-gray-700 font-medium transition mx-auto"
          >
            <LogoutIcon className="h-5 w-5 mr-2" />
            <span>Cerrar sesión</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Animated Background Elements */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 8s ease-in-out infinite 2s;
        }
      `}</style>
    </motion.div>
  );
}

export default WelcomePage;