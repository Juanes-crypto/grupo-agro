import React, { useEffect, useImperativeHandle, forwardRef, useState } from 'react';

const ReCaptcha = forwardRef(({ onTokenChange, action = 'submit', onReady }, ref) => {
    const [loadError, setLoadError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadRecaptcha = () => {
            // Verificar si ya está cargado
            if (window.grecaptcha) {
                console.log('✅ reCAPTCHA ya está cargado');
                initializeRecaptcha();
                return;
            }

            console.log('🔄 Cargando script reCAPTCHA...');
            console.log('Site Key:', import.meta.env.VITE_RECAPTCHA_SITE_KEY);
            console.log('Entorno:', import.meta.env.MODE);
            
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                console.log('✅ Script reCAPTCHA cargado');
                setIsLoaded(true);
                initializeRecaptcha();
            };
            
            script.onerror = (error) => {
                console.error('❌ Error al cargar reCAPTCHA:', error);
                setLoadError('No se pudo cargar el sistema de seguridad. Por favor, recarga la página.');
                if (onReady) onReady();
            };
            
            document.head.appendChild(script);
        };

        const initializeRecaptcha = () => {
            if (!window.grecaptcha) {
                console.error('❌ grecaptcha no está definido después de la carga');
                setLoadError('Error de inicialización de seguridad');
                return;
            }

            // Esperar a que reCAPTCHA esté completamente listo
            const checkReady = () => {
                if (window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
                    console.log('✅ reCAPTCHA inicializado exitosamente');
                    if (onReady) onReady();
                } else {
                    console.log('⏳ Esperando inicialización de reCAPTCHA...');
                    setTimeout(checkReady, 100);
                }
            };
            
            checkReady();
        };

        // Solo cargar si tenemos una site key
        if (import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
            loadRecaptcha();
        } else {
            console.error('❌ No se encontró VITE_RECAPTCHA_SITE_KEY');
            setLoadError('Configuración de seguridad incompleta');
        }

        // Cleanup
        return () => {
            // Limpiar si es necesario
        };
    }, [onReady]);

    useImperativeHandle(ref, () => ({
        execute: async () => {
            if (!window.grecaptcha) {
                throw new Error('reCAPTCHA no está disponible');
            }
            
            try {
                console.log('🎯 Ejecutando reCAPTCHA...');
                const token = await window.grecaptcha.execute(
                    import.meta.env.VITE_RECAPTCHA_SITE_KEY,
                    { action }
                );
                console.log('✅ Token reCAPTCHA generado');
                return token;
            } catch (error) {
                console.error('❌ Error ejecutando reCAPTCHA:', error);
                throw error;
            }
        },
        reset: () => {
            if (window.grecaptcha && window.grecaptcha.reset) {
                window.grecaptcha.reset();
            }
        },
        isReady: () => {
            return !!(window.grecaptcha && typeof window.grecaptcha.execute === 'function');
        }
    }));

    return (
        <div>
            {/* Este div es necesario para reCAPTCHA V3 invisible */}
            <div
                className="g-recaptcha"
                data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                data-size="invisible"
            />
            
            {/* Mostrar errores de carga */}
            {loadError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-700 text-sm">{loadError}</span>
                    </div>
                </div>
            )}
            
            {/* Estado de carga */}
            {!isLoaded && !loadError && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-blue-700 text-sm">Cargando sistema de seguridad...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

ReCaptcha.displayName = 'ReCaptcha';

export default ReCaptcha;