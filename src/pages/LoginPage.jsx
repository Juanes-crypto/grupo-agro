import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  console.log('LoginPage: Componente renderizado.');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('LoginPage: useEffect de autenticación. isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('LoginPage: Usuario autenticado, redirigiendo a /premium.');
      navigate('/bienvenido'); // en lugar de '/premium'
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/users/login', { email, password });
      login(response.data);
      console.log('Login exitoso:', response.data);
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error desconocido al iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  console.log('LoginPage: Retornando JSX del formulario.');

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-xl rounded-xl border font-inter">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>

      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-semibold">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-bold transition duration-300 ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;