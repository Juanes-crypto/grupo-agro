// frontend/src/pages/CreateProductPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function CreateProductPage() {
    const { token, isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        unit: 'kg', // Valor por defecto
        stock: '',  // Valor por defecto
        category: '',
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isTradable, setIsTradable] = useState(false); // <--- NUEVO ESTADO PARA IS_TRUEQUEABLE

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

    // <--- NUEVO HANDLER PARA EL CHECKBOX DE TRUEQUEABLE
    const handleTradableChange = (e) => {
        setIsTradable(e.target.checked);
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

        // ⭐ VALIDACIÓN ACTUALIZADA: Asegurarse que stock y unit no estén vacíos ⭐
        if (!productData.name || !productData.description || !productData.price || 
            !productData.category || !productData.stock || !productData.unit || !image) {
            setError('Por favor, completa todos los campos (nombre, descripción, precio, categoría, stock, unidad, imagen).');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('stock', productData.stock); 
        formData.append('unit', productData.unit); 
        formData.append('category', productData.category);
        formData.append('isPublished', true); // Se mantiene para publicación automática
        formData.append('isTradable', isTradable); // <--- ¡ENVIAR EL ESTADO DE TRUEQUEABLE!

        if (image) {
            formData.append('image', image);
        } else {
            setError('Por favor, selecciona una imagen para el producto.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('http://localhost:5000/api/products', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            const data = response.data;

            setSuccess('Producto publicado con éxito!');
            setProductData({
                name: '', description: '', price: '', unit: 'kg', stock: '', category: ''
            });
            setImage(null);
            setPreviewUrl('');
            setIsTradable(false); // Restablecer el checkbox
            console.log('Producto creado:', data);
            navigate('/products'); 

        } catch (err) {
            console.error("Error creating product:", err);
            setError(err.response?.data?.message || 'No se pudo publicar el producto. Inténtalo de nuevo.');
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
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Publicar Nuevo Producto</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                    <input type="text" id="name" name="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={productData.name} onChange={handleChange} required />
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
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Cantidad en Stock</label>
                        <input type="number" id="stock" name="stock"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={productData.stock} onChange={handleChange} required min="0" />
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

                {/* <--- ¡NUEVO CAMPO PARA TRUEQUEABLE! */}
                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        id="isTradable"
                        name="isTradable"
                        checked={isTradable}
                        onChange={handleTradableChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isTradable" className="ml-2 block text-sm font-medium text-gray-700">
                        ¿Es este producto truequeable?
                    </label>
                </div>

                {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center mt-4">{success}</p>}

                <button type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 disabled:bg-green-400"
                    disabled={loading}>
                    {loading ? 'Publicando...' : 'Publicar Producto'}
                </button>
            </form>
        </div>
    );
}

export default CreateProductPage;