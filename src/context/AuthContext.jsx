// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('CampoBit_token') || null);
    const [loading, setLoading] = useState(true);

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('CampoBit_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Efecto para cargar el estado del usuario/autenticación a partir del token al cargar la app
    useEffect(() => {
        const loadUserFromToken = async () => {
            setLoading(true);
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    if (decoded.id) {
                        // ✅ CORREGIDO: Usar la ruta correcta con /api/
                        const response = await api.get('/api/users/profile');
                        setUser(response.data);
                        setUserId(response.data._id);
                        setIsAuthenticated(true);
                        setIsPremium(response.data.isPremium || false);
                        console.log('Perfil de usuario cargado correctamente');
                    }
                } catch (error) {
                    console.error('Error al cargar perfil:', error);
                    // No hacer logout automáticamente, solo limpiar el estado
                    setIsAuthenticated(false);
                    setUser(null);
                    setUserId(null);
                    setIsPremium(false);
                    setToken(null);
                    localStorage.removeItem('CampoBit_token');
                } finally {
                    setLoading(false);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
                setUserId(null);
                setIsPremium(false);
                setLoading(false);
            }
        };

        loadUserFromToken();
    }, [token]);
    // Efecto para guardar/eliminar el token de localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('CampoBit_token', token);
        } else {
            localStorage.removeItem('CampoBit_token');
        }
    }, [token]);

    // Efecto para guardar el carrito en localStorage
    useEffect(() => {
        localStorage.setItem('CampoBit_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Función de login
    const login = (userData, receivedToken) => {
        console.log("AuthContext: Realizando login con token.");
        setUser(userData);
        setUserId(userData._id);
        setIsAuthenticated(true);
        setIsPremium(userData.isPremium || false);
        setToken(receivedToken);
        setLoading(false);
    };

    const logout = () => {
        console.log("AuthContext: Realizando logout.");
        setUser(null);
        setUserId(null);
        setIsAuthenticated(false);
        setIsPremium(false);
        setToken(null);
        clearCart();
        setLoading(false);
    };

    const register = (userData, receivedToken) => {
        console.log("AuthContext: Realizando registro con token.");
        console.log("User data recibido:", userData);
        
        if (!userData) {
            console.error("Error: userData es undefined/null en register");
            throw new Error("Datos de usuario inválidos recibidos del servidor");
        }
        
        if (!userData._id) {
            console.error("Error: userData no tiene propiedad _id", userData);
            throw new Error("Datos de usuario incompletos recibidos del servidor");
        }
        
        setUser(userData);
        setUserId(userData._id);
        setIsAuthenticated(true);
        setIsPremium(userData.isPremium || false);
        setToken(receivedToken);
        setLoading(false);
    };

    // Funciones del carrito (sin cambios)
    const addToCart = (product) => {
        if (typeof product.stock === 'undefined' || product.stock === null) {
            console.error("Error: El producto no tiene una propiedad 'stock' definida.", product);
            alert("No se pudo añadir el producto al carrito: stock no disponible.");
            return;
        }

        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item._id === product._id);

            if (existingItem) {
                const newQuantity = existingItem.quantity + 1;
                const finalQuantity = Math.min(newQuantity, product.stock);

                if (existingItem.quantity === finalQuantity) {
                    console.warn(`El producto "${product.name}" ya alcanzó el stock máximo (${product.stock}). No se añadió más.`);
                    return prevItems;
                }

                return prevItems.map((item) =>
                    item._id === product._id ? { ...item, quantity: finalQuantity } : item
                );
            } else {
                const initialQuantity = Math.min(1, product.stock);

                if (initialQuantity <= 0) {
                    console.warn(`El producto "${product.name}" tiene stock 0 o negativo. No se puede añadir.`);
                    alert(`El producto "${product.name}" no está disponible en este momento.`);
                    return prevItems;
                }
                return [...prevItems, {
                    ...product,
                    quantity: initialQuantity,
                    price: product.price || 0,
                    name: product.name || 'Producto Desconocido',
                    stock: product.stock
                }];
            }
        });
        console.log("Producto añadido/actualizado en el carrito:", product.name);
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
        console.log("Producto eliminado del carrito:", productId);
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems((prevItems) => {
            return prevItems.map((item) => {
                if (item._id === productId) {
                    const availableStock = item.stock;
                    const quantityLowerBound = Math.max(1, newQuantity);
                    const finalQuantity = Math.min(quantityLowerBound, availableStock);

                    if (finalQuantity !== item.quantity) {
                        return { ...item, quantity: finalQuantity };
                    }
                    return item;
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
        console.log(`Cantidad actualizada para ${productId} a ${newQuantity}`);
    };

    const clearCart = () => {
        setCartItems([]);
        console.log("Carrito vaciado.");
    };

    const contextValue = {
        user,
        userId,
        isAuthenticated,
        isPremium,
        token,
        loading,
        login,
        logout,
        register,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};