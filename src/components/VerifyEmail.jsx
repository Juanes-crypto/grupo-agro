import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verificando tu email...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          setMessage('Token de verificación no válido');
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`
        );
        
        setMessage('¡Email verificado correctamente! Redirigiendo...');
        setIsSuccess(true);
        
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setMessage('Error en la verificación. El enlace puede haber expirado.');
        setIsSuccess(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Verificación de Email</h2>
        <p className={`text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
        {!isSuccess && (
          <button 
            onClick={() => navigate('/login')}
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Ir al Login
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;