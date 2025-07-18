import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa los componentes de página que existen en tu carpeta src/pages/
import BarterDetailsPage from './pages/BarterDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CreateBarterProposalPage from './pages/CreateBarterProposalPage';
import CreateCounterProposalPage from './pages/CreateCounterProposalPage';
import CreateProductPage from './pages/CreateProductPage';
import CreateServicePage from './pages/CreateServicePage';
// import DashboardPage from './pages/DashboardPage'; // <--- ELIMINAR/COMENTAR ESTA LÍNEA
import EditProductPage from './pages/EditProductPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyBarterProposalsPage from './pages/MyBarterProposalsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import NotificationsPage from './pages/NotificationsPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import PremiumInventoryPage from './pages/PremiumInventoryPage';
import PremiumUpsellPage from './pages/PremiumUpsellPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductListPage from './pages/ProductListPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';

// ⭐ NUEVOS COMPONENTES QUE ACABAS DE CREAR ⭐
import ServiceListPage from './pages/ServiceListPage'; // <--- DESCOMENTAR/AGREGAR ESTA LÍNEA
import RentalPage from './pages/RentalPage';         // <--- DESCOMENTAR/AGREGAR ESTA LÍNEA

// Importa el componente Navbar
import Navbar from './components/Navbar';

// Definir categorías de productos (se mantiene la lista que ya tenías)
export const CATEGORIES = [
    'Frutas', 'Verduras', 'Granos', 'Lácteos', 'Carnes', 'Semillas',
    'Fertilizantes', 'Herramientas', 'Maquinaria', 'Servicios Agrícolas', 'Otros'
];

function App() {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState('user-example-id'); // Valor de ejemplo, cambiarás esto con tu lógica de autenticación real

    const authContextValue = {
        isAuthenticated: !!user,
        user: user,
        userId: userId,
        isPremium: true, // ⭐ Establecido en true para probar Premium Inventory y formularios por ahora ⭐
        login: (userData) => {
            console.log("Simulando login:", userData);
            setUser({ email: userData.email, /* otras propiedades del usuario */ });
            setUserId('some-real-user-id');
        },
        logout: () => {
            console.log("Simulando logout.");
            setUser(null);
            setUserId(null);
        },
        register: (userData) => {
            console.log("Simulando registro:", userData);
        }
    };

    return (
        // El Router se mantiene aquí, ya que lo quitamos de main.jsx
        <Router>
            <div className="min-h-screen bg-gray-100 font-inter">
                {/* Navbar se renderiza aquí para que esté en todas las páginas */}
                <Navbar />

                <main className="container mx-auto p-4 py-8">
                    <Routes>
                        {/* Rutas principales y de autenticación */}
                        <Route path="/" element={<HomePage userId={userId} />} />
                        <Route path="/welcome" element={<WelcomePage userId={userId} />} />
                        <Route path="/register" element={<RegisterPage userId={userId} />} />
                        <Route path="/login" element={<LoginPage userId={userId} />} />

                        {/* Rutas de Productos */}
                        <Route path="/products" element={<ProductListPage userId={userId} />} />
                        <Route path="/products/:id" element={<ProductDetailsPage userId={userId} />} />
                        <Route path="/create-product" element={<CreateProductPage userId={userId} />} />
                        <Route path="/edit-product/:id" element={<EditProductPage userId={userId} />} />

                        {/* ⭐ Rutas de Servicios (ahora con ServiceListPage.jsx) ⭐ */}
                        <Route path="/create-service" element={<CreateServicePage userId={userId} />} />
                        <Route path="/services" element={<ServiceListPage userId={userId} />} /> {/* <--- AÑADIR/DESCOMENTAR ESTA LÍNEA */}

                        {/* ⭐ Rutas de Rentas (ahora con RentalPage.jsx) ⭐ */}
                        <Route path="/rentals" element={<RentalPage userId={userId} />} /> {/* <--- AÑADIR/DESCOMENTAR ESTA LÍNEA */}

                        {/* Rutas de Trueques y Órdenes */}
                        <Route path="/barter-details/:id" element={<BarterDetailsPage userId={userId} />} />
                        <Route path="/create-barter" element={<CreateBarterProposalPage userId={userId} />} />
                        <Route path="/create-counter-proposal/:id" element={<CreateCounterProposalPage userId={userId} />} />
                        <Route path="/my-barter-proposals" element={<MyBarterProposalsPage userId={userId} />} />
                        <Route path="/my-orders" element={<MyOrdersPage userId={userId} />} />
                        <Route path="/notifications" element={<NotificationsPage userId={userId} />} />
                        <Route path="/order/:id" element={<OrderDetailsPage userId={userId} />} />
                        <Route path="/cart" element={<CartPage userId={userId} />} />
                        <Route path="/checkout" element={<CheckoutPage userId={userId} />} />

                        {/* Rutas de Dashboard y Notificaciones */}
                        {/* <Route path="/dashboard" element={<DashboardPage userId={userId} />} /> */} {/* <--- ELIMINAR/COMENTAR ESTA LÍNEA */}


                        {/* Rutas Premium */}
                        <Route path="/premium-inventory" element={<PremiumInventoryPage userId={userId} />} />
                        <Route path="/premium-upsell" element={<PremiumUpsellPage userId={userId} />} />
                        {/* Asumiendo que PremiumPage.jsx es para /premium */}
                        {/* <Route path="/premium" element={<PremiumPage userId={userId} />} /> */}


                        {/* Ruta para cualquier otra URL no definida */}
                        <Route path="*" element={<h2 className="text-3xl font-bold text-red-600 text-center">Página no encontrada o en construcción</h2>} />
                    </Routes>
                </main>

                <footer className="bg-green-700 text-white text-center p-4 mt-8 shadow-inner">
                    <p>&copy; {new Date().getFullYear()} AgroApp. Todos los derechos reservados.</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;