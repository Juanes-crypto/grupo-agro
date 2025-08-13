import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import MisPublicaciones from './MisPublicaciones';
import MisPedidos from './MisPedidos';
import MisNotificaciones from './MisNotificaciones';

const DashboardOverview = () => {
    const { user } = useContext(AuthContext);

    // Datos simulados para las estadísticas rápidas, ya que no tenemos endpoints para estos datos
    const quickStats = [
        { label: "Publicaciones Activas", value: "3" },
        { label: "Propuestas de Trueque", value: "2" },
        { label: "Órdenes Recibidas", value: "1" },
        { label: "Reputación", value: `${user?.reputation || 0} / 5` },
    ];

    return (
        <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
            {/* Sección de Bienvenida */}
            <div className="bg-white rounded-lg p-6 shadow-md flex flex-col sm:flex-row items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        ¡Hola de nuevo, {user?.name || 'Usuario'}!
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Aquí tienes un resumen rápido de tu actividad en AgroApp.
                    </p>
                </div>
                {user?.profilePicture && (
                    <img
                        src={user.profilePicture}
                        alt="Foto de perfil"
                        className="w-20 h-20 rounded-full object-cover mt-4 sm:mt-0 sm:ml-4 border-2 border-green-500"
                    />
                )}
            </div>

            {/* Estadísticas Rápidas */}
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Estadísticas Rápidas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickStats.map((stat, index) => (
                        <div key={index} className="bg-green-100 p-4 rounded-lg shadow-sm text-center">
                            <p className="text-3xl font-bold text-green-700">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Contenedor principal de las secciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Notificaciones */}
                <div className="lg:col-span-1">
                    <MisNotificaciones />
                </div>

                {/* Publicaciones y Pedidos */}
                <div className="lg:col-span-1 space-y-8">
                    <MisPublicaciones />
                    <MisPedidos />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
