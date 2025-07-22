import React from 'react';

function Spinner() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500"></div>
            <p className="ml-4 text-xl text-gray-600">Cargando propuestas...</p>
        </div>
    );
}

export default Spinner;