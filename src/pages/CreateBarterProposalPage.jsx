// src/pages/CreateBarterProposalPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CurrencyDollarIcon, CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon, HandThumbUpIcon, ShieldCheckIcon, UsersIcon } from '@heroicons/react/24/outline';

function CreateBarterProposalPage() {
    const { productId } = useParams(); // ID del producto que el usuario quiere obtener
    const navigate = useNavigate();
    const { isAuthenticated, user, loading: authLoading } = useContext(AuthContext);

    const [desiredProduct, setDesiredProduct] = useState(null);
    const [userTruequeableProducts, setUserTruequeableProducts] = useState([]);
    const [selectedOfferedProductIds, setSelectedOfferedProductIds] = useState([]); // IDs de productos que el usuario ofrece
    const [barterEquity, setBarterEquity] = useState(null); // Feedback de equidad del trueque desde el backend

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [message, setMessage] = useState('');
    // Estados para el sistema de 3 pasos
    const [currentStep, setCurrentStep] = useState(1); // 1: Selección, 2: Propuesta, 3: Acuerdo
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [timeAgreementChecked, setTimeAgreementChecked] = useState(false);

    useEffect(() => {
        const fetchBarterData = async () => {
            if (!isAuthenticated) {
                setError('Debes iniciar sesión para proponer un trueque.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // 1. Obtener detalles del producto deseado (el que el usuario quiere)
                const desiredProductRes = await api.get(`http://localhost:5000/api/products/${productId}`);
                const fetchedDesiredProduct = desiredProductRes.data;
                setDesiredProduct(fetchedDesiredProduct);

                // 2. Obtener productos del usuario logueado que son truequeables y tienen stock
                const userProductsRes = await api.get(`http://localhost:5000/api/products?user=${user._id}&isTradable=true&stock_gt=0`); // Usando 'stock_gt=0' para filtrar
                
                // Filtrar productos del usuario para que no incluyan el producto deseado (si por alguna razón lo fuera)
                const filteredUserProducts = userProductsRes.data.filter(p => p._id !== fetchedDesiredProduct._id);
                setUserTruequeableProducts(filteredUserProducts);

                // Validaciones iniciales (Paso 0 del flujo)
                if (fetchedDesiredProduct.user && fetchedDesiredProduct.user._id === user._id) {
                    setError('No puedes proponer un trueque por tu propio producto.');
                    setLoading(false);
                    return;
                }
                if (!fetchedDesiredProduct.isTradable || fetchedDesiredProduct.stock <= 0) {
                    setError('Este producto no está disponible para trueque o no tiene stock.');
                    setLoading(false);
                    return;
                }
                // Las validaciones de reputación y certificación de frescura se harán en el backend al crear la propuesta.

            } catch (err) {
                setError('Error al cargar la información para el trueque: ' + (err.response?.data?.message || err.message));
                console.error("Error fetching barter data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) { // Asegurarse de que el usuario esté cargado antes de hacer las peticiones
            fetchBarterData();
        }
    }, [productId, isAuthenticated, user, authLoading, navigate]);

    // Función para obtener la valoración de equidad del backend
    useEffect(() => {
        const getBarterEquityFromBackend = async () => {
            if (selectedOfferedProductIds.length === 0 || !desiredProduct) {
                setBarterEquity(null);
                return;
            }
            try {
                // Para simplificar, comparamos el primer producto ofrecido con el deseado.
                // Si se permiten múltiples productos, la lógica de comparación de valor debería ser más compleja en el backend.
                const product1Id = selectedOfferedProductIds[0]; // Asume que el primer producto ofrecido es el principal para la comparación
                const product2Id = desiredProduct._id;

                const response = await api.get(`http://localhost:5000/api/barter/value-comparison?product1Id=${product1Id}&product2Id=${product2Id}`);
                setBarterEquity(response.data); // { isFair: boolean, message: string, difference: object, differencePercentage: number }
            } catch (err) {
                console.error("Error fetching barter equity:", err);
                setBarterEquity({ isFair: false, message: "No se pudo calcular la equidad. Intenta de nuevo.", difference: null, differencePercentage: 100 });
            }
        };

        getBarterEquityFromBackend();
    }, [selectedOfferedProductIds, desiredProduct]);

    const handleOfferedItemToggle = (productId) => {
        setSelectedOfferedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleProposeBarter = async () => {
        if (selectedOfferedProductIds.length === 0) {
            setError('Por favor, selecciona al menos un producto que deseas ofrecer.');
            return;
        }
        if (!desiredProduct) {
            setError('Error: Producto deseado no cargado.');
            return;
        }

        // Validar en frontend si la diferencia es demasiado grande antes de enviar al backend
        if (barterEquity && !barterEquity.isFair && barterEquity.differencePercentage > 40) {
             setError('La diferencia de valor supera el 40%. Por favor, ajusta tu oferta.');
             return;
        }

        setLoading(true);
        setError(null);
        try {
            const proposalData = {
                recipientId: desiredProduct.user._id, // El dueño del producto deseado es el recipiente
                offeredProductIds: selectedOfferedProductIds,
                requestedProductIds: [desiredProduct._id], // El producto deseado es el único solicitado
                message: message || `¡Hola! Me gustaría intercambiar mi(s) producto(s) por tu ${desiredProduct.name}. ¿Qué te parece esta oferta?`
            };
            const response = await api.post('http://localhost:5000/api/barter', proposalData);
            setSuccessMessage('¡Propuesta de trueque enviada con éxito! Espera la respuesta del otro usuario.');
            console.log('Propuesta creada:', response.data);
            setCurrentStep(3); // Avanzar al paso de acuerdo
        } catch (err) {
            setError('Error al enviar la propuesta de trueque: ' + (err.response?.data?.message || err.message));
            console.error("Error sending barter proposal:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptAgreement = async () => {
        if (!agreementChecked || !timeAgreementChecked) {
            setError('Debes aceptar ambos términos para firmar el acuerdo.');
            return;
        }
        setSuccessMessage('¡Acuerdo de trueque firmado! Recibirás notificaciones sobre los siguientes pasos logísticos.');
        // En un sistema real, aquí se confirmaría el acuerdo y se pasaría a la logística.
        // Por ahora, solo navegamos.
        setTimeout(() => navigate('/my-barter-proposals'), 2000); // Redirigir a una página de trueques del usuario (a crear)
    };

    if (loading || authLoading) {
        return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-700 text-2xl animate-pulse">Cargando detalles del trueque...</div>;
    }

    if (error && !successMessage) { // Mostrar error solo si no hay mensaje de éxito
        return <div className="flex justify-center items-center min-h-screen bg-red-50 text-red-700 text-xl font-semibold">Error: {error}</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Crear Propuesta de Trueque</h2>
                <p className="text-center text-gray-600 mb-4">Por favor, <Link to="/login" className="text-blue-600 hover:underline font-bold">inicia sesión</Link> para crear una propuesta de trueque.</p>
            </div>
        );
    }

    if (!desiredProduct) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-700 text-xl">Producto deseado no encontrado o no disponible para trueque.</div>;
    }

    const selectedOfferedProductsDetails = userTruequeableProducts.filter(p => selectedOfferedProductIds.includes(p._id));

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-10 drop-shadow-md">
                Propón un Trueque
            </h1>

            {/* Mensajes de éxito y error */}
            {successMessage && (
                <div className="max-w-4xl mx-auto bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 text-center shadow-md" role="alert">
                    <strong className="font-bold">¡Éxito!</strong>
                    <span className="block sm:inline ml-2">{successMessage}</span>
                </div>
            )}
            {error && (
                <div className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-center shadow-md" role="alert">
                    <strong className="font-bold">¡Error!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            )}

            {/* Indicador de Pasos */}
            <div className="max-w-4xl mx-auto mb-10 flex justify-around items-center relative">
                <div className="absolute left-0 right-0 h-1 bg-gray-300 z-0"></div>
                <div className={`absolute left-0 h-1 bg-green-500 z-10 transition-all duration-500 ${currentStep === 1 ? 'w-1/4' : currentStep === 2 ? 'w-2/4' : 'w-full'}`}></div>

                {[1, 2, 3].map(step => (
                    <div key={step} className="relative z-20 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300
                            ${currentStep >= step ? 'bg-green-600 shadow-lg' : 'bg-gray-400'}`}>
                            {step}
                        </div>
                        <p className={`mt-2 text-sm font-semibold transition-colors duration-300 ${currentStep >= step ? 'text-green-800' : 'text-gray-600'}`}>
                            {step === 1 && 'Selección'}
                            {step === 2 && 'Propuesta'}
                            {step === 3 && 'Acuerdo'}
                        </p>
                    </div>
                ))}
            </div>

            {/* Contenido de los pasos */}
            {currentStep === 1 && (
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-green-100 p-8">
                    <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Paso 1: Selecciona tu Oferta</h2>
                    <p className="text-center text-gray-600 mb-8">Estás a punto de proponer un trueque por **{desiredProduct.name}**.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Producto Deseado (Izquierda) */}
                        <div className="flex flex-col items-center p-6 bg-green-50 rounded-xl shadow-md border border-green-200">
                            <h3 className="text-2xl font-bold text-green-800 mb-4">Producto que deseas</h3>
                            <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                <img src={desiredProduct.imageUrl || 'https://via.placeholder.com/400x300?text=Producto Deseado'} alt={desiredProduct.name} className="w-full h-48 object-cover"/>
                                <div className="p-4">
                                    <h4 className="text-xl font-semibold text-gray-900">{desiredProduct.name}</h4>
                                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{desiredProduct.description}</p>
                                    <p className="text-lg font-bold text-blue-700 mt-2">COP {desiredProduct.price ? desiredProduct.price.toLocaleString('es-CO') : 'N/A'}</p>
                                    {desiredProduct.user && (
                                        <p className="text-gray-500 text-xs mt-1">Vendedor: {desiredProduct.user.name} ({desiredProduct.user.reputation} estrellas)</p>
                                    )}
                                    {/* Principio de Escasez */}
                                    {desiredProduct.stock > 0 && desiredProduct.stock < 5 && (
                                        <div className="mt-3 p-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center">
                                            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                                            ¡Solo {desiredProduct.stock} {desiredProduct.unit} disponible para trueque!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tu Oferta (Derecha) */}
                        <div className="flex flex-col items-center p-6 bg-blue-50 rounded-xl shadow-md border border-blue-200">
                            <h3 className="text-2xl font-bold text-blue-800 mb-4">Tus Productos a Ofrecer</h3>
                            {userTruequeableProducts.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 w-full max-w-lg overflow-y-auto max-h-96 p-2">
                                    {userTruequeableProducts.map(product => (
                                        <div
                                            key={product._id}
                                            onClick={() => handleOfferedItemToggle(product._id)}
                                            className={`border rounded-lg p-3 text-center cursor-pointer transition-all duration-200 ease-in-out
                                                ${selectedOfferedProductIds.includes(product._id) ? 'border-blue-600 ring-2 ring-blue-300 bg-blue-100' : 'border-gray-300 bg-white hover:border-blue-400'}`}
                                        >
                                            <img src={product.imageUrl || 'https://via.placeholder.com/100x80?text=Tu+Oferta'} alt={product.name} className="w-full h-24 object-cover rounded-md mb-2"/>
                                            <p className="font-semibold text-gray-800 text-base">{product.name}</p>
                                            <p className="text-gray-600 text-sm">{product.stock} {product.unit}</p>
                                            <p className="text-green-700 font-bold text-sm">COP {product.price ? product.price.toLocaleString('es-CO') : 'N/A'}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-600 p-4">
                                    <p className="mb-4">No tienes productos disponibles para trueque.</p>
                                    <Link to="/create-product" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                                        Publica un Producto Truequeable
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={() => setCurrentStep(2)}
                            disabled={selectedOfferedProductIds.length === 0}
                            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full text-xl transition duration-300 shadow-lg ${selectedOfferedProductIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Continuar a la Propuesta
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-green-100 p-8">
                    <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Paso 2: Confirma tu Propuesta</h2>
                    <p className="text-center text-gray-600 mb-8">Revisa la equidad de tu trueque antes de enviarlo.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        {/* Producto Deseado */}
                        <div className="flex flex-col items-center p-6 bg-green-50 rounded-xl shadow-md border border-green-200">
                            <h3 className="text-2xl font-bold text-green-800 mb-4">Recibirás:</h3>
                            <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                <img src={desiredProduct.imageUrl || 'https://via.placeholder.com/400x300?text=Producto Deseado'} alt={desiredProduct.name} className="w-full h-48 object-cover"/>
                                <div className="p-4">
                                    <h4 className="text-xl font-semibold text-gray-900">{desiredProduct.name}</h4>
                                    <p className="text-lg font-bold text-blue-700 mt-2">COP {desiredProduct.price ? desiredProduct.price.toLocaleString('es-CO') : 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tu Oferta */}
                        <div className="flex flex-col items-center p-6 bg-blue-50 rounded-xl shadow-md border border-blue-200">
                            <h3 className="text-2xl font-bold text-blue-800 mb-4">Ofrecerás:</h3>
                            <div className="w-full max-w-sm grid grid-cols-2 gap-4">
                                {selectedOfferedProductsDetails.map(product => (
                                    <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                        <img src={product.imageUrl || 'https://via.placeholder.com/200x150?text=Tu Oferta'} alt={product.name} className="w-full h-24 object-cover"/>
                                        <div className="p-2">
                                            <h4 className="text-md font-semibold text-gray-900">{product.name}</h4>
                                            <p className="text-sm text-gray-600">{product.stock} {product.unit}</p>
                                            <p className="text-md font-bold text-blue-700">COP {product.price ? product.price.toLocaleString('es-CO') : 'N/A'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Feedback de Equidad (Semáforo) */}
                    {barterEquity ? (
                        <div className={`mt-10 p-6 rounded-xl text-center shadow-inner border
                            ${barterEquity.isFair ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800'}
                        `}>
                            <h4 className="text-2xl font-bold mb-3">
                                {barterEquity.isFair ? '¡Trueque Justo! 💚' : 'Ajusta tu Oferta 💡'}
                            </h4>
                            <p className="text-lg">
                                {barterEquity.message}
                            </p>
                            {barterEquity.difference && (
                                <p className="mt-2 text-md">
                                    Necesitas añadir aproximadamente <span className="font-bold">{barterEquity.difference.amount} {barterEquity.difference.unit}</span> de <span className="font-bold">{barterEquity.difference.product}</span> para equilibrar.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="mt-10 p-6 rounded-xl text-center shadow-inner border bg-gray-100 border-gray-300 text-gray-800">
                            <p className="text-lg animate-pulse flex items-center justify-center">
                                <ArrowPathIcon className="w-6 h-6 mr-3 animate-spin text-gray-600" />
                                Calculando equidad del trueque...
                            </p>
                        </div>
                    )}

                    {/* Mensaje opcional */}
                    <div className="mt-8">
                        <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">Mensaje para el receptor (Opcional):</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ej: ¡Hola! Me interesa mucho tu producto. Espero que mi oferta sea de tu agrado."
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 shadow-sm"
                        ></textarea>
                    </div>

                    {/* Botones de navegación */}
                    <div className="mt-10 flex justify-between">
                        <button
                            onClick={() => setCurrentStep(1)}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-md"
                        >
                            Atrás
                        </button>
                        <button
                            onClick={handleProposeBarter}
                            // Deshabilitar si no hay equidad calculada o si la diferencia es > 40%
                            disabled={!barterEquity || (barterEquity && barterEquity.differencePercentage > 40)}
                            className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-full text-xl transition duration-300 shadow-lg flex items-center justify-center space-x-2
                                ${(!barterEquity || (barterEquity && barterEquity.differencePercentage > 40)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="text-xl">🔄</span>
                            <span>¡Obtenerlo SIN dinero!</span>
                            <span className="text-sm">(97% de éxito)</span>
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-green-100 p-8 text-center">
                    <h2 className="text-3xl font-bold text-green-700 mb-6">Paso 3: Acuerdo Final</h2>
                    <p className="text-gray-600 mb-8">¡Casi listo! Confirma los términos para finalizar el trueque.</p>

                    <div className="space-y-4 mb-8 text-left">
                        <label className="flex items-center text-lg text-gray-800 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreementChecked}
                                onChange={(e) => setAgreementChecked(e.target.checked)}
                                className="form-checkbox h-6 w-6 text-green-600 rounded-md border-gray-300 focus:ring-green-500"
                            />
                            <span className="ml-3">Acepto recibir <span className="font-semibold">[{desiredProduct.name}]</span> y entregar <span className="font-semibold">[{selectedOfferedProductsDetails.map(p => p.name).join(', ')}]</span>.</span>
                        </label>
                        <label className="flex items-center text-lg text-gray-800 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={timeAgreementChecked}
                                onChange={(e) => setTimeAgreementChecked(e.target.checked)}
                                className="form-checkbox h-6 w-6 text-green-600 rounded-md border-gray-300 focus:ring-green-500"
                            />
                            <span className="ml-3">Conozco que tengo 48h para concretar la logística del trueque.</span>
                        </label>
                    </div>

                    <button
                        onClick={handleAcceptAgreement}
                        disabled={!agreementChecked || !timeAgreementChecked}
                        className={`bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-full text-xl transition duration-300 shadow-lg flex items-center justify-center space-x-3 mx-auto
                            ${(!agreementChecked || !timeAgreementChecked) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className="text-2xl">🖊</span>
                        <span>Firmar acuerdo</span>
                        <span className="text-sm">(sin costos)</span>
                    </button>

                    <p className="text-gray-500 text-sm mt-6">
                        Una vez firmado, el sistema te guiará para coordinar la entrega.
                    </p>
                </div>
            )}

            {/* Microcopys de Prueba Social y Autoridad (ejemplos estáticos por ahora) */}
            <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-blue-100 p-6 rounded-xl shadow-md flex items-center space-x-4">
                    <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                    <p className="text-blue-800 font-medium">
                        <span className="font-bold">¡Trueque verificado por Fedegan!</span> Este producto cumple con los estándares de calidad.
                    </p>
                </div>
                <div className="bg-purple-100 p-6 rounded-xl shadow-md flex items-center space-x-4">
                    <UsersIcon className="w-8 h-8 text-purple-600" />
                    <p className="text-purple-800 font-medium">
                        <span className="font-bold">Juan en Antioquia</span> cambió 10kg café por un saco de fertilizante hace 2 horas.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CreateBarterProposalPage;
