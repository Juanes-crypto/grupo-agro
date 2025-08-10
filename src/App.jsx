import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import TopNavbar from "./components/TopNavbar";
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import PremiumRoute from './components/PremiumRoute';

// Páginas
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
import SubscriptionPlansPage from './pages/SubscriptionPlansPage';

function App() {
    // Estado para controlar la visibilidad del Navbar en móviles
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    // Función para alternar el estado
    const toggleNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    return (
        <Router>
            <AuthProvider>
                <NotificationProvider>
                    <div className="flex min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
                        {/* El Navbar ahora recibe su estado y una función para cerrarse */}
                        <Navbar isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} />
                        
                        <div className="flex-1 md:ml-64">
                            {/* El TopNavbar ahora recibe la función para abrir/cerrar el menú */}
                            <TopNavbar onMenuClick={toggleNavbar} />

                            <main className="p-8 pt-16 overflow-y-auto">
                                <div className="max-w-7xl mx-auto">
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/register" element={<RegisterPage />} />
                                        <Route path="/login" element={<LoginPage />} />
                                        <Route path="/welcome" element={<WelcomePage />} />
                                        <Route path="/products" element={<ProductListPage />} />
                                        <Route path="/products/:id" element={<ProductDetailsPage />} />
                                        <Route path="/services" element={<ServiceListPage />} />
                                        <Route path="/rentals" element={<RentalListPage />} />
                                        <Route path="/services/:id" element={<ServiceDetailsPage />} />
                                        <Route path="/rentals/:id" element={<RentalDetailsPage />} />
                                        <Route path="/barter/:productId" element={<BarterProposalPage />} />
                                        <Route path="/subscription-plans" element={<SubscriptionPlansPage />} />

                                        <Route element={<PrivateRoute />}>
                                            <Route path="/cart" element={<CartPage />} />
                                            <Route path="/checkout" element={<CheckoutPage />} />
                                            <Route path="/my-orders" element={<MyOrdersPage />} />
                                            <Route path="/order-details/:id" element={<OrderDetailsPage />} />
                                            <Route path="/dashboard" element={<DashboardPage />} />
                                            <Route path="/notifications" element={<NotificationsPage />} />
                                            <Route path="/edit-product/:id" element={<EditProductPage />} />
                                            <Route path="/my-products" element={<ProductListPage />} />
                                            <Route path="/my-services" element={<ServiceListPage />} />
                                            <Route path="/my-rentals" element={<RentalListPage />} />
                                            <Route path="/barter-details/:id" element={<BarterDetailsPage />} />
                                            <Route path="/create-barter-proposal/:productId" element={<CreateBarterProposalPage />} />
                                            <Route path="/create-counter-proposal/:proposalId" element={<CreateCounterProposalPage />} />
                                            <Route path="/my-barter-proposals" element={<MyBarterProposalsPage />} />
                                            <Route path="/create-rental" element={<CreateRentalPage />} />
                                            <Route path="/create-service" element={<CreateServicePage />} />
                                            <Route path="/create-product" element={<CreateProductPage />} />
                                            <Route path="/premium-upsell" element={<PremiumUpsellPage />} />
                                        </Route>

                                        <Route element={<PrivateRoute />}>
                                            <Route element={<PremiumRoute />}>
                                                <Route path="/premium-inventory" element={<PremiumInventoryPage />} />
                                            </Route>
                                        </Route>
                                    </Routes>
                                </div>
                            </main>
                        </div>
                    </div>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        toastClassName="bg-white text-gray-800 shadow-xl rounded-xl"
                        progressClassName="bg-primary-500"
                    />
                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
