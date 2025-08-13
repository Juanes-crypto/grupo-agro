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
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/products/my-products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError("Hubo un error al cargar tus productos.");
                setLoading(false);
                toast.error('Error al cargar productos');
            }
        };

        if (user && token) {
            fetchUserProducts();
        }
    }, [user, token]);

    const handleDelete = async (productId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                await axios.delete(`/api/products/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(products.filter(product => product._id !== productId));
                toast.success('Producto eliminado correctamente');
            } catch (err) {
                toast.error('Error al eliminar el producto');
            }
        }
    };

    const togglePublishStatus = async (productId, currentStatus) => {
        try {
            const response = await axios.put(
                `/api/products/${productId}`,
                { isPublished: !currentStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setProducts(products.map(product => 
                product._id === productId ? response.data : product
            ));
            
            toast.success(
                `Producto ${!currentStatus ? 'publicado' : 'ocultado'} correctamente`
            );
        } catch (err) {
            toast.error('Error al actualizar el estado del producto');
        }
    };

    if (!user) {
        return <div className="p-6 bg-white rounded-lg shadow-sm">Inicia sesión para ver tus productos.</div>;
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
                <h2 className="text-2xl font-bold text-gray-800">Mis Productos Agrícolas</h2>
                <button 
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                    onClick={() => window.location.href = '/publicar-producto'}
                >
                    <PlusCircleIcon className="h-5 w-5" />
                    <span>Nuevo Producto</span>
                </button>
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
                                                    ${product.price.toLocaleString()}
                                                </span>
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                                    Stock: {product.stock} {product.unit}
                                                </span>
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
                                <span>Última actualización: {moment(product.updatedAt).fromNow()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-700">
                    <p>Aún no has publicado ningún producto. ¡Crea uno para empezar a vender!</p>
                    <button 
                        className="mt-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                        onClick={() => window.location.href = '/publicar-producto'}
                    >
                        Crear mi primer producto
                    </button>
                </div>
            )}
        </div>
    );
};

export default MisPublicaciones;