import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Asegúrate de importar Link
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Obtiene la función de login del contexto

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // ⭐ LLAMADA A TU API DE LOGIN DEL BACKEND ⭐
            const response = await fetch('http://localhost:5000/api/users/login', { // ⭐ VERIFICA TU URL Y PUERTO DEL BACKEND ⭐
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Si la respuesta no es OK (ej. 401 Unauthorized, 400 Bad Request)
                throw new Error(data.message || 'Error al iniciar sesión.');
            }

            // En un login exitoso, almacena los datos del usuario y el token en AuthContext
            // Asumiendo que el backend devuelve { user: { _id, name, email, isPremium }, token: '...' }
            login(data.user, data.token);
            console.log('Inicio de sesión exitoso:', data);
            navigate('/welcome'); // Redirige a la página de bienvenida o dashboard

        } catch (err) {
            setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
            console.error("Error de login:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 disabled:bg-green-400"
                    disabled={loading}
                >
                    {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                </button>
            </form>
            <p className="mt-4 text-center text-gray-600">
                ¿No tienes una cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate aquí</Link>
            </p>
        </div>
    );
}

export default LoginPage;