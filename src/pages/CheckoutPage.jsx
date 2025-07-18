// frontend/src/pages/CheckoutPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CheckoutPage() {
    const { cartItems, isAuthenticated, token, clearCart } = useContext(AuthContext);
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('PayPal');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
        if (cartItems.length === 0 && !orderSuccess) {
            setError('Tu carrito está vacío. No puedes proceder al pago.');
            // Opcional: Redirigir al carrito o productos
            // navigate('/cart');
        }
    }, [isAuthenticated, cartItems, navigate, orderSuccess]);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxPrice = subtotal * 0.19; // Ejemplo: 19% de impuestos
    const shippingPrice = subtotal > 100000 ? 0 : 15000; // Envío gratis si el subtotal es mayor a 100,000 COP
    const totalPrice = subtotal + taxPrice + shippingPrice;

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (cartItems.length === 0) {
            setError('No hay productos en el carrito para realizar un pedido.');
            setLoading(false);
            return;
        }

        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            setError('Por favor, completa todos los campos de la dirección de envío.');
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id, // Asegúrate de que este es el ID del producto
                    name: item.name,
                    quantity: item.quantity,
                    image: item.imageUrl, // Asegúrate de que tu producto tenga imageUrl
                    price: item.price,
                })),
                shippingAddress,
                paymentMethod,
                taxPrice: parseFloat(taxPrice.toFixed(2)),
                shippingPrice: parseFloat(shippingPrice.toFixed(2)),
                totalPrice: parseFloat(totalPrice.toFixed(2)),
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/orders',
                orderData,
                config
            );

            // ⭐ Esta línea ahora debería mostrar el ID correctamente ⭐
            console.log("Order created:", data._id);
            setCreatedOrder(data); // Guarda el pedido creado
            setOrderSuccess(true);
            clearCart(); // Vaciar el carrito después de un pedido exitoso
            // ⭐ ASEGÚRATE de que esta redirección sea a /order-details/:id ⭐
            navigate(`/order-details/${data._id}`); // Redirigir a la página de detalles del pedido
        } catch (err) {
            console.error("Error al realizar el pedido:", err);
            setError(err.response?.data?.message || 'Error desconocido al realizar el pedido. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center text-xl">Procesando tu pedido...</div>;
    }

    // ⭐ Mensaje de éxito después de crear el pedido ⭐
    if (orderSuccess && createdOrder) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">¡Pedido Realizado con Éxito! 🎉</h1>
                <p className="text-lg mb-4">Tu pedido con ID: <span className="font-semibold">{createdOrder._id}</span> ha sido recibido.</p>
                <p className="text-lg mb-6">Te hemos redirigido a los detalles de tu pedido. Puedes ver el estado y la información completa allí.</p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link
                        to={`/order-details/${createdOrder._id}`} // Redirige a la ruta correcta de detalles
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
                    >
                        Ver Detalles del Pedido
                    </Link>
                    <Link
                        to="/my-orders"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
                    >
                        Ver Mis Pedidos
                    </Link>
                    <Link
                        to="/products"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
                    >
                        Continuar Comprando
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Confirmar Pedido</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            <form onSubmit={handleSubmitOrder} className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Dirección de Envío</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Dirección</label>
                        <input
                            type="text"
                            id="address"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={shippingAddress.address}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">Ciudad</label>
                        <input
                            type="text"
                            id="city"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">Código Postal</label>
                        <input
                            type="text"
                            id="postalCode"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">País</label>
                        <input
                            type="text"
                            id="country"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={shippingAddress.country}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <h2 className="text-2xl font-semibold mb-6">Método de Pago</h2>
                <div className="mb-6">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio text-blue-600"
                            name="paymentMethod"
                            value="PayPal"
                            checked={paymentMethod === 'PayPal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="ml-2 text-gray-700">PayPal</span>
                    </label>
                    {/* Puedes añadir más opciones de pago aquí */}
                </div>

                <h2 className="text-2xl font-semibold mb-6">Resumen del Pedido</h2>
                <div className="border-t border-b py-4 mb-6">
                    <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Impuestos (19%):</span>
                        <span>${taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Costo de Envío:</span>
                        <span>${shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl">
                        <span>Total:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
                    disabled={loading || cartItems.length === 0}
                >
                    {loading ? 'Realizando Pedido...' : 'Realizar Pedido'}
                </button>
            </form>
        </div>
    );
}

export default CheckoutPage;