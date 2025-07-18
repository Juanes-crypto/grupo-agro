// frontend/src/pages/CreateServicePage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Para obtener el token

function CreateServicePage() {
    const { token, isAuthenticated, isPremium } = useContext(AuthContext);
    const navigate = useNavigate();

    const [serviceData, setServiceData] = useState({
        name: '',
        description: '',
        // ⭐ AÑADIDO: Campo experience ⭐
        experience: '', 
        price: '',
        category: '',
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const categories = [
        'Asesoría Agrícola', 'Mantenimiento de Maquinaria', 'Servicios de Fumigación',
        'Análisis de Suelo', 'Preparación de Terreno', 'Cosecha Asistida',
        'Transporte de Carga Agrícola', 'Poda y Tala', 'Gestión de Cultivos', 'Otros'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData(prevData => ({
            ...prevData,
            [name]: value
        }));
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
            setError('Debes iniciar sesión para ofrecer un servicio.');
            setLoading(false);
            return;
        }

        if (!isPremium) {
            setError('Solo usuarios premium pueden ofrecer servicios.');
            setLoading(false);
            return;
        }

        // ⭐ NUEVA VALIDACIÓN EN EL FRONTEND ⭐
        const { name, description, experience, price, category } = serviceData;
        if (!name || !description || !experience || price === '' || !category) {
            setError('Por favor, ingresa todos los campos obligatorios: Nombre, Descripción, Experiencia, Precio y Categoría.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        for (const key in serviceData) {
            formData.append(key, serviceData[key]);
        }
        if (image) {
            formData.append('image', image); // 'image' es el nombre del campo que Multer espera
        }

        try {
            const response = await fetch('http://localhost:5000/api/services', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                // El backend devuelve un mensaje de error si los campos están incompletos
                throw new Error(data.message || 'Error al publicar el servicio.');
            }

            setSuccess('Servicio publicado con éxito!');
            setServiceData({
                name: '', description: '', experience: '', price: '', category: '' // ⭐ Limpiar experience también ⭐
            });
            setImage(null);
            setPreviewUrl('');
            console.log('Servicio creado:', data);
            navigate('/services');

        } catch (err) {
            setError(err.message || 'No se pudo publicar el servicio. Inténtalo de nuevo.');
            console.error("Error creating service:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Ofrecer Nuevo Servicio</h2>

            {!isAuthenticated ? (
                <p className="text-red-600 text-center mb-4">Debes iniciar sesión para ofrecer servicios.</p>
            ) : !isPremium ? (
                <p className="text-red-600 text-center mb-4">Solo los usuarios premium pueden ofrecer servicios. ¡Considera mejorar tu cuenta!</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Campos del formulario */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Servicio</label>
                        <input type="text" id="name" name="name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={serviceData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea id="description" name="description" rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={serviceData.description} onChange={handleChange} required></textarea>
                    </div>
                    {/* ⭐ AÑADIDO: Campo de entrada para experience ⭐ */}
                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experiencia / Calificaciones</label>
                        <input type="text" id="experience" name="experience"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={serviceData.experience} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio (COP)</label>
                        <input type="number" id="price" name="price"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={serviceData.price} onChange={handleChange} required min="0" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select id="category" name="category"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={serviceData.category} onChange={handleChange} required>
                            <option value="">Selecciona una categoría</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen del Servicio (Opcional)</label>
                        <input type="file" id="image" name="image" accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={handleImageChange} />
                        {previewUrl && (
                            <div className="mt-4 w-48 h-auto">
                                <img src={previewUrl} alt="Vista previa" className="rounded-md object-cover max-w-full h-auto" />
                            </div>
                        )}
                    </div>

                    {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
                    {success && <p className="text-green-600 text-sm text-center mt-4">{success}</p>}

                    <button type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 disabled:bg-green-400"
                        disabled={loading}>
                        {loading ? 'Publicando...' : 'Publicar Servicio'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default CreateServicePage;
