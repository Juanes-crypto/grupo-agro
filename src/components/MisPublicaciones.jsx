// src/components/MisPublicaciones.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import 'moment/locale/es'; // Importa el locale en español

// Establece el locale global para moment
moment.locale('es');

const MisPublicaciones = () => {
    const { user } = useContext(AuthContext);
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulamos la carga de datos de publicaciones desde una API
    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                // Simulación de una llamada a la API
                setTimeout(() => {
                    // Datos simulados. En un caso real, reemplazarías esto con un fetch a tu backend.
                    const mockData = [
                        {
                            id: 'pub1',
                            title: 'Tomates Orgánicos',
                            description: 'Tomates cultivados de forma ecológica, ideal para ensaladas.',
                            date: moment().subtract(2, 'days'),
                            status: 'Activa',
                            views: 50,
                        },
                        {
                            id: 'pub2',
                            title: 'Manzanas Verdes',
                            description: 'Manzanas crujientes y dulces, perfectas para postres.',
                            date: moment().subtract(1, 'week'),
                            status: 'Activa',
                            views: 35,
                        },
                        {
                            id: 'pub3',
                            title: 'Lechuga Fresca',
                            description: 'Hojas de lechuga recién cortadas, lista para consumir.',
                            date: moment().subtract(3, 'weeks'),
                            status: 'Inactiva',
                            views: 12,
                        },
                    ];
                    setPublicaciones(mockData);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError("Hubo un error al cargar tus publicaciones.");
                setLoading(false);
            }
        };

        if (user) {
            fetchPublicaciones();
        }
    }, [user]);

    if (!user) {
        return <div className="p-6 bg-white rounded-lg shadow-sm">Inicia sesión para ver tus publicaciones.</div>;
    }

    if (loading) {
        return <div className="p-6 bg-white rounded-lg shadow-sm">Cargando publicaciones...</div>;
    }

    if (error) {
        return <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-sm">{error}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Mis Publicaciones</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-200">
                    <PlusCircleIcon className="h-5 w-5" />
                    <span>Nueva Publicación</span>
                </button>
            </div>
            
            {publicaciones.length > 0 ? (
                <div className="space-y-4">
                    {publicaciones.map((pub) => (
                        <div key={pub.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center border border-gray-200">
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-semibold text-gray-800 text-lg">{pub.title}</h3>
                                <p className="text-sm text-gray-500">{pub.description}</p>
                                <p className="text-xs text-gray-400 mt-1">Publicado hace {pub.date.fromNow()}</p>
                            </div>
                            <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-4 flex items-center space-x-4">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                    pub.status === 'Activa' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {pub.status}
                                </span>
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">{pub.views}</span> visitas
                                </div>
                                <button className="text-gray-500 hover:text-green-600 transition-colors">
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-700">
                    <p>Aún no tienes publicaciones. ¡Crea una para empezar a conectar!</p>
                </div>
            )}
        </div>
    );
};

export default MisPublicaciones;
