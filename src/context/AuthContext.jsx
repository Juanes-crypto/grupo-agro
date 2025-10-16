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

    // 🔥 NUEVO: Función para limpiar completamente la sesión
    const clearSession = () => {
        console.log("AuthContext: Limpiando sesión completa.");
        setUser(null);
        setUserId(null);
        setIsAuthenticated(false);
        setIsPremium(false);
        setToken(null);
        clearCart();
        
        // Limpiar TODOS los datos de localStorage relacionados con la sesión
        localStorage.removeItem('CampoBit_token');
        localStorage.removeItem('CampoBit_cart');
        localStorage.removeItem('CampoBit_user');
        localStorage.removeItem('CampoBit_premium');
        
        // También limpiar sessionStorage por si acaso
        sessionStorage.clear();
    };

    // 🔥 NUEVO: Manejar el cierre de pestaña/ventana
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isAuthenticated) {
                console.log("Cerrando pestaña - Limpiando sesión...");
                
                // Intentar hacer logout en el servidor (opcional, pero recomendado)
                // Esto se ejecuta justo antes de que la pestaña se cierre
                if (navigator.sendBeacon) {
                    try {
                        // Usar sendBeacon para enviar la solicitud de logout
                        // Es más confiable que fetch/xhr en beforeunload
                        const formData = new FormData();
                        formData.append('logout', 'true');
                        navigator.sendBeacon(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/logout`, formData);
                    } catch (error) {
                        console.log('Logout con sendBeacon no disponible');
                    }
                }
                
                // Limpiar datos locales
                clearSession();
            }
        };

        // 🔥 NUEVO: Manejar cuando la pestaña/navegador se cierra
        const handlePageHide = (event) => {
            if (isAuthenticated && (event.persisted || !document.hidden)) {
                console.log("Pestaña siendo descargada - Limpiando sesión...");
                clearSession();
            }
        };

        // Agregar event listeners
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pagehide', handlePageHide);

        // Cleanup: remover event listeners cuando el componente se desmonte
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('pagehide', handlePageHide);
        };
    }, [isAuthenticated]); // Se ejecuta cuando cambia el estado de autenticación

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
                    // Si hay error al cargar el perfil, limpiar la sesión
                    clearSession();
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

    // 🔥 NUEVO: Manejar cuando el usuario cambia de pestaña (opcional)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // El usuario cambió a otra pestaña
                console.log("Usuario cambió a otra pestaña");
            } else {
                // El usuario regresó a esta pestaña
                console.log("Usuario regresó a la pestaña");
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

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
        clearSession();
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