// frontend/src/pages/PaymentCancelPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function PaymentCancelPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                <svg className="mx-auto h-24 w-24 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h1 className="text-3xl font-bold text-red-700 mt-4 mb-2">Pago Cancelado</h1>
                <p className="text-gray-700 text-lg mb-4">Tu compra no se pudo completar o fue cancelada.</p>
                <p className="text-gray-600 text-md mb-6">Si fue un error, por favor inténtalo de nuevo.</p>
                <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 mr-4">
                    Volver a la Tienda
                </Link>
                <Link to="/cart" className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                    Ir al Carrito
                </Link>
            </div>
        </div>
    );
}

export default PaymentCancelPage;
