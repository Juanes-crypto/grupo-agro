// frontend/src/pages/PayoutSettingsPage.jsx

import React, { useEffect, useState, useContext } from 'react'; // 💡 Importar useContext
// import { useSelector } from 'react-redux'; // ❌ ¡ELIMINAR ESTO!
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 💡 IMPORTAR TU CONTEXTO

const PayoutSettingsPage = () => {
    // 1. OBTENER EL USUARIO DEL CONTEXTO (¡LA FORMA CORRECTA PARA TI!)
    const { user: userInfo, authToken } = useContext(AuthContext);
    // Determinar si el usuario ya conectó su cuenta de MP
    const isConnected = userInfo?.mpAccessToken; // Ahora lee el campo del Contexto

    // 2. Manejar mensajes de éxito/error de la URL
    const location = useLocation();
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        if (params.get('success') === 'mp_connected') {
            setStatusMessage({
                type: 'success',
                text: '✅ ¡Conexión exitosa! Tu cuenta de Mercado Pago está lista para recibir pagos.',
            });
        } else if (params.get('error')) {
            setStatusMessage({
                type: 'error',
                text: '❌ Fallo en la conexión. Por favor, inténtalo de nuevo. (Detalle: ' + params.get('error') + ')',
            });
        }

        // Opcional: Limpiar los parámetros de la URL después de mostrarlos
        // navigate(location.pathname, { replace: true }); // Requiere importar 'useNavigate'

    }, [location.search]);


    // frontend/src/pages/PayoutSettingsPage.jsx

    const handleConnect = () => {
        let finalToken = authToken; // 1. Intentar obtener del Contexto

        // 2. Si el contexto no lo tiene, OBLIGAR la lectura de la clave correcta de localStorage
        if (!finalToken) {
            // 💡 CORRECCIÓN CLAVE: Usar la clave exacta que está en localStorage
            finalToken = localStorage.getItem('CampoBit_token');

            console.log("Token recuperado de localStorage:", finalToken ? "Sí" : "No");
        }

        if (!finalToken) {
            console.error("Token de autenticación no encontrado. No se puede iniciar el OAuth.");
            alert("Debes iniciar sesión para conectar con Mercado Pago.");
            return;
        }

        // 3. El token que se guarda en localStorage parece estar limpio (sin 'Bearer '), 
        // pero lo limpiamos por si acaso.
        const cleanToken = finalToken.startsWith('Bearer ')
            ? finalToken.split(' ')[1]
            : finalToken;

        // 4. Redirigir al backend con el token
        const oauthUrl = `http://localhost:5000/api/users/init-mp-oauth?token=${cleanToken}`;

        console.log("Token a enviar (limpio, inicio):", cleanToken.substring(0, 20) + '...');
        // Iniciar la redirección que finalmente llamará a initMpOAuth en el backend
        window.location.href = oauthUrl;
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Configuración de Pagos (Payout)
            </h1>

            {/* Mostrar mensajes de estado */}
            {statusMessage && (
                <div className={`p-4 rounded-md mb-4 ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {statusMessage.text}
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-600 mb-4">
                    Para recibir el dinero de tus ventas, debes conectar tu cuenta de Mercado Pago a CampoBit.
                    Serás redirigido a un entorno seguro para completar la conexión.
                </p>

                {isConnected ? (
                    <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                        <h3 className="font-semibold text-xl mb-2">¡Cuenta Conectada!</h3>
                        <p>
                            Tu cuenta de Mercado Pago está lista para recibir pagos.
                            (ID de Usuario MP: {userInfo.mpUserId || 'N/A'})
                        </p>
                        <button
                            onClick={() => alert('Próximamente: Lógica para desconectar la cuenta.')}
                            className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
                        >
                            Desconectar Cuenta
                        </button>
                    </div>
                ) : (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-3">Conectar Cuenta</h3>
                        <button
                            onClick={handleConnect}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
                        >
                            Conectar con Mercado Pago (OAuth)
                        </button>
                        <p className="text-sm text-gray-500 mt-3">
                            Al hacer clic serás redirigido a Mercado Pago para autorizar a CampoBit a transferirte dinero.
                        </p>
                    </div>
                )}

                <div className="mt-8 pt-4 border-t border-gray-200">
                    <Link to="/profile" className="text-indigo-600 hover:text-indigo-800">
                        &larr; Volver al Perfil
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PayoutSettingsPage;