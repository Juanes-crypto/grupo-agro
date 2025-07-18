// src/pages/EditProductPage.jsx

import React from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el ID del producto de la URL

function EditProductPage() {
  const { id } = useParams(); // Captura el ID de la URL
  return (
    <div>
      <h2>Editar Producto</h2>
      <p>Editando producto con ID: <strong>{id}</strong></p>
      <p>Aquí irá el formulario para editar productos.</p>
    </div>
  );
}

export default EditProductPage;