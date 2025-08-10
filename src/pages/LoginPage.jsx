import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// import api from '../services/api'; // Si usas Axios, descomenta esto

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    // ⭐ Cambiado de 'error' a 'errors' para consistencia con RegisterPage ⭐
    const [errors, setErrors] = useState([]); 

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]); // Limpiamos los errores antes de un nuevo intento

        try {
            // ⭐ LLAMADA A TU API DE LOGIN DEL BACKEND ⭐
            // Si usaras Axios:
            // const response = await api.post('/users/login', { email, password });
            // const data = response.data;

            // Si sigues usando fetch:
            const response = await fetch('https://grupo-agro-backend.onrender.com/api/users/login', { // ⭐ VERIFICA TU URL Y PUERTO DEL BACKEND ⭐
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Manejo de errores más detallado para fetch
                if (data.message) {
                    setErrors([data.message]); // Si el backend envía un mensaje directo
                } else if (data.errors && Array.isArray(data.errors)) {
                    // Si el backend envía un array de errores (ej. de express-validator)
                    const backendErrorMessages = data.errors.map(err => err.msg);
                    setErrors(backendErrorMessages);
                } else {
                    setErrors(['Error al iniciar sesión. Por favor, verifica tus credenciales.']);
                }
                setLoading(false); // Detener la carga si hay un error
                return; // Importante para detener la ejecución
            }

            // En un login exitoso, almacena los datos del usuario y el token en AuthContext
            // Asumiendo que el backend devuelve { user: { _id, name, email, isPremium }, token: '...' }
            login(data.user, data.token);
            console.log('Inicio de sesión exitoso:', data);
            navigate('/welcome'); // Redirige a la página de bienvenida o dashboard

        } catch (err) {
            // Este catch manejará errores de red u otros errores inesperados
            setErrors(['Error de conexión o inesperado. ' + (err.message || 'Por favor, inténtalo de nuevo.')]);
            console.error("Error de login:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-white rounded-xl shadow-2xl border border-green-100 transform hover:scale-[1.005] transition-all duration-300">
                {/* Columna del Formulario de Inicio de Sesión */}
                <div className="space-y-8 flex flex-col justify-center">
                    <div className="text-center">
                        <img className="mx-auto h-16 w-auto mb-4" src="./public/AgroApp-logo.png" alt="AgroApp Logo" />
                        <h2 className="mt-2 text-center text-3xl font-extrabold text-green-800">
                            Bienvenido de nuevo
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Inicia sesión para acceder a tu cuenta de AgroApp.
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                                placeholder="Tu dirección de email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                                placeholder="Tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* ⭐ Mostrar los errores aquí ⭐ */}
                        {errors.length > 0 && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-4 shadow-sm" role="alert">
                                <strong className="font-bold">¡Error al iniciar sesión!</strong>
                                <ul className="mt-2 list-disc list-inside space-y-1">
                                    {errors.map((msg, index) => (
                                        <li key={index} className="text-sm">{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Iniciando Sesión...
                                    </span>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </div>
                    </form>
                    <p className="mt-4 text-center text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>

                {/* Columna de la Tarjeta de Incentivo Premium */}
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 rounded-xl shadow-xl flex flex-col justify-between items-center text-center text-white
                                border border-yellow-300 transform hover:scale-[1.01] transition-all duration-300
                                lg:mt-0 mt-8"> {/* Añadimos margen superior en móvil */}
                    <div>
                        <svg className="mx-auto h-24 w-24 text-white mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2h3.382l-.788 1.576a1 1 0 001.789.894L9 8h2l1.191-2.382a1 1 0 00-1.789-.894L11 4h-3.382l.894-1.789A1 1 0 009 2z" opacity=".25"></path>
                        </svg>
                        <h3 className="text-3xl font-extrabold mb-3 leading-tight">¡Lleva tu experiencia al siguiente nivel con AgroApp Premium!</h3>
                        <p className="text-lg mb-6 opacity-90">Desbloquea funciones exclusivas y maximiza tus beneficios:</p>
                        <ul className="text-left space-y-2 mb-6 text-lg list-disc list-inside">
                            <li>Optimiza tus precios, maximiza ingresos.</li>
                            <li>Tus productos apareceran primero en los resultados de busqueda.</li>
                            <li>Herramientas de Gestion: Accede a un panel de control avanzado.</li>
                            <li>Prioridad de renderizacion: Tus productos tienen prioridad de muestra.</li>
                        </ul>
                    </div>
                    <Link 
                        to="/premium" // Puedes cambiar esta ruta a donde tengas la página de información premium
                        className="w-full bg-white text-yellow-700 hover:bg-yellow-100 py-3 px-6 rounded-lg text-lg font-bold shadow-md transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Saber Más
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;