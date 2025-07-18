import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// ELIMINA ESTAS LÍNEAS DE FIREBASE
// import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { initializeApp } from 'firebase/app';
import { CATEGORIES } from '../App'; // Importa las categorías desde App.jsx

// ELIMINA ESTAS VARIABLES GLOBALES Y LA INICIALIZACIÓN DE FIREBASE
// const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
// const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// ELIMINA LA INICIALIZACIÓN DE FIREBASE
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

function CreateProductPage({ userId }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0] || ''); // Establece la primera categoría como valor predeterminado
    const [isTradable, setIsTradable] = useState(false);
    const [imageUrl, setImageUrl] = useState(''); // Para la URL de la imagen (placeholder)
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            setMessage('Debes iniciar sesión para ofrecer un producto.');
            // Opcional: Redirigir al login si no hay userId
            // navigate('/login');
        }
    }, [userId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setMessage('Error: No se pudo obtener el ID de usuario. Por favor, inicia sesión.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // ELIMINA O REEMPLAZA ESTA LÓGICA DE FIREBASE
            // const productsCollectionRef = collection(db, `artifacts/${appId}/products`);
            // await addDoc(productsCollectionRef, {
            //     name,
            //     description,
            //     price: parseFloat(price), // Asegúrate de que el precio sea un número
            //     category,
            //     isTradable,
            //     imageUrl: imageUrl || `https://placehold.co/600x400/E0E0E0/333333?text=Producto+Agro`, // Placeholder si no hay URL
            //     userId, // ID del usuario que crea el producto
            //     createdAt: serverTimestamp(),
            //     updatedAt: serverTimestamp()
            // });

            // ⭐ INICIO DE LA SIMULACIÓN TEMPORAL (REEMPLAZA CON TU LÓGICA DE BACKEND REAL) ⭐
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula un envío de red (1.5 segundos)
            console.log('🎉 Simulación: Producto enviado con éxito:', {
                name,
                description,
                price: parseFloat(price),
                category,
                isTradable,
                imageUrl: imageUrl || `https://placehold.co/600x400/E0E0E0/333333?text=Producto+Agro`,
                userId
            });
            // ⭐ FIN DE LA SIMULACIÓN TEMPORAL ⭐

            setMessage('Producto creado con éxito!');
            setName('');
            setDescription('');
            setPrice('');
            setCategory(CATEGORIES[0] || '');
            setIsTradable(false);
            setImageUrl('');
            // Opcional: Redirigir a la lista de productos
            navigate('/products');
        } catch (error) {
            console.error("Error al crear el producto:", error);
            setMessage(`Error al crear el producto: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Ofrecer Nuevo Producto</h2>
            {message && (
                <div className={`p-3 mb-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                    <input
                        type="text"
                        id="name"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                        id="description"
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio (COP)</label>
                    <input
                        type="number"
                        id="price"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                        id="category"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isTradable"
                        className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        checked={isTradable}
                        onChange={(e) => setIsTradable(e.target.checked)}
                    />
                    <label htmlFor="isTradable" className="ml-2 block text-sm font-medium text-gray-700">Ofrecer para Trueque 🤝</label>
                </div>
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen (Opcional)</label>
                    <input
                        type="url"
                        id="imageUrl"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Ej: https://ejemplo.com/mi-imagen.jpg"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition duration-300 font-semibold text-lg"
                    disabled={loading}
                >
                    {loading ? 'Creando Producto...' : 'Crear Producto'}
                </button>
            </form>
        </div>
    );
}

export default CreateProductPage;