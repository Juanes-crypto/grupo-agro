// src/pages/CreateCounterProposalPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function CreateCounterProposalPage() {
    const { id: originalProposalId } = useParams(); // ID de la propuesta original
    const [originalProposal, setOriginalProposal] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [myProducts, setMyProducts] = useState([]);
    const [otherUsersProducts, setOtherUsersProducts] = useState([]);
    const [selectedOfferedItems, setSelectedOfferedItems] = useState([]); // IDs de productos que ofrezco en la contrapropuesta
    const [selectedRequestedItems, setSelectedRequestedItems] = useState([]); // IDs de productos que solicito en la contrapropuesta
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                setError('Debes iniciar sesión para crear una contrapropuesta.');
                return;
            }
            try {
                setLoading(true);
                // Obtener la propuesta original
                const originalResponse = await api.get(`/barter/${originalProposalId}`);
                const prop = originalResponse.data;

                // Verificar que el usuario actual es el RECIPIENTE de la propuesta original
                if (prop.recipient._id !== user._id) {
                    setError('No autorizado para hacer una contraoferta a esta propuesta.');
                    setLoading(false);
                    return;
                }
                if (prop.status !== 'pending') {
                    setError(`No se puede contraofertar una propuesta que ya está ${prop.status}.`);
                    setLoading(false);
                    return;
                }

                setOriginalProposal(prop);

                // Obtener todos los productos
                const productsResponse = await api.get('/products');
                const productsData = productsResponse.data;
                setAllProducts(productsData);

                // Filtrar mis productos (los que el recipiente original puede ofrecer)
                const myProds = productsData.filter(p => p.user === user._id);
                setMyProducts(myProds);

                // Filtrar los productos del proponente original (los que el recipiente original puede solicitar)
                const originalProposerProducts = productsData.filter(p => p.user === prop.proposer._id);
                setOtherUsersProducts(originalProposerProducts); // Renombrado para claridad en este contexto

                // Pre-seleccionar los ítems de la propuesta original como punto de partida
                // Ofreces lo que el original pidió, pides lo que el original ofreció
                setSelectedOfferedItems(prop.requestedItems.map(item => item.product._id));
                setSelectedRequestedItems(prop.offeredItems.map(item => item.product._id));


                setError('');
            } catch (err) {
                console.error('Error al cargar datos para contrapropuesta:', err);
                if (err.response && err.response.data && err.response.data.message) {
                    setError(`Error al cargar datos: ${err.response.data.message}`);
                } else {
                    setError('Error desconocido al cargar datos para la contrapropuesta.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && originalProposalId) {
            fetchData();
        }
    }, [isAuthenticated, authLoading, user, originalProposalId]);

    const handleOfferedItemChange = (productId) => {
        setSelectedOfferedItems(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleRequestedItemChange = (productId) => {
        // En una contrapropuesta, solo puedes solicitar productos del proponente original
        // No necesitamos verificar múltiples recipientes aquí.
        setSelectedRequestedItems(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        if (!isAuthenticated || !user) {
            setError('Debes iniciar sesión para enviar una contrapropuesta.');
            setLoading(false);
            return;
        }

        if (selectedOfferedItems.length === 0 || selectedRequestedItems.length === 0) {
            setError('Debes seleccionar al menos un producto para ofrecer y uno para solicitar en la contrapropuesta.');
            setLoading(false);
            return;
        }

        try {
            const counterProposalData = {
                offeredProductIds: selectedOfferedItems,
                requestedProductIds: selectedRequestedItems,
                message,
            };

            // El endpoint para contraofertar es POST /api/barter/:id/counter
            const response = await api.post(`/barter/${originalProposalId}/counter`, counterProposalData);
            setSuccessMessage('¡Contrapropuesta enviada exitosamente!');
            console.log('Contrapropuesta creada:', response.data);

            // Limpiar formulario y redirigir a mis trueques
            setSelectedOfferedItems([]);
            setSelectedRequestedItems([]);
            setMessage('');
            
            setTimeout(() => navigate('/mybarterproposals'), 2000);

        } catch (err) {
            console.error('Error al crear contrapropuesta:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Error al crear contrapropuesta: ${err.response.data.message}`);
            } else {
                setError('Error desconocido al crear la contrapropuesta.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading || authLoading) {
        return <div style={styles.loading}>Cargando contrapropuesta...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Crear Contrapropuesta</h2>
                <p style={styles.message}>Por favor, <Link to="/login" style={styles.link}>inicia sesión</Link> para crear una contrapropuesta.</p>
            </div>
        );
    }

    if (!originalProposal) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Crear Contrapropuesta</h2>
                <p style={styles.message}>No se pudo cargar la propuesta original o no tienes permiso para contraofertarla.</p>
                <Link to="/mybarterproposals" style={styles.link}>Volver a Mis Trueques</Link>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Contraofertar Propuesta #{originalProposal._id.substring(0, 8)}...</h2>
            <p style={styles.subheading}>De: {originalProposal.proposer.username} | Solicitando: {originalProposal.offeredItems.map(item => item.name).join(', ')}</p>
            <p style={styles.subheading}>Ofreciendo: {originalProposal.requestedItems.map(item => item.name).join(', ')}</p>

            {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
            {error && <p style={styles.errorMessage}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Sección de Tus Productos a Ofrecer (como contraoferta) */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>1. Tus Productos a Ofrecer (en la contrapropuesta)</h3>
                    {myProducts.length === 0 ? (
                        <p style={styles.noProducts}>No tienes productos para ofrecer. <Link to="/create-product" style={styles.link}>Crea uno</Link>.</p>
                    ) : (
                        <div style={styles.productSelectionGrid}>
                            {myProducts.map(product => (
                                <div
                                    key={product._id}
                                    style={selectedOfferedItems.includes(product._id) ? styles.selectedProductCard : styles.productCard}
                                    onClick={() => handleOfferedItemChange(product._id)}
                                >
                                    <img src={product.imageUrl || 'https://placehold.co/100x80'} alt={product.name} style={styles.productImage} />
                                    <p style={styles.productName}>{product.name}</p>
                                    <p style={styles.productQuantity}>{product.quantity}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sección de Productos a Solicitar (del proponente original) */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>2. Productos a Solicitar (a {originalProposal.proposer.username})</h3>
                    {otherUsersProducts.length === 0 ? (
                        <p style={styles.noProducts}>El usuario {originalProposal.proposer.username} no tiene productos disponibles para trueque.</p>
                    ) : (
                        <div style={styles.productSelectionGrid}>
                            {otherUsersProducts.map(product => (
                                <div
                                    key={product._id}
                                    style={selectedRequestedItems.includes(product._id) ? styles.selectedProductCard : styles.productCard}
                                    onClick={() => handleRequestedItemChange(product._id)}
                                >
                                    <img src={product.imageUrl || 'https://placehold.co/100x80'} alt={product.name} style={styles.productImage} />
                                    <p style={styles.productName}>{product.name}</p>
                                    <p style={styles.productQuantity}>{product.quantity}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sección de Mensaje */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>3. Mensaje para la Contrapropuesta (Opcional)</h3>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Explica tu contraoferta..."
                        style={styles.textarea}
                        rows="4"
                    ></textarea>
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Enviando Contrapropuesta...' : 'Enviar Contrapropuesta'}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1000px',
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
        marginBottom: '10px',
        fontSize: '2.5em',
        fontWeight: '600',
    },
    subheading: {
        textAlign: 'center',
        color: '#555',
        marginBottom: '20px',
        fontSize: '1.1em',
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
    productSelectionGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '15px',
        marginTop: '15px',
    },
    productCard: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '10px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: '#fefefe',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    selectedProductCard: {
        border: '2px solid #007bff',
        backgroundColor: '#e7f3ff',
        transform: 'scale(1.02)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    },
    productImage: {
        width: '100%',
        height: '80px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginBottom: '8px',
    },
    productName: {
        fontSize: '0.9em',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '4px',
    },
    productQuantity: {
        fontSize: '0.8em',
        color: '#666',
    },
    noProducts: {
        textAlign: 'center',
        color: '#888',
        padding: '20px',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ced4da',
        borderRadius: '5px',
        fontSize: '1em',
        minHeight: '100px',
        resize: 'vertical',
        boxSizing: 'border-box',
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

export default CreateCounterProposalPage;
