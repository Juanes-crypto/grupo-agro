// frontend/src/pages/PaymentSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function PaymentSuccessPage() {
    const location = useLocation();
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        // Extraer el session_id de la URL si existe
        const params = new URLSearchParams(location.search);
        const id = params.get('session_id');
        if (id) {
            setSessionId(id);
            // ⭐ FUTURO: Aquí podrías hacer una llamada a tu backend
            // para confirmar la transacción, actualizar el stock, enviar emails, etc.
            // fetch('/api/payments/confirm-order', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ sessionId: id })
            // });
        }
    }, [location]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                <svg className="mx-auto h-24 w-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h1 className="text-3xl font-bold text-green-700 mt-4 mb-2">¡Pago Exitoso!</h1>
                <p className="text-gray-700 text-lg mb-4">Tu compra ha sido procesada correctamente.</p>
                {sessionId && (
                    <p className="text-gray-500 text-sm mb-4">ID de Transacción (Stripe): {sessionId}</p>
                )}
                <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                    Volver a la Tienda
                </Link>
            </div>
        </div>
    );
}

export default PaymentSuccessPage;
