import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Importa tu instancia de Axios

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      console.log(`Enviando solicitud de reseteo para: ${email}`);
      // Apunta a la nueva ruta del backend
      const { data } = await api.post('/api/users/forgot-password', { email });
      
      console.log('Respuesta del servidor:', data);
      setMessage(data.message || 'Se ha enviado un enlace a tu correo.');
      setEmail('');
    } catch (err) {
      console.error('Error al solicitar reseteo:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error al enviar el correo. Verifica el email e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-2xl">
        <div>
          <img
            className="mx-auto h-20 w-auto"
            src="/images/CampoBit-logo.png"
            alt="CampoBit"
          />
          <h2 className="mt-6 text-center text-3xl font-bold text-green-800">
            Recupera tu contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl" role="alert">
              <p className="font-medium">{message}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl" role="alert">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <Link to="/login" className="font-medium text-green-600 hover:text-green-700">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;