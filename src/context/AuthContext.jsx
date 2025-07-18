// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de haber instalado jwt-decode: npm install jwt-decode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('agroapp_token') || null);
    const [loading, setLoading] = useState(true); // Estado de carga para la verificación inicial del token/usuario

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('agroapp_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Efecto para cargar el estado del usuario/autenticación a partir del token al cargar la app
    useEffect(() => {
        const loadUserFromToken = async () => { // Marcamos como async porque haremos un fetch
            setLoading(true); // Inicia la carga
            if (token) {
                try {
                    const decoded = jwtDecode(token);

                    // Si el token decodificado tiene un 'id' (que es el _id del usuario),
                    // intentamos cargar el perfil completo desde el backend.
                    if (decoded.id) {
                        const response = await fetch('http://localhost:5000/api/users/profile', {
                            headers: {
                                'Authorization': `Bearer ${token}` // Usamos el token para la autorización
                            }
                        });
                        const data = await response.json();

                        if (response.ok) {
                            setUser(data); // data es el objeto de usuario completo del backend
                            setUserId(data._id); // Usamos el _id del usuario
                            setIsAuthenticated(true);
                            setIsPremium(data.isPremium || false); // Obtenemos el estado premium real
                            console.log('AuthContext: Perfil de usuario cargado desde el backend.');
                        } else {
                            console.error('AuthContext: Error al cargar perfil:', data.message);
                            logout(); // Si hay error al cargar el perfil, cerrar sesión
                        }
                    } else {
                        // Si el token no tiene un ID válido en su payload, cerrar sesión
                        console.error('AuthContext: Token no contiene un ID de usuario válido.');
                        logout();
                    }
                } catch (error) {
                    console.error('AuthContext: Error al decodificar o verificar token:', error);
                    logout(); // Si el token es inválido o hay otro error, cerrar sesión
                } finally {
                    setLoading(false); // Termina la carga, independientemente del resultado
                }
            } else {
                // No hay token, no hay usuario autenticado
                setIsAuthenticated(false);
                setUser(null);
                setUserId(null);
                setIsPremium(false);
                setLoading(false); // Termina la carga
            }
        };

        loadUserFromToken();
    }, [token]); // Se ejecuta cuando el token cambia

    // Efecto para guardar/eliminar el token de localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('agroapp_token', token);
        } else {
            localStorage.removeItem('agroapp_token');
        }
    }, [token]);

    // Efecto para guardar el carrito en localStorage (se mantiene local por ahora)
    useEffect(() => {
        localStorage.setItem('agroapp_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Función de login: ahora espera un objeto userData y el token del backend
    const login = (userData, receivedToken) => {
        console.log("AuthContext: Realizando login con token.");
        setUser(userData); // Datos del usuario de la respuesta del backend
        setUserId(userData._id); // Usa el _id de la respuesta del backend
        setIsAuthenticated(true);
        setIsPremium(userData.isPremium || false); // Obtiene el estado premium del backend
        setToken(receivedToken); // Almacena el token JWT
        setLoading(false); // Termina la carga después del login
    };

    const logout = () => {
        console.log("AuthContext: Realizando logout.");
        setUser(null);
        setUserId(null);
        setIsAuthenticated(false);
        setIsPremium(false);
        setToken(null); // Borra el token
        setCartItems([]); // Borra el carrito al cerrar sesión
        setLoading(false); // Termina la carga después del logout
    };

    const register = (userData, receivedToken) => {
        console.log("AuthContext: Realizando registro con token.");
        setUser(userData); // Datos del usuario de la respuesta del backend
        setUserId(userData._id); // Usa el _id de la respuesta del backend
        setIsAuthenticated(true);
        setIsPremium(userData.isPremium || false); // Obtiene el estado premium del backend
        setToken(receivedToken); // Almacena el token JWT
        setLoading(false); // Termina la carga después del registro
    };

    // Funciones del carrito (se mantienen como están, usando localStorage por ahora)
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item._id === product._id); // Usar _id del backend
            if (existingItem) {
                return prevItems.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1, price: product.price || 0, name: product.name || 'Producto Desconocido' }];
            }
        });
        console.log("Producto añadido al carrito:", product.name);
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId)); // Usar _id
        console.log("Producto eliminado del carrito:", productId);
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems((prevItems) => {
            if (newQuantity <= 0) {
                return prevItems.filter((item) => item._id !== productId); // Usar _id
            }
            return prevItems.map((item) =>
                item._id === productId ? { ...item, quantity: newQuantity } : item // Usar _id
            );
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
        loading, // Exporta el estado de carga
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
