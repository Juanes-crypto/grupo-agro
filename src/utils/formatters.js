// frontend/src/utils/formatters.js

/**
 * Formatea un número como moneda colombiana (COP).
 * @param {number} amount - El número a formatear.
 * @returns {string} El valor formateado con el símbolo de moneda.
 */
export const formatPrice = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    
    // Configuración para el formato de pesos colombianos
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0, // Usualmente se usa 0 para COP
    }).format(amount);
};