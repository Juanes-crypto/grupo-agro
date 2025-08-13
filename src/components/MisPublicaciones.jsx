import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PlusCircleIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import 'moment/locale/es';
import axios from 'axios';
import { toast } from 'react-toastify';

moment.locale('es');

const MisPublicaciones = () => {
    const { user, token } = useContext(AuthContext);
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('productos'); // 'productos', 'servicios', 'rentas'

    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/user/publicaciones/${activeTab}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPublicaciones(response.data);
                setLoading(false);
            } catch (err) {
                setError("Hubo un error al cargar tus publicaciones.");
                setLoading(false);
                toast.error('Error al cargar publicaciones');
            }
        };

        if (user && token) {
            fetchPublicaciones();
        }
    }, [user, token, activeTab]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/publicaciones/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPublicaciones(publicaciones.filter(pub => pub._id !== id));
            toast.success('Publicación eliminada correctamente');
        } catch (err) {
            toast.error('Error al eliminar la publicación');
        }
    };

    if (!user) {
        return <div className="p-6 bg-white rounded-lg shadow-sm">Inicia sesión para ver tus publicaciones.</div>;
    }

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-sm flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-sm">{error}</div>;
    }

    const renderTipoPublicacion = (tipo) => {
        switch(tipo) {
            case 'producto':
                return 'Producto';
            case 'servicio':
                return 'Servicio';
            case 'renta':
                return 'Renta';
            default:
                return tipo;
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Mis Publicaciones</h2>
                <button 
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                    onClick={() => window.location.href = '/publicar'}
                >
                    <PlusCircleIcon className="h-5 w-5" />
                    <span>Nueva Publicación</span>
                </button>
            </div>

            {/* Pestañas para diferentes tipos de publicaciones */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-4">
                    {['productos', 'servicios', 'rentas'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-2 text-sm font-medium ${
                                activeTab === tab
                                    ? 'border-b-2 border-green-500 text-green-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>
            
            {publicaciones.length > 0 ? (
                <div className="space-y-4">
                    {publicaciones.map((pub) => (
                        <div key={pub._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-start space-x-4">
                                        {pub.imagenes && pub.imagenes.length > 0 && (
                                            <img 
                                                src={pub.imagenes[0]} 
                                                alt={pub.titulo}
                                                className="h-16 w-16 object-cover rounded-md"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-lg">{pub.titulo}</h3>
                                            <p className="text-sm text-gray-500">{pub.descripcion}</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                    {renderTipoPublicacion(pub.tipo)}
                                                </span>
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                                    {pub.categoria}
                                                </span>
                                                {pub.precio && (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                        ${pub.precio.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        pub.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {pub.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                    </span>
                                    <div className="flex space-x-2">
                                        <button 
                                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                            onClick={() => window.location.href = `/publicaciones/${pub._id}`}
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </button>
                                        <button 
                                            className="p-2 text-gray-500 hover:text-yellow-600 transition-colors"
                                            onClick={() => window.location.href = `/editar-publicacion/${pub._id}`}
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button 
                                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                            onClick={() => handleDelete(pub._id)}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                                <span>Publicado: {moment(pub.createdAt).format('LL')}</span>
                                <span>{pub.vistas || 0} visitas</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-700">
                    <p>No tienes {activeTab} publicados. ¡Crea uno para empezar!</p>
                </div>
            )}
        </div>
    );
};

export default MisPublicaciones;