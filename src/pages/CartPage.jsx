// frontend/src/pages/CartPage.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(AuthContext);

    // Calcular el total del carrito
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-3xl font-bold mb-4">Tu Carrito Está Vacío</h1>
                <p className="text-lg mb-6">Parece que aún no has añadido ningún producto.</p>
                <Link
                    to="/products"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
                >
                    Explorar Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Tu Carrito de Compras</h1>

            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                        <div className="flex items-center">
                            {item.imageUrl && (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-md mr-4"
                                />
                            )}
                            <div>
                                <h2 className="text-xl font-semibold">{item.name}</h2>
                                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300"
                            >
                                -
                            </button>
                            <span className="text-lg font-medium">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300"
                            >
                                +
                            </button>
                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-6 rounded-lg shadow-md">
                <div className="text-2xl font-bold mb-4 md:mb-0">
                    Subtotal: <span className="text-green-700">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={clearCart}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300"
                    >
                        Vaciar Carrito
                    </button>
                    <Link
                        to="/checkout"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                    >
                        Proceder al Pago
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
