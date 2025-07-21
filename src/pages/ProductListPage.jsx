// frontend/src/pages/ProductListPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // Asegúrate de importar tu instancia de Axios/API

function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isTradableFilter, setIsTradableFilter] = useState(false);

    const { user, token, isAuthenticated, addToCart } = useContext(AuthContext);
    const navigate = useNavigate();

    const [addedToCartMessages, setAddedToCartMessages] = useState({});

    const location = useLocation();
    const isMyProductsPage = location.pathname === '/my-products';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            let url = 'http://localhost:5000/api/products';
            const params = new URLSearchParams();

            if (isMyProductsPage) {
                url = 'http://localhost:5000/api/products/my-products';
                if (!isAuthenticated || !token) {
                    setError('Debes iniciar sesión para ver tus productos.');
                    setLoading(false);
                    return;
                }
            } else {
                if (searchTerm) {
                    params.append('search', searchTerm);
                }
                if (selectedCategory) {
                    params.append('category', selectedCategory);
                }
                if (isTradableFilter) {
                    params.append('isTradable', 'true');
                }
            }

            const queryString = params.toString();
            if (queryString) {
                url = `${url}?${queryString}`;
            }

            try {
                const headers = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                // Usando 'api' de Axios para una gestión de errores más consistente
                const response = await api.get(url, { headers });
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError('Error desconocido al cargar los productos.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [isMyProductsPage, isAuthenticated, token, searchTerm, selectedCategory, isTradableFilter]);

    const handleAddToCart = (product) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para añadir productos al carrito.');
            navigate('/login');
            return;
        }

        if (product.stock === 0) {
            setAddedToCartMessages(prevMessages => ({
                ...prevMessages,
                [product._id]: '❌ ¡Producto agotado!'
            }));
            setTimeout(() => {
                setAddedToCartMessages(prevMessages => ({
                    ...prevMessages,
                    [product._id]: ''
                }));
            }, 2000);
            return;
        }

        addToCart(product);

        setAddedToCartMessages(prevMessages => ({
            ...prevMessages,
            [product._id]: '✔️ ¡Añadido al carrito!'
        }));

        setTimeout(() => {
            setAddedToCartMessages(prevMessages => ({
                ...prevMessages,
                [product._id]: ''
            }));
        }, 2000);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                // Asumiendo que tu API tiene un endpoint DELETE para productos
                await api.delete(`/products/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(products.filter(p => p._id !== productId)); // Eliminar de la lista local
                alert('Producto eliminado con éxito.');
            } catch (err) {
                console.error("Error eliminando producto:", err);
                alert('Error al eliminar el producto.');
            }
        }
    };

    const categories = [
        'Frutas', 'Verduras', 'Granos', 'Lácteos', 'Carnes',
        'Cereales', 'Legumbres', 'Pescados', 'Huevos', 'Miel',
        'Plantas', 'Semillas', 'Fitosanitarios', 'Fertilizantes', 'Maquinaria', 'Otros'
    ];


    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-700 text-2xl animate-pulse">Cargando productos...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen bg-red-50 text-red-700 text-xl font-semibold">Error: {error}</div>;
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-700 text-xl p-4">
                <p className="mb-4 text-2xl font-semibold">🌱 ¡No se encontraron productos que coincidan con tu búsqueda!</p>
                <Link to="/create-product" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-lg hover:shadow-xl">
                    Publica un Producto Ahora
                </Link>
            </div>
        );
    }

    return (
        // Contenedor principal de la página con fondo degradado y espaciado mejorado
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-10 drop-shadow-md">
                {isMyProductsPage ? "Mis Productos Publicados" : "Explorar Productos Agrícolas"}
            </h1>

            {!isMyProductsPage && (
                // Contenedor de filtros con diseño mejorado
                <div className="max-w-4xl mx-auto mb-10 p-6 bg-white rounded-2xl shadow-xl border border-green-100">
                    <h2 className="text-2xl font-bold text-green-700 mb-5 text-center">Filtra tus Productos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        {/* Barra de búsqueda */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre o descripción</label>
                            <input
                                id="search"
                                type="text"
                                placeholder="Ej: Tomates frescos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-400 transition duration-200 text-gray-700 placeholder-gray-400 shadow-sm" // Añadido shadow-sm
                            />
                        </div>
                        {/* Selector de categoría */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Categoría</label>
                            <div className="relative"> {/* Contenedor para el icono de flecha */}
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="block w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-400 transition duration-200 bg-white text-gray-700 appearance-none pr-8 shadow-sm" // Añadido shadow-sm y pr-8
                                >
                                    <option value="">Todas las categorías</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {/* Icono de flecha personalizado */}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338z"/></svg>
                                </div>
                            </div>
                        </div>
                        {/* Toggle de Truequeable */}
                        <div className="flex items-center justify-center md:justify-start pt-2 md:pt-0">
                            <label htmlFor="isTradableFilter" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id="isTradableFilter"
                                        className="sr-only" // Oculta el checkbox original
                                        checked={isTradableFilter}
                                        onChange={(e) => setIsTradableFilter(e.target.checked)}
                                    />
                                    {/* Fondo del toggle */}
                                    <div className={`block w-14 h-8 rounded-full transition-all duration-300 ${isTradableFilter ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                                    {/* Círculo del toggle */}
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-all duration-300 shadow-md ${isTradableFilter ? 'translate-x-full border-purple-800' : 'border-gray-400'}`}></div>
                                </div>
                                <div className="ml-3 text-lg font-medium text-gray-800">
                                    Solo productos truequeables
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid de productos con diseño de tarjeta mejorado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 relative
                            ${product.user && product.user.isPremium ? 'border-4 border-yellow-400 ring-4 ring-yellow-200' : 'border border-gray-200'}`}
                    >
                        {/* Insignia de Vendedor Premium */}
                        {product.user && product.user.isPremium && (
                            <span className="absolute top-3 right-3 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
                                ⭐ Vendedor Premium
                            </span>
                        )}
                        {/* Imagen del producto */}
                        {product.imageUrl && (
                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-t-xl"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }} // Fallback
                                />
                            </div>
                        )}
                        {/* Contenido de la tarjeta */}
                        <div className="p-5 flex flex-col flex-grow min-h-[200px]"> {/* Añadido min-h para consistencia de altura */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h2>
                            <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{product.description}</p>
                            
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-md font-semibold text-gray-700">
                                    <span className="text-green-700">Categoría:</span> {product.category}
                                </p>
                                <p className="text-md font-semibold text-gray-700">
                                    <span className="text-green-700">Stock:</span> {product.stock === 0 ? 'Agotado' : `${product.stock} ${product.unit}`}
                                </p>
                            </div>

                            <p className="text-xl font-extrabold text-green-700 mb-4">
                                {product.isTradable ? (
                                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-lg">♻️ Truequeable</span>
                                ) : (
                                    `$${product.price ? product.price.toFixed(2) : 'N/A'} por ${product.unit}`
                                )}
                            </p>
                            {/* Información del vendedor */}
                            {product.user && (
                                <p className="text-sm text-gray-500 mb-4">
                                    Publicado por: <span className="font-medium text-gray-700">{product.user.name ? product.user.name : 'Desconocido'}</span>
                                </p>
                            )}

                            {/* Contenedor de botones */}
                            <div className="mt-auto flex flex-col space-y-3 w-full">
                                <Link
                                    to={`/products/${product._id}`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
                                >
                                    Ver Detalles
                                </Link>

                                {isAuthenticated && user && (
                                    <>
                                        {isMyProductsPage ? (
                                            // Botones de Editar/Eliminar para "Mis Productos"
                                            <>
                                                <Link
                                                    to={`/edit-product/${product._id}`}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
                                                >
                                                    Editar Producto
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                                                >
                                                    Eliminar Producto
                                                </button>
                                            </>
                                        ) : (
                                            // Botones para otros usuarios (cuando no es mi producto)
                                            product.user && user && product.user._id !== user._id && (
                                                <>
                                                    {product.stock > 0 ? (
                                                        <button
                                                            onClick={() => handleAddToCart(product)}
                                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                                                        >
                                                            🛒 Añadir al Carrito
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="bg-gray-400 text-white font-bold py-3 px-6 rounded-lg cursor-not-allowed shadow-md"
                                                            disabled
                                                        >
                                                            Agotado
                                                        </button>
                                                    )}
                                                    
                                                    {addedToCartMessages[product._id] && (
                                                        <p className={`text-center text-sm font-semibold mt-1 animate-pulse
                                                            ${addedToCartMessages[product._id].includes('❌') ? 'text-red-600' : 'text-green-600'}`}>
                                                            {addedToCartMessages[product._id]}
                                                        </p>
                                                    )}

                                                    {product.isTradable && (
                                                        <Link
                                                            to={`/create-barter-proposal/${product._id}`}
                                                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
                                                        >
                                                            🤝 Proponer Trueque
                                                        </Link>
                                                    )}
                                                </>
                                            )
                                        )}
                                        {/* Mensaje si es tu propio producto en la vista general */}
                                        {!isMyProductsPage && product.user._id === user._id && (
                                            <p className="text-gray-500 text-center text-sm font-medium pt-2">Este es tu producto. Visible para otros.</p>
                                        )}
                                    </>
                                )}
                                {/* Si no está autenticado, solo puede ver detalles */}
                                {!isAuthenticated && !isMyProductsPage && (
                                    <p className="text-gray-500 text-center text-sm font-medium pt-2">Inicia sesión para interactuar.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductListPage;