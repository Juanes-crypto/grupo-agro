import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
    PlusCircleIcon,
    PhotoIcon,
    TagIcon,
    CurrencyDollarIcon,
    CubeTransparentIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

function CreateRentalPage() {
    const { token, isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [rentalData, setRentalData] = useState({
        name: '',
        description: '',
        pricePerDay: '',
        category: '',
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Contadores de caracteres
    const [nameCount, setNameCount] = useState(0);
    const [descriptionCount, setDescriptionCount] = useState(0);

    const categories = [
        'Maquinaria Agrícola', 'Implementos de Labranza', 'Equipo de Riego',
        'Drones Agrícolas', 'Vehículos de Carga', 'Espacios/Terrenos',
        'Herramientas Manuales', 'Otros Equipos'
    ];

    // Función para formatear números con separadores de miles
    const formatNumber = (value) => {
        if (!value) return '';
        const numericValue = value.toString().replace(/[^\d]/g, '');
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Función para parsear números formateados
    const parseFormattedNumber = (formattedValue) => {
        return formattedValue.replace(/\./g, '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'name') {
            if (value.length <= 50) {
                setRentalData(prevData => ({
                    ...prevData,
                    [name]: value
                }));
                setNameCount(value.length);
            }
        } else if (name === 'description') {
            if (value.length <= 250) {
                setRentalData(prevData => ({
                    ...prevData,
                    [name]: value
                }));
                setDescriptionCount(value.length);
            }
        } else if (name === 'pricePerDay') {
            const formattedValue = formatNumber(value);
            if (formattedValue.replace(/\./g, '').length <= 10) {
                setRentalData(prevData => ({
                    ...prevData,
                    [name]: parseFormattedNumber(formattedValue)
                }));
            }
        } else {
            setRentalData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setImage(null);
            setPreviewUrl('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!isAuthenticated) {
            setError('¡Atención! Debes iniciar sesión para ofrecer una renta.');
            setLoading(false);
            return;
        }

        // Validación de campos obligatorios
        if (!rentalData.name || !rentalData.description || rentalData.pricePerDay === '' || !rentalData.category) {
            setError('¡Ojo! Por favor, completa todos los campos obligatorios para publicar tu renta.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        for (const key in rentalData) {
            formData.append(key, rentalData[key]);
        }
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await api.post('/api/rentals', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            const data = response.data;

            setSuccess('¡Tu equipo o espacio ha sido publicado para renta con éxito! 🎉');
            // Limpiar formulario
            setRentalData({
                name: '', description: '', pricePerDay: '', category: ''
            });
            setImage(null);
            setPreviewUrl('');
            setNameCount(0);
            setDescriptionCount(0);
            console.log('Renta creada:', data);
            navigate('/rentals');
        } catch (err) {
            console.error("Error creating rental:", err);
            const errorMessage = err.response?.data?.message || 'Hubo un problema al publicar tu renta. Intenta de nuevo más tarde.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-700 text-2xl animate-pulse">
                Cargando tu sesión...
            </div>
        );
    }

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded-3xl shadow-2xl my-10 border border-blue-100 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out">
                <h2 className="text-5xl font-extrabold text-blue-800 text-center mb-6 drop-shadow-lg">
                    ¡Ofrece tu Equipo o Espacio en Renta! 🚜🏠
                </h2>
                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    ¿Tienes maquinaria, herramientas o incluso un terreno que otros puedan necesitar? ¡Publica tu oferta de renta aquí!
                    Ayuda a la comunidad agrícola a encontrar lo que buscan y genera ingresos extras.
                </p>

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <strong className="font-bold">¡Éxito!</strong>
                        <span className="block sm:inline ml-2">{success}</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <strong className="font-bold">¡Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Nombre del Equipo o Espacio */}
                    <div>
                        <label htmlFor="name" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <CubeTransparentIcon className="h-6 w-6 text-blue-500 mr-2" /> 
                            Nombre del Equipo o Espacio <span className="text-red-500 ml-1">*</span>
                            <span className="ml-auto text-sm font-medium text-gray-500">
                                {nameCount}/50
                            </span>
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Un nombre claro y descriptivo para lo que ofreces (ej. "Tractor John Deere 5075E", "Finca para Eventos 'El Edén'").</p>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={rentalData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 text-base transition duration-200"
                            placeholder="Ej: Sembradora de maíz de 4 surcos"
                            required
                            maxLength={50}
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="description" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <DocumentTextIcon className="h-6 w-6 text-blue-500 mr-2" /> 
                            Descripción Detallada <span className="text-red-500 ml-1">*</span>
                            <span className="ml-auto text-sm font-medium text-gray-500">
                                {descriptionCount}/250
                            </span>
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Describe las características, estado, capacidades y si es un espacio, sus comodidades.</p>
                        <textarea
                            id="description"
                            name="description"
                            rows="5"
                            value={rentalData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 text-base transition duration-200"
                            placeholder="Ej: Tractor en excelente estado, ideal para arado y siembra, incluye operador. O: Finca con piscina, kiosco, zona de asados, ideal para eventos campestres."
                            required
                            maxLength={250}
                        ></textarea>
                    </div>

                    {/* Precio por Día */}
                    <div>
                        <label htmlFor="pricePerDay" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <CurrencyDollarIcon className="h-6 w-6 text-blue-500 mr-2" /> 
                            Precio por Día (COP) <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Indica el costo de la renta por cada día.</p>
                        <input
                            type="text"
                            id="pricePerDay"
                            name="pricePerDay"
                            value={formatNumber(rentalData.pricePerDay)}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 text-base transition duration-200"
                            placeholder="Ej: 150.000 (se mostrará como COP 150.000/día)"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Máximo 10 dígitos
                        </p>
                    </div>

                    {/* Categoría */}
                    <div>
                        <label htmlFor="category" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <TagIcon className="h-6 w-6 text-blue-500 mr-2" /> Categoría <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Clasifica lo que ofreces para que sea más fácil de encontrar.</p>
                        <div className="relative">
                            <select
                                id="category"
                                name="category"
                                value={rentalData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 placeholder-gray-400 text-base appearance-none pr-10 transition duration-200"
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338z"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Imagen del Equipo/Espacio con Vista Previa */}
                    <div>
                        <label htmlFor="image" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <PhotoIcon className="h-6 w-6 text-blue-500 mr-2" /> Imagen del Equipo o Espacio
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Una buena imagen atrae más interesados. Sube una foto clara de lo que ofreces.</p>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-base text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200 cursor-pointer"
                        />
                        {previewUrl && (
                            <div className="mt-4 border-2 border-dashed border-blue-300 rounded-lg p-4 flex justify-center items-center">
                                <img src={previewUrl} alt="Vista previa del equipo o espacio" className="max-w-full h-auto max-h-60 rounded-md shadow-md object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Botón de Enviar */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-xl font-bold text-white transition duration-300 transform hover:scale-105 ${
                            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publicando Renta...
                            </>
                        ) : (
                            <>
                                <PlusCircleIcon className="h-6 w-6 mr-3" />
                                Publicar Renta
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateRentalPage;