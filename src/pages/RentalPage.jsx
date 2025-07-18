// src/pages/RentalPage.jsx
import React, { useState, useEffect } from 'react';

function RentalPage({ userId }) {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simular la carga de rentas
        const fetchRentals = async () => {
            setLoading(true);
            setError(null);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simula un retraso de red
                // Datos de rentas de ejemplo
                const dummyRentals = [
                    { id: 'r1', name: 'Alquiler de Tractor (Diario)', description: 'Tractor John Deere 5075E, incluye operador.', pricePerDay: 800000, ownerId: 'userA', imageUrl: 'https://placehold.co/600x400/C0C0C0/333333?text=Tractor+Renta' },
                    { id: 'r2', name: 'Alquiler de Sembradora', description: 'Sembradora de precisión para pequeños cultivos.', pricePerDay: 250000, ownerId: 'userB', imageUrl: 'https://placehold.co/600x400/C0C0C0/333333?text=Sembradora+Renta' },
                    { id: 'r3', name: 'Drone para Fumigación', description: 'Drone agrícola con capacidad de 10L, por hectárea.', pricePerDay: 400000, ownerId: 'userA', imageUrl: 'https://placehold.co/600x400/C0C0C0/333333?text=Drone+Renta' },
                ];
                setRentals(dummyRentals);
            } catch (err) {
                setError('Error al cargar las rentas.');
                console.error("Error fetching dummy rentals:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Maquinaria y Herramientas en Renta</h2>
            {loading && <p className="text-center text-gray-600">Cargando rentas...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!loading && !error && rentals.length === 0 && (
                <p className="text-center text-gray-600">No hay equipos en renta disponibles en este momento.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentals.map(rental => (
                    <div key={rental.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <img src={rental.imageUrl} alt={rental.name} className="w-full h-48 object-cover"/>
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{rental.name}</h3>
                            <p className="text-gray-700 text-sm mb-3">{rental.description}</p>
                            <p className="text-lg font-bold text-blue-700">COP {rental.pricePerDay.toLocaleString('es-CO')} / día</p>
                            {/* Aquí puedes agregar un botón para ver detalles o solicitar */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RentalPage;