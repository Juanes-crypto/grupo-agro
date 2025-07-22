// src/pages/BarterProposalPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function BarterProposalPage() {
    const { productId } = useParams(); // ID del producto que el usuario quiere obtener
    const navigate = useNavigate();
    const { isAuthenticated, user } = useContext(AuthContext);

    const [desiredProduct, setDesiredProduct] = useState(null);
    const [offeredProduct, setOfferedProduct] = useState(null); // Producto que el usuario ofrece
    const [userTruequeableProducts, setUserTruequeableProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [barterEquity, setBarterEquity] = useState(null); // Feedback de equidad del trueque desde el backend

    // Estados para el sistema de 3 pasos
    const [currentStep, setCurrentStep] = useState(1); // 1: Selección, 2: Propuesta, 3: Acuerdo
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [timeAgreementChecked, setTimeAgreementChecked] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para proponer un trueque.');
            navigate('/login');
            return;
        }

        const fetchBarterData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Obtener detalles del producto deseado
                const desiredProductRes = await api.get(`http://localhost:5000/api/products/${productId}`);
                setDesiredProduct(desiredProductRes.data);

                // 2. Obtener productos del usuario logueado que son truequeables
                // Asumiendo que el backend tiene un endpoint para esto, o que `api.get('/products')`
                // puede filtrar por el usuario autenticado y `is_truequeable`.
                const userProductsRes = await api.get(`http://localhost:5000/api/products?user=${user._id}&is_truequeable=true&inventory_gt=0`);
                
                // Filtrar productos del usuario para que no incluyan el producto deseado (si fuera el caso)
                const filteredUserProducts = userProductsRes.data.filter(p => p._id !== desiredProductRes.data._id);
                setUserTruequeableProducts(filteredUserProducts);

                // Validaciones iniciales (Paso 0 del flujo)
                if (desiredProductRes.data.user && desiredProductRes.data.user._id === user._id) {
                    setError('No puedes proponer un trueque por tu propio producto.');
                    setLoading(false);
                    return;
                }
                if (!desiredProductRes.data.is_truequeable || desiredProductRes.data.inventory <= 0) {
                    setError('Este producto no está disponible para trueque o no tiene inventario.');
                    setLoading(false);
                    return;
                }
                // La validación de reputación del vendedor del producto deseado se hará en el backend al crear la propuesta
                // y la de certificación de frescura también.

            } catch (err) {
                setError('Error al cargar la información para el trueque: ' + (err.response?.data?.message || err.message));
                console.error("Error fetching barter data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) { // Asegurarse de que el usuario esté cargado antes de hacer las peticiones
            fetchBarterData();
        }
    }, [productId, isAuthenticated, user, navigate]);

    // Función para obtener la valoración de equidad del backend
    const getBarterEquityFromBackend = async (offeredProdId, desiredProdId) => {
        try {
            const response = await api.get(`http://localhost:5000/api/barter/value-comparison?product1Id=${offeredProdId}&product2Id=${desiredProdId}`);
            setBarterEquity(response.data); // { isFair: boolean, message: string, difference: object, differencePercentage: number }
        } catch (err) {
            console.error("Error fetching barter equity:", err);
            setBarterEquity({ isFair: false, message: "No se pudo calcular la equidad. Intenta de nuevo.", difference: null, differencePercentage: 100 });
        }
    };

    useEffect(() => {
        if (offeredProduct && desiredProduct) {
            getBarterEquityFromBackend(offeredProduct._id, desiredProduct._id);
        } else {
            setBarterEquity(null);
        }
    }, [offeredProduct, desiredProduct]);

    const handleProposeBarter = async () => {
        if (!offeredProduct) {
            alert('Por favor, selecciona el producto que deseas ofrecer.');
            return;
        }
        if (!desiredProduct) {
            alert('Error: Producto deseado no cargado.');
            return;
        }

        // Validar en frontend si la diferencia es demasiado grande antes de enviar al backend
        if (barterEquity && !barterEquity.isFair && barterEquity.differencePercentage > 40) {
              alert('La diferencia de valor es demasiado grande para un trueque justo. Por favor, ajusta tu oferta.');
              return;
        }

        try {
            // Envío de la propuesta al backend
            const proposalData = {
                recipientId: desiredProduct.user._id, // El dueño del producto deseado es el recipiente
                offeredProductIds: [offeredProduct._id], // Por ahora, solo un producto ofrecido
                requestedProductIds: [desiredProduct._id], // Por ahora, solo un producto solicitado
                message: "¡Hola! Me gustaría intercambiar mi producto por el tuyo. ¿Qué te parece esta oferta?" // Mensaje por defecto
            };
            const response = await api.post('http://localhost:5000/api/barter', proposalData);
            console.log('Propuesta de trueque enviada:', response.data);
            alert('¡Propuesta de trueque enviada con éxito! Espera la respuesta del otro usuario.');
            setCurrentStep(3); // Avanzar al paso de acuerdo
        } catch (err) {
            setError('Error al enviar la propuesta de trueque: ' + (err.response?.data?.message || err.message));
            console.error("Error sending barter proposal:", err);
        }
    };

    const handleAcceptAgreement = async () => {
        if (!agreementChecked || !timeAgreementChecked) {
            alert('Debes aceptar ambos términos para firmar el acuerdo.');
            return;
        }
        // En un sistema real, aquí se confirmaría el acuerdo y se pasaría a la logística.
        // Por ahora, solo navegamos.
        alert('¡Acuerdo de trueque firmado! Recibirás notificaciones sobre los siguientes pasos logísticos.');
        // CAMBIA ESTA LÍNEA:
        // setTimeout(() => navigate('/my-barters'), 2000); // Antes (línea que tenías)
        setTimeout(() => navigate('/my-barter-proposals'), 2000); // Después (la nueva línea)
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-700 text-2xl animate-pulse">Cargando detalles del trueque...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen bg-red-50 text-red-700 text-xl font-semibold">Error: {error}</div>;
    }

    if (!desiredProduct) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-700 text-xl">Producto no encontrado o no disponible para trueque.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-10 drop-shadow-md">
                Propón un Trueque
            </h1>

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
                                    {desiredProduct.inventory > 0 && desiredProduct.inventory < 5 && (
                                        <div className="mt-3 p-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
                                            ¡Solo {desiredProduct.inventory} disponible para trueque!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tu Oferta (Derecha) */}
                        <div className="flex flex-col items-center p-6 bg-blue-50 rounded-xl shadow-md border border-blue-200">
                            <h3 className="text-2xl font-bold text-blue-800 mb-4">Tu Oferta</h3>
                            {userTruequeableProducts.length > 0 ? (
                                <>
                                    <label htmlFor="offeredProduct" className="block text-sm font-medium text-gray-700 mb-2">Selecciona un producto para ofrecer:</label>
                                    <div className="relative w-full max-w-sm mb-6">
                                        <select
                                            id="offeredProduct"
                                            value={offeredProduct ? offeredProduct._id : ''}
                                            onChange={(e) => setOfferedProduct(userTruequeableProducts.find(p => p._id === e.target.value))}
                                            className="block w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-400 bg-white text-gray-700 appearance-none pr-8 shadow-sm"
                                        >
                                            <option value="">Selecciona tu producto</option>
                                            {userTruequeableProducts.map(product => (
                                                <option key={product._id} value={product._id}>{product.name} ({product.quantity})</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338z"/></svg>
                                        </div>
                                    </div>

                                    {offeredProduct && (
                                        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                            <img src={offeredProduct.imageUrl || 'https://via.placeholder.com/400x300?text=Tu Oferta'} alt={offeredProduct.name} className="w-full h-48 object-cover"/>
                                            <div className="p-4">
                                                <h4 className="text-xl font-semibold text-gray-900">{offeredProduct.name}</h4>
                                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{offeredProduct.description}</p>
                                                <p className="text-lg font-bold text-blue-700 mt-2">COP {offeredProduct.price ? offeredProduct.price.toLocaleString('es-CO') : 'N/A'}</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center text-gray-600">
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
                            disabled={!offeredProduct}
                            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full text-xl transition duration-300 shadow-lg ${!offeredProduct ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                            <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                <img src={offeredProduct.imageUrl || 'https://via.placeholder.com/400x300?text=Tu Oferta'} alt={offeredProduct.name} className="w-full h-48 object-cover"/>
                                <div className="p-4">
                                    <h4 className="text-xl font-semibold text-gray-900">{offeredProduct.name}</h4>
                                    <p className="text-lg font-bold text-blue-700 mt-2">COP {offeredProduct.price ? offeredProduct.price.toLocaleString('es-CO') : 'N/A'}</p>
                                </div>
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
                            <p className="text-lg animate-pulse">Calculando equidad del trueque...</p>
                        </div>
                    )}

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
                            <span className="ml-3">Acepto recibir <span className="font-semibold">[{desiredProduct.name}]</span> y entregar <span className="font-semibold">[{offeredProduct.name}]</span>.</span>
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
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <p className="text-blue-800 font-medium">
                        <span className="font-bold">¡Trueque verificado por Fedegan!</span> Este producto cumple con los estándares de calidad.
                    </p>
                </div>
                <div className="bg-purple-100 p-6 rounded-xl shadow-md flex items-center space-x-4">
                    <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM14.5 19a.5.5 0 00.5-.5v-1.5a.5.5 0 00-.5-.5h-9a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5h9z"></path></svg>
                    <p className="text-purple-800 font-medium">
                        <span className="font-bold">Juan en Antioquia</span> cambió 10kg café por un saco de fertilizante hace 2 horas.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default BarterProposalPage;