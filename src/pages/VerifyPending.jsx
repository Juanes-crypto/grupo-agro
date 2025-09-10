// VerifyPending.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyPending = () => {
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    const pending = localStorage.getItem('pendingVerification');
    if (pending) {
      const data = JSON.parse(pending);
      setEmail(data.email);
    } else {
      navigate('/register');
    }

    // Countdown para reenviar
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const resendVerification = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/resend-verification`, {
        email: email
      });
      setCountdown(30); // Reiniciar countdown
      alert('✅ Email de verificación reenviado');
    } catch (error) {
      alert('❌ Error al reenviar el email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Verifica tu Email</h2>
        <p className="text-center mb-4">
          Hemos enviado un email de verificación a: <strong>{email}</strong>
        </p>
        <p className="text-center text-gray-600 mb-6">
          Por favor revisa tu bandeja de entrada y haz clic en el link para activar tu cuenta.
        </p>
        
        <div className="text-center">
          <button
            onClick={resendVerification}
            disabled={countdown > 0}
            className={`px-4 py-2 rounded ${
              countdown > 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {countdown > 0 ? `Reenviar en ${countdown}s` : 'Reenviar email'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:text-blue-700"
          >
            ¿Ya verificaste? Ir al Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPending;