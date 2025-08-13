// src/pages/EditServicePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import PublicationForm from '../components/PublicationForm';

const EditServicePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const categories = [
        'Análisis de Suelos', 'Asesoría Agrícola', 'Transporte de Productos',
        'Mantenimiento de Maquinaria', 'Control de Plagas', 'Diseño de Paisajes',
        'Cursos y Capacitación', 'Servicios de Cosecha', 'Riego y Drenaje', 'Otros'
    ];

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await api.get(`/services/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setService({
                    ...response.data,
                    specificData: {
                        duration: response.data.duration
                    }
                });
            } catch (err) {
                setError('No se pudo cargar el servicio');
                console.error('Error fetching service:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id, token]);

    const handleSubmit = async (formData) => {
        setSubmitting(true);
        try {
            await api.put(`/services/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/mis-servicios', { state: { message: 'Servicio actualizado correctamente' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar el servicio');
            console.error('Error updating service:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Cargando servicio...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PublicationForm
                type="servicio"
                publication={service}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/mis-servicios')}
                loading={submitting}
                categories={categories}
            />
        </div>
    );
};

export default EditServicePage;