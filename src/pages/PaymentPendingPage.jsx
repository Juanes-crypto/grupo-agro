// frontend/src/pages/PaymentPendingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function PaymentPendingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-gray-800">
            <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full">
                <svg className="mx-auto h-24 w-24 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h1 className="text-4xl font-extrabold text-yellow-700 mt-6 mb-3">Pago Pendiente</h1>
                <p className="text-lg mb-6">Tu pago está siendo procesado. Te notificaremos por correo electrónico una vez que se confirme.</p>
                <p className="text-md text-gray-600 mb-6">Si elegiste un método de pago en efectivo, recuerda completar el pago en el punto autorizado.</p>
                
                <div className="flex justify-center">
                    <Link to="/my-orders" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                        Ver el Estado de Mis Órdenes
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PaymentPendingPage;