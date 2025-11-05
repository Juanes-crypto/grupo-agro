import React from 'react';
import {
    ChartBarIcon,
    TagIcon,
    ShoppingCartIcon,
    BellIcon,
    StarIcon,
    SparklesIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from '@heroicons/react/24/outline';

const DashboardOverview = ({ user, data, loading }) => {
    const quickStats = [
        {
            label: "Publicaciones Activas",
            value: (data.products?.length || 0) + (data.services?.length || 0) + (data.rentals?.length || 0),
            icon: TagIcon,
            color: "from-green-500 to-emerald-600",
            bgColor: "from-green-50 to-emerald-50",
            textColor: "text-green-700",
            trend: "+12%",
            trendUp: true
        },
        {
            label: "Órdenes Recibidas",
            value: data.receivedOrders?.length || 0,
            icon: ShoppingCartIcon,
            color: "from-blue-500 to-indigo-600",
            bgColor: "from-blue-50 to-indigo-50",
            textColor: "text-blue-700",
            trend: "+8%",
            trendUp: true
        },
        {
            label: "Notificaciones",
            value: data.notifications?.filter(n => !n.isRead)?.length || 0,
            icon: BellIcon,
            color: "from-orange-500 to-red-600",
            bgColor: "from-orange-50 to-red-50",
            textColor: "text-orange-700",
            trend: "-5%",
            trendUp: false
        },
        {
            label: "Reputación",
            value: user?.reputation ? `${user.reputation}/5` : 'N/A',
            icon: StarIcon,
            color: "from-purple-500 to-pink-600",
            bgColor: "from-purple-50 to-pink-50",
            textColor: "text-purple-700",
            trend: "+2%",
            trendUp: true
        },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-sm text-gray-500">Cargando resumen...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <SparklesIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    ¡Bienvenido de vuelta, {user?.name || 'Usuario'}!
                                </h1>
                                <p className="text-blue-100 mt-1">Tu panel profesional está listo</p>
                            </div>
                        </div>
                        <p className="text-lg text-blue-100 max-w-2xl">
                            Gestiona tus publicaciones, sigue tus ventas y mantén el control de tu actividad en CampoBit.
                        </p>
                    </div>

                    {user?.profilePicture && (
                        <div className="mt-6 md:mt-0 md:ml-8">
                            <div className="relative">
                                <img
                                    src={user.profilePicture}
                                    alt="Foto de perfil"
                                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 shadow-2xl"
                                />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Statistics Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <ChartBarIcon className="w-7 h-7 mr-3 text-blue-600" />
                        Estadísticas del Panel
                    </h2>
                    <div className="flex items-center text-sm text-gray-500">
                        <ChartBarIcon className="w-4 h-4 mr-1" />
                        Actualizado en tiempo real
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className={`relative overflow-hidden bg-gradient-to-br ${stat.bgColor} border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                            >
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                                    <div className={`w-full h-full bg-gradient-to-br ${stat.color} rounded-full transform translate-x-6 -translate-y-6`}></div>
                                </div>

                                <div className="relative z-10">
                                    {/* Icon and Trend */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                                            stat.trendUp
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {stat.trendUp ? (
                                                <ArrowUpIcon className="w-3 h-3 mr-1" />
                                            ) : (
                                                <ArrowDownIcon className="w-3 h-3 mr-1" />
                                            )}
                                            {stat.trend}
                                        </div>
                                    </div>

                                    {/* Value */}
                                    <div className="mb-2">
                                        <p className={`text-3xl font-bold ${stat.textColor}`}>
                                            {stat.value}
                                        </p>
                                    </div>

                                    {/* Label */}
                                    <p className="text-sm font-medium text-gray-600">
                                        {stat.label}
                                    </p>
                                </div>

                                {/* Hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center justify-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <SparklesIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            ¡Todo bajo control!
                        </h3>
                        <p className="text-gray-600 max-w-md">
                            Tu actividad está organizada y optimizada. Explora las secciones del panel para gestionar cada aspecto de tu presencia en CampoBit.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
