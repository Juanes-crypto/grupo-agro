// components/NewsletterForm.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext'; // ✅ Importar el contexto

const NewsletterForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  
  // ✅ CORREGIDO: Usar useContext en lugar de useAuth
  const { token, user, isAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔍 Debug - token:', token);
    console.log('🔍 Debug - user:', user);
    console.log('🔍 Debug - isAuthenticated:', isAuthenticated);
    
    if (!token) {
      console.error('❌ No hay token de acceso');
      toast.error('Debes iniciar sesión para enviar newsletters');
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Enviando newsletter...');
      console.log('📧 Token:', token ? 'PRESENTE' : 'AUSENTE');
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/email/newsletter`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Newsletter enviado:', response.data);
      toast.success(response.data.message);
      setFormData({ subject: '', content: '' });
    } catch (error) {
      console.error('❌ Error enviando newsletter:', error);
      console.error('❌ URL completa:', error.config?.url);
      console.error('❌ Response:', error.response);
      
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
      } else {
        toast.error(error.response?.data?.message || 'Error enviando newsletter');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-800 mb-6">📧 Enviar Newsletter</h2>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Estado de autenticación:</strong> {isAuthenticated ? '✅ Conectado' : '❌ No conectado'}
        </p>
        {user && (
          <p className="text-sm text-blue-800">
            <strong>Usuario:</strong> {user.email}
          </p>
        )}
        <p className="text-sm text-blue-800">
          <strong>Token:</strong> {token ? '✅ PRESENTE' : '❌ AUSENTE'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Asunto *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ej: Nuevos productos disponibles..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contenido (HTML) *
            <span className="text-xs text-gray-500 ml-2">Puedes usar etiquetas HTML básicas</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={8}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
            placeholder='<p>¡Hola [Nombre]!</p><p>Tenemos novedades en Campobit...</p><a href="https://tu-app.com">Ver más</a>'
          />
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 font-semibold"
        >
          {loading ? '📤 Enviando...' : '🚀 Enviar Newsletter a Todos los Usuarios'}
        </button>
      </form>

      {!token && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="font-semibold text-red-800">⚠️ No autenticado</h3>
          <p className="text-sm text-red-700">
            Debes iniciar sesión para enviar newsletters. Recarga la página o cierra y abre sesión nuevamente.
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsletterForm;