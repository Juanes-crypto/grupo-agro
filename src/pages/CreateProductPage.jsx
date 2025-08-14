// frontend/src/pages/CreateProductPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
// Importamos los íconos de Heroicons para un toque visual
import {
    PlusCircleIcon,        // Para el botón de enviar
    PhotoIcon,             // Para el campo de imagen
    TagIcon,               // Para categoría
    CurrencyDollarIcon,    // Para precio
    ShoppingBagIcon,       // Para el título principal y nombre del producto
    CubeIcon,              // Para stock y unidad
    DocumentTextIcon,      // Para descripción
    ArrowsRightLeftIcon    // Para el campo de truequeable
} from '@heroicons/react/24/outline'; // Usamos outline para un estilo más ligero

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
        'Verduras', 'Granos', 'Lácteos', 'Carnes',
        'Cereales', 'Pescados', 'Producto Animal',
        'Plantas', 'Semillas', 'Fertilizantes', 'Otros..'
    ];
    const units = ['kg', 'litro', 'unidad', 'docena', 'bulto', 'gr', 'saco', 'quintal']; // Añadí más unidades comunes

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
            setError('¡Atención! Debes iniciar sesión para publicar un producto.');
            setLoading(false);
            return;
        }

        // ⭐ VALIDACIÓN ACTUALIZADA: Asegurarse que stock, unit y category no estén vacíos, e imagen ⭐
        if (!productData.name || !productData.description || productData.price === '' || 
            !productData.category || productData.stock === '' || !productData.unit || !image) {
            setError('¡Cuidado! Por favor, completa todos los campos obligatorios (nombre, descripción, precio, categoría, cantidad en stock, unidad de medida e imagen).');
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
        } else { // Esto ya está validado arriba, pero por si acaso.
            setError('Por favor, selecciona una imagen para el producto.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/products', formData, { // Usar la URL base de `api`
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            const data = response.data;

            setSuccess('¡Producto publicado con éxito en tu tienda! 🛒');
            // Limpiar formulario
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
            const errorMessage = err.response?.data?.message || 'Hubo un problema al publicar tu producto. Intenta de nuevo más tarde.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 text-gray-700 text-2xl animate-pulse">
                Cargando tu sesión...
            </div>
        );
    }

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded-3xl shadow-2xl my-10 border border-yellow-100 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out">
                <h2 className="text-5xl font-extrabold text-orange-700 text-center mb-6 drop-shadow-lg">
                    ¡Vende y/o Truequea tus Productos! 🍎🥕
                </h2>
                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Comparte la abundancia de tu cosecha. Publica aquí los productos que deseas vender o intercambiar.
                    ¡Conecta con compradores o encuentra oportunidades de trueque!
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
                    {/* Nombre del Producto */}
                    <div>
                        <label htmlFor="name" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <ShoppingBagIcon className="h-6 w-6 text-orange-500 mr-2" /> Nombre del Producto <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Un nombre claro y atractivo para tu producto (ej. "Tomates Chonto Frescos", "Café Orgánico de la Finca").</p>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={productData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-400 text-base transition duration-200"
                            placeholder="Ej: Aguacates Hass maduros"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="description" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <DocumentTextIcon className="h-6 w-6 text-orange-500 mr-2" /> Descripción Detallada <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Describe las características de tu producto, su calidad, origen, etc.</p>
                        <textarea
                            id="description"
                            name="description"
                            rows="5"
                            value={productData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-400 text-base transition duration-200"
                            placeholder="Ej: Cosecha fresca de la semana, cultivados sin pesticidas, ideal para ensaladas."
                            required
                        ></textarea>
                    </div>

                    {/* Precio, Unidad y Stock - En una cuadrícula para mejor visualización */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Precio */}
                        <div>
                            <label htmlFor="price" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                <CurrencyDollarIcon className="h-6 w-6 text-orange-500 mr-2" /> Precio (COP) <span className="text-red-500 ml-1">*</span>
                            </label>
                            <p className="text-sm text-gray-500 mb-2">Costo del producto por la unidad seleccionada.</p>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={productData.price}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-400 text-base transition duration-200"
                                placeholder="Ej: 3000 (por kg)"
                                required
                                min="0"
                                step="any"
                            />
                        </div>
                        {/* Unidad */}
                        <div>
                            <label htmlFor="unit" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                <CubeIcon className="h-6 w-6 text-orange-500 mr-2" /> Unidad de Medida <span className="text-red-500 ml-1">*</span>
                            </label>
                            <p className="text-sm text-gray-500 mb-2">Cómo se mide tu producto (ej. por kilo, por unidad).</p>
                            <div className="relative">
                                <select
                                    id="unit"
                                    name="unit"
                                    value={productData.unit}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 text-base appearance-none pr-10 transition duration-200"
                                    required
                                >
                                    {units.map(unit => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338z"/></svg>
                                </div>
                            </div>
                        </div>
                        {/* Cantidad en Stock */}
                        <div>
                            <label htmlFor="stock" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                <CubeIcon className="h-6 w-6 text-orange-500 mr-2" /> Cantidad en Stock <span className="text-red-500 ml-1">*</span>
                            </label>
                            <p className="text-sm text-gray-500 mb-2">Cuántas unidades o kilos tienes disponibles.</p>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={productData.stock}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-400 text-base transition duration-200"
                                placeholder="Ej: 50 (unidades)"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Categoría */}
                    <div>
                        <label htmlFor="category" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <TagIcon className="h-6 w-6 text-orange-500 mr-2" /> Categoría del Producto <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Clasifica tu producto para que los compradores lo encuentren fácilmente.</p>
                        <div className="relative">
                            <select
                                id="category"
                                name="category"
                                value={productData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 text-base appearance-none pr-10 transition duration-200"
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

                    {/* Imagen del Producto con Vista Previa */}
                    <div>
                        <label htmlFor="image" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <PhotoIcon className="h-6 w-6 text-orange-500 mr-2" /> Imagen del Producto <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-2">¡La primera impresión cuenta! Sube una foto de alta calidad de tu producto.</p>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-base text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition duration-200 cursor-pointer"
                            required
                        />
                        {previewUrl && (
                            <div className="mt-4 border-2 border-dashed border-orange-300 rounded-lg p-4 flex justify-center items-center">
                                <img src={previewUrl} alt="Vista previa del producto" className="max-w-full h-auto max-h-60 rounded-md shadow-md object-cover" />
                            </div>
                        )}
                    </div>

                    {/* ¡NUEVO CAMPO PARA TRUEQUEABLE! */}
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start space-x-3 shadow-sm">
                        <input
                            type="checkbox"
                            id="isTradable"
                            name="isTradable"
                            checked={isTradable}
                            onChange={handleTradableChange}
                            className="h-6 w-6 text-orange-600 focus:ring-orange-500 border-gray-300 rounded-md flex-shrink-0 mt-1 cursor-pointer" // Aumenté tamaño
                        />
                        <div>
                            <label htmlFor="isTradable" className="block text-lg font-semibold text-gray-800 cursor-pointer flex items-center">
                                <ArrowsRightLeftIcon className="h-6 w-6 text-orange-500 mr-2" /> ¿Este producto es truequeable?
                            </label>
                            <p className="text-sm text-gray-600 mt-1">
                                Marca esta casilla si estás dispuesto/a a intercambiar este producto por otros bienes o servicios, en lugar de solo venderlo.
                            </p>
                        </div>
                    </div>

                    {/* Botón de Enviar */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-xl font-bold text-white transition duration-300 transform hover:scale-105 ${
                            loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-orange-500'
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publicando Producto...
                            </>
                        ) : (
                            <>
                                <PlusCircleIcon className="h-6 w-6 mr-3" />
                                Publicar Producto
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateProductPage;