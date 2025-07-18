// src/pages/CreateBarterProposalPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function CreateBarterProposalPage() {
    const [allProducts, setAllProducts] = useState([]);
    const [myProducts, setMyProducts] = useState([]);
    const [otherUsersProducts, setOtherUsersProducts] = useState([]);
    const [selectedOfferedItems, setSelectedOfferedItems] = useState([]); // IDs de productos que ofrezco
    const [selectedRequestedItems, setSelectedRequestedItems] = useState([]); // IDs de productos que solicito
    const [recipientId, setRecipientId] = useState(''); // ID del usuario al que se le hace la propuesta
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                setError('Debes iniciar sesión para crear una propuesta de trueque.');
                return;
            }
            try {
                setLoading(true);
                const response = await api.get('/products');
                const productsData = response.data;
                setAllProducts(productsData);

                // Filtrar mis productos y los productos de otros usuarios
                const myProds = productsData.filter(p => p.user === user._id);
                const otherProds = productsData.filter(p => p.user !== user._id);

                setMyProducts(myProds);
                setOtherUsersProducts(otherProds);
                setError('');
            } catch (err) {
                console.error('Error al obtener productos para trueque:', err);
                setError('Error al cargar productos para la propuesta de trueque.');
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchProducts();
        }
    }, [isAuthenticated, authLoading, user]);

    const handleOfferedItemChange = (productId) => {
        setSelectedOfferedItems(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleRequestedItemChange = (productId) => {
        const selectedProduct = allProducts.find(p => p._id === productId);

        if (!selectedProduct) return;

        // Si es el primer producto solicitado, establece el recipiente
        if (selectedRequestedItems.length === 0) {
            setRecipientId(selectedProduct.user);
        } else {
            // Si ya hay productos solicitados, asegúrate de que el nuevo producto sea del mismo recipiente
            const currentRecipientId = allProducts.find(p => p._id === selectedRequestedItems[0])?.user;
            if (selectedProduct.user !== currentRecipientId) {
                setError('Solo puedes solicitar productos de un mismo usuario en una propuesta.');
                return;
            }
        }
        setError(''); // Limpiar error si todo está bien

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
            setError('Debes iniciar sesión para crear una propuesta.');
            setLoading(false);
            return;
        }

        if (selectedOfferedItems.length === 0 || selectedRequestedItems.length === 0) {
            setError('Debes seleccionar al menos un producto para ofrecer y uno para solicitar.');
            setLoading(false);
            return;
        }

        if (!recipientId) {
            setError('No se pudo determinar el recipiente de la propuesta. Selecciona un producto solicitado.');
            setLoading(false);
            return;
        }

        if (user._id === recipientId) {
             setError('No puedes hacer una propuesta de trueque a ti mismo.');
             setLoading(false);
             return;
        }

        try {
            const proposalData = {
                recipientId,
                offeredProductIds: selectedOfferedItems,
                requestedProductIds: selectedRequestedItems,
                message,
            };

            const response = await api.post('/barter', proposalData);
            setSuccessMessage('¡Propuesta de trueque enviada exitosamente!');
            console.log('Propuesta creada:', response.data);

            // Limpiar formulario
            setSelectedOfferedItems([]);
            setSelectedRequestedItems([]);
            setRecipientId('');
            setMessage('');

            // Opcional: redirigir a la página de mis propuestas
            setTimeout(() => navigate('/mybarterproposals'), 2000);

        } catch (err) {
            console.error('Error al crear propuesta de trueque:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Error al crear propuesta: ${err.response.data.message}`);
            } else {
                setError('Error desconocido al crear la propuesta de trueque.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Filtrar los productos de otros usuarios para que solo muestren los del recipiente seleccionado
    const productsForRecipientSelection = otherUsersProducts.filter(p => {
        if (selectedRequestedItems.length === 0) {
            return true; // Mostrar todos los productos de otros usuarios si no se ha seleccionado nada
        }
        // Si ya hay productos seleccionados, solo mostrar los del mismo recipiente
        const currentRecipient = allProducts.find(prod => prod._id === selectedRequestedItems[0]);
        return p.user === currentRecipient?.user;
    });


    if (loading || authLoading) {
        return <div style={styles.loading}>Cargando...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Crear Propuesta de Trueque</h2>
                <p style={styles.message}>Por favor, <Link to="/login" style={styles.link}>inicia sesión</Link> para crear una propuesta de trueque.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Crear Propuesta de Trueque</h2>
            {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
            {error && <p style={styles.errorMessage}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Sección de Productos Ofrecidos */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>1. Tus Productos a Ofrecer</h3>
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
                                    <p style={styles.productPrice}>${product.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sección de Productos Solicitados */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>2. Productos a Solicitar (de otros usuarios)</h3>
                    {otherUsersProducts.length === 0 ? (
                        <p style={styles.noProducts}>No hay productos de otros usuarios disponibles para trueque.</p>
                    ) : (
                        <div style={styles.productSelectionGrid}>
                            {productsForRecipientSelection.map(product => (
                                <div
                                    key={product._id}
                                    style={selectedRequestedItems.includes(product._id) ? styles.selectedProductCard : styles.productCard}
                                    onClick={() => handleRequestedItemChange(product._id)}
                                >
                                    <img src={product.imageUrl || 'https://placehold.co/100x80'} alt={product.name} style={styles.productImage} />
                                    <p style={styles.productName}>{product.name}</p>
                                    <p style={styles.productPrice}>${product.price.toFixed(2)}</p>
                                    <p style={styles.productOwner}>De: {product.user === recipientId ? 'Tú' : (allProducts.find(p => p.user === product.user)?.user || 'Otro')}</p> {/* Mostrar el dueño del producto */}
                                </div>
                            ))}
                        </div>
                    )}
                    {recipientId && (
                        <p style={styles.recipientInfo}>
                            Propuesta para el usuario: <strong>{allProducts.find(p => p.user === recipientId)?.user || 'Cargando...'}</strong>
                        </p>
                    )}
                </div>

                {/* Sección de Mensaje */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>3. Mensaje (Opcional)</h3>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe un mensaje para tu propuesta de trueque..."
                        style={styles.textarea}
                        rows="4"
                    ></textarea>
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Enviando Propuesta...' : 'Enviar Propuesta de Trueque'}
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
        border: '2px solid #007bff', // Borde azul para seleccionados
        backgroundColor: '#e7f3ff', // Fondo ligeramente azul
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
    productPrice: {
        fontSize: '0.8em',
        color: '#666',
    },
    productOwner: {
        fontSize: '0.75em',
        color: '#888',
        marginTop: '5px',
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
        backgroundColor: '#28a745',
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
        backgroundColor: '#218838',
    },
    recipientInfo: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '1.1em',
        color: '#34495e',
        backgroundColor: '#e9ecef',
        padding: '10px',
        borderRadius: '5px',
    },
};

export default CreateBarterProposalPage;
