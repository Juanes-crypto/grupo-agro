// src/pages/MyBarterProposalsPage.jsx
import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // Descomenta si necesitas enlaces a detalles de trueque

function MyBarterProposalsPage({ userId }) {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simular la carga de propuestas de trueque
        const fetchProposals = async () => {
            setLoading(true);
            setError(null);
            try {
                // Simula un retraso de red
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Datos de propuestas de trueque de ejemplo
                const dummyProposals = [
                    {
                        id: 'bp1',
                        status: 'Pendiente',
                        offeredItems: [{ name: '20 kg de Papas Criollas' }],
                        requestedItems: [{ name: '10 kg de Tomates Chonto' }],
                        date: '2025-07-10',
                        fromUser: 'user-juan',
                        toUser: 'user-maria'
                    },
                    {
                        id: 'bp2',
                        status: 'Aceptada',
                        offeredItems: [{ name: '10 L de Leche Fresca' }],
                        requestedItems: [{ name: '5 kg de Café Orgánico' }],
                        date: '2025-07-05',
                        fromUser: 'user-maria',
                        toUser: 'user-pedro'
                    },
                    {
                        id: 'bp3',
                        status: 'Rechazada',
                        offeredItems: [{ name: '50 unidades de Huevos Campesinos' }],
                        requestedItems: [{ name: '2 bultos de Abono Orgánico' }],
                        date: '2025-07-01',
                        fromUser: 'user-pedro',
                        toUser: 'user-juan'
                    }
                ];

                // Filtra las propuestas si se necesita una lógica por userId, de lo contrario, muestra todas.
                // Por ahora, mostraremos todas las simuladas.
                setProposals(dummyProposals);

            } catch (err) {
                setError('Error desconocido al cargar tus propuestas de trueque.');
                console.error("Error fetching dummy barter proposals:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, [userId]); // Dependencia del userId

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
            case 'Aceptada': return 'bg-green-100 text-green-800';
            case 'Rechazada': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Mis Propuestas de Trueque</h2>
            {loading && <p className="text-center text-gray-600">Cargando propuestas de trueque...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!loading && !error && proposals.length === 0 && (
                <p className="text-center text-gray-600">No tienes propuestas de trueque en este momento.</p>
            )}

            <div className="space-y-4">
                {proposals.map(proposal => (
                    <div key={proposal.id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">Propuesta #{proposal.id.slice(2)}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(proposal.status)}`}>
                                {proposal.status}
                            </span>
                        </div>
                        <p className="text-gray-700 mb-1">
                            **Ofreces:** {proposal.offeredItems.map(item => item.name).join(', ')}
                        </p>
                        <p className="text-gray-700 mb-3">
                            **Solicitas:** {proposal.requestedItems.map(item => item.name).join(', ')}
                        </p>
                        <p className="text-sm text-gray-500">Fecha: {proposal.date}</p>
                        {/* Puedes añadir un enlace para ver los detalles completos de la propuesta */}
                        {/* <Link to={`/barter-details/${proposal.id}`} className="text-blue-600 hover:underline mt-2 inline-block">Ver detalles</Link> */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyBarterProposalsPage;