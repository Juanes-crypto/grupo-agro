import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getToken } from '../utils/auth'; // Asumo que tienes una función para obtener el token

// Componente de tarjeta de publicación
const PublicationCard = ({ publication }) => {
    // Determinar el estado basado en isPublished y stock
    const status = publication.isPublished && publication.stock > 0 ? 'active' : 'paused';
    
    // Determinar el tipo de publicación (asumiendo que 'category' es el tipo por ahora)
    // Esto es temporal hasta que tengamos un modelo más detallado de publicaciones
    const type = publication.category;

    return (
        <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <img 
                src={publication.imageUrl || "https://placehold.co/400x300/e2e8f0/475569?text=Sin+Imagen"} 
                alt={publication.name} 
                className="w-full h-48 object-cover" 
            />
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        type === 'product' ? 'bg-green-200 text-green-800' :
                        type === 'service' ? 'bg-blue-200 text-blue-800' :
                        'bg-yellow-200 text-yellow-800'
                    }`}>
                        {/* Se usa la categoría como tipo, puedes ajustarlo si el modelo cambia */}
                        {type}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        status === 'active' ? 'bg-green-500 text-white' :
                        'bg-gray-500 text-white'
                    }`}>
                        {status === 'active' ? 'Activo' : 'Pausado'}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 truncate">{publication.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{publication.description}</p>
                <div className="mt-3 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                        ${publication.price} / {publication.unit}
                    </span>
                    <button className="text-green-600 hover:text-green-800 text-sm font-semibold">
                        Editar
                    </button>
                </div>
            </div>
        </div>
    );
};

const MisPublicaciones = () => {
    const [publications, setPublications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext); // Asumo que el contexto de autenticación proporciona el token

    useEffect(() => {
        const fetchMyPublications = async () => {
            if (!user) {
                // No hay usuario logueado, no se puede hacer la petición.
                setIsLoading(false);
                return;
            }

            const token = getToken(); // Función que obtiene el token guardado localmente
            if (!token) {
                setError("No se encontró token de autenticación.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/products/my-products', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('No se pudo obtener las publicaciones.');
                }

                const data = await response.json();
                setPublications(data);
            } catch (err) {
                console.error("Error al obtener mis publicaciones:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyPublications();
    }, [user]); // El efecto se ejecuta cuando el usuario cambia

    if (isLoading) {
        return <div className="text-center text-gray-500 p-8">Cargando tus publicaciones...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    }

    if (publications.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600">Aún no tienes publicaciones. ¡Anímate a crear una!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Mis Publicaciones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {publications.map(pub => (
                    <PublicationCard key={pub._id} publication={pub} />
                ))}
            </div>
        </div>
    );
};

export default MisPublicaciones;
