import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { 
  FiMail, 
  FiTrash2, 
  FiEdit, 
  FiStar 
} from 'react-icons/fi';
import { 
  FaWhatsapp, 
  FaCrown 
} from 'react-icons/fa';

/**
 * Componente que muestra una tarjeta individual de renta.
 * @param {Object} props
 * @param {Object} props.rental - Objeto de la renta a mostrar.
 * @param {boolean} props.isPremium - Indica si la tarjeta debe tener estilo premium.
 * @param {boolean} props.isMyRentalsPage - Indica si se está en la página de "Mis Rentas".
 * @param {Function} props.setRentals - Función para actualizar la lista de rentas.
 */
function RentalCard({ rental, isPremium = false, isMyRentalsPage, setRentals }) {
  const { isAuthenticated, user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleContactMe = (rental) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para contactar al proveedor.");
      navigate("/login");
      return;
    }

    if (rental.owner && rental.owner.phoneNumber && rental.owner.showPhoneNumber) {
      const whatsappMessage = `Hola, estoy interesado en tu equipo en renta: ${rental.name} (ID: ${rental._id}). ¿Podrías darme más información?`;
      window.open(
        `https://wa.me/${rental.owner.phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`,
        "_blank"
      );
    } else if (rental.owner && rental.owner.email) {
      window.location.href = `mailto:${rental.owner.email}?subject=Interés en ${rental.name}`;
    } else {
      alert("El proveedor no ha habilitado opciones de contacto público.");
    }
  };

  const handleDeleteRental = async (rentalId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta renta?")) {
      try {
        await api.delete(`/rentals/${rentalId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRentals(prevRentals => prevRentals.filter((r) => r._id !== rentalId));
        alert("Renta eliminada con éxito.");
      } catch (err) {
        console.error("Error eliminando renta:", err);
        alert("Error al eliminar la renta.");
      }
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden flex flex-col transition-all duration-300 transform hover:scale-[1.02] group
      ${isPremium ?
        'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-300 shadow-xl' :
        'bg-white border border-gray-200 shadow-md hover:shadow-lg'
      }`}
    >
      {/* Premium badge */}
      {isPremium && (
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            <FaCrown className="mr-1" /> PREMIUM
          </div>
        </div>
      )}

      {/* Rental image */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={rental.imageUrl || 'https://via.placeholder.com/400x300?text=Maquinaria+Agro'}
          alt={rental.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+No+Disponible'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Rental details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-900 leading-tight">{rental.name}</h2>
          <span className="text-xl font-extrabold text-blue-700">
            ${rental.pricePerDay ? rental.pricePerDay.toLocaleString('es-CO') : 'N/A'} <span className="text-sm font-normal">/día</span>
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{rental.description}</p>
        
        <div className="flex justify-between items-center mb-3 text-xs">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{rental.category}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {rental.availability || 'DISPONIBLE'}
          </span>
        </div>

        {rental.owner && (
          <div className="flex items-center text-xs text-gray-500 mb-4">
            <span className="font-medium text-gray-700">Proveedor: {rental.owner.name || 'Anónimo'}</span>
            {rental.owner.isPremium && <FiStar className="ml-1 text-yellow-500" />}
          </div>
        )}

        <div className="mt-auto flex flex-col space-y-2 w-full">
          <Link
            to={`/rentals/${rental._id}`}
            className={`text-center py-2 px-4 rounded-lg transition duration-300 text-sm font-semibold
              ${isPremium ?
                'bg-amber-600 hover:bg-amber-700 text-white' :
                'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            Ver Detalles
          </Link>

          {isAuthenticated && user && (
            <>
              {isMyRentalsPage ? (
                <>
                  <Link
                    to={`/edit-rental/${rental._id}`}
                    className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
                  >
                    <FiEdit className="mr-2" /> Editar
                  </Link>
                  <button
                    onClick={() => handleDeleteRental(rental._id)}
                    className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
                  >
                    <FiTrash2 className="mr-2" /> Eliminar
                  </button>
                </>
              ) : (
                rental.owner && user && rental.owner._id !== user._id && (
                  <>
                    {rental.owner && rental.owner.phoneNumber && rental.owner.showPhoneNumber ? (
                      <button
                        onClick={() => handleContactMe(rental)}
                        className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
                      >
                        <FaWhatsapp className="mr-2" /> WhatsApp
                      </button>
                    ) : (
                      rental.owner && rental.owner.email && (
                        <button
                          onClick={() => handleContactMe(rental)}
                          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
                        >
                          <FiMail className="mr-2" /> Contactar por Email
                        </button>
                      )
                    )}
                  </>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RentalCard;