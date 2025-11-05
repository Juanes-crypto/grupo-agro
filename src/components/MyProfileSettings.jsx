import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const MyProfileSettings = () => {
    const { user, updateUser, token } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        showPhoneNumber: false,
    });
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                showPhoneNumber: user.showPhoneNumber || false,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        setProfilePictureFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phoneNumber', formData.phoneNumber);
        data.append('showPhoneNumber', formData.showPhoneNumber);

        if (profilePictureFile) {
            data.append('profilePicture', profilePictureFile);
        }

        try {
            const res = await api.put('/api/users/profile', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.token && res.data._id) {
                updateUser(res.data);
            } else {
                updateUser({ ...user, ...res.data });
            }

            setIsEditing(false);
            setProfilePictureFile(null);
            toast.success('Perfil actualizado correctamente.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al actualizar el perfil.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <div className="text-center text-gray-500">Cargando perfil...</div>;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil y Configuración</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Número de Teléfono</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100"
                        />
                    </div>
                    <div className="flex items-center mb-4">
                        <input
                            id="showPhoneNumber"
                            type="checkbox"
                            name="showPhoneNumber"
                            checked={formData.showPhoneNumber}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="showPhoneNumber" className="ml-2 block text-sm text-gray-900">
                            Mostrar mi número de teléfono en mis publicaciones
                        </label>
                    </div>
                    {isEditing && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
                            <input
                                type="file"
                                name="profilePicture"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            />
                            {user.profilePicture && !profilePictureFile && (
                                <div className="mt-2 flex items-center space-x-2">
                                    <img src={user.profilePicture} alt="Perfil" className="h-10 w-10 rounded-full object-cover" />
                                    <p className="text-xs text-gray-500">Imagen actual</p>
                                </div>
                            )}
                            {profilePictureFile && (
                                <p className="text-xs text-green-600 mt-1">
                                    Listo para subir: {profilePictureFile.name}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setProfilePictureFile(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
                            >
                                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-200"
                        >
                            Editar Perfil
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default MyProfileSettings;