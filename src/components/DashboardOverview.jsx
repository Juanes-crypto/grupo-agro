import React from 'react'; // Eliminamos useContext, useState, useEffect
// Eliminamos api y toast

// ⭐ AHORA RECIBE PROPS: user, data, loading ⭐
const DashboardOverview = ({ user, data, loading }) => {

    const quickStats = [
        { label: "Publicaciones Activas", value: (data.products?.length || 0) + (data.services?.length || 0) + (data.rentals?.length || 0) },
        { label: "Propuestas de Trueque", value: data.barterProposals?.length || 0 },
        { label: "Órdenes Recibidas", value: data.receivedOrders?.length || 0 },
        { label: "Reputación", value: user?.reputation ? `${user.reputation} / 5` : 'N/A' },
    ];

    if (loading) {
        return <div className="text-center p-8">Cargando resumen...</div>;
    }

    return (
        // El JSX se queda igual, pero ahora usa 'data' de las props
        <div className="space-y-8"> 
            {/* Sección de Bienvenida */}
            <div className="bg-white rounded-lg p-6 shadow-md flex flex-col sm:flex-row items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        ¡Hola de nuevo, {user?.name || 'Usuario'}!
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Aquí tienes un resumen rápido de tu actividad en CampoBit.
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
            
            <div className="text-center bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700">Explora tu panel</h3>
                <p className="text-gray-600 mt-2">Usa el menú lateral para ver tus publicaciones, órdenes y notificaciones en detalle.</p>
            </div>
        </div>
    );
};

export default DashboardOverview;