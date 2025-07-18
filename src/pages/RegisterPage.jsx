import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function RegisterPage() {
  console.log('RegisterPage: Componente renderizado.');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('RegisterPage: useEffect de autenticación. isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('RegisterPage: Usuario autenticado, redirigiendo a /premium.');
      navigate('/bienvenido'); // en lugar de '/premium'
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/users/register', { username, email, password });
      login(response.data);
      console.log('Registro exitoso:', response.data);
    } catch (err) {
      console.error('Error de registro:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error desconocido al registrar usuario. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  console.log('RegisterPage: Retornando JSX del formulario.');

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg border font-inter">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Registrarse</h2>

      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-semibold">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="username" className="block mb-2 font-medium text-gray-700">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-700">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white transition duration-300 ${
            loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="text-green-600 font-semibold hover:underline">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;