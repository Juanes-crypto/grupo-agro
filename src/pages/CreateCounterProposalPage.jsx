import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // Asegúrate de que tu instancia de Axios esté aquí
import { AuthContext } from '../context/AuthContext'; // Para acceder al usuario autenticado
import { toast } from 'react-toastify'; // Para notificaciones de éxito/error

function CreateCounterProposalPage() {
    const { proposalId: originalProposalId } = useParams(); // ¡Asegúrate de que coincida con el nombre en App.jsx!
    const [originalProposal, setOriginalProposal] = useState(null);
    const [myProducts, setMyProducts] = useState([]); // Mis productos disponibles para ofrecer
    const [otherUserProducts, setOtherUserProducts] = useState([]); // Productos del otro usuario disponibles para solicitar

    // Estado para los ítems de la contrapropuesta (productoId, name, quantity, image, unit)
    const [offeredItemsCounter, setOfferedItemsCounter] = useState([]); // Lo que yo ofrezco en la contrapropuesta
    const [requestedItemsCounter, setRequestedItemsCounter] = useState([]); // Lo que yo solicito en la contrapropuesta

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            console.log('DEBUG: Iniciando fetchData en CreateCounterProposalPage...');
            console.log('DEBUG: originalProposalId:', originalProposalId);
            console.log('DEBUG: isAuthenticated:', isAuthenticated);
            console.log('DEBUG: authLoading:', authLoading);
            console.log('DEBUG: user:', user);
            if (!isAuthenticated) {
                console.log('DEBUG: Usuario no autenticado, redirigiendo a /login.');
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                setError('');
                console.log(`DEBUG: Intentando obtener propuesta original con ID: ${originalProposalId}`);
                // 1. Obtener la propuesta original
                const originalResponse = await api.get(`http://localhost:5000/api/barter/${originalProposalId}`);
                const prop = originalResponse.data;
                console.log('DEBUG: Propuesta original obtenida:', prop);

                // Verificar que el usuario actual es el RECIPIENTE de la propuesta original
                // Solo el recipiente puede contraofertar
                if (!user || prop.recipient._id !== user._id) {
                    console.log('DEBUG: No autorizado o no es el recipiente. Recipient ID:', prop.recipient._id, 'User ID:', user?._id);
                    setError('No autorizado para hacer una contraoferta a esta propuesta o la propuesta no está pendiente.');
                    setLoading(false);
                    return;
                }
                
                // Solo se puede contraofertar si el estado es 'pending'
                if (prop.status !== 'pending') {
                    console.log('DEBUG: Estado de la propuesta no es "pending":', prop.status);
                    setError(`No se puede contraofertar una propuesta que ya está '${prop.status}'.`);
                    setLoading(false);
                    return;
                }

                setOriginalProposal(prop);
                console.log('DEBUG: Propuesta original establecida.');

                console.log('DEBUG: Obteniendo mis productos...');
                // 2. Obtener mis productos (los que puedo ofrecer en la contrapropuesta)
                const myProductsResponse = await api.get('http://localhost:5000/api/products/myproducts');
                const fetchedMyProducts = Array.isArray(myProductsResponse.data) ? myProductsResponse.data : [];
                setMyProducts(fetchedMyProducts);
                console.log('DEBUG: Mis productos obtenidos:', myProductsResponse.data.length, 'productos.');

                console.log(`DEBUG: Obteniendo productos de ${prop.proposer.username}...`);
                // 3. Obtener los productos del proponente original (los que puedo solicitar en la contrapropuesta)
                // Usamos el ID del proponente original de la propuesta que acabamos de cargar
                const otherUserProductsResponse = await api.get(`http://localhost:5000/api/products/user/${prop.proposer._id}`);
                setOtherUserProducts(otherUserProductsResponse.data);

                console.log('DEBUG: Productos del otro usuario obtenidos:', otherUserProductsResponse.data.length, 'productos.');
                // 4. Pre-rellenar los ítems de la contrapropuesta
                // Yo OFREZCO lo que el original SOLICITÓ
                const initialOffered = prop.requestedItems.map(item => ({
                    product: item.product._id,
                    name: item.product.name, // Asegúrate de que 'name' venga de item.product.name
                    quantity: parseFloat(item.quantity.split(' ')[0]) || 0, // Esto analiza el número
                    image: item.product.imageUrl || 'https://placehold.co/100x80/e2e8f0/64748b?text=Producto', // Asegúrate de que 'image' venga de item.product.imageUrl
                    unit: item.product.unit || 'unidades' // Asegura que la unidad esté presente
                }));
                setOfferedItemsCounter(initialOffered);
                console.log('DEBUG: offeredItemsCounter inicializado:', initialOffered);

                // Yo SOLICITO lo que el original OFRECIÓ
                const initialRequested = prop.offeredItems.map(item => ({
                    product: item.product._id,
                    name: item.product.name, // El nombre del producto para generar consistencia
                    quantity: parseFloat(item.quantity.split(' ')[0]) || 0, // Analiza a número
                    image: item.product.imageUrl || 'https://placehold.co/100x80/e2e8f0/64748b?text=Producto', // Asegúrate de que 'image' venga de item.product.imageUrl
                    unit: item.product.unit || 'unidades' // Asegura que la unidad esté presente
                }));
                setRequestedItemsCounter(initialRequested);
                console.log('DEBUG: requestedItemsCounter inicializado:', initialRequested);

            } catch (err) {
                console.error('Error al cargar datos para contrapropuesta:', err);
                setError('Error al cargar datos para la contrapropuesta: ' + (err.response?.data?.message || err.message));
            } finally {
                console.log('DEBUG: Finalizando fetchData, setting loading to false.');
                setLoading(false);
            }
        };

        if (!authLoading && originalProposalId) {
            console.log('DEBUG: authLoading es false y originalProposalId está presente, ejecutando fetchData.');
            fetchData();
        }else {
            console.log('DEBUG: fetchData no se ejecutó. authLoading:', authLoading, 'originalProposalId:', originalProposalId);
        }
    }, [isAuthenticated, authLoading, user, originalProposalId, navigate]);

    // Manejar cambio de cantidad para un producto en los ítems ofrecidos
    const handleOfferedQuantityChange = (productId, newQuantity) => {
        setOfferedItemsCounter(prevItems =>
            prevItems.map(item =>
                item.product === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Manejar adición/remoción de productos a ofrecer
    const toggleOfferedItem = (product) => {
        setOfferedItemsCounter(prevItems => {
            const exists = prevItems.some(item => item.product === product._id);
            if (exists) {
                return prevItems.filter(item => item.product !== product._id);
            } else {
                return [...prevItems, {
                    product: product._id,
                    name: product.name,
                    quantity: product.stock > 0 ? 1 : 0, // Almacenar como número
                    image: product.imageUrl,
                    unit: product.unit
                }];
            }
        });
    };

    // Manejar cambio de cantidad para un producto en los ítems solicitados
    const handleRequestedQuantityChange = (productId, newQuantity) => {
        setRequestedItemsCounter(prevItems =>
            prevItems.map(item =>
                item.product === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Manejar adición/remoción de productos a solicitar
    const toggleRequestedItem = (product) => {
        setRequestedItemsCounter(prevItems => {
            const exists = prevItems.some(item => item.product === product._id);
            if (exists) {
                return prevItems.filter(item => item.product !== product._id);
            } else {
                return [...prevItems, {
                    product: product._id,
                    name: product.name,
                    quantity: 1, // Almacenar como número
                    image: product.imageUrl,
                    unit: product.unit
                }];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!isAuthenticated || !user) {
            setError('Debes iniciar sesión para enviar una contrapropuesta.');
            setLoading(false);
            return;
        }

        if (offeredItemsCounter.length === 0 || requestedItemsCounter.length === 0) {
            setError('Debes seleccionar al menos un producto para ofrecer y uno para solicitar en la contrapropuesta.');
            setLoading(false);
            return;
        }

        // Validar que las cantidades no sean cero o negativas
        const hasInvalidQuantities = [...offeredItemsCounter, ...requestedItemsCounter].some(item => {
            return item.quantity <= 0; // La cantidad ya es un número en el estado
        });

        if (hasInvalidQuantities) {
            setError('Las cantidades de los productos no pueden ser cero o negativas.');
            setLoading(false);
            return;
        }

        try {
            const counterProposalData = {
                offeredItems: offeredItemsCounter.map(item => ({
                    product: item.product,
                    name: item.name,
                    quantity: `${item.quantity} ${item.unit}`, // Reconstruye la cadena "número unidad" para el backend
                    image: item.image,
                })),
                requestedItems: requestedItemsCounter.map(item => ({
                    product: item.product,
                    name: item.name,
                    quantity: `${item.quantity} ${item.unit}`, // Reconstruye la cadena "número unidad" para el backend
                    image: item.image,
                })),
                message,
            };

            const response = await api.post(`http://localhost:5000/api/barter/${originalProposalId}/counter`, counterProposalData);
            toast.success('¡Contrapropuesta enviada exitosamente! 🎉');
            console.log('Contrapropuesta creada:', response.data);

            setTimeout(() => navigate('/my-barter-proposals'), 2000);

        } catch (err) {
            console.error('Error al crear contrapropuesta:', err);
            setError('Error al crear contrapropuesta: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-700 animate-pulse">Cargando contrapropuesta...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 text-center p-4">
                <p className="text-xl font-semibold">{error}</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Crear Contrapropuesta</h2>
                <p className="text-lg text-gray-600 mb-6">Por favor, <Link to="/login" className="text-blue-600 hover:underline">inicia sesión</Link> para crear una contrapropuesta.</p>
            </div>
        );
    }

    if (!originalProposal) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Crear Contrapropuesta</h2>
                <p className="text-lg text-gray-600 mb-6">No se pudo cargar la propuesta original o no tienes permiso para contraofertarla.</p>
                <Link to="/mybarterproposals" className="text-blue-600 hover:underline">Volver a Mis Trueques</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-green-800 mb-6">
                    Contraofertar Propuesta #{originalProposal._id.slice(-6)} 🔄
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Estás respondiendo a la propuesta de <span className="font-semibold">{originalProposal.proposer.username}</span>.
                    Ajusta los productos que ofreces y solicitas.
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                        <strong className="font-bold">¡Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Sección: Mis Productos a Ofrecer (en la contrapropuesta) */}
                    <div className="bg-blue-50 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                            <span className="mr-2 text-2xl">📤</span> 1. Tus Productos a Ofrecer
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Selecciona y ajusta la cantidad de los productos que tú (el recipiente original) quieres ofrecer en esta contrapropuesta.
                            Estos productos son los que el proponente original te había solicitado.
                        </p>
                        {myProducts.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No tienes productos disponibles para ofrecer. <Link to="/create-product" className="text-blue-600 hover:underline">Crea uno</Link>.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {myProducts.map(product => {
                                    const isSelected = offeredItemsCounter.some(item => item.product === product._id);
                                    const currentQuantityItem = offeredItemsCounter.find(item => item.product === product._id);
                                    // currentQuantityValue ya no necesita split(' ') porque quantity es un número
                                    const currentQuantityValue = currentQuantityItem ? currentQuantityItem.quantity : 0;

                                    return (
                                        <div
                                            key={product._id}
                                            className={`p-4 border rounded-lg shadow-sm cursor-pointer transition-all duration-200 
                                                         ${isSelected ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-300' : 'border-gray-200 bg-white hover:shadow-md'}`}
                                            onClick={() => toggleOfferedItem(product)}
                                        >
                                            <img
                                                src={product.imageUrl || 'https://placehold.co/100x80/e2e8f0/64748b?text=Producto'}
                                                alt={product.name}
                                                className="w-full h-24 object-cover rounded-md mb-2"
                                            />
                                            <h4 className="font-semibold text-gray-800 text-lg">{product.name}</h4>
                                            <p className="text-sm text-gray-600">Stock: {product.stock} {product.unit}</p>
                                            {isSelected && (
                                                <div className="mt-2">
                                                    <label htmlFor={`offered-qty-${product._id}`} className="block text-sm font-medium text-gray-700">Cantidad a ofrecer:</label>
                                                    <input
                                                        type="number"
                                                        id={`offered-qty-${product._id}`}
                                                        value={currentQuantityValue}
                                                        onChange={(e) => {
                                                            const val = parseFloat(e.target.value);
                                                            if (!isNaN(val) && val >= 0) {
                                                                // Pasa directamente el número
                                                                handleOfferedQuantityChange(product._id, val);
                                                            }
                                                        }}
                                                        onClick={(e) => e.stopPropagation()} // Evita que el clic en el input deseleccione
                                                        min="0"
                                                        max={product.stock}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                                    />
                                                    {currentQuantityValue > product.stock && (
                                                        <p className="text-red-500 text-xs mt-1">Cantidad excede tu stock disponible.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sección: Productos a Solicitar (del proponente original) */}
                    <div className="bg-green-50 p-6 rounded-lg shadow-md border-l-4 border-green-500">
                        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                            <span className="mr-2 text-2xl">📥</span> 2. Productos a Solicitar (a {originalProposal.proposer.username})
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Selecciona y ajusta la cantidad de los productos que quieres solicitar al otro usuario.
                            Estos productos son los que el proponente original te había ofrecido.
                        </p>
                        {otherUserProducts.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">El usuario {originalProposal.proposer.username} no tiene productos disponibles para trueque.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {otherUserProducts.map(product => {
                                    const isSelected = requestedItemsCounter.some(item => item.product === product._id);
                                    const currentQuantityItem = requestedItemsCounter.find(item => item.product === product._id);
                                    // currentQuantityValue ya no necesita split(' ') porque quantity es un número
                                    const currentQuantityValue = currentQuantityItem ? currentQuantityItem.quantity : 0;

                                    return (
                                        <div
                                            key={product._id}
                                            className={`p-4 border rounded-lg shadow-sm cursor-pointer transition-all duration-200 
                                                         ${isSelected ? 'border-green-500 bg-green-100 ring-2 ring-green-300' : 'border-gray-200 bg-white hover:shadow-md'}`}
                                            onClick={() => toggleRequestedItem(product)}
                                        >
                                            <img
                                                src={product.imageUrl || 'https://placehold.co/100x80/e2e8f0/64748b?text=Producto'}
                                                alt={product.name}
                                                className="w-full h-24 object-cover rounded-md mb-2"
                                            />
                                            <h4 className="font-semibold text-gray-800 text-lg">{product.name}</h4>
                                            <p className="text-sm text-gray-600">Stock: {product.stock} {product.unit}</p>
                                            {isSelected && (
                                                <div className="mt-2">
                                                    <label htmlFor={`requested-qty-${product._id}`} className="block text-sm font-medium text-gray-700">Cantidad a solicitar:</label>
                                                    <input
                                                        type="number"
                                                        id={`requested-qty-${product._id}`}
                                                        value={currentQuantityValue}
                                                        onChange={(e) => {
                                                            const val = parseFloat(e.target.value);
                                                            if (!isNaN(val) && val >= 0) {
                                                                // Pasa directamente el número
                                                                handleRequestedQuantityChange(product._id, val);
                                                            }
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        min="0"
                                                        max={product.stock}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                                                    />
                                                    {currentQuantityValue > product.stock && (
                                                        <p className="text-red-500 text-xs mt-1">Cantidad excede el stock disponible del otro usuario.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sección: Mensaje */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-gray-300">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2 text-2xl">💬</span> 3. Mensaje para la Contrapropuesta (Opcional)
                        </h3>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Explica tu contraoferta, por qué cambiaste la propuesta, etc."
                            rows="4"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enviando Contrapropuesta...' : 'Enviar Contrapropuesta'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateCounterProposalPage;