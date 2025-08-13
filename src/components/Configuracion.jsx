// src/components/Configuracion.jsx
import React from 'react';

const Configuracion = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuración de la Cuenta</h2>
            <div className="space-y-4">
                <p className="text-gray-600">
                    Aquí podrás gestionar la configuración de tu cuenta, como notificaciones, seguridad y preferencias de privacidad.
                </p>
                <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-semibold text-lg text-gray-700">Notificaciones</h3>
                    <p className="text-sm text-gray-500">
                        Ajusta qué tipo de notificaciones quieres recibir.
                    </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-semibold text-lg text-gray-700">Seguridad</h3>
                    <p className="text-sm text-gray-500">
                        Cambia tu contraseña o gestiona tus dispositivos activos.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Configuracion;
