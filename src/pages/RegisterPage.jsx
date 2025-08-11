import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
//import api from '../services/api'; 

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    // ⭐ Nuevos estados basados en tu User.js ⭐
    const [phoneNumber, setPhoneNumber] = useState(''); // Para el número de WhatsApp
    const [showPhoneNumber, setShowPhoneNumber] = useState(false); // Para el checkbox

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]); 

    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]); // Limpiamos los errores antes de un nuevo intento

        if (password !== confirmPassword) {
            setErrors(['Las contraseñas no coinciden.']);
            setLoading(false);
            return;
        }

        // Validación básica para phoneNumber (solo dígitos, opcional pero recomendado)
        if (phoneNumber && !/^\d+$/.test(phoneNumber)) {
            setErrors(prev => [...prev, 'El número de teléfono solo debe contener dígitos.']);
            setLoading(false); // Detener si hay errores de validación local
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            // ⭐ Agregamos los nuevos campos a FormData con los nombres exactos del backend ⭐
            formData.append('phoneNumber', phoneNumber);
            formData.append('showPhoneNumber', showPhoneNumber); // Los booleanos se envían como 'true' o 'false' strings, el backend debe convertirlos

            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }

            // Si sigues usando fetch:
            const response = await fetch('https://grupo-agro-backend.onrender.com/api/users/register', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log('Backend response data:', data);

            if (!response.ok) {
                if (data.errors && Array.isArray(data.errors)) {
                    const backendErrorMessages = data.errors.map(err => err.msg);
                    setErrors(backendErrorMessages);
                } else if (data.message) {
                    setErrors([data.message]);
                } else {
                    setErrors(['Error al registrar usuario. Por favor, inténtalo de nuevo.']);
                }
                setLoading(false);
                return;
            }

            register(data.user, data.token);
            console.log('Registro exitoso:', data);
            navigate('/welcome'); 

        } catch (err) {
            console.error("Error de registro:", err);
            setErrors(['Error de conexión o inesperado. ' + (err.message || 'Por favor, inténtalo de nuevo.')]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl border border-green-100 transition-all duration-300 transform hover:scale-[1.01]">
                <div className="text-center">
                    {/* Puedes reemplazar este SVG con tu logo si lo tienes */}
                    <img className="mx-auto h-20 w-auto" src="/images/AgroNet-logo.png" alt="AgroNet Logo" />
                    <h2 className="mt-6 text-center text-4xl font-extrabold text-green-800">
                        ¡Únete a la comunidad AgroNet!
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Crea tu cuenta para empezar a vender o comprar productos agrícolas.
                    </p>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                        {/* Campo Nombre */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                                placeholder="Ej: Juan Pérez"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        {/* Campo Email */}
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                                placeholder="email@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {/* Campo Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* Campo Confirmar Contraseña */}
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-1">Confirmar Contraseña</label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                                placeholder="Repite tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {/* ⭐ NUEVO CAMPO: Número de Teléfono (WhatsApp) ⭐ */}
                        <div className="sm:col-span-2"> {/* Ocupa ambas columnas en pantallas grandes */}
                            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-1">Número de WhatsApp</label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel" // Usar 'tel' para números de teléfono
                                autoComplete="tel"
                                className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                                placeholder="Ej: 3001234567"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <p className="mt-1 text-xs text-gray-500">Este número podría ser visible para otros usuarios si decides compartirlo.</p>
                        </div>
                    </div>

                    {/* ⭐ NUEVO CAMPO: Checkbox para showPhoneNumber ⭐ */}
                    <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="showPhoneNumber"
                                name="showPhoneNumber"
                                type="checkbox"
                                className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                                checked={showPhoneNumber}
                                onChange={(e) => setShowPhoneNumber(e.target.checked)}
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="showPhoneNumber" className="font-medium text-gray-700 cursor-pointer">
                                Compartir mi número de WhatsApp (Recomendado para servicios y rentas)
                            </label>
                            <p className="text-gray-500">Permite que otros usuarios vean tu número de WhatsApp en tu perfil.</p>
                        </div>
                    </div>

                    {/* Campo para la foto de perfil */}
                    <div>
                        <label htmlFor="profilePicture" className="block text-sm font-semibold text-gray-700 mb-1">
                            Foto de Perfil (Opcional)
                        </label>
                        <input
                            type="file"
                            id="profilePicture"
                            className="block w-full text-sm text-gray-700
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-green-50 file:text-green-700
                                hover:file:bg-green-100 cursor-pointer transition-colors duration-200"
                            accept="image/*"
                            onChange={(e) => setProfilePicture(e.target.files[0])}
                        />
                        {profilePicture && (
                            <p className="mt-2 text-sm text-gray-500">
                                Archivo seleccionado: <span className="font-semibold">{profilePicture.name}</span>
                            </p>
                        )}
                    </div>

                    {/* ⭐ Mostrar los errores aquí ⭐ */}
                    {errors.length > 0 && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-4 shadow-sm" role="alert">
                            <strong className="font-bold">¡Errores de registro!</strong>
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
                                    Registrando...
                                </span>
                            ) : (
                                'Registrarse'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;