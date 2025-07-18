// src/pages/CartPage.jsx

import React, { useState, useEffect, useContext } from "react";
import api from "../services/api"; // Tu instancia de Axios configurada
import { AuthContext } from "../context/AuthContext"; // Para acceder al usuario autenticado
import { Link } from "react-router-dom"; // Para navegar de vuelta a la lista de productos

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Mensajes de éxito o error para acciones del carrito
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useContext(AuthContext); // Obtener el usuario y estado de autenticación

  // Efecto para cargar el carrito del usuario
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        setError("Debes iniciar sesión para ver tu carrito.");
        return;
      }
      try {
        setLoading(true);
        const response = await api.get("/cart");
        setCart(response.data);
        setError("");
        setMessage("");
      } catch (err) {
        console.error("Error al obtener el carrito:", err);
        setError("Error al cargar el carrito. Inténtalo de nuevo más tarde.");
        setCart(null); // Asegurarse de que el carrito esté vacío en caso de error
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      // Solo intentar cargar el carrito si la autenticación ya ha terminado
      fetchCart();
    }
  }, [isAuthenticated, authLoading]); // Dependencias: se ejecuta cuando cambia el estado de autenticación

  // Función para actualizar la cantidad de un ítem en el carrito
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId); // Si la cantidad es 0 o menos, eliminar el ítem
      return;
    }
    try {
      const response = await api.put(`/cart/${productId}`, {
        quantity: newQuantity,
      });
      setCart(response.data); // Actualiza el estado del carrito con la respuesta del backend
      setMessage("Cantidad actualizada.");
      setError("");
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
      setMessage("");
      setError("Error al actualizar la cantidad. Inténtalo de nuevo.");
    }
  };

  // Función para eliminar un ítem del carrito
  const handleRemoveItem = async (productId) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      setCart(response.data); // Actualiza el estado del carrito
      setMessage("Producto eliminado del carrito.");
      setError("");
    } catch (err) {
      console.error("Error al eliminar producto del carrito:", err);
      setMessage("");
      setError(
        "Error al eliminar el producto del carrito. Inténtalo de nuevo."
      );
    }
  };

  // Función para vaciar todo el carrito
  const handleClearCart = async () => {
    try {
      const response = await api.delete("/cart");
      setCart(response.data); // El carrito estará vacío
      setMessage("Carrito vaciado exitosamente.");
      setError("");
    } catch (err) {
      console.error("Error al vaciar el carrito:", err);
      setMessage("");
      setError("Error al vaciar el carrito. Inténtalo de nuevo.");
    }
  };

  // Calcular el total del carrito
  const calculateTotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return 0;
    }
    return cart.items.reduce(
      (total, item) => total + item.quantity * item.priceAtTime,
      0
    );
  };

  if (loading || authLoading) {
    return <div style={styles.loading}>Cargando carrito...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Tu Carrito de Compras</h2>
        <p style={styles.message}>
          Por favor,{" "}
          <Link to="/login" style={styles.link}>
            inicia sesión
          </Link>{" "}
          para ver tu carrito.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Tu Carrito de Compras</h2>
      {message && (
        <p
          style={
            message.includes("Error")
              ? styles.errorMessage
              : styles.successMessage
          }
        >
          {message}
        </p>
      )}
      {cart && cart.items && cart.items.length > 0 ? (
        <>
          <div style={styles.cartItemsContainer}>
            {cart.items.map((item) => (
              <div key={item.product._id} style={styles.cartItemCard}>
                <img
                  src={
                    item.imageUrlAtTime ||
                    "https://placehold.co/100x100/cccccc/333333?text=No+Image"
                  }
                  alt={item.nameAtTime}
                  style={styles.itemImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/100x100/cccccc/333333?text=No+Image";
                  }}
                />
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemName}>{item.nameAtTime}</h3>
                  <p style={styles.itemPrice}>
                    ${item.priceAtTime.toFixed(2)} c/u
                  </p>
                  <div style={styles.quantityControl}>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product._id,
                          item.quantity - 1
                        )
                      }
                      style={styles.quantityButton}
                    >
                      -
                    </button>
                    <span style={styles.itemQuantity}>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                      style={styles.quantityButton}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.product._id)}
                  style={styles.removeButton}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <div style={styles.cartSummary}>
            <h3 style={styles.cartTotal}>
              Total del Carrito: ${calculateTotal().toFixed(2)}
            </h3>
            <div style={styles.cartActions}>
              <button onClick={handleClearCart} style={styles.clearCartButton}>
                Vaciar Carrito
              </button>
              <Link to="/" style={styles.continueShoppingButton}>
                Seguir Comprando
              </Link>
              <Link to="/checkout" style={styles.checkoutButton}>
                {" "}
                Proceder al Pago
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div style={styles.emptyCart}>
          <p>Tu carrito está vacío.</p>
          <Link to="/" style={styles.link}>
            Volver a la tienda
          </Link>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "50px auto",
    padding: "25px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
    fontSize: "2.5em",
    fontWeight: "600",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.2em",
    color: "#666",
    padding: "50px",
  },
  error: {
    textAlign: "center",
    fontSize: "1.1em",
    color: "#dc3545",
    padding: "20px",
    backgroundColor: "#f8d7da",
    border: "1px solid #f5c6cb",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  errorMessage: {
    textAlign: "center",
    fontSize: "1.0em",
    color: "#dc3545",
    padding: "10px",
    backgroundColor: "#f8d7da",
    border: "1px solid #f5c6cb",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  successMessage: {
    textAlign: "center",
    fontSize: "1.0em",
    color: "#28a745",
    padding: "10px",
    backgroundColor: "#d4edda",
    border: "1px solid #c3e6cb",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  message: {
    textAlign: "center",
    fontSize: "1.1em",
    color: "#555",
    marginBottom: "20px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  cartItemsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "30px",
  },
  cartItemCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  itemImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "5px",
    marginRight: "15px",
  },
  itemDetails: {
    flexGrow: 1,
  },
  itemName: {
    fontSize: "1.2em",
    color: "#007bff",
    marginBottom: "5px",
  },
  itemPrice: {
    fontSize: "1.1em",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  quantityButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    width: "30px",
    height: "30px",
    fontSize: "1.2em",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 0.2s ease",
  },
  quantityButtonHover: {
    backgroundColor: "#0056b3",
  },
  itemQuantity: {
    fontSize: "1.1em",
    fontWeight: "bold",
    color: "#555",
    minWidth: "20px",
    textAlign: "center",
  },
  removeButton: {
    backgroundColor: "#dc3545", // Rojo
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "0.9em",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    marginLeft: "auto", // Empuja el botón a la derecha
  },
  removeButtonHover: {
    backgroundColor: "#c82333",
  },
  cartSummary: {
    borderTop: "1px solid #eee",
    paddingTop: "20px",
    marginTop: "20px",
    textAlign: "right",
  },
  cartTotal: {
    fontSize: "1.8em",
    color: "#333",
    marginBottom: "20px",
  },
  cartActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
  },
  clearCartButton: {
    backgroundColor: "#ffc107", // Amarillo
    color: "#333",
    border: "none",
    borderRadius: "5px",
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  clearCartButtonHover: {
    backgroundColor: "#e0a800",
  },
  continueShoppingButton: {
    backgroundColor: "#6c757d", // Gris
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    textDecoration: "none", // Para Link
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  continueShoppingButtonHover: {
    backgroundColor: "#5a6268",
  },
  checkoutButton: {
    backgroundColor: "#007bff", // Azul
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "1.1em",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  checkoutButtonHover: {
    backgroundColor: "#0056b3",
  },
  emptyCart: {
    textAlign: "center",
    fontSize: "1.2em",
    color: "#888",
    padding: "50px",
  },
};

export default CartPage;
