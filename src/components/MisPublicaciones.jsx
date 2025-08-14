import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PlusCircleIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { FaBox, FaTools, FaTractor } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { toast } from 'react-toastify';
import api from '../services/api';

moment.locale('es');

const MisPublicaciones = () => {
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('productos'); // 'productos', 'servicios', 'rentas'

    // Iconos para cada tipo de publicación
    const typeIcons = {
        productos: <FaBox className="text-green-600" />,
        servicios: <FaTools className="text-blue-600" />,
        rentas: <FaTractor className="text-purple-600" />
    };

    // Rutas API para cada tipo de publicación
    const apiEndpoints = {
        productos: '/products/my-products',
        servicios: '/services/my-services',
        rentas: '/rentals/my-rentals'
    };

    // Rutas de edición para cada tipo
    const editRoutes = {
        productos: '/edit-product',
        servicios: '/edit-service',
        rentas: '/edit-rental'
    };

    // Rutas de creación para cada tipo
    const createRoutes = {
        productos: '/create-product',
        servicios: '/create-service',
        rentas: '/create-rental'
    };

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await api.get(apiEndpoints[activeTab], {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // Agregamos un campo 'type' a cada publicación para identificarla fácilmente
                const publicationsWithType = response.data.map(pub => ({
                    ...pub,
                    type: activeTab.slice(0, -1) // Convierte 'productos' a 'producto'
                }));
                
                setPublications(publicationsWithType);
            } catch (err) {
                console.error(`Error al cargar ${activeTab}:`, err);
                setError(`No se pudieron cargar tus ${activeTab}.`);
                toast.error(`Error al cargar tus ${activeTab}`);
            } finally {
                setLoading(false);
            }
        };

        if (user && token) {
            fetchPublications();
        }
    }, [user, token, activeTab]);

    const handleDelete = async (publicationId, type) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
            try {
                await api.delete(`/${type}s/${publicationId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPublications(publications.filter(pub => pub._id !== publicationId));
                toast.success('Publicación eliminada correctamente');
            } catch (err) {
                console.error('Error al eliminar:', err);
                toast.error(err.response?.data?.message || 'Error al eliminar la publicación');
            }
        }
    };

    const togglePublishStatus = async (publicationId, currentStatus, type) => {
        try {
            const response = await api.put(
                `/${type}s/${publicationId}`,
                { isPublished: !currentStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            setPublications(publications.map(pub => 
                pub._id === publicationId ? { ...pub, isPublished: response.data.isPublished } : pub
            ));
            
            toast.success(
                `Publicación ${!currentStatus ? 'publicada' : 'ocultada'} correctamente`
            );
        } catch (err) {
            console.error('Error al cambiar estado:', err);
            toast.error(err.response?.data?.message || 'Error al actualizar el estado');
        }
    };

    const renderPublicationCard = (publication) => {
        // Campos comunes
        const commonFields = (
            <>
                <h3 className="font-semibold text-gray-800 text-lg">{publication.name}</h3>
                <p className="text-sm text-gray-500">{publication.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {publication.category && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {publication.category}
                        </span>
                    )}
                    {publication.price && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            ${publication.price.toLocaleString('es-CO')}
                        </span>
                    )}
                    {publication.isTradable && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Acepta trueque
                        </span>
                    )}
                </div>
            </>
        );

        // Campos específicos por tipo
        let specificFields;
        switch(publication.type) {
            case 'producto':
                specificFields = (
                    publication.stock && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            {publication.stock} {publication.unit}
                        </span>
                    )
                );
                break;
            case 'servicio':
                specificFields = (
                    publication.duration && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                            Duración: {publication.duration}
                        </span>
                    )
                );
                break;
            case 'renta':
                specificFields = (
                    publication.pricePerDay && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                            ${publication.pricePerDay.toLocaleString('es-CO')}/día
                        </span>
                    )
                );
                break;
            default:
                specificFields = null;
        }

        return (
            <div key={publication._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-start space-x-4">
                            {publication.imageUrl && (
                                <img 
                                    src={publication.imageUrl} 
                                    alt={publication.name}
                                    className="h-16 w-16 object-cover rounded-md"
                                />
                            )}
                            <div>
                                {commonFields}
                                {specificFields && (
                                    <div className="mt-2">
                                        {specificFields}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                        <div className="flex space-x-2">
                            <button 
                                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                onClick={() =>  navigate(`/${publication.type}s/${publication._id}`)}
                            >
                                <EyeIcon className="h-5 w-5" />
                            </button>
                            <button 
                                className="p-2 text-gray-500 hover:text-yellow-600 transition-colors"
                                onClick={() => navigate(`${editRoutes[activeTab]}/${publication._id}`)}
                            >
                                <PencilIcon className="h-5 w-5" />
                            </button>
                            <button 
                                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                onClick={() => handleDelete(publication._id, publication.type)}
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                    <span>Publicado: {moment(publication.createdAt).format('LL')}</span>
                    <span>Actualizado: {moment(publication.updatedAt).fromNow()}</span>
                </div>
            </div>
        );
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

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Mis Publicaciones</h2>
                <button 
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                    onClick={() => navigate(createRoutes[activeTab])}
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
                            className={`px-3 py-2 text-sm font-medium flex items-center ${
                                activeTab === tab
                                    ? 'border-b-2 border-green-500 text-green-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <span className="mr-2">{typeIcons[tab]}</span>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>
            
            {publications.length > 0 ? (
                <div className="space-y-4">
                    {publications.map(publication => renderPublicationCard(publication))}
                </div>
            ) : (
                <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-700">
                    <p>Aún no tienes {activeTab} publicados. ¡Crea uno para empezar!</p>
                    <button 
                        className="mt-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                        onClick={() => window.location.href = createRoutes[activeTab]}
                    >
                        Crear mi primer {activeTab.slice(0, -1)}
                    </button>
                </div>
            )}
        </div>
    );
};

export default MisPublicaciones;