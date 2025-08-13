// src/pages/EditRentalPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import PublicationForm from '../components/PublicationForm';

const EditRentalPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [rental, setRental] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const categories = [
        "Tractores", "Arados", "Sembradoras", "Cosechadoras", "Sistemas de Riego",
        "Herramientas Manuales", "Vehículos Utilitarios", "Drones Agrícolas", 
        "Equipos de Fumigación", "Otros"
    ];

    useEffect(() => {
        const fetchRental = async () => {
            try {
                const response = await api.get(`/rentals/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRental({
                    ...response.data,
                    specificData: {
                        pricePerDay: response.data.pricePerDay
                    }
                });
            } catch (err) {
                setError('No se pudo cargar la renta');
                console.error('Error fetching rental:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRental();
    }, [id, token]);

    const handleSubmit = async (formData) => {
        setSubmitting(true);
        try {
            await api.put(`/rentals/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/mis-rentas', { state: { message: 'Renta actualizada correctamente' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar la renta');
            console.error('Error updating rental:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Cargando renta...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PublicationForm
                type="renta"
                publication={rental}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/mis-rentas')}
                loading={submitting}
                categories={categories}
            />
        </div>
    );
};

export default EditRentalPage;