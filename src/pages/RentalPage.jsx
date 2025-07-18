// src/pages/RentalPage.jsx
import React, { useState, useEffect } from 'react';

function RentalPage() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRentals = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:5000/api/rentals'); // ⭐ URL REAL DE TU BACKEND ⭐
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRentals(data);
            } catch (err) {
                setError('Error al cargar las rentas desde el servidor.');
                console.error("Error fetching rentals from backend:", err);
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
                    // ⭐ Usar rental._id de MongoDB como key ⭐
                    <div key={rental._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <img src={rental.imageUrl} alt={rental.name} className="w-full h-48 object-cover"/>
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{rental.name}</h3>
                            <p className="text-gray-700 text-sm mb-3">{rental.description}</p>
                            <p className="text-lg font-bold text-blue-700">COP {rental.pricePerDay.toLocaleString('es-CO')} / día</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RentalPage;