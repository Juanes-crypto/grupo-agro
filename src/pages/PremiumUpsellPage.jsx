// src/pages/PremiumUpsellPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function PremiumUpsellPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-lime-100 p-8 rounded-lg shadow-xl text-center animate-fade-in">
            <h2 className="text-4xl font-extrabold text-green-800 mb-6">
                ¡Desbloquea tu Potencial con AgroApp Premium! 🌟
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl">
                El Inventario Premium es solo una de las muchas herramientas exclusivas diseñadas para transformar
                la gestión de tu negocio agrícola. ¡Descubre cómo puedes ir más allá!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 w-full max-w-4xl">
                {/* Característica 1 */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-center text-green-600 text-3xl mb-4">
                        <span role="img" aria-label="chart">📈</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Análisis de Rendimiento Avanzado</h3>
                    <p className="text-gray-600">Obtén métricas detalladas sobre tus productos y ventas para tomar decisiones más inteligentes.</p>
                </div>
                {/* Característica 2 */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-center text-blue-600 text-3xl mb-4">
                        <span role="img" aria-label="handshake">🤝</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Acceso a Trueques Exclusivos</h3>
                    <p className="text-gray-600">Conéctate con una red de productores verificados para trueques de alto valor.</p>
                </div>
                {/* Característica 3 */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-center text-purple-600 text-3xl mb-4">
                        <span role="img" aria-label="headphones">🎧</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Soporte Prioritario 24/7</h3>
                    <p className="text-gray-600">Resuelve tus dudas y problemas rápidamente con nuestro equipo de soporte dedicado.</p>
                </div>
                 {/* Característica 4 */}
                 <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-center text-red-600 text-3xl mb-4">
                        <span role="img" aria-label="dollar sign">💰</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Mayores Ganancias</h3>
                    <p className="text-gray-600">Optimiza tus precios y encuentra mejores mercados para maximizar tus ingresos.</p>
                </div>
                 {/* Característica 5 */}
                 <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-center text-yellow-600 text-3xl mb-4">
                        <span role="img" aria-label="star">⭐</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Visibilidad Destacada</h3>
                    <p className="text-gray-600">Tus productos premium aparecerán primero en los resultados de búsqueda.</p>
                </div>
                {/* Característica 6 */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-center text-orange-600 text-3xl mb-4">
                        <span role="img" aria-label="farm">🚜</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Herramientas de Gestión</h3>
                    <p className="text-gray-600">Accede a un panel de control avanzado para gestionar eficientemente tu producción.</p>
                </div>
            </div>

            <button
                onClick={() => navigate('/subscription-plans')} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 text-xl"
            >
                ¡Pásate a Premium y Transforma tu Cosecha!
            </button>
            <p className="mt-6 text-md text-gray-500">
                ¿Tienes preguntas? Nuestro equipo está listo para ayudarte.
            </p>
        </div>
    );
}

export default PremiumUpsellPage;