// src/pages/SubscriptionPlansPage.jsx
import React from 'react';

function SubscriptionPlansPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-lime-100 p-8 rounded-lg shadow-xl text-center animate-fade-in">
            <h1 className="text-5xl font-extrabold text-green-800 mb-6 leading-tight">
                ¡Desbloquea el Verdadero Poder de tu Cosecha con AgroApp Premium! 🚀
            </h1>
            <p className="text-xl text-gray-700 mb-10 max-w-3xl">
                Deja atrás las limitaciones y maximiza el potencial de tu negocio agrícola. Con AgroApp Premium, no solo gestionas, ¡prosperas!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mb-12 w-full max-w-5xl">
                {/* Característica 1: Gestión de Inventario Avanzada */}
                <div className="bg-white p-8 rounded-xl shadow-2xl border-t-4 border-yellow-500 flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-3xl">
                    <div className="text-yellow-600 text-5xl mb-6">
                        <span role="img" aria-label="database">🗄️</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Control Total: Tu Inventario sin Límites
                    </h2>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        Imagina una base de datos exclusiva para **TODOS tus productos**. Con AgroApp Premium, obtienes un **inventario ilimitado y centralizado** donde puedes:
                    </p>
                    <ul className="list-none space-y-3 text-lg text-gray-800 mb-8 text-left w-full px-4">
                        <li className="flex items-start">
                            <span className="text-green-500 mr-3 text-2xl">✔</span>
                            <span className="flex-1">
                                **Registra y Gestiona sin Esfuerzo:** Añade cada uno de tus productos agrícolas con todos sus detalles, sin restricciones de cantidad.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-3 text-2xl">✔</span>
                            <span className="flex-1">
                                **Publica y Despublica al Instante:** Ten el poder de mostrar u ocultar tus ofertas con un solo clic, adaptándote a la demanda del mercado.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-3 text-2xl">✔</span>
                            <span className="flex-1">
                                **Edita y Actualiza en Tiempo Real:** Mantén tu inventario siempre al día con facilidad, modificando precios, cantidades o descripciones.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-3 text-2xl">✔</span>
                            <span className="flex-1">
                                **Elimina lo que ya no está:** Mantén tu base de datos limpia y eficiente, retirando productos que ya no ofreces.
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Característica 2: Visibilidad y Prioridad */}
                <div className="bg-white p-8 rounded-xl shadow-2xl border-t-4 border-green-500 flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-3xl">
                    <div className="text-green-600 text-5xl mb-6">
                        <span role="img" aria-label="star">🌟</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Destaca entre la Multitud: Prioridad de Exhibición
                    </h2>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        ¿Quieres que tus productos sean los primeros en ser vistos? Con Premium, tus ofertas no se pierden en la multitud:
                    </p>
                    <ul className="list-none space-y-3 text-lg text-gray-800 mb-8 text-left w-full px-4">
                        <li className="flex items-start">
                            <span className="text-yellow-500 mr-3 text-2xl">🚀</span>
                            <span className="flex-1">
                                **Primeros en la Lista:** Tus productos publicados obtendrán una **prioridad de renderizado** exclusiva, apareciendo en los primeros lugares de búsqueda y listados.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-yellow-500 mr-3 text-2xl">🚀</span>
                            <span className="flex-1">
                                **Mayor Visibilidad, Más Ventas:** Al estar más visibles, tus productos atraerán más miradas, generando más interés y, en consecuencia, **más oportunidades de venta y trueque**.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-yellow-500 mr-3 text-2xl">🚀</span>
                            <span className="flex-1">
                                **Conecta con Compradores Rápidamente:** Aumenta las interacciones y acelera tus transacciones al asegurarte de que tus ofertas lleguen primero a quienes las buscan.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <button
                onClick={() => alert('Implementar lógica de suscripción aquí')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-5 px-12 rounded-full shadow-lg transform transition duration-300 hover:scale-110 focus:outline-none focus:ring-6 focus:ring-yellow-300 text-2xl animate-bounce-slow"
            >
                ¡Hazte Premium Hoy y Multiplica tu Potencial! ✨
            </button>

            <p className="mt-8 text-md text-gray-600">
                Tu éxito es nuestra prioridad. Únete a la élite de AgroApp.
            </p>
        </div>
    );
}

export default SubscriptionPlansPage;