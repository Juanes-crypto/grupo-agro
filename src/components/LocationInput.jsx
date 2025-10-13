import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

// Reemplaza con tu token de acceso de Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoibm9tYWRpYzMzIiwiYSI6ImNtZXN6cTBtcjA4N2IybW80dXd3YWNtcDQifQ.XJxIgSuHYjanAXiVfHIFug';

const LocationInput = ({ onLocationSelected }) => {
    const geocoderContainerRef = useRef(null);
    const geocoderRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!geocoderRef.current) {
            const geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                placeholder: 'Busca tu ciudad o dirección...',
                marker: false,
                countries: 'co',
                language: 'es',
                types: 'place,locality,neighborhood,address',
                // Configuraciones para mejorar la experiencia
                zoom: 12,
                proximity: { longitude: -74.0817, latitude: 4.6097 }, // Coordenadas de Bogotá como centro
                // Limitar búsquedas a Colombia
                bbox: [-79.0, -4.0, -66.0, 13.0], // Aproximadamente los límites de Colombia
            });

            geocoderRef.current = geocoder;

            if (geocoderContainerRef.current) {
                geocoder.addTo(geocoderContainerRef.current);
                
                // Aplicar estilos personalizados después de que el componente se monte
                setTimeout(() => {
                    const inputElement = geocoderContainerRef.current?.querySelector('.mapboxgl-ctrl-geocoder--input');
                    if (inputElement) {
                        // Aplicar estilos personalizados al input
                        inputElement.className = '';
                        inputElement.style.cssText = `
                            width: 100%;
                            padding: 12px 45px 12px 16px;
                            border: 1px solid #d1d5db;
                            border-radius: 12px;
                            font-size: 16px;
                            background: white;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                        `;
                        
                        // Estilos para el estado de focus
                        inputElement.addEventListener('focus', () => {
                            inputElement.style.borderColor = '#10b981';
                            inputElement.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                            inputElement.style.outline = 'none';
                            setIsFocused(true);
                        });
                        
                        inputElement.addEventListener('blur', () => {
                            inputElement.style.borderColor = '#d1d5db';
                            inputElement.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                            setIsFocused(false);
                        });

                        // Ocultar el icono de lupa por defecto de Mapbox
                        const searchIcon = geocoderContainerRef.current?.querySelector('.mapboxgl-ctrl-geocoder--icon-search');
                        if (searchIcon) {
                            searchIcon.style.display = 'none';
                        }

                        // Ocultar el icono de loading
                        const loadingIcon = geocoderContainerRef.current?.querySelector('.mapboxgl-ctrl-geocoder--icon-loading');
                        if (loadingIcon) {
                            loadingIcon.style.display = 'none';
                        }

                        // Ocultar el botón de limpiar por defecto
                        const clearButton = geocoderContainerRef.current?.querySelector('.mapboxgl-ctrl-geocoder--button');
                        if (clearButton) {
                            clearButton.style.display = 'none';
                        }
                    }

                    // Estilos para el contenedor de sugerencias
                    const suggestionsContainer = geocoderContainerRef.current?.querySelector('.suggestions');
                    if (suggestionsContainer) {
                        suggestionsContainer.style.cssText = `
                            background: white;
                            border: 1px solid #e5e7eb;
                            border-radius: 12px;
                            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                            margin-top: 8px;
                            overflow: hidden;
                            z-index: 50;
                        `;
                    }
                }, 100);
            }
        }

        const handleResult = (e) => {
            const feature = e.result;
            const locationData = {
                city: feature.context.find(c => c.id.startsWith('place'))?.text || feature.place_name.split(',')[0],
                address: feature.place_name,
                coordinates: feature.geometry.coordinates,
            };
            onLocationSelected(locationData);
        };

        geocoderRef.current.on('result', handleResult);

        return () => {
            if (geocoderRef.current) {
                geocoderRef.current.off('result', handleResult);
                geocoderRef.current.onRemove();
                geocoderRef.current = null;
            }
        };
    }, [onLocationSelected]);

    return (
        <div className="relative w-full">
            {/* Nuestro icono de ubicación personalizado */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <svg 
                    className={`h-5 w-5 transition-colors duration-200 ${
                        isFocused ? 'text-green-500' : 'text-gray-400'
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                    />
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                </svg>
            </div>

            {/* Contenedor del geocoder de Mapbox */}
            <div 
                ref={geocoderContainerRef} 
                className="geocoder-container w-full"
                style={{
                    position: 'relative',
                }}
            />

            {/* Estilos adicionales para personalizar completamente el geocoder */}
            <style jsx>{`
                .geocoder-container :global(.mapboxgl-ctrl-geocoder) {
                    width: 100% !important;
                    max-width: none !important;
                    font-size: 16px !important;
                    border-radius: 12px !important;
                    border: 1px solid #d1d5db !important;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
                    background: white !important;
                    min-height: 48px !important;
                }

                .geocoder-container :global(.mapboxgl-ctrl-geocoder--input) {
                    height: 48px !important;
                    padding: 12px 45px 12px 45px !important;
                    border: none !important;
                    border-radius: 12px !important;
                    font-size: 16px !important;
                    background: transparent !important;
                    color: #374151 !important;
                }

                .geocoder-container :global(.mapboxgl-ctrl-geocoder--input:focus) {
                    outline: none !important;
                    box-shadow: none !important;
                    border: none !important;
                }

                .geocoder-container :global(.mapboxgl-ctrl-geocoder--input::placeholder) {
                    color: #9ca3af !important;
                    font-size: 16px !important;
                }

                .geocoder-container :global(.mapboxgl-ctrl-geocoder--icon) {
                    display: none !important;
                }

                .geocoder-container :global(.mapboxgl-ctrl-geocoder--button) {
                    display: none !important;
                }

                .geocoder-container :global(.suggestions) {
                    background: white !important;
                    border: 1px solid #e5e7eb !important;
                    border-radius: 12px !important;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
                    margin-top: 8px !important;
                    overflow: hidden !important;
                    z-index: 50 !important;
                }

                .geocoder-container :global(.suggestions > div > .active) {
                    background: #f0fdf4 !important;
                    color: #065f46 !important;
                }

                .geocoder-container :global(.suggestions > div > a) {
                    padding: 12px 16px !important;
                    border-bottom: 1px solid #f3f4f6 !important;
                    color: #374151 !important;
                    text-decoration: none !important;
                    display: block !important;
                    transition: background-color 0.15s ease !important;
                }

                .geocoder-container :global(.suggestions > div > a:hover) {
                    background: #f0fdf4 !important;
                    color: #065f46 !important;
                }

                .geocoder-container :global(.suggestions > div > a:last-child) {
                    border-bottom: none !important;
                }
            `}</style>
        </div>
    );
};

export default LocationInput;