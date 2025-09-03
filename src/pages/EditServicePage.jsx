import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
    SparklesIcon, BookOpenIcon,
    LightBulbIcon, CurrencyDollarIcon,
    TagIcon, PhotoIcon,
    ArrowPathIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';

function EditServicePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, isAuthenticated } = useContext(AuthContext);
    
    const [serviceData, setServiceData] = useState({
        name: '',
        description: '',
        experience: '',
        price: '',
        category: '',
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const categories = [
        'Análisis de Suelos', 'Asesoría Agrícola', 'Cosecha y Siembra',
        'Control de Plagas', 'Cursos y Capacitación', 'Diseño de Paisajes',
        'Mantenimiento de Maquinaria', 'Poda y Mantenimiento', 'Riego y Drenaje',
        'Transporte de Productos', 'Otros'
    ];

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await api.get(`/api/services/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                setServiceData({
                    name: data.name,
                    description: data.description,
                    experience: data.experience,
                    price: data.price,
                    category: data.category
                });
                if (data.imageUrl) setPreviewUrl(data.imageUrl);
            } catch (err) {
                setError('No se pudo cargar el servicio');
                console.error("Error fetching service:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchService();
        } else {
            navigate('/login');
        }
    }, [id, token, isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData(prev => ({ ...prev, [name]: value }));
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
        if (!serviceData.name || !serviceData.description || !serviceData.experience || !serviceData.price || !serviceData.category) {
            setError('Por favor completa todos los campos obligatorios');
            setSubmitting(false);
            return;
        }

        const formData = new FormData();
        for (const key in serviceData) {
            formData.append(key, serviceData[key]);
        }
        if (image) formData.append('image', image);

        try {
            await api.put(`/api/services/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            setSuccess('¡Tu servicio ha sido actualizado con éxito! 🎉');
            setTimeout(() => navigate('/my-services'), 1500);
        } catch (err) {
            console.error("Error updating service:", err);
            setError(err.response?.data?.message || 'Error al actualizar el servicio');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded-3xl shadow-2xl my-10 border border-green-100">
                <h2 className="text-4xl font-extrabold text-green-800 text-center mb-6">
                    Editar tu Servicio Agrícola 🌿
                </h2>
                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Actualiza los detalles del servicio que ofreces.
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
                    {/* Nombre del Servicio */}
                    <div>
                        <label htmlFor="name" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <SparklesIcon className="h-6 w-6 text-green-500 mr-2" /> Nombre del Servicio <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={serviceData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="Ej: Asesoría en Cultivos Orgánicos"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="description" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <BookOpenIcon className="h-6 w-6 text-green-500 mr-2" /> Descripción Detallada <span className="text-red-500 ml-1">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="5"
                            value={serviceData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="Describe en qué consiste tu servicio..."
                            required
                        ></textarea>
                    </div>

                    {/* Experiencia */}
                    <div>
                        <label htmlFor="experience" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <LightBulbIcon className="h-6 w-6 text-green-500 mr-2" /> Tu Experiencia <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            id="experience"
                            name="experience"
                            value={serviceData.experience}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="Ej: 5 años de experiencia en control de plagas"
                            required
                        />
                    </div>

                    {/* Precio */}
                    <div>
                        <label htmlFor="price" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <CurrencyDollarIcon className="h-6 w-6 text-green-500 mr-2" /> Precio (COP) <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={serviceData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="Ej: 50000"
                            required
                            min="0"
                        />
                    </div>

                    {/* Categoría */}
                    <div>
                        <label htmlFor="category" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <TagIcon className="h-6 w-6 text-green-500 mr-2" /> Categoría <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="category"
                                name="category"
                                value={serviceData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white appearance-none pr-10"
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
                            <PhotoIcon className="h-6 w-6 text-green-500 mr-2" /> Imagen del Servicio
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        {previewUrl && (
                            <div className="mt-4 border-2 border-dashed border-green-300 rounded-lg p-4 flex justify-center">
                                <img src={previewUrl} alt="Vista previa" className="max-w-full h-auto max-h-60 rounded-md shadow-md" />
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/my-services')}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex-1 flex items-center justify-center py-3 px-6 rounded-lg shadow-lg text-white font-bold transition duration-300 ${
                                submitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
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
                                    Actualizar Servicio
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditServicePage;