import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(false);
    // ⭐ Cambiamos 'error' a 'errors' para manejar múltiples mensajes ⭐
    const [errors, setErrors] = useState([]); 

    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // ⭐ Limpiamos los errores antes de un nuevo intento ⭐
        setErrors([]); 

        if (password !== confirmPassword) {
            setErrors(['Las contraseñas no coinciden.']); // Ahora es un array
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }

            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log('Backend response data:', data);

            if (!response.ok) {
                // ⭐ MODIFICACIÓN CLAVE AQUÍ: Manejar errores de express-validator ⭐
                if (data.errors && Array.isArray(data.errors)) {
                    // Si el backend envió un array de errores de validación
                    const backendErrorMessages = data.errors.map(err => err.msg);
                    setErrors(backendErrorMessages); // Guardamos todos los mensajes
                } else if (data.message) {
                    // Si el backend envió un mensaje de error genérico (ej. "usuario ya existe")
                    setErrors([data.message]);
                } else {
                    // Si la estructura del error es inesperada
                    setErrors(['Error al registrar usuario. Por favor, inténtalo de nuevo.']);
                }
                setLoading(false);
                return; // Importante para detener la ejecución aquí si hay errores
            }

            register(data.user, data.token);
            console.log('Registro exitoso:', data);
            navigate('/welcome'); 

        } catch (err) {
            // Este catch manejará errores de red u otros que no sean 400 del backend
            setErrors(['Error de conexión o inesperado. ' + (err.message || 'Por favor, inténtalo de nuevo.')]);
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
                {/* Campo para la foto de perfil */}
                <div>
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Foto de Perfil (Opcional)</label>
                    <input
                        type="file"
                        id="profilePicture"
                        className="mt-1 block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                    {profilePicture && (
                        <p className="mt-2 text-sm text-gray-500">
                            Archivo seleccionado: {profilePicture.name}
                        </p>
                    )}
                </div>
                {/* ⭐ Mostrar los errores aquí ⭐ */}
                {errors.length > 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">¡Errores de registro!</strong>
                        <ul className="mt-2 list-disc list-inside">
                            {errors.map((msg, index) => (
                                <li key={index} className="text-sm">{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}
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