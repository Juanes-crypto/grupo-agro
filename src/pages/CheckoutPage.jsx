// frontend/src/pages/CheckoutPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // ⭐ Asegúrate de que tu instancia de axios esté importada

function CheckoutPage() {
    // --- ESTADOS (SIN CAMBIOS) ---
    const { cartItems, isAuthenticated, token, clearCart } = useContext(AuthContext);
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
    
    // --- CAMBIO 1: El método de pago ahora es MercadoPago por defecto ---
    const [paymentMethod, setPaymentMethod] = useState('MercadoPago');
    // -----------------------------------------------------------------

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- ELIMINADOS: Ya no manejamos el éxito aquí, redirigimos directamente ---
    // const [orderSuccess, setOrderSuccess] = useState(false);
    // const [createdOrder, setCreatedOrder] = useState(null);
    // -----------------------------------------------------------------------

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
        if (cartItems.length === 0) {
            setError('Tu carrito está vacío. No puedes proceder al pago.');
        }
    }, [isAuthenticated, cartItems, navigate]);

    // --- CÁLCULOS DE PRECIO (SIN CAMBIOS) ---
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    const taxPrice = subtotal * 0.19;
    const shippingPrice = subtotal > 100000 ? 0 : 15000;
    const totalPrice = subtotal + taxPrice + shippingPrice;

    // --- CAMBIO 2: Renombramos la función para que sea más clara ---
    const handleProceedToPayment = async (e) => {
    // ------------------------------------------------------------
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (cartItems.length === 0) {
            setError('No hay productos en el carrito.');
            setLoading(false);
            return;
        }

        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            setError('Por favor, completa todos los campos de la dirección de envío.');
            setLoading(false);
            return;
        }

        try {
            // --- PASO 1: Crear la orden en tu base de datos (lógica similar a la tuya) ---
            console.log('Creando orden en la base de datos...');
            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id, name: item.name, quantity: item.quantity, image: item.imageUrl, price: item.price,
                })),
                shippingAddress,
                paymentMethod,
                taxPrice: parseFloat(taxPrice.toFixed(2)),
                shippingPrice: parseFloat(shippingPrice.toFixed(2)),
                totalPrice: parseFloat(totalPrice.toFixed(2)),
            };
            
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
            
            const { data: createdOrder } = await api.post('/api/orders', orderData, config);
            console.log('Orden creada con éxito:', createdOrder);

            // --- PASO 2: Crear la preferencia de pago en Mercado Pago ---
            console.log('Creando preferencia de pago en Mercado Pago...');
            const { data: paymentData } = await api.post('/api/payments/create-order', {
                orderId: createdOrder._id,
                items: createdOrder.orderItems,
            }, config); // Reutilizamos la config con el token

            const { url: mercadoPagoUrl } = paymentData;
            console.log('URL de pago recibida:', mercadoPagoUrl);

            // --- PASO 3: Redirigir al usuario al checkout de Mercado Pago ---
            if (mercadoPagoUrl) {
                clearCart(); // Limpiamos el carrito antes de salir
                window.location.href = mercadoPagoUrl; // Redirección externa
            } else {
                throw new Error('No se recibió la URL de pago de Mercado Pago.');
            }

        } catch (err) {
            console.error("Error durante el proceso de pago:", err);
            setError(err.response?.data?.message || 'Error desconocido al procesar el pago. Inténtalo de nuevo.');
            setLoading(false);
        }
    };

    // --- ELIMINADO: Ya no necesitamos la vista de éxito aquí ---
    // if (orderSuccess && createdOrder) { ... }
    // --------------------------------------------------------

    // --- El resto del JSX permanece similar, pero con la nueva función y método de pago ---
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Confirmar Pedido</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {/* --- CAMBIO 3: El formulario ahora llama a handleProceedToPayment --- */}
            <form onSubmit={handleProceedToPayment} className="bg-white shadow-lg rounded-lg p-6">
                {/* ... (Tu formulario de dirección de envío, sin cambios) ... */}
                <h2 className="text-2xl font-semibold mb-6">Dirección de Envío</h2>
                {/* ... campos de input ... */}

                {/* --- CAMBIO 4: Actualizamos el método de pago a MercadoPago --- */}
                <h2 className="text-2xl font-semibold mb-6">Método de Pago</h2>
                <div className="mb-6 bg-gray-100 p-4 rounded-lg">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio text-blue-600 h-5 w-5"
                            name="paymentMethod"
                            value="MercadoPago"
                            checked={paymentMethod === 'MercadoPago'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="ml-3 text-gray-800 font-semibold flex items-center">
                            <img src="/images/mercadopago_logo.svg" alt="Mercado Pago" className="h-6 mr-2" />
                            Mercado Pago
                        </span>
                    </label>
                    <p className="text-sm text-gray-600 mt-2 ml-8">Paga de forma segura con tarjeta de crédito, débito o efectivo.</p>
                </div>
                {/* ----------------------------------------------------------- */}

                {/* ... (Tu resumen del pedido, sin cambios) ... */}
                <h2 className="text-2xl font-semibold mb-6">Resumen del Pedido</h2>
                {/* ... subtotal, impuestos, etc ... */}

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 disabled:opacity-50"
                    disabled={loading || cartItems.length === 0}
                >
                    {loading ? 'Procesando...' : 'Continuar al Pago'}
                </button>
            </form>
        </div>
    );
}

export default CheckoutPage;