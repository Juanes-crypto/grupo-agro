import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChatBubbleBottomCenterTextIcon, PhoneIcon } from '@heroicons/react/24/solid';
import api from "../services/api";

function RentalListPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isMyRentalsPage = location.pathname === "/my-rentals";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const rentalCategories = [
    "Tractores",
    "Arados",
    "Sembradoras",
    "Cosechadoras",
    "Sistemas de Riego",
    "Herramientas Manuales",
    "Vehículos Utilitarios",
    "Drones Agrícolas",
    "Equipos de Fumigación",
    "Otros",
  ];

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      setError(null);

      let url = "http://localhost:5000/api/rentals";
      const params = new URLSearchParams();

      if (isMyRentalsPage) {
        url = "http://localhost:5000/api/rentals/my-rentals";
        if (!isAuthenticated || !token) {
          setError("Debes iniciar sesión para ver tus rentas.");
          setLoading(false);
          return;
        }
      } else {
        if (searchTerm) {
          params.append("search", searchTerm);
        }
        if (selectedCategory) {
          params.append("category", selectedCategory);
        }
      }

      const queryString = params.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }

      try {
        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await api.get(url, { headers });
        const sortedRentals = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setRentals(sortedRentals);
      } catch (err) {
        console.error("Error fetching rentals:", err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Error desconocido al cargar las rentas.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [isMyRentalsPage, isAuthenticated, token, searchTerm, selectedCategory]);

  const handleContactMe = (rental) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para contactar al proveedor.");
      navigate("/login");
      return;
    }

    // MODIFICADO: Cambiado rental.user por rental.owner y añadido showPhoneNumber
    if (rental.owner && rental.owner.phoneNumber && rental.owner.showPhoneNumber) {
      // Abre WhatsApp si hay un número de teléfono Y showPhoneNumber es true
      const whatsappMessage = `Hola, estoy interesado en tu equipo en renta: ${rental.name} (ID: ${rental._id}). ¿Podrías darme más información?`;
      window.open(
        `https://wa.me/${rental.owner.phoneNumber}?text=${encodeURIComponent(
          whatsappMessage
        )}`,
        "_blank"
      );
    } else if (rental.owner && rental.owner.email) {
      // Fallback a email si no hay número de teléfono o showPhoneNumber es false
      alert(
        `Simulando contacto con ${
          rental.owner.name || "el proveedor"
        } al email: ${rental.owner.email}`
      );
      // O podrías abrir un cliente de correo: window.location.href = `mailto:${rental.owner.email}?subject=Interés en ${rental.name}`;
    } else {
      alert("Funcionalidad de contacto en desarrollo o sin datos de contacto disponibles públicamente.");
    }
  };

  const handleAddToCart = (rental) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para añadir al carrito.");
      navigate("/login");
      return;
    }
    // Aquí iría la lógica real para añadir al carrito.
    // Podrías usar un contexto de carrito, Redux, o una llamada a la API.
    console.log(`Añadiendo ${rental.name} (ID: ${rental._id}) al carrito.`);
    alert(`"${rental.name}" ha sido añadido al carrito (funcionalidad en desarrollo).`);
  };

  const handleDeleteRental = async (rentalId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta renta?")) {
      try {
        await api.delete(`/rentals/${rentalId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRentals(rentals.filter((r) => r._id !== rentalId));
        alert("Renta eliminada con éxito.");
      } catch (err) {
        console.error("Error eliminando renta:", err);
        alert("Error al eliminar la renta.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-700 text-2xl animate-pulse">
        Cargando rentas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50 text-red-700 text-xl font-semibold">
        Error: {error}
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-700 text-xl p-4">
        <p className="mb-4 text-2xl font-semibold">
          🌱 ¡No se encontraron equipos en renta que coincidan con tu búsqueda!
          {isMyRentalsPage && " Publica uno para que aparezca aquí."}
        </p>
        <Link
          to="/create-rental"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-lg hover:shadow-xl"
        >
          Publica tu Maquinaria Ahora
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center text-green-800 mb-10 drop-shadow-md">
        {isMyRentalsPage
          ? "Mi Maquinaria y Herramientas en Renta"
          : "Maquinaria y Herramientas en Renta"}
      </h1>

      {!isMyRentalsPage && (
        <div className="max-w-4xl mx-auto mb-10 p-6 bg-white rounded-2xl shadow-xl border border-green-100">
          <h2 className="text-2xl font-bold text-green-700 mb-5 text-center">
            Filtra tus Rentas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Buscar por nombre o descripción
              </label>
              <input
                id="search"
                type="text"
                placeholder="Ej: Tractor John Deere..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-400 transition duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Seleccionar Categoría
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-400 transition duration-200 bg-white text-gray-700 appearance-none pr-8 shadow-sm"
                >
                  <option value="">Todas las categorías</option>
                  {rentalCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg
                    className="fill-current h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {rentals.map((rental) => (
          <div
            key={rental._id}
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 relative
            ${
              rental.owner && rental.owner.isPremium // MODIFICADO: rental.user.isPremium por rental.owner.isPremium
                ? "border-4 border-yellow-400 ring-4 ring-yellow-200"
                : "border border-gray-200"
            }`}
          >
            {rental.owner && rental.owner.isPremium && ( // MODIFICADO: rental.user.isPremium por rental.owner.isPremium
              <span className="absolute top-3 right-3 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
                ⭐ Proveedor Premium
              </span>
            )}
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
              <img
                src={rental.imageUrl || "/no-image.png"} // Usar la ruta relativa para la imagen por defecto
                alt={rental.name}
                className="w-full h-full object-cover rounded-t-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/no-image.png"; // Fallback final si la imagen es inaccesible
                }}
              />
            </div>
            <div className="p-5 flex flex-col flex-grow min-h-[180px]">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {rental.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                {rental.description.substring(0, 100)}
                {rental.description.length > 100 ? "..." : ""}
              </p>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                <span className="text-green-700">Categoría:</span>{" "}
                {rental.category}
              </p>
              <p className="text-xl font-extrabold text-blue-700 mb-4">
                COP{" "}
                {rental.pricePerDay
                  ? rental.pricePerDay.toLocaleString("es-CO")
                  : "N/A"}{" "}
                / día
              </p>

              <div className="mt-auto flex flex-col space-y-3 w-full">
                <Link
                  to={`/rentals/${rental._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
                >
                  Ver Detalles
                </Link>

                {isAuthenticated &&
                user &&
                rental.owner && // MODIFICADO: rental.user por rental.owner
                rental.owner._id === user._id ? ( // MODIFICADO: rental.user._id por rental.owner._id
                  <>
                    <Link
                      to={`/edit-rental/${rental._id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
                    >
                      Editar Renta
                    </Link>
                    <button
                      onClick={() => handleDeleteRental(rental._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                    >
                      Eliminar Renta
                    </button>
                  </>
                ) : (
                  <>
                    {/* MODIFICADO: rental.user.phoneNumber por rental.owner.phoneNumber Y añadido rental.owner.showPhoneNumber */}
                    {rental.owner && rental.owner.phoneNumber && rental.owner.showPhoneNumber ? (
                      <button
                        onClick={() => handleContactMe(rental)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <PhoneIcon className="w-5 h-5" />
                        <span>WhatsApp</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleContactMe(rental)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                      >
                        Comunícate Conmigo
                      </button>
                    )}

                    {!isMyRentalsPage && ( // Mostrar "Añadir al Carrito" solo en la página principal, no en "Mis Rentas"
                      <button
                        onClick={() => handleAddToCart(rental)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                      >
                        Añadir al Carrito
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RentalListPage;