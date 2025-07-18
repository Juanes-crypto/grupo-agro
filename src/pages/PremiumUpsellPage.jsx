// src/pages/PremiumUpsellPage.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PremiumUpsellPage() {
    const { user, isAuthenticated, isPremium } = useContext(AuthContext);
    const navigate = useNavigate();

    // Si el usuario no está autenticado, redirigir al login
    if (!isAuthenticated) {
        navigate('/login');
        return null; // No renderizar nada mientras se redirige
    }

    // Si el usuario ya es premium, redirigir a la página principal
    if (isPremium) {
        navigate('/');
        return null;
    }

    const handleUpgradeClick = () => {
        // Aquí iría la lógica para iniciar el proceso de pago.
        // Por ahora, solo mostraremos un mensaje.
        alert('¡Gracias por tu interés en Premium! Aquí se integraría una pasarela de pago.');
        // Después de un pago exitoso (simulado), podrías redirigir o actualizar el estado del usuario
        // Por ejemplo:
        // navigate('/payment-gateway');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>¡Desbloquea el Potencial Completo de AgroApp!</h2>
            <p style={styles.subheading}>Conviértete en un Usuario Premium y lleva tu experiencia al siguiente nivel.</p>

            <div style={styles.premiumFeatures}>
                <div style={styles.featureCard}>
                    <h3 style={styles.featureTitle}>📊 BD-Inventario Avanzado</h3>
                    <p style={styles.featureDescription}>Gestiona tu inventario de productos de forma eficiente con nuestra base de datos dedicada. Control total sobre tus existencias.</p>
                </div>
                <div style={styles.featureCard}>
                    <h3 style={styles.featureTitle}>🚀 Publicación Automática</h3>
                    <p style={styles.featureDescription}>Olvídate de las publicaciones manuales. Tus productos se publicarán automáticamente desde tu inventario, ahorrándote tiempo valioso.</p>
                *</div>
                <div style={styles.featureCard}>
                    <h3 style={styles.featureTitle}>✨ Jerarquía Visual Prioritaria</h3>
                    <p style={styles.featureDescription}>Tus productos destacarán sobre el resto. Obtén una visibilidad superior con una presentación visual única y prioritaria en los listados.</p>
                </div>
                <div style={styles.featureCard}>
                    <h3 style={styles.featureTitle}>📞 Soporte Prioritario</h3>
                    <p style={styles.featureDescription}>Accede a nuestro equipo de soporte con prioridad para resolver tus dudas y problemas rápidamente.</p>
                </div>
            </div>

            <div style={styles.priceSection}>
                <p style={styles.price}>Solo <span style={styles.priceAmount}>50.000 COP</span> / mes</p>
                <button onClick={handleUpgradeClick} style={styles.upgradeButton}>
                    ¡Quiero ser Premium Ahora!
                </button>
            </div>

            <div style={styles.footerLinks}>
                <p>¿No te interesa por ahora?</p>
                <Link to="/" style={styles.skipLink}>Continuar a la página principal (Usuario Básico)</Link>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '900px',
        margin: '50px auto',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        color: '#333',
    },
    heading: {
        fontSize: '2.8em',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '20px',
    },
    subheading: {
        fontSize: '1.4em',
        color: '#555',
        marginBottom: '40px',
        lineHeight: '1.5',
    },
    premiumFeatures: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        marginBottom: '50px',
    },
    featureCard: {
        backgroundColor: '#f0f8ff', // Un azul muy claro
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
        },
    },
    featureTitle: {
        fontSize: '1.6em',
        fontWeight: '600',
        color: '#007bff',
        marginBottom: '10px',
    },
    featureDescription: {
        fontSize: '1em',
        color: '#666',
        lineHeight: '1.6',
    },
    priceSection: {
        backgroundColor: '#e6ffe6', // Un verde muy claro
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '40px',
        border: '2px solid #28a745',
    },
    price: {
        fontSize: '1.8em',
        color: '#28a745',
        fontWeight: '600',
        marginBottom: '15px',
    },
    priceAmount: {
        fontSize: '2.5em',
        fontWeight: '800',
        color: '#1e7e34',
    },
    upgradeButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '18px 35px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.5em',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        '&:hover': {
            backgroundColor: '#218838',
            transform: 'scale(1.02)',
        },
    },
    footerLinks: {
        marginTop: '30px',
        fontSize: '1.1em',
        color: '#777',
    },
    skipLink: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop: '10px',
        display: 'block',
        transition: 'color 0.2s ease',
        '&:hover': {
            color: '#0056b3',
            textDecoration: 'underline',
        },
    },
};

export default PremiumUpsellPage;
