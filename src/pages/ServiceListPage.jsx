// src/pages/ServiceListPage.jsx
import React, { useState, useEffect } from 'react';

function ServiceListPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:5000/api/services'); // ⭐ URL REAL DE TU BACKEND ⭐
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setServices(data);
            } catch (err) {
                setError('Error al cargar los servicios desde el servidor.');
                console.error("Error fetching services from backend:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Servicios Agrícolas Disponibles</h2>
            {loading && <p className="text-center text-gray-600">Cargando servicios...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!loading && !error && services.length === 0 && (
                <p className="text-center text-gray-600">No hay servicios disponibles en este momento.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    // ⭐ Usar service._id de MongoDB como key ⭐
                    <div key={service._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <img src={service.imageUrl} alt={service.name} className="w-full h-48 object-cover"/>
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                            <p className="text-gray-700 text-sm mb-3">{service.description}</p>
                            <p className="text-lg font-bold text-green-700">COP {service.price.toLocaleString('es-CO')}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServiceListPage;