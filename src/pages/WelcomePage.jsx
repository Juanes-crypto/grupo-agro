import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  GiftIcon,
  SparklesIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  WrenchIcon,
  SunIcon,
  TruckIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
  StarIcon,
} from "@heroicons/react/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
function WelcomePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isPremium = user?.isPremium;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Secciones explicativas
  const features = [
    {
      title: "Productos Agrícolas",
      icon: <ShoppingBagIcon className="h-8 w-8 text-emerald-600" />,
      description:
        "Publica y descubre frutas, verduras, lácteos, huevos y todo lo que provenga directamente de la tierra.",
      color: "emerald",
    },
    {
      title: "Servicios Especializados",
      icon: <WrenchIcon className="h-8 w-8 text-blue-600" />,
      description:
        "Ofrece o encuentra servicios agrícolas: jardinería, injertos, análisis de suelos y más.",
      color: "blue",
    },
    {
      title: "Alquiler de Equipos",
      icon: <TruckIcon className="h-8 w-8 text-amber-600" />,
      description:
        "Renta maquinaria, herramientas o incluso tu finca para eventos especiales.",
      color: "amber",
    },
    {
      title: "Sistema de Trueques",
      icon: <ArrowsRightLeftIcon className="h-8 w-8 text-purple-600" />,
      description:
        "Intercambia productos con nuestro sistema inteligente que calcula equivalencias justas.",
      color: "purple",
    },
    {
      title: "Gestión Completa",
      icon: <ChartBarIcon className="h-8 w-8 text-cyan-600" />,
      description:
        "Controla tus publicaciones, ventas y alquileres desde un solo lugar.",
      color: "cyan",
    },
    {
      title: "Seguridad Garantizada",
      icon: <ShieldCheckIcon className="h-8 w-8 text-green-600" />,
      description:
        "Transacciones seguras y perfiles verificados para tu tranquilidad.",
      color: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] bg-repeat opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 shadow-lg"
          >
            {isPremium
              ? "Cuenta Premium Activa"
              : "Conectando el campo con el mundo"}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Bienvenido a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-800">
              AgroNet
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
          >
            La plataforma definitiva para comprar, vender, intercambiar y
            alquilar productos y servicios agrícolas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-20"
          >
            <Link
              to="/products"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              Explorar Productos
            </Link>
            {!isPremium && (
              <Link
                to="/premium-upsell"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-2"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>Hazte Premium</span>
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-emerald-500/20 rounded-xl blur-lg"></div>
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
              <img
                src="/images/dashboard-preview.jpg"
                alt="Vista previa de AgroNet"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que AgroNet ofrece
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una plataforma completa diseñada específicamente para las
              necesidades del sector agrícola
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className={`p-6 bg-${feature.color}-50`}>
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${feature.color}-100 mb-6`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
                <div className="px-6 py-4 bg-gray-50">
                  <Link
                    to={
                      feature.title.includes("Productos")
                        ? "/products"
                        : feature.title.includes("Servicios")
                        ? "/services"
                        : feature.title.includes("Alquiler")
                        ? "/rentals"
                        : "/features"
                    }
                    className={`inline-flex items-center text-${feature.color}-600 font-medium group`}
                  >
                    <span>Conocer más</span>
                    <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona AgroNet?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sigue estos simples pasos para comenzar a aprovechar todas las
              ventajas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Regístrate",
                description:
                  "Crea tu cuenta en minutos y verifica tu perfil para mayor seguridad",
                icon: <UserCircleIcon className="h-8 w-8 text-emerald-600" />,
              },
              {
                step: "2",
                title: "Publica",
                description:
                  "Añade tus productos, servicios o equipos disponibles para alquiler",
                icon: <PlusIcon className="h-8 w-8 text-emerald-600" />,
              },
              {
                step: "3",
                title: "Conecta",
                description:
                  "Interactúa con otros agricultores, realiza ventas o intercambios",
                icon: (
                  <ArrowsRightLeftIcon className="h-8 w-8 text-emerald-600" />
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 font-bold text-2xl mb-6 mx-auto">
                  {item.step}
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6 mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-emerald-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Listo para unirte a la comunidad agrícola más grande?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-3xl mx-auto">
            Regístrate ahora y comienza a disfrutar de todas las ventajas que
            AgroNet tiene para ofrecerte
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-emerald-600 hover:bg-gray-100 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              Crear cuenta gratis
            </Link>
            <Link
              to="/premium-upsell"
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              Conocer ventajas Premium
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
