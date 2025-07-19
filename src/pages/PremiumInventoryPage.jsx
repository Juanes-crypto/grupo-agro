// src/pages/PremiumInventoryPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Asegúrate de que tu instancia de Axios 'api' esté configurada correctamente

function PremiumInventoryPage() {
    const { isAuthenticated, isPremium, loading: authLoading, token } = useContext(AuthContext); // Añadido 'token'
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Formulario para creación/edición de productos
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [isTradable, setIsTradable] = useState(false);
    const [image, setImage] = useState(null);
    const [formMessage, setFormMessage] = useState('');
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    const categories = [
        'Frutas', 'Verduras', 'Granos', 'Lácteos', 'Carnes',
        'Cereales', 'Legumbres', 'Pescados', 'Huevos', 'Miel',
        'Plantas', 'Semillas', 'Fitosanitarios', 'Fertilizantes', 'Maquinaria', 'Otros'
    ];

    // Redirección si no es premium o no está autenticado
    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                navigate('/login');
            } else if (!isPremium) {
                navigate('/premium');
            } else {
                fetchUserProducts();
            }
        }
    }, [isAuthenticated, isPremium, authLoading, navigate, token]); // Añadido 'token' a las dependencias

    // Función para cargar los productos del usuario premium
    const fetchUserProducts = async () => {
        setLoadingProducts(true);
        setError('');
        try {
            // ⭐ NO ES NECESARIO PASAR EL TOKEN AQUÍ SI 'api' TIENE INTERCEPTOR ⭐
            // Pero si el interceptor falla, se puede pasar manualmente:
            // const res = await api.get('/products/my-products', {
            //     headers: { Authorization: `Bearer ${token}` }
            // });
            const res = await api.get('/products/my-products');
            setProducts(res.data);
        } catch (err) {
            console.error('Error al cargar los productos del inventario:', err);
            setError(err.response?.data?.message || 'No se pudieron cargar los productos de tu inventario.');
        } finally {
            setLoadingProducts(false);
        }
    };

    // Abrir modal para crear nuevo producto
    const handleCreateNewProduct = () => {
        setEditingProduct(null);
        setProductName('');
        setDescription('');
        setPrice('');
        setQuantity('');
        setCategory('');
        setIsTradable(false);
        setImage(null);
        setFormMessage('');
        setFormError('');
        setIsModalOpen(true);
    };

    // Abrir modal para editar un producto existente
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setQuantity(product.quantity);
        setCategory(product.category || '');
        setIsTradable(product.isTradable);
        setImage(null);
        setFormMessage('');
        setFormError('');
        setIsModalOpen(true);
    };

    // Eliminar producto
    const handleDeleteProduct = async (productId) => {
        // ⭐ CAMBIO: Usar modal personalizado en lugar de window.confirm ⭐
        const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este producto?'); // Mantengo window.confirm por simplicidad, idealmente un modal
        if (confirmed) {
            try {
                await api.delete(`/products/${productId}`);
                setProducts(products.filter(p => p._id !== productId));
                alert('Producto eliminado exitosamente.'); // Mantengo alert, idealmente un toast/snackbar
            } catch (err) {
                console.error('Error al eliminar el producto:', err);
                alert('Error al eliminar el producto.');
            }
        }
    };

    // ✨ NUEVA FUNCIÓN: Publicar o Despublicar Producto ✨
    const handleTogglePublish = async (product) => {
        const newPublishedStatus = !product.isPublished;
        const confirmAction = newPublishedStatus
            ? `¿Estás seguro de que quieres PUBLICAR "${product.name}"? Una vez publicado, será visible para todos.`
            : `¿Estás seguro de que quieres DESPUBLICAR "${product.name}"? Ya no será visible públicamente.`;

        // ⭐ CAMBIO: Usar modal personalizado en lugar de window.confirm ⭐
        const confirmed = window.confirm(confirmAction); // Mantengo window.confirm por simplicidad
        if (confirmed) {
            try {
                const res = await api.put(`/products/${product._id}`, { isPublished: newPublishedStatus });
                
                setProducts(products.map(p => 
                    p._id === product._id ? { ...p, isPublished: res.data.isPublished } : p
                ));
                alert(`Producto "${product.name}" ${newPublishedStatus ? 'publicado' : 'despublicado'} exitosamente.`); // Mantengo alert
            } catch (err) {
                console.error(`Error al ${newPublishedStatus ? 'publicar' : 'despublicar'} el producto:`, err);
                alert(`Error al ${newPublishedStatus ? 'publicar' : 'despublicar'} el producto.`);
            }
        }
    };

    // Enviar formulario (Crear o Actualizar)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormMessage('');
        setFormError('');

        // Validación básica
        if (!productName || !description || !price || !quantity || !category) {
            setFormError('Por favor, completa todos los campos requeridos (nombre, descripción, precio, cantidad, categoría).');
            setFormLoading(false);
            return;
        }
        if (!editingProduct && !image) {
            setFormError('Por favor, selecciona una imagen para el nuevo producto.');
            setFormLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity); 
        formData.append('category', category);
        formData.append('isTradable', isTradable);

        // ⭐ CAMBIO CLAVE AQUÍ: Para productos creados desde PremiumInventoryPage, isPublished es FALSE ⭐
        if (!editingProduct) { // Solo al crear un nuevo producto
            formData.append('isPublished', false); 
        } else { // Al editar, mantener el estado de publicación actual a menos que se cambie explícitamente
            formData.append('isPublished', editingProduct.isPublished); // Mantener el estado actual
        }

        if (image) {
            formData.append('image', image);
        }

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setFormMessage('Producto actualizado exitosamente.');
            } else {
                await api.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setFormMessage('Producto creado exitosamente y guardado como "Borrador".'); // Mensaje actualizado
            }
            setIsModalOpen(false);
            fetchUserProducts(); // Recargar la lista de productos
        } catch (err) {
            console.error('Error al guardar el producto:', err);
            const msg = err.response?.data?.message || 'Error desconocido al guardar el producto.';
            setFormError(msg);
        } finally {
            setFormLoading(false);
        }
    };

    if (authLoading || loadingProducts) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-600">
                Cargando inventario premium...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 font-medium py-20">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-inter">
            <h2 className="text-4xl font-extrabold text-green-800 text-center mb-8">
                Mi Inventario Premium 📊
            </h2>

            <div className="flex justify-between items-center mb-6">
                <p className="text-lg text-gray-700">Gestiona tus productos premium.</p>
                <button
                    onClick={handleCreateNewProduct}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                    + Nuevo Producto
                </button>
            </div>

            {products.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-600">
                    <p className="text-xl">No tienes productos en tu inventario premium.</p>
                    <p className="mt-2">¡Haz clic en "Nuevo Producto" para añadir el primero!</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Imagen
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Descripción
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio (COP)
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cantidad
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Truequeable
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={product.imageUrl || 'https://placehold.co/50x50?text=No+Img'}
                                            alt={product.name}
                                            className="h-12 w-12 rounded-md object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {product.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.category || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            product.isTradable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {product.isTradable ? 'Sí' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            product.isPublished ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {product.isPublished ? 'Publicado' : 'Borrador'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleTogglePublish(product)}
                                            className={`
                                                ${product.isPublished 
                                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'}
                                                py-2 px-3 rounded-md shadow-sm transition duration-200 text-xs mr-2
                                            `}
                                        >
                                            {product.isPublished ? 'Despublicar' : 'Publicar'}
                                        </button>
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal para Crear/Editar Producto */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                        </h3>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            &times;
                        </button>

                        {formError && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{formError}</p>}
                        {formMessage && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{formMessage}</p>}

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio (COP)</label>
                                <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Cantidad</label>
                                <input
                                    type="text"
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isTradable"
                                    checked={isTradable}
                                    onChange={(e) => setIsTradable(e.target.checked)}
                                    className="h-4 w-4 text-green-600 border-gray-300 rounded"
                                />
                                <label htmlFor="isTradable" className="ml-2 block text-sm text-gray-900">¿Es truequeable?</label>
                            </div>
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    required={!editingProduct} 
                                />
                                {editingProduct && !image && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Dejar vacío para mantener la imagen actual.
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={formLoading}
                                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium ${
                                    formLoading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {formLoading ? 'Guardando...' : (editingProduct ? 'Actualizar Producto' : 'Crear Producto')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PremiumInventoryPage;
