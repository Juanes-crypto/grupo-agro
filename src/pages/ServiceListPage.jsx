// src/pages/ServiceListPage.jsx
import React, { useState, useEffect } from 'react';

function ServiceListPage({ userId }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simular la carga de servicios
        const fetchServices = async () => {
            setLoading(true);
            setError(null);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simula un retraso de red
                // Datos de servicios de ejemplo
                const dummyServices = [
                    { id: 's1', name: 'Asesoría Agronómica', description: 'Expertos en cultivos y suelos.', price: 150000, providerId: 'user1', imageUrl: 'https://placehold.co/600x400/D0D0D0/333333?text=Asesoria+Agro' },
                    { id: 's2', name: 'Alquiler de Maquinaria', description: 'Tractores, sembradoras, cosechadoras.', price: 500000, providerId: 'user2', imageUrl: 'https://placehold.co/600x400/D0D0D0/333333?text=Maquinaria+Agro' },
                    { id: 's3', name: 'Control de Plagas', description: 'Soluciones ecológicas para tus cultivos.', price: 200000, providerId: 'user1', imageUrl: 'https://placehold.co/600x400/D0D0D0/333333?text=Control+Plagas' },
                ];
                setServices(dummyServices);
            } catch (err) {
                setError('Error al cargar los servicios.');
                console.error("Error fetching dummy services:", err);
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
                    <div key={service.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <img src={service.imageUrl} alt={service.name} className="w-full h-48 object-cover"/>
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                            <p className="text-gray-700 text-sm mb-3">{service.description}</p>
                            <p className="text-lg font-bold text-green-700">COP {service.price.toLocaleString('es-CO')}</p>
                            {/* Aquí puedes agregar un botón para ver detalles o contactar */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServiceListPage;