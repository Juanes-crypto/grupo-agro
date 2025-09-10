import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Componente del formulario de registro
const RegisterForm = () => {
  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [location, setLocation] = useState('');

  // Estados para el UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validación básica
    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        phoneNumber,
        showPhoneNumber,
        location,
      });

      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        // Opcional: limpiar los campos del formulario
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhoneNumber('');
        setShowPhoneNumber(false);
        setLocation('');
      }
    } catch (err) {
      console.error('Error de registro:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Crea tu cuenta</h1>
          <p className="text-gray-600 mt-2">Únete a la comunidad de CampoBit.</p>
        </div>

        {/* Muestra mensajes de éxito o error */}
        {successMessage && (
          <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
            <p>{successMessage}</p>
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Campo de Nombre */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Nombre</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0a4.5 4.5 0 01-9 0ZM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.75.75H4.501a.75.75 0 01-.75-.75Z" clipRule="evenodd" /></svg>
              </span>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Tu nombre completo"
                required
              />
            </div>
          </div>

          {/* Campo de Correo Electrónico */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Correo Electrónico</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M1.5 8.67v8.58a3 3 0 00.324 1.157 4 4 0 01.761 1.76l.044.137c.105.344.208.682.316 1.018a.75.75 0 001.037.196l4.471-2.235a.75.75 0 00-.518-1.341l-3.328 1.664a.75.75 0 00-.916-.17l-.234-.14a3 3 0 01-.795-1.554.75.75 0 00-.077-.282.75.75 0 00-.528-.863l-1.92-1.92V6.75a3 3 0 013-3h11.458a.75.75 0 000-1.5H3.75a.75.75 0 00-.75.75v12a3 3 0 003 3h12a3 3 0 003-3V8.67a.75.75 0 00-.472-.71l-11-2.934a.75.75 0 00-.573-.02l-6.556 1.748a.75.75 0 00-.594.721z" /><path d="M1.5 8.67v8.58a3 3 0 00.324 1.157 4 4 0 01.761 1.76l.044.137c.105.344.208.682.316 1.018a.75.75 0 001.037.196l4.471-2.235a.75.75 0 00-.518-1.341l-3.328 1.664a.75.75 0 00-.916-.17l-.234-.14a3 3 0 01-.795-1.554.75.75 0 00-.077-.282.75.75 0 00-.528-.863l-1.92-1.92V6.75a3 3 0 013-3h11.458a.75.75 0 000-1.5H3.75a.75.75 0 00-.75.75v12a3 3 0 003 3h12a3 3 0 003-3V8.67a.75.75 0 00-.472-.71l-11-2.934a.75.75 0 00-.573-.02l-6.556 1.748a.75.75 0 00-.594.721z" /></svg>
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>

          {/* Campo de Contraseña */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg>
              </span>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
                required
                minLength="6"
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fillRule="evenodd" d="M1.323 11.447C2.81 7.822 8.01 5.625 12 5.625c3.99 0 9.19 2.197 10.677 5.822a1.5 1.5 0 010 1.106C21.19 16.178 15.99 18.375 12 18.375c-3.99 0-9.19-2.197-10.677-5.822a1.5 1.5 0 010-1.106zM12 13.875a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z" clipRule="evenodd" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18z" /><path fillRule="evenodd" d="M22.625 12.001a1.53 1.53 0 01-.132.585 8.25 8.25 0 01-2.943 3.69l-.801-.801c2.194-.96 4.1-2.73 5.166-4.914a1.5 1.5 0 000-1.106c-1.066-2.183-2.972-3.953-5.166-4.914l.801-.801a8.25 8.25 0 012.943 3.69c1.029 2.083 1.029 4.382 0 6.465zM12 4.5a.75.75 0 01.75.75v.528a3 3 0 00-1.5 0V5.25A.75.75 0 0112 4.5zM8.423 7.846a.75.75 0 011.06-1.06l.397.398a5.25 5.25 0 00-3.69 3.69l-.398-.397a.75.75 0 01-1.06-1.06zm4.945 1.765a3.75 3.75 0 013.75 3.75v.75a.75.75 0 001.5 0v-.75a5.25 5.25 0 00-5.25-5.25h-.75a.75.75 0 000 1.5h.75z" clipRule="evenodd" /></svg>
                )}
              </span>
            </div>
          </div>
          
          {/* Campo de Confirmar Contraseña */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg>
              </span>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Vuelve a escribir tu contraseña"
                required
              />
            </div>
          </div>

          {/* Campo de Número de Teléfono */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="phoneNumber">Número de Teléfono</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h15a3 3 0 013 3v12a3 3 0 01-3 3h-15a3 3 0 01-3-3v-12zm6 1.5h10.5v12H7.5V6zM15 12h-3v3h3v-3z" clipRule="evenodd" /></svg>
              </span>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Tu número de teléfono (opcional)"
              />
            </div>
          </div>
          
          {/* Checkbox para mostrar el número de teléfono */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="showPhoneNumber"
              checked={showPhoneNumber}
              onChange={(e) => setShowPhoneNumber(e.target.checked)}
              className="rounded-md border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
            />
            <label htmlFor="showPhoneNumber" className="ml-2 block text-sm text-gray-700">
              Mostrar mi número de teléfono en mi perfil público
            </label>
          </div>

          {/* Campo de Ubicación */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="location">Ubicación</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v4.5H7.5a.75.75 0 000 1.5h3.75v4.5a.75.75 0 001.5 0v-4.5h3.75a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>
              </span>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Tu ciudad o región (opcional)"
              />
            </div>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        {/* Enlace para ir al login */}
        <p className="mt-6 text-center text-gray-600">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-green-600 font-semibold hover:underline">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
