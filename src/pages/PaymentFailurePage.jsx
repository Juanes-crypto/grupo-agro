// frontend/src/pages/PaymentFailurePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function PaymentFailurePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-gray-800">
            <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full">
                <svg className="mx-auto h-24 w-24 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h1 className="text-4xl font-extrabold text-red-700 mt-6 mb-3">Pago Rechazado</h1>
                <p className="text-lg mb-6">Hubo un problema al procesar tu pago. No se ha realizado ningún cargo.</p>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/cart" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                        Intentar de Nuevo
                    </Link>
                    <Link to="/products" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                        Volver a la Tienda
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PaymentFailurePage;