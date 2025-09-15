// components/ReCaptcha.jsx
import React, { useEffect, useImperativeHandle, forwardRef } from 'react';

const ReCaptcha = forwardRef(({ onTokenChange, action = 'submit', onReady }, ref) => {
    useEffect(() => {
        const loadRecaptcha = () => {
            if (window.grecaptcha) {
                console.log('✅ reCAPTCHA ya está cargado');
                initializeRecaptcha();
                return;
            }

            console.log('🔄 Cargando script reCAPTCHA...');
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log('✅ Script reCAPTCHA cargado');
                initializeRecaptcha();
            };
            script.onerror = () => {
                console.error('❌ Error al cargar reCAPTCHA');
                if (onReady) onReady();
            };
            document.head.appendChild(script);
        };

        const initializeRecaptcha = () => {
            if (!window.grecaptcha) {
                console.error('❌ grecaptcha no está definido');
                return;
            }

            console.log('✅ reCAPTCHA inicializado exitosamente');
            if (onReady) onReady();
        };

        loadRecaptcha();
    }, [onReady]);

    useImperativeHandle(ref, () => ({
        execute: async () => {
            if (!window.grecaptcha) {
                throw new Error('reCAPTCHA no está disponible');
            }
            return await window.grecaptcha.execute(
                import.meta.env.VITE_RECAPTCHA_SITE_KEY,
                { action }
            );
        },
        reset: () => {
            if (window.grecaptcha) {
                window.grecaptcha.reset();
            }
        }
    }));

    return (
        <div
            className="g-recaptcha"
            data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            data-size="invisible"
        />
    );
});

ReCaptcha.displayName = 'ReCaptcha';

export default ReCaptcha;