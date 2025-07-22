// AGROAPP-UI/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; // ¡Este es importante para los estilos!

// ======================================================
// ⭐ IMPORTACIONES DE CONTEXTOS ⭐
// ======================================================
import { AuthProvider } from './context/AuthContext';


// ======================================================
// ⭐ IMPORTACIONES DE COMPONENTES DE LAYOUT / RUTA EXISTENTES ⭐
// ======================================================
import Navbar from './components/Navbar';
// No tienes Footer.jsx en tus componentes según las capturas.
// Si lo creas, descomenta la siguiente línea:
// import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import PremiumRoute from './components/PremiumRoute'; // Asumiendo que este sí existe ahora
// Si tienes un componente AdminRoute, impórtalo también
// import AdminRoute from './components/AdminRoute';


// ======================================================
// ⭐ IMPORTACIONES DE TODAS LAS PÁGINAS EXISTENTES ⭐
// ======================================================
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CreateProductPage from './pages/CreateProductPage';
import DashboardPage from './pages/DashboardPage';
import EditProductPage from './pages/EditProductPage';
import MyOrdersPage from './pages/MyOrdersPage';
import NotificationsPage from './pages/NotificationsPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import PremiumInventoryPage from './pages/PremiumInventoryPage';
import PremiumUpsellPage from './pages/PremiumUpsellPage';
import WelcomePage from './pages/WelcomePage';
import BarterDetailsPage from './pages/BarterDetailsPage';
import CreateBarterProposalPage from './pages/CreateBarterProposalPage';
import CreateCounterProposalPage from './pages/CreateCounterProposalPage';
import MyBarterProposalsPage from './pages/MyBarterProposalsPage';
import CreateRentalPage from './pages/CreateRentalPage';
import RentalListPage from './pages/RentalListPage';
import CreateServicePage from './pages/CreateServicePage';
import ServiceListPage from './pages/ServiceListPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage'; 
import RentalDetailsPage from './pages/RentalDetailsPage'; 
import BarterProposalPage from './pages/BarterProposalPage';


// ⭐ Componente para páginas no encontradas (404) ⭐
// Si NO lo tienes creado, la ruta con '*' lanzará un error.
// Puedes crear un simple NotFoundPage.jsx en src/pages/ o eliminar esta ruta si no lo vas a implementar.
// import NotFoundPage from './pages/NotFoundPage';


function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar /> {/* Tu barra de navegación */}
                <main className="container mx-auto px-4 py-8 pl-72">
                    <Routes>
                        {/* ====================================================== */}
                        {/* ⭐ RUTAS PÚBLICAS (accesibles sin autenticación) ⭐ */}
                        {/* ====================================================== */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/welcome" element={<WelcomePage />} />

                        {/* Rutas para listar y ver detalles de productos (públicas) */}
                        <Route path="/products" element={<ProductListPage />} />
                        <Route path="/products/:id" element={<ProductDetailsPage />} />
                        <Route path="/services" element={<ServiceListPage />} />
                        <Route path="/rentals" element={<RentalListPage />} />
                        <Route path="/services/:id" element={<ServiceDetailsPage />} />
                        <Route path="/rentals/:id" element={<RentalDetailsPage />} />
                        <Route path="/barter/:productId" element={<BarterProposalPage />} />

                        {/* ====================================================== */}
                        {/* ⭐ RUTAS PROTEGIDAS (requieren autenticación) ⭐ */}
                        {/* ====================================================== */}
                        <Route element={<PrivateRoute />}>
                            {/* Rutas de carrito y compra */}
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/my-orders" element={<MyOrdersPage />} />
                            <Route path="/order-details/:id" element={<OrderDetailsPage />} />
                            {/* La ruta que estaba generando el error era '/order/:id', ahora la corregimos a '/order-details/:id' para coincidir con la navegación del CheckoutPage */}


                            {/* Rutas relacionadas con el usuario y sus propios productos/negocios */}
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/notifications" element={<NotificationsPage />} />
                            <Route path="/edit-product/:id" element={<EditProductPage />} />
                            {/* Usamos ProductListPage para mostrar los productos del usuario actual */}
                            <Route path="/my-products" element={<ProductListPage />} />
                            <Route path="/my-services" element={<ServiceListPage />} />
                            <Route path="/my-rentals" element={<RentalListPage />} />

                            {/* Rutas de Trueque */}
                            <Route path="/barter-details/:id" element={<BarterDetailsPage />} />
                            <Route path="/create-barter-proposal/:productId" element={<CreateBarterProposalPage />} />
                            <Route path="/create-counter-proposal/:proposalId" element={<CreateCounterProposalPage />} />
                            <Route path="/my-barter-proposals" element={<MyBarterProposalsPage />} />

                            {/* Rutas de Alquiler */}
                            <Route path="/create-rental" element={<CreateRentalPage />} />

                            {/* Rutas de Servicios */}
                            <Route path="/create-service" element={<CreateServicePage />} />

                            {/* ⭐ CAMBIO CRÍTICO AQUÍ: Mover /create-product fuera de PremiumRoute ⭐ */}
                            <Route path="/create-product" element={<CreateProductPage />} />

                        </Route>


                        {/* ====================================================== */}
                        {/* ⭐ RUTAS PREMIUM (requieren autenticación Y ser premium) ⭐ */}
                        {/* ====================================================== */}
                        <Route element={<PrivateRoute />}>
                            <Route element={<PremiumRoute />}>
                                {/* SOLO RUTAS QUE REQUIERAN EXCLUSIVAMENTE SER PREMIUM VAN AQUÍ */}
                                <Route path="/premium-inventory" element={<PremiumInventoryPage />} />
                                <Route path="/premium-upsell" element={<PremiumUpsellPage />} />
                            </Route>
                        </Route>

                        {/* ====================================================== */}
                        {/* ⭐ RUTAS DE ADMINISTRADOR (requieren autenticación Y rol de admin) ⭐ */}
                        {/* ====================================================== */}
                        {/* Si tienes un AdminRoute y páginas de admin:
                        <Route element={<PrivateRoute />}>
                            <Route element={<AdminRoute />}>
                                <Route path="/admin/users" element={<AdminUsersPage />} />
                                <Route path="/admin/products" element={<AdminProductsPage />} />
                            </Route>
                        </Route>
                        */}

                        {/* ====================================================== */}
                        {/* ⭐ RUTA DE PÁGINA NO ENCONTRADA (404) ⭐ */}
                        {/* ====================================================== */}
                        {/* Si NO tienes el componente NotFoundPage.jsx, esta línea te dará un error.
                            Coméntala o elimínala si no lo vas a implementar.
                        <Route path="*" element={<NotFoundPage />} />
                        */}
                    </Routes>
                </main>
                {/* Si tienes un componente Footer.jsx, descomenta la siguiente línea: */}
                {/* <Footer /> */}

                {/* --- AQUÍ SE AÑADE EL TOASTCONTAINER --- */}
                <ToastContainer
                    position="bottom-right" // Puedes cambiar la posición (top-right, top-center, etc.)
                    autoClose={5000}       // Las notificaciones se cierran después de 5 segundos
                    hideProgressBar={false} // Muestra una pequeña barra de progreso
                    newestOnTop={false}    // Las notificaciones más nuevas aparecen abajo
                    closeOnClick           // Cierra la notificación al hacer clic
                    rtl={false}            // Soporte para idiomas de derecha a izquierda
                    pauseOnFocusLoss       // Pausa el temporizador si la ventana pierde el foco
                    draggable              // Permite arrastrar las notificaciones
                    pauseOnHover           // Pausa el temporizador si pasas el ratón por encima
                />
            </Router>
        </AuthProvider>
    );
}

export default App;