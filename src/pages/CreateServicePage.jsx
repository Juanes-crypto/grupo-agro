import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// ELIMINA estas líneas de importación de Firebase:
// import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { initializeApp } from 'firebase/app';

// ELIMINA estas variables globales de configuración e inicialización de Firebase:
// const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
// const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// ELIMINA la inicialización de Firebase:
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

function CreateServicePage({ userId }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(''); // Precio por hora/servicio, etc.
    const [contactInfo, setContactInfo] = useState(''); // Información de contacto del proveedor
    const [imageUrl, setImageUrl] = useState(''); // URL de la imagen del servicio
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            setMessage('Debes iniciar sesión para ofrecer un servicio.');
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
            // TODO: Aquí es donde necesitas INTEGRAR tu nueva lógica para guardar el servicio.
            // Si vas a enviar esto a una API REST, por ejemplo, aquí iría el 'fetch' o 'axios'.
            // Por ahora, simplemente vamos a simular un éxito.

            // ELIMINA o REEMPLAZA estas líneas de Firebase:
            // const servicesCollectionRef = collection(db, `artifacts/${appId}/services`);
            // await addDoc(servicesCollectionRef, {
            //     title,
            //     description,
            //     price: parseFloat(price),
            //     contactInfo,
            //     imageUrl: imageUrl || `https://placehold.co/600x400/E0E0E0/333333?text=Servicio+Agro`,
            //     userId,
            //     status: 'published',
            //     createdAt: serverTimestamp(), // Eliminar si no usas un timestamp de servidor de Firebase
            //     updatedAt: serverTimestamp()  // Eliminar si no usas un timestamp de servidor de Firebase
            // });

            // Simulación de éxito si no tienes una API aún
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simula un retraso de red
            console.log('Simulando envío de servicio:', {
                title,
                description,
                price: parseFloat(price),
                contactInfo,
                imageUrl,
                userId,
                status: 'published'
            });

            setMessage('Servicio publicado con éxito!');
            setTitle('');
            setDescription('');
            setPrice('');
            setContactInfo('');
            setImageUrl('');
            // Opcional: Redirigir a la lista de servicios
            navigate('/services');
        } catch (error) {
            console.error("Error al crear el servicio:", error);
            setMessage(`Error al crear el servicio: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Ofrecer Nuevo Servicio</h2>
            {message && (
                <div className={`p-3 mb-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título del Servicio</label>
                    <input
                        type="text"
                        id="title"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción del Servicio</label>
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
                    <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">Información de Contacto</label>
                    <input
                        type="text"
                        id="contactInfo"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="Ej: Teléfono, Email, WhatsApp"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen (Opcional)</label>
                    <input
                        type="url"
                        id="imageUrl"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Ej: https://ejemplo.com/mi-servicio.jpg"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition duration-300 font-semibold text-lg"
                    disabled={loading}
                >
                    {loading ? 'Publicando Servicio...' : 'Publicar Servicio'}
                </button>
            </form>
        </div>
    );
}

export default CreateServicePage;