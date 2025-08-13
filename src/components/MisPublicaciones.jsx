import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PlusCircleIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import 'moment/locale/es';
import { toast } from 'react-toastify';
import api from '../services/api';

moment.locale('es');

const MisPublicaciones = () => {
    const { user, token } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('productos'); // 'productos', 'servicios', 'rentas'

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Usamos el mismo endpoint que en PremiumInventoryPage pero para todos los usuarios
                const response = await api.get('/products/my-products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                setProducts(response.data);
            } catch (err) {
                console.error('Error al cargar los productos:', err);
                setError(err.response?.data?.message || 'No se pudieron cargar tus publicaciones.');
                toast.error('Error al cargar tus publicaciones');
            } finally {
                setLoading(false);
            }
        };

        if (user && token) {
            fetchUserProducts();
        }
    }, [user, token, activeTab]);

    const handleDelete = async (productId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
            try {
                await api.delete(`/products/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(products.filter(product => product._id !== productId));
                toast.success('Publicación eliminada correctamente');
            } catch (err) {
                console.error('Error al eliminar:', err);
                toast.error(err.response?.data?.message || 'Error al eliminar la publicación');
            }
        }
    };

    const togglePublishStatus = async (productId, currentStatus) => {
        try {
            const response = await api.put(
                `/products/${productId}`,
                { isPublished: !currentStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            setProducts(products.map(product => 
                product._id === productId ? response.data : product
            ));
            
            toast.success(
                `Publicación ${!currentStatus ? 'publicada' : 'ocultada'} correctamente`
            );
        } catch (err) {
            console.error('Error al cambiar estado:', err);
            toast.error(err.response?.data?.message || 'Error al actualizar el estado');
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

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Mis Publicaciones</h2>
                <button 
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                    onClick={() => window.location.href = '/crear-publicacion'}
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
            
            {products.length > 0 ? (
                <div className="space-y-4">
                    {products.map((product) => (
                        <div key={product._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-start space-x-4">
                                        {product.imageUrl && (
                                            <img 
                                                src={product.imageUrl} 
                                                alt={product.name}
                                                className="h-16 w-16 object-cover rounded-md"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                                            <p className="text-sm text-gray-500">{product.description}</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                    {product.category}
                                                </span>
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                    ${product.price?.toLocaleString('es-CO') || '0'}
                                                </span>
                                                {product.stock && (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                                        {product.stock} {product.unit}
                                                    </span>
                                                )}
                                                {product.isTradable && (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                                        Acepta trueque
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                    <button
                                        onClick={() => togglePublishStatus(product._id, product.isPublished)}
                                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                            product.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {product.isPublished ? 'Publicado' : 'Oculto'}
                                    </button>
                                    <div className="flex space-x-2">
                                        <button 
                                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                            onClick={() => window.location.href = `/productos/${product._id}`}
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </button>
                                        <button 
                                            className="p-2 text-gray-500 hover:text-yellow-600 transition-colors"
                                            onClick={() => window.location.href = `/editar-producto/${product._id}`}
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button 
                                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                                <span>Publicado: {moment(product.createdAt).format('LL')}</span>
                                <span>Actualizado: {moment(product.updatedAt).fromNow()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-700">
                    <p>Aún no tienes publicaciones. ¡Crea una para empezar!</p>
                    <button 
                        className="mt-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                        onClick={() => window.location.href = '/crear-publicacion'}
                    >
                        Crear mi primera publicación
                    </button>
                </div>
            )}
        </div>
    );
};

export default MisPublicaciones;