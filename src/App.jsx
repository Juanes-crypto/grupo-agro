import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopNavbar from "./components/TopNavbar";
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import PremiumRoute from './components/PremiumRoute';
import Footer from './components/Footer';

// Lazy loading de páginas para mejorar rendimiento
const HomePage = lazy(() => import('./pages/HomePage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProductListPage = lazy(() => import('./pages/ProductListPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CreateProductPage = lazy(() => import('./pages/CreateProductPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const EditProductPage = lazy(() => import('./pages/EditProductPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const PremiumInventoryPage = lazy(() => import('./pages/PremiumInventoryPage'));
const PremiumUpsellPage = lazy(() => import('./pages/PremiumUpsellPage'));
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const BarterDetailsPage = lazy(() => import('./pages/BarterDetailsPage'));
const CreateBarterProposalPage = lazy(() => import('./pages/CreateBarterProposalPage'));
const CreateCounterProposalPage = lazy(() => import('./pages/CreateCounterProposalPage'));
const MyBarterProposalsPage = lazy(() => import('./pages/MyBarterProposalsPage'));
const CreateRentalPage = lazy(() => import('./pages/CreateRentalPage'));
const RentalListPage = lazy(() => import('./pages/RentalListPage'));
const CreateServicePage = lazy(() => import('./pages/CreateServicePage'));
const ServiceListPage = lazy(() => import('./pages/ServiceListPage'));
const ServiceDetailsPage = lazy(() => import('./pages/ServiceDetailsPage'));
const RentalDetailsPage = lazy(() => import('./pages/RentalDetailsPage'));
const BarterProposalPage = lazy(() => import('./pages/BarterProposalPage'));
const SubscriptionPlansPage = lazy(() => import('./pages/SubscriptionPlansPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const CookiesPage = lazy(() => import('./pages/CookiesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MyServicesPage = lazy(() => import('./pages/MyServicesPage'));
const MyRentalsPage = lazy(() => import('./pages/MyRentalsPage'));
const EditServicePage = lazy(() => import('./pages/EditServicePage'));
const EditRentalPage = lazy(() => import('./pages/EditRentalPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const NewsletterPage = lazy(() => import('./pages/NewsletterPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const PaymentFailurePage = lazy(() => import('./pages/PaymentFailurePage'));
const PaymentPendingPage = lazy(() => import('./pages/PaymentPendingPage'));
const PayoutSettingsPage = lazy(() => import('./pages/PayoutSettingsPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

// Componente de loading para Suspense
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
    </div>
);
function App() {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const toggleNavbar = () => setIsNavbarOpen(!isNavbarOpen);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary-50 to-primary-100">
            {/* Navbar Lateral */}
            <Navbar isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} />
            
            {/* Contenido Principal */}
            <div className="flex-1 md:ml-64 flex flex-col">
                {/* TopNavbar */}
                <TopNavbar onMenuClick={toggleNavbar} />

                {/* Contenido Dinámico */}
                <main className="flex-1 p-8 pt-16 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Suspense fallback={<LoadingSpinner />}>
                            <Routes>
                            {/* Rutas Públicas */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/nosotros" element={<AboutUsPage />} />
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
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="/privacy" element={<PrivacyPage />} />
                            <Route path="/cookies" element={<CookiesPage />} />
                            <Route path="/premium-upsell" element={<PremiumUpsellPage />} />
                            <Route path="/payment-success" element={<PaymentSuccessPage />} />
                            <Route path="/payment-failure" element={<PaymentFailurePage />} />
                            <Route path="/payment-pending" element={<PaymentPendingPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                            
                            {/* Rutas Privadas */}
                            <Route element={<PrivateRoute />}>
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/my-orders" element={<MyOrdersPage />} />
                                <Route path="/order-details/:id" element={<OrderDetailsPage />} />
                                <Route path="/newsletter" element={<NewsletterPage />} />
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/notifications" element={<NotificationsPage />} />
                                <Route path="/edit-product/:id" element={<EditProductPage />} />
                                <Route path="/edit-service/:id" element={<EditServicePage />} />
                                <Route path="/edit-rental/:id" element={<EditRentalPage />} />
                                <Route path="/my-products" element={<ProductListPage />} />
                                <Route path="/my-services" element={<MyServicesPage />} />
                                <Route path="/my-rentals" element={<MyRentalsPage />} />
                                <Route path="/barter-details/:id" element={<BarterDetailsPage />} />
                                <Route path="/create-barter-proposal/:productId" element={<CreateBarterProposalPage />} />
                                <Route path="/create-counter-proposal/:proposalId" element={<CreateCounterProposalPage />} />
                                <Route path="/my-barter-proposals" element={<MyBarterProposalsPage />} />
                                <Route path="/create-rental" element={<CreateRentalPage />} />
                                <Route path="/create-service" element={<CreateServicePage />} />
                                <Route path="/create-product" element={<CreateProductPage />} />
                                <Route path="/profile" element={<ProfilePage />} /> 
                                <Route path="/profile/payout-settings" element={<PayoutSettingsPage />} />                       
                            </Route>

                            {/* Rutas Premium */}
                            <Route element={<PrivateRoute />}>
                                <Route element={<PremiumRoute />}>
                                    <Route path="/premium-inventory" element={<PremiumInventoryPage />} />
                                </Route>
                            </Route>
                            
                            {/* Ruta 404 */}
                            <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </Suspense>
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>

            {/* Toast Notifications */}
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
        </div>
    );
}

export default App;