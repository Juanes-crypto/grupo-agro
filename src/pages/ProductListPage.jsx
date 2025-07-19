// frontend/src/pages/ProductListPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isTradableFilter, setIsTradableFilter] = useState(false);

    const { user, token, isAuthenticated, addToCart } = useContext(AuthContext);

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

                const response = await fetch(url, { headers });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `Error al cargar ${isMyProductsPage ? 'tus productos' : 'los productos'}.`);
                }

                setProducts(data);
            } catch (err) {
                setError(err.message || 'Error desconocido al cargar los productos.');
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [isMyProductsPage, isAuthenticated, token, searchTerm, selectedCategory, isTradableFilter]);


    if (loading) {
        return <div className="text-center text-xl">Cargando productos...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 text-xl">Error: {error}</div>;
    }

    if (products.length === 0) {
        return <div className="text-center text-xl">No se encontraron productos.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                {isMyProductsPage ? "Mis Productos Publicados" : "Explorar Productos"}
            </h1>

            {!isMyProductsPage && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todas las categorías</option>
                            <option value="Fertilizantes">Fertilizantes</option>
                            <option value="Semillas">Semillas</option>
                            <option value="Herramientas">Herramientas</option>
                            <option value="Maquinaria">Maquinaria</option>
                            <option value="Animales">Animales</option>
                            <option value="Cultivos">Cultivos</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="isTradableFilter"
                            checked={isTradableFilter}
                            onChange={(e) => setIsTradableFilter(e.target.checked)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isTradableFilter" className="text-gray-700">Solo productos truequeables</label>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    // ⭐ CAMBIO AQUÍ: Aplicación de estilos condicionales para usuarios premium ⭐
                    <div
                        key={product._id}
                        className={`bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center relative
                            ${product.user && product.user.isPremium ? 'border-2 border-yellow-500 shadow-lg' : 'border border-gray-200'}`}
                    >
                        {product.user && product.user.isPremium && (
                            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Vendedor Premium
                            </span>
                        )}
                        {product.imageUrl && (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                        )}
                        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                        <p className="text-gray-600 text-sm mb-2">{product.description.substring(0, 100)}...</p>
                        <p className="text-lg font-bold text-green-700 mb-2">
                            {product.isTradable ? 'Truequeable' : `$${product.price.toFixed(2)}`}
                        </p>

                        <div className="mt-auto flex flex-col space-y-2 w-full">
                            <Link
                                to={`/products/${product._id}`}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
                            >
                                Ver Detalles
                            </Link>

                            {isAuthenticated && user && (
                                <>
                                    {isMyProductsPage && (
                                        <>
                                            <Link
                                                to={`/edit-product/${product._id}`}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
                                                        console.log(`Eliminar producto con ID: ${product._id}`);
                                                    }
                                                }}
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
                                            >
                                                Eliminar
                                            </button>
                                        </>
                                    )}

                                    {!isMyProductsPage && product.user !== user._id && (
                                        <>
                                            {!product.isTradable && (
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
                                                >
                                                    Añadir al Carrito
                                                </button>
                                            )}
                                            {product.isTradable && (
                                                <Link
                                                    to={`/create-barter-proposal/${product._id}`}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
                                                >
                                                    Proponer Trueque
                                                </Link>
                                            )}
                                        </>
                                    )}
                                    {!isMyProductsPage && product.user === user._id && (
                                        <p className="text-gray-500 text-sm">Este es tu producto.</p>
                                    )}
                                </>
                            )}
                            {!isAuthenticated && !isMyProductsPage && (
                                <p className="text-gray-500 text-sm">Inicia sesión para comprar o proponer trueque.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductListPage;
