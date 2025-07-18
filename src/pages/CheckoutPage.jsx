// src/pages/CheckoutPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Tu instancia de Axios configurada
import { AuthContext } from '../context/AuthContext'; // Para acceder al usuario autenticado

function CheckoutPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // Mensajes de éxito o error
    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('PayPal'); // Opciones: 'PayPal', 'Stripe', 'Efectivo'
    const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch user's cart
    useEffect(() => {
        const fetchCart = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                setError('Debes iniciar sesión para proceder al pago.');
                return;
            }
            try {
                setLoading(true);
                const response = await api.get('/cart');
                setCart(response.data);
                setError('');
                setMessage('');
                // If cart is empty, redirect back to cart page or product list
                if (!response.data || response.data.items.length === 0) {
                    setError('Tu carrito está vacío. Añade productos antes de proceder al pago.');
                    setTimeout(() => navigate('/cart'), 2000); // Redirect to cart page
                }
            } catch (err) {
                console.error('Error al obtener el carrito para el pago:', err);
                setError('Error al cargar el carrito para el pago. Inténtalo de nuevo más tarde.');
                setCart(null);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchCart();
        }
    }, [isAuthenticated, authLoading, navigate]);

    const handleShippingChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const calculateSubtotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((acc, item) => acc + item.quantity * item.priceAtTime, 0);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para completar la compra.');
            return;
        }
        if (!cart || cart.items.length === 0) {
            setError('Tu carrito está vacío. No se puede realizar el pedido.');
            return;
        }
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            setError('Por favor, completa todos los campos de la dirección de envío.');
            return;
        }

        setLoading(true);

        const orderItems = cart.items.map(item => ({
            product: item.product._id, // Asegúrate de enviar solo el ID del producto
            name: item.nameAtTime,
            quantity: item.quantity,
            image: item.imageUrlAtTime,
            price: item.priceAtTime,
        }));

        const subtotal = calculateSubtotal();
        const shippingPrice = 5.00; // Example fixed shipping price
        const taxPrice = subtotal * 0.10; // Example 10% tax
        const totalPrice = subtotal + shippingPrice + taxPrice;

        try {
            const orderData = {
                orderItems,
                shippingAddress,
                paymentMethod,
                taxPrice: parseFloat(taxPrice.toFixed(2)),
                shippingPrice: parseFloat(shippingPrice.toFixed(2)),
                totalPrice: parseFloat(totalPrice.toFixed(2)),
            };

            const response = await api.post('/orders', orderData);
            setMessage('¡Pedido realizado con éxito!');
            console.log('Order created:', response.data);

            // Clear cart in frontend state after successful order (backend also clears it)
            setCart(prevCart => ({ ...prevCart, items: [] }));

            // Redirect to a success page or order details page
            navigate(`/order/${response.data._id}`); // Navigate to a new order details page

        } catch (err) {
            console.error('Error al realizar el pedido:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Error al realizar el pedido: ${err.response.data.message}`);
            } else {
                setError('Error desconocido al realizar el pedido. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading || authLoading) {
        return <div style={styles.loading}>Cargando...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Proceder al Pago</h2>
                <p style={styles.message}>Por favor, <Link to="/login" style={styles.link}>inicia sesión</Link> para ver tu carrito.</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div style={styles.emptyCart}>
                <p>Tu carrito está vacío. <Link to="/" style={styles.link}>Añade productos</Link> antes de proceder al pago.</p>
            </div>
        );
    }

    const subtotal = calculateSubtotal();
    const shippingPrice = 5.00; // Example fixed shipping price
    const taxPrice = subtotal * 0.10; // Example 10% tax
    const totalPrice = subtotal + shippingPrice + taxPrice;

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Proceder al Pago</h2>
            {message && <p style={styles.successMessage}>{message}</p>}
            {error && <p style={styles.errorMessage}>{error}</p>}

            <form onSubmit={handleSubmitOrder} style={styles.form}>
                {/* Shipping Address Section */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>1. Dirección de Envío</h3>
                    <div style={styles.formGroup}>
                        <label htmlFor="address" style={styles.label}>Dirección:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={shippingAddress.address}
                            onChange={handleShippingChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="city" style={styles.label}>Ciudad:</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={shippingAddress.city}
                            onChange={handleShippingChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="postalCode" style={styles.label}>Código Postal:</label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={shippingAddress.postalCode}
                            onChange={handleShippingChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="country" style={styles.label}>País:</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={shippingAddress.country}
                            onChange={handleShippingChange}
                            required
                            style={styles.input}
                        />
                    </div>
                </div>

                {/* Payment Method Section */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>2. Método de Pago</h3>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Selecciona Método:</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={styles.select}
                        >
                            <option value="PayPal">PayPal</option>
                            <option value="Stripe">Tarjeta de Crédito/Débito (Stripe)</option>
                            <option value="Efectivo">Efectivo al Recibir</option>
                        </select>
                    </div>
                </div>

                {/* Order Summary Section */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>3. Resumen del Pedido</h3>
                    <div style={styles.summaryItems}>
                        {cart.items.map(item => (
                            <div key={item.product._id} style={styles.summaryItem}>
                                <img src={item.imageUrlAtTime || 'https://placehold.co/50x50'} alt={item.nameAtTime} style={styles.summaryItemImage} />
                                <span style={styles.summaryItemName}>{item.nameAtTime} x {item.quantity}</span>
                                <span style={styles.summaryItemPrice}>${(item.quantity * item.priceAtTime).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div style={styles.summaryRow}>
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div style={styles.summaryRow}>
                        <span>Envío:</span>
                        <span>${shippingPrice.toFixed(2)}</span>
                    </div>
                    <div style={styles.summaryRow}>
                        <span>Impuestos (10%):</span>
                        <span>${taxPrice.toFixed(2)}</span>
                    </div>
                    <div style={styles.summaryTotalRow}>
                        <strong>Total:</strong>
                        <strong>${totalPrice.toFixed(2)}</strong>
                    </div>
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Procesando...' : 'Realizar Pedido'}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '2.2em',
        fontWeight: '600',
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2em',
        color: '#666',
        padding: '50px',
    },
    error: {
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    successMessage: {
        color: '#28a745',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    errorMessage: {
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        fontSize: '1.1em',
        color: '#555',
        marginBottom: '20px',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    emptyCart: {
        textAlign: 'center',
        fontSize: '1.2em',
        color: '#888',
        padding: '50px',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '25px',
        marginBottom: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    sectionHeading: {
        fontSize: '1.8em',
        color: '#34495e',
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
    },
    formGroup: {
        marginBottom: '18px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#34495e',
        fontWeight: 'bold',
        fontSize: '1em',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ced4da',
        borderRadius: '5px',
        fontSize: '1em',
        boxSizing: 'border-box',
    },
    select: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ced4da',
        borderRadius: '5px',
        fontSize: '1em',
        backgroundColor: '#fff',
        cursor: 'pointer',
        boxSizing: 'border-box',
    },
    summaryItems: {
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
    },
    summaryItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        gap: '10px',
    },
    summaryItemImage: {
        width: '50px',
        height: '50px',
        objectFit: 'cover',
        borderRadius: '5px',
    },
    summaryItemName: {
        flexGrow: 1,
        fontSize: '1em',
        color: '#555',
    },
    summaryItemPrice: {
        fontSize: '1em',
        fontWeight: 'bold',
        color: '#333',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '1.1em',
        color: '#555',
    },
    summaryTotalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '2px solid #007bff',
        fontSize: '1.4em',
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '14px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        marginTop: '20px',
        width: '100%',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
};
export default CheckoutPage;
