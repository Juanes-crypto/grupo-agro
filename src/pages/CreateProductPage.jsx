// frontend/src/pages/CreateProductPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function CreateProductPage() {
    const { token, isAuthenticated, isPremium } = useContext(AuthContext);
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: '',        // ⭐ REVERTIDO: Vuelve a 'name'
        description: '',
        price: '',
        unit: 'kg',      // Para almacenar la unidad seleccionada
        stock: '',       // ⭐ REVERTIDO: Vuelve a 'stock' para el input numérico
        category: '',
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const categories = [
        'Frutas', 'Verduras', 'Granos', 'Lácteos', 'Carnes',
        'Cereales', 'Legumbres', 'Pescados', 'Huevos', 'Miel',
        'Plantas', 'Semillas', 'Fitosanitarios', 'Fertilizantes', 'Maquinaria', 'Otros'
    ];
    const units = ['kg', 'litro', 'unidad', 'docena', 'bulto', 'gr'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prevData => ({
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
            setError('Debes iniciar sesión para publicar un producto.');
            setLoading(false);
            return;
        }

        if (!isPremium) {
            setError('Solo usuarios premium pueden publicar productos.');
            setLoading(false);
            return;
        }

        // Validación adicional en el frontend por si acaso
        if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.stock || !image) {
            setError('Por favor, completa todos los campos (nombre, descripción, precio, categoría, cantidad, imagen).');
            setLoading(false);
            return;
        }

        // Crear FormData para enviar datos mixtos (texto + archivo)
        const formData = new FormData();
        // Asegúrate de que los nombres de los campos aquí coincidan con los del backend
        formData.append('name', productData.name); // ⭐ REVERTIDO
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        // ⭐ IMPORTANTE: Combinar stock y unit en un solo campo 'quantity' para el backend
        formData.append('quantity', `${productData.stock} ${productData.unit}`); // ⭐ CAMBIO CRÍTICO
        formData.append('category', productData.category);

        if (image) {
            formData.append('image', image);
        } else {
            setError('Por favor, selecciona una imagen para el producto.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al publicar el producto.');
            }

            setSuccess('Producto publicado con éxito!');
            setProductData({
                name: '', description: '', price: '', unit: 'kg', stock: '', category: '' // ⭐ REVERTIDO
            });
            setImage(null);
            setPreviewUrl('');
            console.log('Producto creado:', data);
            navigate('/my-products');

        } catch (err) {
            setError(err.message || 'No se pudo publicar el producto. Inténtalo de nuevo.');
            console.error("Error creating product:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Publicar Nuevo Producto</h2>

            {!isAuthenticated ? (
                <p className="text-red-600 text-center mb-4">Debes iniciar sesión para publicar productos.</p>
            ) : !isPremium ? (
                <p className="text-red-600 text-center mb-4">Solo los usuarios premium pueden publicar productos. ¡Considera mejorar tu cuenta!</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label> {/* ⭐ REVERTIDO */}
                        <input type="text" id="name" name="name" // ⭐ REVERTIDO
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={productData.name} onChange={handleChange} required /> {/* ⭐ REVERTIDO */}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea id="description" name="description" rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={productData.description} onChange={handleChange} required></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio (COP)</label>
                            <input type="number" id="price" name="price"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={productData.price} onChange={handleChange} required min="0" />
                        </div>
                        <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unidad</label>
                            <select id="unit" name="unit"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={productData.unit} onChange={handleChange} required>
                                {units.map(unit => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Cantidad en Stock</label> {/* ⭐ REVERTIDO */}
                            <input type="number" id="stock" name="stock" // ⭐ REVERTIDO
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={productData.stock} onChange={handleChange} required min="0" /> {/* ⭐ REVERTIDO */}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select id="category" name="category"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={productData.category} onChange={handleChange} required>
                            <option value="">Selecciona una categoría</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
                        <input type="file" id="image" name="image" accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            onChange={handleImageChange} required />
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
                        {loading ? 'Publicando...' : 'Publicar Producto'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default CreateProductPage;