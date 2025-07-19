import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

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

    const categories = [
        'Tractores', 'Sembradoras', 'Cosechadoras', 'Drones Agrícolas',
        'Implementos de Labranza', 'Equipo de Riego', 'Vehículos de Carga', 'Otros Equipos'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRentalData(prevData => ({
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
            setError('Debes iniciar sesión para ofrecer una renta.');
            setLoading(false);
            return;
        }

        // Validación de campos obligatorios
        if (!rentalData.name || !rentalData.description || !rentalData.pricePerDay || !rentalData.category) {
            setError('Por favor, completa todos los campos obligatorios: nombre, descripción, precio por día y categoría.');
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
            const response = await api.post('http://localhost:5000/api/rentals', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            const data = response.data; // ⭐ CORREGIDO: Usar .data con Axios ⭐

            setSuccess('Renta publicada con éxito!');
            setRentalData({
                name: '', description: '', pricePerDay: '', category: ''
            });
            setImage(null);
            setPreviewUrl('');
            console.log('Renta creada:', data);
            navigate('/rentals'); // Redirige a la lista de rentas

        } catch (err) {
            console.error("Error creating rental:", err);
            setError(err.response?.data?.message || 'No se pudo publicar la renta. Inténtalo de nuevo.');
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
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Ofrecer Nuevo Equipo en Renta</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Equipo</label>
                    <input type="text" id="name" name="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={rentalData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea id="description" name="description" rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={rentalData.description} onChange={handleChange} required></textarea>
                </div>
                <div>
                    <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">Precio por Día (COP)</label>
                    <input type="number" id="pricePerDay" name="pricePerDay"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={rentalData.pricePerDay} onChange={handleChange} required min="0" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                    <select id="category" name="category"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={rentalData.category} onChange={handleChange} required>
                        <option value="">Selecciona una categoría</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen del Equipo (Opcional)</label>
                    <input type="file" id="image" name="image" accept="image/*"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
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
                    {loading ? 'Publicando...' : 'Publicar Renta'}
                </button>
            </form>
        </div>
    );
}

export default CreateRentalPage;
