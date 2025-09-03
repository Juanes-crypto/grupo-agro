import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
    CubeTransparentIcon, DocumentTextIcon,
    CurrencyDollarIcon, TagIcon, PhotoIcon,
    ArrowPathIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';

function EditRentalPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, isAuthenticated } = useContext(AuthContext);
    
    const [rentalData, setRentalData] = useState({
        name: '',
        description: '',
        pricePerDay: '',
        category: '',
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const categories = [
        'Maquinaria Agrícola', 'Implementos de Labranza', 'Equipo de Riego',
        'Drones Agrícolas', 'Vehículos de Carga', 'Espacios/Terrenos',
        'Herramientas Manuales', 'Otros Equipos'
    ];

    useEffect(() => {
        const fetchRental = async () => {
            try {
                const response = await api.get(`/api/rentals/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                setRentalData({
                    name: data.name,
                    description: data.description,
                    pricePerDay: data.pricePerDay,
                    category: data.category
                });
                if (data.imageUrl) setPreviewUrl(data.imageUrl);
            } catch (err) {
                setError('No se pudo cargar la renta');
                console.error("Error fetching rental:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchRental();
        } else {
            navigate('/login');
        }
    }, [id, token, isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRentalData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        // Validación de campos
        if (!rentalData.name || !rentalData.description || !rentalData.pricePerDay || !rentalData.category) {
            setError('Por favor completa todos los campos obligatorios');
            setSubmitting(false);
            return;
        }

        const formData = new FormData();
        for (const key in rentalData) {
            formData.append(key, rentalData[key]);
        }
        if (image) formData.append('image', image);

        try {
            await api.put(`/api/rentals/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            setSuccess('¡Tu renta ha sido actualizada con éxito! 🎉');
            setTimeout(() => navigate('/my-rentals'), 1500);
        } catch (err) {
            console.error("Error updating rental:", err);
            setError(err.response?.data?.message || 'Error al actualizar la renta');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded-3xl shadow-2xl my-10 border border-blue-100">
                <h2 className="text-4xl font-extrabold text-blue-800 text-center mb-6">
                    Editar tu Oferta de Renta 🚜
                </h2>
                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Actualiza los detalles de tu equipo o espacio para renta.
                </p>

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                        <strong className="font-bold">¡Éxito!</strong>
                        <span className="block sm:inline ml-2">{success}</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                        <strong className="font-bold">¡Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Nombre del Equipo o Espacio */}
                    <div>
                        <label htmlFor="name" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <CubeTransparentIcon className="h-6 w-6 text-blue-500 mr-2" /> Nombre del Equipo o Espacio <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={rentalData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: Tractor John Deere 5075E"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="description" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <DocumentTextIcon className="h-6 w-6 text-blue-500 mr-2" /> Descripción Detallada <span className="text-red-500 ml-1">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="5"
                            value={rentalData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Describe las características y estado del equipo..."
                            required
                        ></textarea>
                    </div>

                    {/* Precio por Día */}
                    <div>
                        <label htmlFor="pricePerDay" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <CurrencyDollarIcon className="h-6 w-6 text-blue-500 mr-2" /> Precio por Día (COP) <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="number"
                            id="pricePerDay"
                            name="pricePerDay"
                            value={rentalData.pricePerDay}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: 150000"
                            required
                            min="0"
                        />
                    </div>

                    {/* Categoría */}
                    <div>
                        <label htmlFor="category" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <TagIcon className="h-6 w-6 text-blue-500 mr-2" /> Categoría <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="category"
                                name="category"
                                value={rentalData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Imagen */}
                    <div>
                        <label htmlFor="image" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <PhotoIcon className="h-6 w-6 text-blue-500 mr-2" /> Imagen del Equipo/Espacio
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {previewUrl && (
                            <div className="mt-4 border-2 border-dashed border-blue-300 rounded-lg p-4 flex justify-center">
                                <img src={previewUrl} alt="Vista previa" className="max-w-full h-auto max-h-60 rounded-md shadow-md" />
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/my-rentals')}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex-1 flex items-center justify-center py-3 px-6 rounded-lg shadow-lg text-white font-bold transition duration-300 ${
                                submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {submitting ? (
                                <>
                                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon className="h-6 w-6 mr-2" />
                                    Actualizar Renta
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditRentalPage;