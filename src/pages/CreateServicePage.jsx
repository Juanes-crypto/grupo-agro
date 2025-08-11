// frontend/src/pages/CreateServicePage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
// Importamos los íconos de Heroicons para un toque visual
import {
    PlusCircleIcon, // Para el botón de enviar
    PhotoIcon,      // Para el campo de imagen
    TagIcon,        // Para categoría
    CurrencyDollarIcon, // Para precio
    LightBulbIcon,   // Para experiencia
    BookOpenIcon,    // Para descripción
    SparklesIcon     // Para el nombre del servicio
} from '@heroicons/react/24/outline'; // Usamos outline para un estilo más ligero

function CreateServicePage() {
    const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [experience, setExperience] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(''); // Estado para la URL de la vista previa
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const serviceCategories = [
        'Análisis de Suelos', 'Asesoría Agrícola', 'Cosecha y Siembra',
        'Control de Plagas', 'Cursos y Capacitación', 'Diseño de Paisajes',
        'Mantenimiento de Maquinaria', 'Poda y Mantenimiento', 'Riego y Drenaje',
        'Transporte de Productos', 'Otros'
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Crea una URL para la vista previa
        } else {
            setImage(null);
            setImagePreview('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (!name || !description || !experience || price === undefined || price === '' || !category) {
            setError('¡Ojo! Por favor, completa todos los campos obligatorios para tu servicio.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('experience', experience);
        formData.append('price', price);
        formData.append('category', category);

        if (image) {
            formData.append('image', image);
        }

        try {
            const res = await api.post('/services', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const data = res.data;

            setMessage('¡Servicio publicado con éxito! 🎉');
            // Limpiar formulario
            setName('');
            setDescription('');
            setExperience('');
            setPrice('');
            setCategory('');
            setImage(null);
            setImagePreview(''); // Limpiar la vista previa
            console.log('Servicio creado:', data);
            navigate('/services');
        } catch (err) {
            console.error('Error al crear el servicio:', err);
            const errorMessage = err.response?.data?.message || 'Hubo un problema al publicar tu servicio. Intenta de nuevo más tarde.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-700 text-2xl animate-pulse">
                Cargando tu sesión...
            </div>
        );
    }

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded-3xl shadow-2xl my-10 border border-green-100 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out">
                <h2 className="text-5xl font-extrabold text-green-800 text-center mb-6 drop-shadow-lg">
                    ¡Ofrece tu Servicio Agrícola! 🌿
                </h2>
                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Ayúdanos a conocer tu talento. Cuéntanos sobre el servicio que ofreces, tu experiencia y el valor.
                    ¡Conecta con otros campesinos y empresas que necesitan tus habilidades!
                </p>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <strong className="font-bold">¡Hecho!</strong>
                        <span className="block sm:inline ml-2">{message}</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
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
                        <p className="text-sm text-gray-500 mb-2">Un título claro y atractivo para lo que ofreces (ej. "Análisis de Suelos con Drones").</p>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700 placeholder-gray-400 text-base transition duration-200"
                            placeholder="Ej: Asesoría en Cultivos Orgánicos"
                            required
                        />
                    </div>

                    {/* Descripción Detallada */}
                    <div>
                        <label htmlFor="description" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <BookOpenIcon className="h-6 w-6 text-green-500 mr-2" /> Descripción Detallada <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Explica en qué consiste tu servicio, cómo lo realizas y qué beneficios ofrece.</p>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="5"
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700 placeholder-gray-400 text-base transition duration-200"
                            placeholder="Detalla aquí los aspectos clave de tu servicio..."
                            required
                        ></textarea>
                    </div>

                    {/* Experiencia / Calificaciones */}
                    <div>
                        <label htmlFor="experience" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <LightBulbIcon className="h-6 w-6 text-green-500 mr-2" /> Tu Experiencia / Calificaciones <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Cuéntanos sobre tu trayectoria o formación (ej. "5 años podando frutales", "Ingeniero Agrónomo titulado").</p>
                        <input
                            type="text"
                            id="experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700 placeholder-gray-400 text-base transition duration-200"
                            placeholder="Ej: Técnico agrícola con 10 años de experiencia en riego"
                            required
                        />
                    </div>

                    {/* Precio */}
                    <div>
                        <label htmlFor="price" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <CurrencyDollarIcon className="h-6 w-6 text-green-500 mr-2" /> Precio (COP) <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Establece el costo de tu servicio por hora, por proyecto, o si es un precio fijo. Solo números.</p>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700 placeholder-gray-400 text-base transition duration-200"
                            placeholder="Ej: 50000 (solo el número, se mostrará como COP 50.000)"
                            required
                            min="0"
                            step="any" // Permite decimales si necesitas para precios más exactos
                        />
                    </div>

                    {/* Categoría del Servicio */}
                    <div>
                        <label htmlFor="category" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <TagIcon className="h-6 w-6 text-green-500 mr-2" /> Categoría del Servicio <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Clasifica tu servicio para que los interesados lo encuentren fácilmente.</p>
                        <div className="relative">
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white text-gray-700 placeholder-gray-400 text-base appearance-none pr-10 transition duration-200"
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {serviceCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338z"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Imagen del Servicio con Vista Previa */}
                    <div>
                        <label htmlFor="image" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <PhotoIcon className="h-6 w-6 text-green-500 mr-2" /> Imagen del Servicio
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Una buena imagen ayuda a mostrar tu servicio. Sube una foto clara.</p>
                        <input
                            type="file"
                            id="image"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-base text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition duration-200 cursor-pointer"
                            accept="image/*" // Solo acepta archivos de imagen
                        />
                        {imagePreview && (
                            <div className="mt-4 border-2 border-dashed border-green-300 rounded-lg p-4 flex justify-center items-center">
                                <img src={imagePreview} alt="Vista previa del servicio" className="max-w-full h-auto max-h-60 rounded-md shadow-md object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Botón de Enviar */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-xl font-bold text-white transition duration-300 transform hover:scale-105 ${
                            loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-500'
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publicando Servicio...
                            </>
                        ) : (
                            <>
                                <PlusCircleIcon className="h-6 w-6 mr-3" />
                                Publicar Servicio
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateServicePage;