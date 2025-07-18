// frontend/src/components/PremiumRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Asegúrate de que la ruta a AuthContext sea correcta

const PremiumRoute = () => {
    const { isAuthenticated, isPremium, loading } = useContext(AuthContext); // Asume que AuthContext tiene 'isPremium' y 'loading'

    if (loading) {
        // Opcional: Puedes mostrar un spinner o un mensaje de carga mientras se verifica el estado de autenticación y premium
        return <div className="text-center mt-20 text-xl">Verificando estado Premium...</div>;
    }

    // Primero, verifica si está autenticado
    if (!isAuthenticated) {
        // Si no está autenticado, redirige a la página de login (PrivateRoute ya debería manejar esto, pero es una doble capa)
        return <Navigate to="/login" replace />;
    }

    // Luego, verifica si es premium
    if (!isPremium) {
        // Si no es premium, puedes redirigirlo a una página de "upsell" o a la página de inicio
        // Por ejemplo, a una página que explique los beneficios premium
        // Asegúrate de que exista una ruta para '/premium-upsell' en tu App.jsx
        return <Navigate to="/premium-upsell" replace />;
    }

    // Si está autenticado y es premium, permite el acceso a las rutas anidadas
    return <Outlet />;
};

export default PremiumRoute;