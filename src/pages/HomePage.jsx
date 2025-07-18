import React from 'react';

function HomePage() {
    return (
        <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-green-800 mb-4">¡Bienvenido a AgroApp!</h1>
            <p className="text-xl text-gray-700">Tu plataforma para conectar productores y consumidores agrícolas.</p>
            <div className="mt-8">
                <img 
                    src="https://placehold.co/800x400/ADDE9E/333333?text=AgroApp+Home" 
                    alt="Campo agrícola" 
                    className="mx-auto rounded-lg shadow-lg"
                />
            </div>
            <p className="mt-6 text-lg text-gray-600">
                Explora productos frescos, servicios agrícolas y oportunidades de trueque.
            </p>
        </div>
    );
}

export default HomePage;
