// src/pages/ProductDetailsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProductDetailsPage() {
    const { id } = useParams();
    const { addToCart } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartMessage, setCartMessage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError('Error al cargar los detalles del producto desde el servidor.');
                console.error("Error fetching product details from backend:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product.stock === 0) { // ⭐ Validar stock antes de añadir ⭐
            setCartMessage('🚫 ¡Producto agotado!');
            return; 
        }
        addToCart(product);
        setCartMessage('✅ ¡Producto añadido al carrito!');
        setTimeout(() => {
            setCartMessage('');
        }, 3000);
    };

    if (loading) {
        return <div className="text-center text-gray-600">Cargando detalles del producto...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    if (!product) {
        return <div className="text-center text-gray-600">Producto no disponible.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
            <div className="md:w-1/2">
                <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-sm" />
            </div>
            <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h2>
                <p className="text-green-700 text-lg font-semibold mb-2">Categoría: {product.category}</p>
                <p className="text-gray-700 text-lg mb-4">{product.description}</p>
                <div className="text-4xl font-extrabold text-green-800 mb-6">
                    COP {product.price.toLocaleString('es-CO')} / {product.unit} {/* ⭐ Usar product.unit ⭐ */}
                </div>
                <p className="text-gray-600 mb-4">Disponibles: {product.stock} {product.unit}s</p> {/* ⭐ Usar product.stock y product.unit ⭐ */}

                <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.stock <= 0} // ⭐ Deshabilitar si stock es 0 o menos ⭐
                >
                    {product.stock > 0 ? `Añadir al Carrito` : `Agotado`}
                </button>

                {cartMessage && (
                    <p className={`text-center mt-3 font-medium ${cartMessage.includes('🚫') ? 'text-red-600' : 'text-green-600'}`}> {/* ⭐ Estilo dinámico para mensajes ⭐ */}
                        {cartMessage}
                    </p>
                )}

                <Link to="/products" className="block text-center text-blue-600 hover:underline mt-4">
                    Volver a la lista de productos
                </Link>
            </div>
        </div>
    );
}

export default ProductDetailsPage;
