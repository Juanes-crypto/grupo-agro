import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

function ProductDetailsPage() {
    const { id } = useParams();
    const { addToCart, user } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartMessage, setCartMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch del producto principal
                const productResponse = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!productResponse.ok) throw new Error(`HTTP error! status: ${productResponse.status}`);
                const productData = await productResponse.json();
                setProduct(productData);

                // Fetch de productos relacionados
                const relatedResponse = await fetch(`http://localhost:5000/api/products?category=${encodeURIComponent(productData.category)}&limit=4`);
                if (!relatedResponse.ok) throw new Error(`HTTP error! status: ${relatedResponse.status}`);
                const relatedData = await relatedResponse.json();
                
                // Filtrar el producto actual de los relacionados
                setRelatedProducts(relatedData.filter(p => p._id !== id));
            } catch (err) {
                setError('Error al cargar los datos del producto');
                console.error("Error fetching product data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAddToCart = () => {
        if (product.stock === 0) {
            setCartMessage('🚫 ¡Producto agotado!');
            return;
        }
        addToCart(product);
        setCartMessage('✅ ¡Producto añadido al carrito!');
        setTimeout(() => setCartMessage(''), 3000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg">{error}</div>;
    }

    if (!product) {
        return <div className="text-center text-gray-600 p-8">Producto no encontrado.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Producto principal */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
                <div className="md:flex">
                    {/* Imagen del producto */}
                    <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
                        <img 
                            src={product.imageUrl || '/no-image.png'} 
                            alt={product.name} 
                            className="w-full h-auto max-h-96 object-contain rounded-lg"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/no-image.png';
                            }}
                        />
                    </div>
                    
                    {/* Detalles del producto */}
                    <div className="md:w-1/2 p-8">
                        <Link 
                            to="/products" 
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-1" />
                            Volver a productos
                        </Link>
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                            {product.category}
                        </div>
                        
                        <p className="text-gray-700 text-lg mb-6">{product.description}</p>
                        
                        <div className="flex items-center mb-6">
                            <span className="text-3xl font-bold text-green-700">
                                COP {product.price.toLocaleString('es-CO')}
                            </span>
                            <span className="ml-2 text-gray-500">/ {product.unit}</span>
                        </div>
                        
                        <div className="mb-8">
                            <span className={`text-lg font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                            </span>
                        </div>
                        
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className={`w-full flex items-center justify-center py-3 px-6 rounded-lg font-bold text-lg transition-colors duration-300 ${
                                product.stock > 0 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                        >
                            <ShoppingCartIcon className="h-6 w-6 mr-2" />
                            {product.stock > 0 ? 'Añadir al carrito' : 'Sin stock'}
                        </button>
                        
                        {cartMessage && (
                            <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
                                cartMessage.includes('🚫') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {cartMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Productos relacionados */}
            {relatedProducts.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Otros productos en {product.category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <div key={relatedProduct._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <Link to={`/products/${relatedProduct._id}`}>
                                    <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                                        <img 
                                            src={relatedProduct.imageUrl || '/no-image.png'} 
                                            alt={relatedProduct.name} 
                                            className="h-full w-full object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/no-image.png';
                                            }}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                                            {relatedProduct.name}
                                        </h3>
                                        <p className="text-green-700 font-medium mb-2">
                                            COP {relatedProduct.price.toLocaleString('es-CO')}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm ${
                                                relatedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {relatedProduct.stock > 0 ? 'Disponible' : 'Agotado'}
                                            </span>
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                Ver detalles
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetailsPage;