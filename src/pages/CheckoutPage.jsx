// frontend/src/pages/CheckoutPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; 
// ✅ RUTA CORREGIDA: Accediendo a src/utils/formatters.js
import { formatPrice } from '../utils/formatters'; 

function CheckoutPage() {
    // --- ESTADOS ---
    const { cartItems, isAuthenticated, token, clearCart } = useContext(AuthContext);
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
    const [paymentMethod, setPaymentMethod] = useState('MercadoPago');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // --- CÁLCULOS DE PRECIO ---
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    const taxRate = 0.19; // 19% de IVA (ejemplo)
    const taxPrice = subtotal * taxRate;
    const shippingPrice = subtotal > 100000 ? 0 : 15000;
    const totalPrice = subtotal + taxPrice + shippingPrice;

    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (cartItems.length === 0) {
            setError('No hay productos en el carrito.');
            setLoading(false);
            return;
        }

        // --- VALIDACIÓN DE DIRECCIÓN ---
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            setError('Por favor, completa todos los campos de la dirección de envío.');
            setLoading(false);
            return;
        }

        try {
            // PASO 1: Crear la orden en tu base de datos
            console.log('Creando orden en la base de datos...');
            const orderItems = cartItems.map(item => ({
                product: item._id, 
                name: item.name, 
                quantity: item.quantity, 
                image: item.imageUrl || 'default.jpg',
                price: item.price,
            }));
            
            const orderData = {
                orderItems,
                shippingAddress,
                paymentMethod,
                taxPrice: parseFloat(taxPrice.toFixed(2)),
                shippingPrice: parseFloat(shippingPrice.toFixed(2)),
                totalPrice: parseFloat(totalPrice.toFixed(2)),
            };
            
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
            
            const { data: createdOrder } = await api.post('/api/orders', orderData, config);
            console.log('Orden creada con éxito:', createdOrder);

            // PASO 2: Crear la preferencia de pago en Mercado Pago
            console.log('Creando preferencia de pago en Mercado Pago...');
            
            // ✅ CORRECCIÓN CLAVE: Usamos 'orderItems' local para enviarlo a Mercado Pago
            const { data: paymentData } = await api.post('/api/payments/create-order', {
                orderId: createdOrder._id,
                items: orderItems, // <--- Esto resuelve el error "Cannot destructure property 'orderId'"
            }, config);

            const { url: mercadoPagoUrl } = paymentData;
            console.log('URL de pago recibida:', mercadoPagoUrl);

            // PASO 3: Redirigir al usuario al checkout de Mercado Pago
            if (mercadoPagoUrl) {
                clearCart(); 
                window.location.href = mercadoPagoUrl; 
            } else {
                throw new Error('No se recibió la URL de pago de Mercado Pago.');
            }

        } catch (err) {
            console.error("Error durante el proceso de pago:", err);
            setError(err.response?.data?.message || 'Error desconocido al procesar el pago. Inténtalo de nuevo.');
            setLoading(false);
        }
    };

    // --- JSX DEL COMPONENTE ---
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-center mb-8">Confirmar Pedido</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            <form onSubmit={handleProceedToPayment} className="bg-white shadow-xl rounded-lg p-6">
                
                {/* --- 1. SECCIÓN: DIRECCIÓN DE ENVÍO --- */}
                <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Dirección de Envío</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Campo de Dirección */}
                    <div>
                        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Dirección</label>
                        <input
                            type="text"
                            id="address"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            value={shippingAddress.address}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                            required
                            placeholder="Ej: Carrera 10 # 20-30"
                        />
                    </div>

                    {/* Campo de Ciudad */}
                    <div>
                        <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">Ciudad</label>
                        <input
                            type="text"
                            id="city"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            required
                            placeholder="Ej: Medellín"
                        />
                    </div>

                    {/* Campo de Código Postal */}
                    <div>
                        <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">Código Postal</label>
                        <input
                            type="text"
                            id="postalCode"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                            required
                            placeholder="Ej: 050010"
                        />
                    </div>

                    {/* Campo de País */}
                    <div>
                        <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">País</label>
                        <input
                            type="text"
                            id="country"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            value={shippingAddress.country}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                            required
                            placeholder="Ej: Colombia"
                        />
                    </div>
                </div>

                {/* --- 2. SECCIÓN: MÉTODO DE PAGO --- */}
                <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Método de Pago</h2>
                <div className="mb-8 bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <label className="inline-flex items-center w-full cursor-pointer">
                        <input
                            type="radio"
                            className="form-radio text-blue-600 h-5 w-5"
                            name="paymentMethod"
                            value="MercadoPago"
                            checked={paymentMethod === 'MercadoPago'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            disabled={loading}
                        />
                        <span className="ml-3 text-gray-800 font-semibold flex items-center text-lg">
                            <img src="/images/mercadopago_logo.svg" alt="Mercado Pago" className="h-6 w-auto mr-2" onError={(e) => { e.target.onerror = null; e.target.src = '/images/mercadopago_logo.png' }} />
                            Mercado Pago
                        </span>
                    </label>
                    <p className="text-sm text-gray-600 mt-2 ml-8">Paga de forma segura con tarjeta de crédito, débito o efectivo.</p>
                </div>

                {/* --- 3. SECCIÓN: RESUMEN DEL PEDIDO --- */}
                <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Resumen del Pedido</h2>
                <div className="space-y-3 mb-8 text-lg">
                    <div className="flex justify-between">
                        <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}):</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Envío:</span>
                        <span className="font-medium">{shippingPrice === 0 ? 'Gratis' : formatPrice(shippingPrice)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                        <span>IVA ({(taxRate * 100).toFixed(0)}%):</span>
                        <span className="font-medium">{formatPrice(taxPrice)}</span>
                    </div>
                    <div className="flex justify-between border-t border-b py-3 text-xl font-bold text-primary-600">
                        <span>Total:</span>
                        <span>{formatPrice(totalPrice)}</span>
                    </div>
                </div>

                {/* --- BOTÓN DE PAGO --- */}
                <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 disabled:opacity-50"
                    disabled={loading || cartItems.length === 0}
                >
                    {loading ? 'Procesando...' : 'Continuar al Pago'}
                </button>
                <div className="text-center mt-4">
                    <Link to="/cart" className="text-sm text-gray-500 hover:text-gray-700 underline">Volver al carrito</Link>
                </div>
            </form>
        </div>
    );
}

export default CheckoutPage;