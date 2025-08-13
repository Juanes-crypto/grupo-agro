// src/components/PublicationForm.jsx
import React, { useState } from 'react';
import { FiImage, FiTrash2 } from 'react-icons/fi';

const PublicationForm = ({
    type, // 'producto', 'servicio' o 'renta'
    publication,
    onSubmit,
    onCancel,
    loading,
    categories,
    specificFields,
    units = ['kg', 'litro', 'unidad', 'docena', 'bulto', 'gr']
}) => {
    const [formData, setFormData] = useState({
        name: publication?.name || '',
        description: publication?.description || '',
        price: publication?.price || '',
        category: publication?.category || '',
        isTradable: publication?.isTradable || false,
        ...publication?.specificData // Campos específicos del tipo
    });

    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(publication?.imageUrl || '');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.description || !formData.price || !formData.category) {
            setError('Por favor completa todos los campos requeridos');
            return;
        }
        if (!publication && !image && !previewUrl) {
            setError('Por favor selecciona una imagen');
            return;
        }
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('isTradable', formData.isTradable);
        
        // Campos específicos
        Object.entries(formData.specificData || {}).forEach(([key, value]) => {
            data.append(key, value);
        });

        if (image) {
            data.append('image', image);
        }

        onSubmit(data);
    };

    const renderSpecificFields = () => {
        switch(type) {
            case 'producto':
                return (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.specificData?.stock || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            stock: e.target.value
                                        }
                                    }))}
                                    className="w-full p-2 border rounded"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                                <select
                                    name="unit"
                                    value={formData.specificData?.unit || 'kg'}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            unit: e.target.value
                                        }
                                    }))}
                                    className="w-full p-2 border rounded"
                                >
                                    {units.map(unit => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </>
                );
            case 'servicio':
                return (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.specificData?.duration || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                specificData: {
                                    ...prev.specificData,
                                    duration: e.target.value
                                }
                            }))}
                            placeholder="Ej: 2 horas, 1 día, etc."
                            className="w-full p-2 border rounded"
                        />
                    </div>
                );
            case 'renta':
                return (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio por día (COP)</label>
                        <input
                            type="number"
                            name="pricePerDay"
                            value={formData.specificData?.pricePerDay || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                specificData: {
                                    ...prev.specificData,
                                    pricePerDay: e.target.value
                                }
                            }))}
                            className="w-full p-2 border rounded"
                            min="0"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {publication ? `Editar ${type}` : `Crear nuevo ${type}`}
            </h2>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio (COP)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {renderSpecificFields()}

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isTradable"
                        name="isTradable"
                        checked={formData.isTradable}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 rounded"
                    />
                    <label htmlFor="isTradable" className="ml-2 text-sm text-gray-700">
                        ¿Acepta trueque?
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen del {type}
                    </label>
                    <div className="flex items-center space-x-4">
                        <label className="flex flex-col items-center px-4 py-2 bg-white text-blue-500 rounded-lg border border-blue-500 cursor-pointer hover:bg-blue-50">
                            <FiImage className="text-lg" />
                            <span className="mt-1 text-sm">Seleccionar imagen</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                        {previewUrl && (
                            <div className="relative">
                                <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setPreviewUrl('');
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <FiTrash2 size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                    {!publication && !previewUrl && (
                        <p className="text-xs text-red-500 mt-1">Debes seleccionar una imagen</p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PublicationForm;