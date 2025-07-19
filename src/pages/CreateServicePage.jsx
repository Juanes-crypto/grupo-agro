// frontend/src/pages/CreateServicePage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function CreateServicePage() {
    const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [experience, setExperience] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const serviceCategories = [
        'Asesoría Agrícola', 'Cosecha y Siembra', 'Control de Plagas', 
        'Análisis de Suelos', 'Poda y Mantenimiento', 'Riego', 
        'Diseño de Paisajes', 'Transporte de Productos', 'Otros'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (!name || !description || !experience || price === undefined || price === '' || !category) {
            setError('Por favor, ingresa todos los campos obligatorios: nombre, descripción, experiencia, precio y categoría.');
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
            const data = res.data; // ⭐ CORREGIDO: Usar .data con Axios ⭐

            setMessage('Servicio creado exitosamente!');
            setName('');
            setDescription('');
            setExperience('');
            setPrice('');
            setCategory('');
            setImage(null);
            console.log('Servicio creado:', data);
            navigate('/services'); // ⭐ CORREGIDO: Redirigir a /services para evitar la advertencia de ruta ⭐
        } catch (err) {
            console.error('Error al crear el servicio:', err);
            const errorMessage = err.response?.data?.message || 'Error desconocido al crear el servicio.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-600">
                Cargando...
            </div>
        );
    }

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl my-10 font-inter">
            <h2 className="text-4xl font-extrabold text-green-800 text-center mb-8">
                Ofrece un Nuevo Servicio 🌱
            </h2>
            <p className="text-center text-gray-600 mb-6">
                Comparte tus conocimientos y habilidades con la comunidad.
            </p>

            {message && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{message}</p>}
            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Servicio</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción Detallada</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experiencia / Calificaciones (Ej: "5 años en apicultura", "Ingeniero Agrónomo")</label>
                    <input
                        type="text"
                        id="experience"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio (COP por hora/servicio, si aplica)</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                        min="0"
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría del Servicio</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-border-green-500"
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {serviceCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen del Servicio (Opcional)</label>
                    <input
                        type="file"
                        id="image"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white ${
                        loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    }`}
                >
                    {loading ? 'Creando Servicio...' : 'Crear Servicio'}
                </button>
            </form>
        </div>
    );
}

export default CreateServicePage;
