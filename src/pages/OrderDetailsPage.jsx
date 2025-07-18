// src/pages/OrderDetailsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Tu instancia de Axios configurada
import { AuthContext } from '../context/AuthContext'; // Para acceder al usuario autenticado

function OrderDetailsPage() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id: orderId } = useParams(); // Obtener el ID del pedido de la URL
    const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                setError('Debes iniciar sesión para ver los detalles del pedido.');
                return;
            }
            try {
                setLoading(true);
                const response = await api.get(`/orders/${orderId}`);
                setOrder(response.data);
                setError('');
            } catch (err) {
                console.error('Error al obtener los detalles del pedido:', err);
                if (err.response && err.response.data && err.response.data.message) {
                    setError(`Error al cargar el pedido: ${err.response.data.message}`);
                } else {
                    setError('Error desconocido al cargar los detalles del pedido.');
                }
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && orderId) { // Asegurarse de que la autenticación ha cargado y tenemos un ID de pedido
            fetchOrder();
        }
    }, [orderId, isAuthenticated, authLoading]); // Dependencias: se ejecuta cuando cambia el ID del pedido o el estado de autenticación

    if (loading || authLoading) {
        return <div style={styles.loading}>Cargando detalles del pedido...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Detalles del Pedido</h2>
                <p style={styles.message}>Por favor, <Link to="/login" style={styles.link}>inicia sesión</Link> para ver este pedido.</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Detalles del Pedido</h2>
                <p style={styles.message}>Pedido no encontrado o no autorizado para ver.</p>
                <Link to="/" style={styles.link}>Volver a Productos</Link>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Detalles del Pedido #{order._id}</h2>
            <div style={styles.orderSummary}>
                {/* Sección de Envío */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>Dirección de Envío</h3>
                    <p><strong>Dirección:</strong> {order.shippingAddress.address}</p>
                    <p><strong>Ciudad:</strong> {order.shippingAddress.city}</p>
                    <p><strong>Código Postal:</strong> {order.shippingAddress.postalCode}</p>
                    <p><strong>País:</strong> {order.shippingAddress.country}</p>
                </div>

                {/* Sección de Pago */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>Método de Pago</h3>
                    <p><strong>Método:</strong> {order.paymentMethod}</p>
                    {order.isPaid ? (
                        <p style={styles.paidStatus}>Pagado el {new Date(order.paidAt).toLocaleDateString()}</p>
                    ) : (
                        <p style={styles.notPaidStatus}>No Pagado</p>
                        // Aquí podrías añadir un botón para "Pagar Ahora"
                    )}
                </div>

                {/* Sección de Productos del Pedido */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>Productos del Pedido</h3>
                    <div style={styles.orderItemsContainer}>
                        {order.orderItems.map((item) => (
                            <div key={item.product._id} style={styles.orderItem}>
                                <img
                                    src={item.image || 'https://placehold.co/60x60/cccccc/333333?text=No+Image'}
                                    alt={item.name}
                                    style={styles.orderItemImage}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60/cccccc/333333?text=No+Image'; }}
                                />
                                <div style={styles.orderItemDetails}>
                                    <Link to={`/products/${item.product._id}`} style={styles.orderItemName}>
                                        {item.name}
                                    </Link>
                                    <p style={styles.orderItemQuantityPrice}>
                                        {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sección de Resumen de Precios */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>Resumen de Precios</h3>
                    <div style={styles.priceRow}>
                        <span>Items:</span>
                        <span>${order.orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</span>
                    </div>
                    <div style={styles.priceRow}>
                        <span>Envío:</span>
                        <span>${order.shippingPrice.toFixed(2)}</span>
                    </div>
                    <div style={styles.priceRow}>
                        <span>Impuestos:</span>
                        <span>${order.taxPrice.toFixed(2)}</span>
                    </div>
                    <div style={styles.priceTotalRow}>
                        <strong>Total:</strong>
                        <strong>${order.totalPrice.toFixed(2)}</strong>
                    </div>
                </div>

                {/* Sección de Estado de Entrega */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>Estado de Entrega</h3>
                    {order.isDelivered ? (
                        <p style={styles.deliveredStatus}>Entregado el {new Date(order.deliveredAt).toLocaleDateString()}</p>
                    ) : (
                        <p style={styles.notDeliveredStatus}>No Entregado</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '900px',
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
        fontSize: '2.5em',
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
    orderSummary: {
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    sectionHeading: {
        fontSize: '1.6em',
        color: '#34495e',
        marginBottom: '15px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
    },
    orderItemsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    orderItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        paddingBottom: '10px',
        borderBottom: '1px dashed #eee',
    },
    orderItemImage: {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '5px',
    },
    orderItemDetails: {
        flexGrow: 1,
    },
    orderItemName: {
        fontSize: '1.1em',
        fontWeight: 'bold',
        color: '#007bff',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    orderItemQuantityPrice: {
        fontSize: '0.95em',
        color: '#555',
    },
    priceRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '1.1em',
        color: '#555',
    },
    priceTotalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '2px solid #007bff',
        fontSize: '1.4em',
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    paidStatus: {
        color: '#28a745',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    notPaidStatus: {
        color: '#ffc107',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    deliveredStatus: {
        color: '#28a745',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    notDeliveredStatus: {
        color: '#dc3545',
        fontWeight: 'bold',
        marginTop: '10px',
    },
};

export default OrderDetailsPage;
