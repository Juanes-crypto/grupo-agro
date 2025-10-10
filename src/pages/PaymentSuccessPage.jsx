// frontend/src/pages/PaymentSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function PaymentSuccessPage() {
    const location = useLocation();
    const [orderId, setOrderId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);

    useEffect(() => {
        // Mercado Pago nos devuelve 'external_reference' que es nuestro 'orderId'
        const params = new URLSearchParams(location.search);
        const id = params.get('external_reference');
        const status = params.get('collection_status'); // 'approved'
        
        setOrderId(id);
        setPaymentStatus(status);

        // NOTA: La confirmación real del pago ya la hizo tu backend a través del webhook.
        // Esta página es solo para darle una buena experiencia al usuario.
    }, [location]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-gray-800">
            <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full">
                <svg className="mx-auto h-24 w-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h1 className="text-4xl font-extrabold text-green-700 mt-6 mb-3">¡Pago Exitoso!</h1>
                <p className="text-lg mb-6">Gracias por tu compra. Hemos recibido tu pago y tu orden está siendo procesada.</p>
                
                {orderId && (
                    <div className="bg-green-100 p-3 rounded-lg mb-6">
                        <p className="text-md text-green-800">
                            ID de tu Orden: <span className="font-semibold">{orderId}</span>
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/my-orders" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                        Ver Mis Órdenes
                    </Link>
                    <Link to="/products" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                        Seguir Comprando
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccessPage;