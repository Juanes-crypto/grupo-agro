import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // Importa tu instancia de Axios

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { token } = useParams(); // Obtiene el token de la URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Validación de coincidencia
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    // --- ⭐ VALIDACIÓN DE 6 CARACTERES AÑADIDA AQUÍ ⭐ ---
    if (!password || password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        setLoading(false);
        return;
    }
    // --- ⭐ FIN DE LA VALIDACIÓN ⭐ ---

    if (!token) {
        setError('Token no válido o faltante.');
        setLoading(false);
        return;
    }

    try {
      console.log(`Enviando solicitud de reseteo con token: ${token}`);
      const { data } = await api.put(`/api/users/reset-password/${token}`, { 
        password 
      });
      
      console.log('Respuesta del servidor:', data);
      setMessage(data.message || '¡Contraseña actualizada con éxito! Redirigiendo a login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error('Error al resetear contraseña:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error al actualizar. El token puede ser inválido o haber expirado.');
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
            Establece tu nueva contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa una contraseña segura.
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

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Nueva Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirmar Contraseña
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
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

export default ResetPasswordPage;