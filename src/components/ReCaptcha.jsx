import { useEffect, useRef, useCallback } from 'react';

const ReCaptcha = ({ onTokenChange, action }) => {
  const recaptchaRef = useRef();

  // Función para obtener token
  const getToken = useCallback(async () => {
    if (!window.grecaptcha) {
      console.error('reCAPTCHA no está disponible');
      return null;
    }

    try {
      // Usar import.meta.env en lugar de process.env para Vite
      const token = await window.grecaptcha.execute(
        import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        { action }
      );
      
      if (onTokenChange) {
        onTokenChange(token);
      }
      
      return token;
    } catch (error) {
      console.error('Error al ejecutar reCAPTCHA:', error);
      return null;
    }
  }, [action, onTokenChange]);

// En ReCaptcha.jsx - Añadir función para resetear
const resetRecaptcha = useCallback(() => {
  if (window.grecaptcha) {
    window.grecaptcha.reset();
  }
}, []);

// Exponer la función globalmente
useEffect(() => {
  window.resetRecaptcha = resetRecaptcha;
  return () => {
    delete window.resetRecaptcha;
  };
}, [resetRecaptcha]);

  useEffect(() => {
    // Si reCAPTCHA ya está cargado
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        recaptchaRef.current = window.grecaptcha;
        console.log('reCAPTCHA ya estaba cargado');
      });
      return;
    }

    // Cargar script de reCAPTCHA - Usar import.meta.env para Vite
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.id = 'recaptcha-script';
    
    script.addEventListener('load', () => {
      console.log('reCAPTCHA script loaded successfully');
      window.grecaptcha.ready(() => {
        recaptchaRef.current = window.grecaptcha;
        console.log('reCAPTCHA initialized successfully');
      });
    });
    
    script.addEventListener('error', () => {
      console.error('Failed to load reCAPTCHA script');
    });
    
    // Evitar duplicados
    if (!document.getElementById('recaptcha-script')) {
      document.body.appendChild(script);
    }

    return () => {
      // No remover el script para evitar recargas innecesarias
    };
  }, []);

  // Exponer la función getToken globalmente para uso en forms
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.getRecaptchaToken = getToken;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.getRecaptchaToken;
      }
    };
  }, [getToken]);

  return null; // reCAPTCHA v3 es invisible
};

export default ReCaptcha;