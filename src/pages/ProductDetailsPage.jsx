// frontend/src/pages/ProductDetailsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, addToCart } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCartMessage, setAddedToCartMessage] = useState("");
  const [sellerProducts, setSellerProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addedToCartMessages, setAddedToCartMessages] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await api.get(`/products/${id}`, { headers });
        setProduct(response.data);

        // Si el producto tiene usuario, obtener otros productos del mismo vendedor
        if (response.data.user && response.data.user._id) {
          const sellerResponse = await api.get(
            `/products?seller=${response.data.user._id}&limit=4`,
            { headers }
          );
          setSellerProducts(
            sellerResponse.data.filter(
              (p) => p._id !== response.data._id && p.user._id === response.data.user._id
            )
          );
        }

        // Obtener productos de la misma categoría
        if (response.data.category) {
          const categoryResponse = await api.get(
            `/products?category=${response.data.category}&limit=4`,
            { headers }
          );
          setCategoryProducts(
            categoryResponse.data.filter((p) => p._id !== response.data._id)
          );
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token, user]);

  const handleAddToCart = (productToAdd, customQuantity = quantity) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      navigate("/login");
      return;
    }

    if (productToAdd.stock === 0) {
      setAddedToCartMessages((prev) => ({
        ...prev,
        [productToAdd._id]: "❌ ¡Producto agotado!",
      }));
      setTimeout(
        () =>
          setAddedToCartMessages((prev) => ({
            ...prev,
            [productToAdd._id]: "",
          })),
        2000
      );
      return;
    }

    if (customQuantity > productToAdd.stock) {
      setAddedToCartMessages((prev) => ({
        ...prev,
        [productToAdd._id]: `❌ No hay suficiente stock (disponible: ${productToAdd.stock})`,
      }));
      setTimeout(
        () =>
          setAddedToCartMessages((prev) => ({
            ...prev,
            [productToAdd._id]: "",
          })),
        2000
      );
      return;
    }

    const productWithQuantity = { ...productToAdd, quantity: customQuantity };
    addToCart(productWithQuantity);

    setAddedToCartMessages((prev) => ({
      ...prev,
      [productToAdd._id]: "✔️ ¡Añadido al carrito!",
    }));
    setTimeout(
      () =>
        setAddedToCartMessages((prev) => ({ ...prev, [productToAdd._id]: "" })),
      2000
    );
  };

  const handleDeleteProduct = async () => {
    try {
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/my-products");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error al eliminar el producto");
    }
  };

  const incrementQuantity = () => {
    if (product.stock && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const renderProductCard = (productItem) => {
    return (
      <div
        key={productItem._id}
        className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 relative
                    ${
                      productItem.user && productItem.user.isPremium
                        ? "border-4 border-yellow-400 ring-4 ring-yellow-200"
                        : "border border-gray-200"
                    }`}
      >
        {productItem.user && productItem.user.isPremium && (
          <span className="absolute top-3 right-3 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
            ⭐ Vendedor Premium
          </span>
        )}
        {productItem.imageUrl && (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
            <img
              src={productItem.imageUrl}
              alt={productItem.name}
              className="w-full h-full object-cover rounded-t-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/200?text=No+Image";
              }}
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-grow min-h-[200px]">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
            {productItem.name}
          </h2>
          <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
            {productItem.description}
          </p>

          <div className="flex justify-between items-center mb-3">
            <p className="text-md font-semibold text-gray-700">
              <span className="text-green-700">Categoría:</span>{" "}
              {productItem.category}
            </p>
            <p className="text-md font-semibold text-gray-700">
              <span className="text-green-700">Stock:</span>{" "}
              {productItem.stock === 0
                ? "Agotado"
                : `${productItem.stock} ${productItem.unit}`}
            </p>
          </div>
          <p className="text-xl font-extrabold text-green-700 mb-4">
            {productItem.isTradable && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-lg mr-2">
                ♻️ Truequeable
              </span>
            )}
            {productItem.price &&
              `$${productItem.price.toFixed(2)} por ${productItem.unit}`}
          </p>
          {productItem.user && (
            <p className="text-sm text-gray-500 mb-4">
              Publicado por:{" "}
              <span className="font-medium text-gray-700">
                {productItem.user.name ? productItem.user.name : "Desconocido"}
              </span>
            </p>
          )}
          <div className="mt-auto flex flex-col space-y-3 w-full">
            <Link
              to={`/products/${productItem._id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
            >
              Ver Detalles
            </Link>
            {isAuthenticated && user && (
              <>
                {productItem.user &&
                  user &&
                  productItem.user._id !== user._id && (
                    <>
                      {productItem.stock > 0 ? (
                        <button
                          onClick={() => handleAddToCart(productItem, 1)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                        >
                          🛒 Añadir al Carrito
                        </button>
                      ) : (
                        <button
                          className="bg-gray-400 text-white font-bold py-3 px-6 rounded-lg cursor-not-allowed shadow-md"
                          disabled
                        >
                          Agotado
                        </button>
                      )}

                      {addedToCartMessages[productItem._id] && (
                        <p
                          className={`text-center text-sm font-semibold mt-1 animate-pulse
                            ${
                              addedToCartMessages[productItem._id].includes("❌")
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                        >
                          {addedToCartMessages[productItem._id]}
                        </p>
                      )}
                      {productItem.isTradable && (
                        <Link
                          to={`/create-barter-proposal/${productItem._id}`}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
                        >
                          🤝 Proponer Trueque
                        </Link>
                      )}
                    </>
                  )}
                {productItem.user &&
                  user &&
                  productItem.user._id === user._id && (
                    <p className="text-gray-500 text-center text-sm font-medium pt-2">
                      Este es tu producto. Visible para otros.
                    </p>
                  )}
              </>
            )}
            {!isAuthenticated && (
              <p className="text-gray-500 text-center text-sm font-medium pt-2">
                Inicia sesión para interactuar.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">
            Cargando detalles del producto...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            to="/products"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Volver a Productos
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Producto no encontrado
          </h2>
          <p className="text-gray-700 mb-6">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Link
            to="/products"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  const isOwner =
    isAuthenticated && user && product.user && product.user._id === user._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600"
              >
                Inicio
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <Link
                  to="/products"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-green-600 md:ml-2"
                >
                  Productos
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={
                    product.imageUrl ||
                    "https://via.placeholder.com/600x600?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/600x600?text=No+Image";
                  }}
                />
                {product.user?.isPremium && (
                  <span className="absolute top-4 right-4 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                    ⭐ Vendedor Premium
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {product.category}
                </span>
                {product.isTradable && (
                  <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded ml-2">
                    ♻️ Truequeable
                  </span>
                )}
              </div>

              <div className="mb-6">
                <p className="text-gray-700">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Stock disponible
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {product.stock === 0 ? (
                      <span className="text-red-600">Agotado</span>
                    ) : (
                      `${product.stock} ${product.unit}`
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Precio</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {product.price && `$${product.price.toFixed(2)} por ${product.unit}`}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Publicado
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Ubicación
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {product.location || "No especificada"}
                  </p>
                </div>
              </div>

              {/* Seller Info */}
              {product.user && (
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Vendedor
                  </h3>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={
                          product.user.avatar ||
                         '/images/default-profile.png'
                        }
                        alt={product.user.name}
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {product.user.name}
                        {product.user.isPremium && (
                          <span className="ml-2 text-yellow-500">⭐</span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {product.user.email}
                      </p>
                    </div>
                    {!isOwner && (
                      <div className="ml-auto">
                        <Link
                          to={`/products`}
                          className="text-sm font-medium text-green-600 hover:text-green-800"
                        >
                          Ver más productos
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {isAuthenticated ? (
                isOwner ? (
                  <div className="mt-auto space-y-4">
                    <Link
                      to={`/edit-product/${product._id}`}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg text-center block transition duration-300"
                    >
                      Editar Producto
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                    >
                      Eliminar Producto
                    </button>
                  </div>
                ) : (
                  <div className="mt-auto space-y-4">
                    {product.stock > 0 && (
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={decrementQuantity}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4 py-2 text-gray-900 font-medium">
                            {quantity}
                          </span>
                          <button
                            onClick={incrementQuantity}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                            disabled={quantity >= product.stock}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex-1 ml-4"
                          disabled={product.stock === 0}
                        >
                          🛒 Añadir al Carrito
                        </button>
                      </div>
                    )}
                    {product.isTradable && (
                      <Link
                        to={`/create-barter-proposal/${product._id}`}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg text-center block transition duration-300 mb-4"
                      >
                        🤝 Proponer Trueque
                      </Link>
                    )}
                    {addedToCartMessage && (
                      <p
                        className={`text-center font-semibold ${
                          addedToCartMessage.includes("❌")
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {addedToCartMessage}
                      </p>
                    )}
                  </div>
                )
              ) : (
                <div className="mt-auto">
                  <p className="text-center text-gray-500 mb-4">
                    Inicia sesión para interactuar con este producto
                  </p>
                  <Link
                    to="/login"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center block transition duration-300"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* More from this seller */}
        {sellerProducts.length > 0 && !isOwner && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Más productos de este vendedor
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sellerProducts.map((productItem) =>
                renderProductCard(productItem)
              )}
            </div>
          </div>
        )}

        {/* More from this category */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Más productos en {product.category}
          </h2>
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryProducts.map((productItem) =>
                renderProductCard(productItem)
              )}
            </div>
          ) : (
            <div className="text-center bg-white p-8 rounded-xl shadow-md">
              <p className="text-gray-600 mb-4">
                No hay más productos en esta categoría.
              </p>
              <Link
                to="/products"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg inline-block transition duration-300"
              >
                Explorar todos los productos
              </Link>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Confirmar eliminación
              </h3>
              <p className="text-gray-700 mb-6">
                ¿Estás seguro de que quieres eliminar este producto? Esta acción
                no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailsPage;