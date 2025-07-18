// src/pages/BarterDetailsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function BarterDetailsPage() {
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // Para mensajes de éxito/error de acciones
    const { id: proposalId } = useParams(); // Obtener el ID de la propuesta de la URL
    const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchProposal = async () => {
        if (!isAuthenticated) {
            setLoading(false);
            setError('Debes iniciar sesión para ver los detalles de la propuesta.');
            return;
        }
        try {
            setLoading(true);
            const response = await api.get(`/barter/${proposalId}`);
            setProposal(response.data);
            setError('');
            setMessage('');
        } catch (err) {
            console.error('Error al obtener los detalles de la propuesta de trueque:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Error al cargar la propuesta: ${err.response.data.message}`);
            } else {
                setError('Error desconocido al cargar los detalles de la propuesta.');
            }
            setProposal(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && proposalId) {
            fetchProposal();
        }
    }, [proposalId, isAuthenticated, authLoading]);

    // Función para manejar el cambio de estado de una propuesta (aceptar, rechazar, cancelar)
    const handleUpdateStatus = async (newStatus) => {
        try {
            setMessage('');
            setError('');
            setLoading(true);

            const response = await api.put(`/barter/${proposalId}/status`, { status: newStatus });
            
            // Mensaje de éxito más específico
            let successMsg = '';
            if (newStatus === 'accepted') {
                successMsg = 'Propuesta aceptada exitosamente.';
            } else if (newStatus === 'rejected') {
                successMsg = 'Propuesta rechazada exitosamente.';
            } else if (newStatus === 'cancelled') {
                successMsg = 'Propuesta cancelada exitosamente.';
            } else {
                successMsg = `Propuesta actualizada a ${newStatus} exitosamente.`;
            }
            setMessage(successMsg);
            
            console.log(`Propuesta ${newStatus}:`, response.data);
            setProposal(response.data); // Actualizar la propuesta con el nuevo estado del backend

        } catch (err) {
            console.error(`Error al ${newStatus} la propuesta:`, err);
            // Mensaje de error más robusto
            let errMsg = `Error desconocido al ${newStatus} la propuesta.`;
            if (err.response && err.response.data && err.response.data.message) {
                errMsg = `Error al ${newStatus} la propuesta: ${err.response.data.message}`;
            }
            setError(errMsg);
            setMessage(''); // Limpiar mensaje de éxito si hay un error
        } finally {
            setLoading(false);
        }
    };

    if (loading || authLoading) {
        return <div style={styles.loading}>Cargando detalles de la propuesta...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Detalles de la Propuesta de Trueque</h2>
                <p style={styles.message}>Por favor, <Link to="/login" style={styles.link}>inicia sesión</Link> para ver esta propuesta.</p>
            </div>
        );
    }

    if (!proposal) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Detalles de la Propuesta de Trueque</h2>
                <p style={styles.message}>Propuesta no encontrada o no autorizado para ver.</p>
                <Link to="/mybarterproposals" style={styles.link}>Volver a Mis Trueques</Link>
            </div>
        );
    }

    // Determinar si el usuario actual es el proponente o el recipiente
    const isProposer = user && proposal.proposer && proposal.proposer._id === user._id;
    const isRecipient = user && proposal.recipient && proposal.recipient._id === user._id;

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Detalles de la Propuesta #{proposal._id.substring(0, 8)}...</h2>
            {message && <p style={styles.successMessage}>{message}</p>}
            {error && <p style={styles.errorMessage}>{error}</p>}

            <div style={styles.proposalSummary}>
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>Información General</h3>
                    <p><strong>Estado:</strong> <span style={styles.status[proposal.status]}>{proposal.status.toUpperCase()}</span></p>
                    <p><strong>Proponente:</strong> {proposal.proposer.username} ({proposal.proposer.email})</p>
                    <p><strong>Recipiente:</strong> {proposal.recipient.username} ({proposal.recipient.email})</p>
                    <p><strong>Fecha de Creación:</strong> {new Date(proposal.createdAt).toLocaleDateString()} {new Date(proposal.createdAt).toLocaleTimeString()}</p>
                    {proposal.message && (
                        <p style={styles.messageText}>
                            <strong>Mensaje:</strong> {proposal.message}
                        </p>
                    )}
                </div>

                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>Productos Ofrecidos por {proposal.proposer.username}</h3>
                    <div style={styles.itemsGrid}>
                        {proposal.offeredItems.map(item => (
                            <div key={item.product._id} style={styles.itemCard}>
                                <img src={item.image || 'https://placehold.co/80x80'} alt={item.name} style={styles.itemImage} />
                                <p style={styles.itemName}>{item.name}</p>
                                <p style={styles.itemQuantity}>Cantidad: {item.quantity}</p>
                                <p style={styles.itemDescription}>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>Productos Solicitados a {proposal.recipient.username}</h3>
                    <div style={styles.itemsGrid}>
                        {proposal.requestedItems.map(item => (
                            <div key={item.product._id} style={styles.itemCard}>
                                <img src={item.image || 'https://placehold.co/80x80'} alt={item.name} style={styles.itemImage} />
                                <p style={styles.itemName}>{item.name}</p>
                                <p style={styles.itemQuantity}>Cantidad: {item.quantity}</p>
                                <p style={styles.itemDescription}>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sección de Acciones */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeading}>Acciones</h3>
                    <div style={styles.actions}>
                        {proposal.status === 'pending' && isRecipient && (
                            <>
                                <button
                                    onClick={() => handleUpdateStatus('accepted')}
                                    style={styles.actionButtonAccept}
                                    disabled={loading}
                                >
                                    Aceptar Propuesta
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('rejected')}
                                    style={styles.actionButtonReject}
                                    disabled={loading}
                                >
                                    Rechazar Propuesta
                                </button>
                                <Link to={`/barter/${proposal._id}/counter`} style={styles.actionButtonCounter}>
                                    Contraofertar
                                </Link>
                            </>
                        )}
                        {(proposal.status === 'pending' || proposal.status === 'countered') && isProposer && (
                            <button
                                onClick={() => handleUpdateStatus('cancelled')}
                                style={styles.actionButtonCancel}
                                disabled={loading}
                            >
                                Cancelar Propuesta
                            </button>
                        )}
                        {/* Si la propuesta es 'countered' y eres el recipiente de la contraoferta */}
                        {proposal.status === 'countered' && isRecipient && (
                            <p style={styles.infoMessage}>Esta propuesta ha sido contraofertada. Revisa tus "Mis Trueques" para la nueva propuesta.</p>
                        )}
                        {proposal.status === 'accepted' && <p style={styles.infoMessage}>¡Esta propuesta ha sido aceptada!</p>}
                        {proposal.status === 'rejected' && <p style={styles.infoMessage}>Esta propuesta ha sido rechazada.</p>}
                        {proposal.status === 'cancelled' && <p style={styles.infoMessage}>Esta propuesta ha sido cancelada.</p>}
                    </div>
                </div>
            </div>
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
    proposalSummary: {
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
    status: {
        pending: { color: '#ffc107', fontWeight: 'bold' },
        accepted: { color: '#28a745', fontWeight: 'bold' },
        rejected: { color: '#dc3545', fontWeight: 'bold' },
        countered: { color: '#6f42c1', fontWeight: 'bold' },
        cancelled: { color: '#6c757d', fontWeight: 'bold' },
    },
    messageText: {
        fontStyle: 'italic',
        color: '#777',
        borderLeft: '3px solid #007bff',
        paddingLeft: '10px',
        margin: '15px 0',
    },
    itemsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '15px',
        marginTop: '15px',
    },
    itemCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '0.9em',
        color: '#555',
        textAlign: 'center',
        border: '1px solid #f0f0f0',
        borderRadius: '8px',
        padding: '10px',
        backgroundColor: '#fefefe',
    },
    itemImage: {
        width: '80px',
        height: '80px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginBottom: '8px',
    },
    itemName: {
        fontWeight: 'bold',
        marginBottom: '4px',
    },
    itemQuantity: {
        fontSize: '0.85em',
        color: '#666',
    },
    itemDescription: {
        fontSize: '0.75em',
        color: '#888',
        marginTop: '5px',
    },
    actions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '20px',
        justifyContent: 'center',
    },
    actionButton: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonAccept: {
        backgroundColor: '#28a745',
        color: 'white',
        '&:hover': {
            backgroundColor: '#218838',
        },
    },
    actionButtonReject: {
        backgroundColor: '#dc3545',
        color: 'white',
        '&:hover': {
            backgroundColor: '#c82333',
        },
    },
    actionButtonCancel: {
        backgroundColor: '#6c757d',
        color: 'white',
        '&:hover': {
            backgroundColor: '#5a6268',
        },
    },
    actionButtonCounter: {
        backgroundColor: '#007bff',
        color: 'white',
        '&:hover': {
            backgroundColor: '#0056b3',
        },
    },
    infoMessage: {
        textAlign: 'center',
        fontSize: '1em',
        color: '#555',
        backgroundColor: '#e9ecef',
        padding: '10px',
        borderRadius: '5px',
        width: '100%',
    },
};

export default BarterDetailsPage;
