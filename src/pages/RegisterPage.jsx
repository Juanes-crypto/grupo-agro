import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null); // ⭐ Nuevo estado para la foto de perfil ⭐
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        try {
            // ⭐ Crear un objeto FormData para enviar archivos y campos de texto ⭐
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            if (profilePicture) { // Solo añadir si hay una imagen seleccionada
                formData.append('profilePicture', profilePicture);
            }

            // ⭐ LLAMADA A TU API DE REGISTRO DEL BACKEND ⭐
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                // ⭐ MUY IMPORTANTE: NO establezcas 'Content-Type': 'application/json' ⭐
                // Cuando envías FormData, el navegador lo establecerá automáticamente
                // con el boundary correcto. Si lo estableces manualmente, fallará.
                body: formData, // Envía el objeto FormData
            });
            const data = await response.json();
            console.log('Backend response data:', data);

            if (!response.ok) {
                // Si el backend devuelve un error específico (ej. "usuario ya existe"),
                // úsalo, de lo contrario, un mensaje genérico.
                throw new Error(data.message || 'Error al registrar usuario.');
            }

            // En un registro exitoso, almacena los datos del usuario y el token en AuthContext
            // El objeto 'data.user' ahora debería incluir 'profilePicture' desde el backend
            register(data.user, data.token);
            console.log('Registro exitoso:', data);
            navigate('/welcome'); // Redirige a la página de bienvenida o dashboard

        } catch (err) {
            setError(err.message || 'Error al registrar usuario. Inténtalo de nuevo.');
            console.error("Error de registro:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Registrarse</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {/* ⭐ Nuevo campo para la foto de perfil ⭐ */}
                <div>
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Foto de Perfil (Opcional)</label>
                    <input
                        type="file"
                        id="profilePicture"
                        className="mt-1 block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        accept="image/*" // Solo acepta archivos de imagen
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                    {profilePicture && (
                        <p className="mt-2 text-sm text-gray-500">
                            Archivo seleccionado: {profilePicture.name}
                        </p>
                    )}
                </div>
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 disabled:bg-green-400"
                    disabled={loading}
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
            <p className="mt-4 text-center text-gray-600">
                ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión aquí</Link>
            </p>
        </div>
    );
}

export default RegisterPage;