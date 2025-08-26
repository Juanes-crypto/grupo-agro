import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

// Reemplaza con tu token de acceso de Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoibm9tYWRpYzMzIiwiYSI6ImNtZXN6cTBtcjA4N2IybW80dXd3YWNtcDQifQ.XJxIgSuHYjanAXiVfHIFug';

const LocationInput = ({ onLocationSelected }) => {
    const geocoderContainerRef = useRef(null);
    // ⭐ CREA una referencia para la instancia del geocodificador ⭐
    const geocoderRef = useRef(null);

    useEffect(() => {
        // Solo inicializa el geocodificador si no existe ya
        if (!geocoderRef.current) {
            const geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                placeholder: 'Busca tu ciudad o dirección',
                marker: false,
                countries: 'co', 
            });

            // ⭐ Guarda la instancia en la referencia para poder limpiarla después ⭐
            geocoderRef.current = geocoder;

            // Agrega el geocodificador al DOM
            if (geocoderContainerRef.current) {
                geocoder.addTo(geocoderContainerRef.current);
            }
        }
        
        // ⭐ Define la función de escucha aquí para poder referenciarla luego ⭐
        const handleResult = (e) => {
            const feature = e.result;
            const locationData = {
                city: feature.context.find(c => c.id.startsWith('place'))?.text || feature.place_name.split(',')[0],
                address: feature.place_name,
                coordinates: feature.geometry.coordinates,
            };
            onLocationSelected(locationData);
        };

        // Escucha el evento 'result'
        geocoderRef.current.on('result', handleResult);

        // La función de limpieza
        return () => {
            if (geocoderRef.current) {
                // Remueve el listener del evento
                geocoderRef.current.off('result', handleResult);
                // Remueve el control del DOM para evitar fugas de memoria
                geocoderRef.current.onRemove();
                // Limpia la referencia
                geocoderRef.current = null;
            }
        };
    }, [onLocationSelected]);

    return <div ref={geocoderContainerRef} className="geocoder-container w-full"></div>;
};

export default LocationInput;