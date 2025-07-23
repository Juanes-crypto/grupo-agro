// AGROAPP-UI/src/pages/MyBarterProposalsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Asegúrate de que tu instancia de Axios esté aquí
import { AuthContext } from '../context/AuthContext'; // Para acceder al usuario autenticado
import { toast } from 'react-toastify'; // Para notificaciones de éxito/error

function MyBarterProposalsPage() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useContext(AuthContext); // Obtenemos el usuario del contexto
    const navigate = useNavigate();

    // Función para obtener las propuestas del backend
    const fetchProposals = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('http://localhost:5000/api/barter/myproposals');
            // Asegúrate de que response.data sea un array, si no, usa un array vacío
            setProposals(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Error al cargar tus propuestas de trueque: ' + (err.response?.data?.message || err.message));
            console.error("Error fetching barter proposals:", err);
            setProposals([]); // Asegura que proposals sea un array vacío en caso de error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }
        fetchProposals();
    }, [isAuthenticated, user, navigate]);

    // Función auxiliar para determinar si la propuesta fue iniciada por el usuario actual
    const isOutgoingProposal = (proposal) => {
        return proposal.proposer?._id === user?._id;
    };

    // Función auxiliar para determinar si la propuesta es una contraoferta
    const isCounterProposal = (proposal) => {
        return proposal.originalProposalId !== null && proposal.originalProposalId !== undefined;
    };

    // --- Manejadores de Acciones de Trueque ---

    const handleAcceptOriginalProposal = async (proposalId) => {
        try {
            await api.put(`http://localhost:5000/api/barter/${proposalId}/status`, { status: 'accepted' });
            toast.success('¡Propuesta aceptada con éxito!');
            fetchProposals(); // Recargar propuestas para actualizar el estado
        } catch (err) {
            toast.error('Error al aceptar la propuesta: ' + (err.response?.data?.message || err.message));
            console.error("Error accepting original proposal:", err);
        }
    };

    const handleRejectOriginalProposal = async (proposalId) => {
        try {
            await api.put(`http://localhost:5000/api/barter/${proposalId}/status`, { status: 'rejected' });
            toast.info('Propuesta rechazada.');
            fetchProposals();
        } catch (err) {
            toast.error('Error al rechazar la propuesta: ' + (err.response?.data?.message || err.message));
            console.error("Error rejecting original proposal:", err);
        }
    };

    const handleAcceptCounterProposal = async (proposalId) => {
        try {
            await api.put(`http://localhost:5000/api/barter/${proposalId}/counter/accept`);
            toast.success('¡Contraoferta aceptada! Trueque completado. 🎉');
            fetchProposals();
        } catch (err) {
            toast.error('Error al aceptar la contraoferta: ' + (err.response?.data?.message || err.message));
            console.error("Error accepting counter-proposal:", err);
        }
    };

    const handleRejectCounterProposal = async (proposalId) => {
        try {
            await api.put(`http://localhost:5000/api/barter/${proposalId}/counter/reject`);
            toast.info('Contraoferta rechazada.');
            fetchProposals();
        } catch (err) {
            toast.error('Error al rechazar la contraoferta: ' + (err.response?.data?.message || err.message));
            console.error("Error rejecting counter-proposal:", err);
        }
    };

    const handleCancelProposal = async (proposalId) => {
        try {
            await api.put(`http://localhost:5000/api/barter/${proposalId}/cancel`);
            toast.warn('Propuesta cancelada.');
            fetchProposals();
        } catch (err) {
            toast.error('Error al cancelar la propuesta: ' + (err.response?.data?.message || err.message));
            console.error("Error canceling proposal:", err);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 ring-yellow-500/10';
            case 'accepted': return 'bg-green-100 text-green-800 ring-green-500/10';
            case 'rejected': return 'bg-red-100 text-red-800 ring-red-500/10';
            case 'countered': return 'bg-blue-100 text-blue-800 ring-blue-500/10';
            case 'cancelled': return 'bg-gray-100 text-gray-800 ring-gray-500/10';
            case 'completed': return 'bg-purple-100 text-purple-800 ring-purple-500/10'; // Nuevo estado para completado
            default: return 'bg-gray-100 text-gray-800 ring-gray-500/10';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-700 text-2xl animate-pulse">
                Cargando tus propuestas de trueque... 🌱
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-red-50 text-red-700 text-xl font-semibold p-4 text-center">
                Error al cargar: {error}. Por favor, inténtalo de nuevo más tarde. 😟
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-green-900 mb-8 sm:mb-12 drop-shadow-lg">
                    Mis Trueques y Propuestas 🤝
                </h1>

                {!loading && !error && proposals.length === 0 && (
                    <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center border-b-4 border-green-500 max-w-2xl mx-auto">
                        <p className="text-xl sm:text-2xl text-gray-700 mb-6">
                            Aún no tienes propuestas de trueque. ¡Es hora de empezar a intercambiar!
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-lg sm:text-xl font-bold rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-75 transition duration-300 transform hover:scale-105"
                        >
                            <svg className="-ml-1 mr-2 h-6 w-6 sm:h-7 sm:w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Explorar Productos
                        </Link>
                    </div>
                )}

                {Array.isArray(proposals) && proposals.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                        {proposals.map(proposal => (
                            <div
                                key={proposal._id}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] border border-gray-200 flex flex-col"
                            >
                                <div className="p-5 flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                                            Trueque #{proposal._id.slice(-6)}
                                            {isCounterProposal(proposal) && (
                                                <span className="ml-2 px-3 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                                                    Contraoferta
                                                </span>
                                            )}
                                        </h2>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide capitalize ring-1 ring-inset ${getStatusClass(proposal.status)}`}
                                        >
                                            {proposal.status}
                                        </span>
                                    </div>

                                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                                        Fecha: {new Date(proposal.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>

                                    <div className="mb-4 text-sm sm:text-base">
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Proponente:</span> {proposal.proposer?.username || 'Desconocido'} ({proposal.proposer?.email || 'N/A'})
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Recipiente:</span> {proposal.recipient?.username || 'Desconocido'} ({proposal.recipient?.email || 'N/A'})
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                        {/* Tus Artículos Ofrecidos */}
                                        <div className="bg-blue-50 p-3 rounded-lg shadow-inner border border-blue-200">
                                            <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2 flex items-center">
                                                <span className="mr-2">📤</span> Tus Ofrecidos
                                            </h3>
                                            {Array.isArray(proposal.offeredItems) && proposal.offeredItems.map(item => (
                                                <div key={item.product?._id || item._id} className="flex items-center space-x-2 mb-2 last:mb-0">
                                                    {/* ⭐ CAMBIO CLAVE AQUÍ: Usar item.image y comprobación de item.product ⭐ */}
                                                    {item.image ? (
                                                        <img
                                                            src={item.image.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`}
                                                            alt={item.name}
                                                            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center rounded-md shadow-sm">
                                                            No hay <br/> imagen
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm sm:text-base">{item.name}</p>
                                                        <p className="text-xs sm:text-sm text-gray-600">Cant: {item.quantity}</p>
                                                        <p className="text-xs text-gray-500">Valor: COP {item.price ? item.price.toLocaleString('es-CO') : 'N/A'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Artículos Solicitados */}
                                        <div className="bg-green-50 p-3 rounded-lg shadow-inner border border-green-200">
                                            <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2 flex items-center">
                                                <span className="mr-2">📥</span> Tus Solicitados
                                            </h3>
                                            {Array.isArray(proposal.requestedItems) && proposal.requestedItems.map(item => (
                                                <div key={item.product?._id || item._id} className="flex items-center space-x-2 mb-2 last:mb-0">
                                                    {/* ⭐ CAMBIO CLAVE AQUÍ: Usar item.image y comprobación de item.product ⭐ */}
                                                    {item.image ? (
                                                        <img
                                                            src={item.image.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`}
                                                            alt={item.name}
                                                            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center rounded-md shadow-sm">
                                                            No hay <br/> imagen
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm sm:text-base">{item.name}</p>
                                                        <p className="text-xs sm:text-sm text-gray-600">Cant: {item.quantity}</p>
                                                        <p className="text-xs text-gray-500">Valor: COP {item.price ? item.price.toLocaleString('es-CO') : 'N/A'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resumen del trueque */}
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm sm:text-base text-gray-700">
                                        <p className="font-semibold">Mensaje: </p>
                                        <p className="italic text-gray-600 break-words">{proposal.message || "Sin mensaje."}</p>
                                    </div>

                                </div> {/* Fin de p-5 flex-grow */}

                                {/* --- Sección de Botones de Acción --- */}
                                <div className="p-5 border-t border-gray-100 bg-gray-50">
                                    {/* Lógica para Propuestas Originales (no contraofertas) */}
                                    {!isCounterProposal(proposal) && proposal.status === 'pending' && proposal.recipient?._id === user?._id && (
                                        <div className="flex flex-wrap justify-end gap-3">
                                            <button
                                                onClick={() => handleAcceptOriginalProposal(proposal._id)}
                                                className="flex-1 min-w-[100px] px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 ease-in-out font-semibold shadow-md text-sm"
                                            >
                                                Aceptar
                                            </button>
                                            <button
                                                onClick={() => handleRejectOriginalProposal(proposal._id)}
                                                className="flex-1 min-w-[100px] px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 ease-in-out font-semibold shadow-md text-sm"
                                            >
                                                Rechazar
                                            </button>
                                            <Link
                                                to={`/create-counter-proposal/${proposal._id}`}
                                                className="flex-1 min-w-[100px] text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out font-semibold shadow-md text-sm"
                                            >
                                                Contraofertar
                                            </Link>
                                        </div>
                                    )}

                                    {/* Lógica para Contraofertas Recibidas (que el usuario actual debe responder) */}
                                    {isCounterProposal(proposal) && proposal.status === 'pending' && proposal.recipient?._id === user?._id && (
                                        <div className="flex flex-wrap justify-end gap-3">
                                            <button
                                                onClick={() => handleAcceptCounterProposal(proposal._id)}
                                                className="flex-1 min-w-[100px] px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 ease-in-out font-semibold shadow-md text-sm"
                                            >
                                                Aceptar Contraoferta
                                            </button>
                                            <button
                                                onClick={() => handleRejectCounterProposal(proposal._id)}
                                                className="flex-1 min-w-[100px] px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 ease-in-out font-semibold shadow-md text-sm"
                                            >
                                                Rechazar Contraoferta
                                            </button>
                                        </div>
                                    )}

                                    {/* Lógica para Cancelar (para propuestas pendientes o contraofertadas, tuyas o que te llegaron) */}
                                    {(proposal.status === 'pending' || proposal.status === 'countered') &&
                                        (proposal.proposer?._id === user?._id || proposal.recipient?._id === user?._id) && (
                                            <div className="flex justify-end mt-4">
                                                <button
                                                    onClick={() => handleCancelProposal(proposal._id)}
                                                    className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-200 ease-in-out font-semibold shadow-md text-sm"
                                                >
                                                    Cancelar Propuesta
                                                </button>
                                            </div>
                                        )}

                                    {/* Mensajes de estado finales */}
                                    {proposal.status === 'accepted' && (
                                        <div className="mt-6 text-center text-green-700 font-semibold text-base p-3 bg-green-50 rounded-lg border border-green-200">
                                            ¡Esta propuesta ha sido aceptada! 🎉 Procede a coordinar la entrega.
                                        </div>
                                    )}
                                    {proposal.status === 'rejected' && (
                                        <div className="mt-6 text-center text-red-700 font-semibold text-base p-3 bg-red-50 rounded-lg border border-red-200">
                                            Esta propuesta ha sido rechazada. 😔
                                        </div>
                                    )}
                                    {proposal.status === 'completed' && (
                                        <div className="mt-6 text-center text-purple-700 font-semibold text-base p-3 bg-purple-50 rounded-lg border border-purple-200">
                                            ¡Trueque completado! ✅
                                        </div>
                                    )}
                                    {proposal.status === 'countered' && isOutgoingProposal(proposal) && (
                                        <div className="mt-6 text-center text-blue-700 font-semibold text-base p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            Tu propuesta original ha sido contraofertada. Esperando respuesta. 🔄
                                        </div>
                                    )}
                                    {proposal.status === 'cancelled' && (
                                        <div className="mt-6 text-center text-gray-700 font-semibold text-base p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            Esta propuesta ha sido cancelada. 🚫
                                        </div>
                                    )}
                                </div> {/* Fin de Sección de Botones */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBarterProposalsPage;