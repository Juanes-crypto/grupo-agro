import React from 'react';
import { Link } from 'react-router-dom'; // Para el botón de "Ver Detalles"

function BarterProposalCard({ proposal, currentUserId, onUpdateStatus }) {
    // Determinar si el usuario actual es el proponente o el recipiente
    const isProposer = proposal.proposer._id === currentUserId;
    const isRecipient = proposal.recipient._id === currentUserId;

    // Función para obtener el color y texto del estado
    const getStatusDisplay = (status) => {
        switch (status) {
            case 'pending':
                return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>;
            case 'accepted':
                return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">Aceptada</span>;
            case 'rejected':
                return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">Rechazada</span>;
            case 'cancelled':
                return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">Cancelada</span>;
            case 'countered':
                return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">Contraofertada</span>;
            default:
                return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">Desconocido</span>;
        }
    };

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-CO', options);
    };

    // Determinar quién es el "otro" usuario en la propuesta
    const otherUser = isProposer ? proposal.recipient : proposal.proposer;

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col justify-between">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                        Propuesta de Trueque {isProposer ? 'Enviada' : 'Recibida'}
                    </h3>
                    {getStatusDisplay(proposal.status)}
                </div>

                <p className="text-gray-700 mb-3">
                    <strong className="font-semibold">Con:</strong> {otherUser.username}
                </p>

                <div className="mb-4 bg-gray-50 p-3 rounded-md">
                    <p className="text-md text-gray-800 mb-2">
                        <strong className="font-bold text-green-700">Ofreces:</strong>
                    </p>
                    {proposal.offeredItems.map((item, index) => (
                        <p key={index} className="text-sm text-gray-600 ml-2">
                            - {item.quantity} de <span className="font-medium">{item.name}</span>
                        </p>
                    ))}
                </div>

                <div className="mb-4 bg-gray-50 p-3 rounded-md">
                    <p className="text-md text-gray-800 mb-2">
                        <strong className="font-bold text-indigo-700">Solicitas:</strong>
                    </p>
                    {proposal.requestedItems.map((item, index) => (
                        <p key={index} className="text-sm text-gray-600 ml-2">
                            - {item.quantity} de <span className="font-medium">{item.name}</span>
                        </p>
                    ))}
                </div>

                {proposal.message && (
                    <p className="text-gray-600 text-sm italic mb-4 border-l-4 border-gray-200 pl-3 py-1">
                        "{proposal.message}"
                    </p>
                )}

                <p className="text-gray-500 text-sm mt-2">
                    <strong className="font-medium">Fecha:</strong> {formatDate(proposal.createdAt)}
                </p>
            </div>

            <div className="p-6 pt-0 flex flex-wrap gap-3 justify-center border-t border-gray-100">
                {/* Botón para ver detalles de la propuesta completa */}
                <Link 
                    to={`/barter-details/${proposal._id}`} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-center text-sm min-w-[120px]"
                >
                    Ver Detalles
                </Link>

                {/* Acciones para el RECIPIENTE (si la propuesta está pendiente) */}
                {isRecipient && proposal.status === 'pending' && (
                    <>
                        <button
                            onClick={() => onUpdateStatus(proposal._id, 'accepted')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-center text-sm min-w-[120px]"
                        >
                            Aceptar
                        </button>
                        <button
                            onClick={() => onUpdateStatus(proposal._id, 'rejected')}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-center text-sm min-w-[120px]"
                        >
                            Rechazar
                        </button>
                        <Link 
                            to={`/create-counter-proposal/${proposal._id}`}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-center text-sm min-w-[120px]"
                        >
                            Contraofertar
                        </Link>
                    </>
                )}

                {/* Acciones para el PROPONENTE (si la propuesta está pendiente) */}
                {isProposer && proposal.status === 'pending' && (
                    <button
                        onClick={() => onUpdateStatus(proposal._id, 'cancelled')}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-center text-sm min-w-[120px]"
                    >
                        Cancelar
                    </button>
                )}

                {/* Acciones para propuestas contraofertadas (Proponente original debe aceptar/rechazar la contraoferta) */}
                {isProposer && proposal.status === 'countered' && (
                     <p className="text-sm text-gray-500">
                        Tienes una contraoferta. Revisa la nueva propuesta para responder.
                    </p>
                    // Aquí podrías añadir un botón para ir directamente a la contraoferta, si la guardas en 'counterProposalId'
                )}
            </div>
        </div>
    );
}

export default BarterProposalCard;