// src/pages/EditProductPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import PublicationForm from '../components/PublicationForm';

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const categories = [
        'Frutas', 'Verduras', 'Granos', 'Lácteos', 'Carnes',
        'Cereales', 'Legumbres', 'Pescados', 'Huevos', 'Miel',
        'Plantas', 'Semillas', 'Fitosanitarios', 'Fertilizantes', 'Maquinaria', 'Otros'
    ];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProduct({
                    ...response.data,
                    specificData: {
                        stock: response.data.stock,
                        unit: response.data.unit
                    }
                });
            } catch (err) {
                setError('No se pudo cargar el producto');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, token]);

    const handleSubmit = async (formData) => {
        setSubmitting(true);
        try {
            await api.put(`/api/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/my-products', { state: { message: 'Producto actualizado correctamente' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar el producto');
            console.error('Error updating product:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Cargando producto...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PublicationForm
                type="producto"
                publication={product}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/mis-productos')}
                loading={submitting}
                categories={categories}
            />
        </div>
    );
};

export default EditProductPage;