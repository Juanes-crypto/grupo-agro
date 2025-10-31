import React, { useState, useContext, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LocationInput from "../components/LocationInput";
import ReCaptcha from "../components/ReCaptcha";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleLocationSelected = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  // Función para obtener token de reCAPTCHA - CORREGIDA para Vite
  const handleGetRecaptchaToken = useCallback(async () => {
    if (window.grecaptcha) {
      try {
        const token = await window.grecaptcha.execute(
          import.meta.env.VITE_RECAPTCHA_SITE_KEY,
          { action: 'register' }
        );
        setRecaptchaToken(token);
        return token;
      } catch (error) {
        console.error('Error al obtener token reCAPTCHA:', error);
        setErrors(['Error de verificación de seguridad. Por favor, recarga la página.']);
        return null;
      }
    }
    return null;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    // Validaciones iniciales
    if (password !== confirmPassword) {
      setErrors(["Las contraseñas no coinciden."]);
      setLoading(false);
      return;
    }

    if (phoneNumber && !/^\d+$/.test(phoneNumber)) {
      setErrors(["El número de teléfono solo debe contener dígitos."]);
      setLoading(false);
      return;
    }

    if (!location) {
      setErrors(["Por favor, selecciona tu ubicación para continuar."]);
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      setErrors(["Debes aceptar los términos y condiciones y política de privacidad para continuar."]);
      setLoading(false);
      return;
    }

    // Obtener token reCAPTCHA
    const token = await handleGetRecaptchaToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);
      formData.append("showPhoneNumber", showPhoneNumber);
      formData.append("recaptchaToken", token);
      
      // Ubicación
      formData.append("locationCity", location.city || "");
      formData.append("locationAddress", location.address || "");
      formData.append("locationLongitude", location.coordinates[0]?.toString() || "");
      formData.append("locationLatitude", location.coordinates[1]?.toString() || "");
      
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE}/api/users/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message && data.message.includes("CAPTCHA") || 
            data.message && data.message.includes("reCAPTCHA")) {
          setErrors([data.message]);
        } else if (data.errors && Array.isArray(data.errors)) {
          const backendErrorMessages = data.errors.map((err) => err.msg);
          setErrors(backendErrorMessages);
        } else if (data.message) {
          setErrors([data.message]);
        } else {
          setErrors(["Error al registrar usuario. Por favor, inténtalo de nuevo."]);
        }
        setLoading(false);
        return;
      }

      if (data.user && data.token) {
        register(data.user, data.token);
        navigate("/profile");
      } else {
        setErrors(["Respuesta inesperada del servidor."]);
      }
    } catch (err) {
      console.error("Error de registro:", err);
      setErrors(["Error de conexión. Por favor, verifica tu internet e inténtalo de nuevo."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-6 p-6 sm:p-8 bg-white rounded-2xl shadow-2xl border border-green-100 transition-all duration-300">
        {/* Header Mejorado */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <img
              className="h-16 w-36 sm:h-20 sm:w-40"
              src="/images/CampoBit-logo.png"
              alt="CampoBit Logo"
            />
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold text-green-800 leading-tight">
                Únete a CampoBit
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Tu comunidad agrícola de confianza
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <span>Compra y vende productos</span>
            <span>Trueques seguros</span>
            <span>Comercio local</span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Grid de Campos del Formulario Mejorado */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Nombre Completo */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Nombre Completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Ej: Juan Esteban García"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700">
                Email *
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="email@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Contraseña *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700">
                Confirmar Contraseña *
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* WhatsApp (Full Width) */}
            <div className="sm:col-span-2 space-y-2">
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700">
                Número de WhatsApp
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Ej: 3001234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Este número podría ser visible para otros usuarios si decides compartirlo
              </p>
            </div>
          </div>

          {/* Checkbox de Compartir WhatsApp */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <input
                id="showPhoneNumber"
                name="showPhoneNumber"
                type="checkbox"
                className="mt-1 focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                checked={showPhoneNumber}
                onChange={(e) => setShowPhoneNumber(e.target.checked)}
              />
              <div>
                <label htmlFor="showPhoneNumber" className="block text-sm font-medium text-gray-700 cursor-pointer">
                  Compartir mi número de WhatsApp
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Recomendado para facilitar la comunicación en servicios y rentas. Otros usuarios podrán ver tu número en tu perfil.
                </p>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Tu Ubicación Principal *
            </label>
            <LocationInput onLocationSelected={handleLocationSelected} />
            <p className="text-xs text-gray-500">
              Esto nos ayudará a mostrarte productos y servicios cercanos a tu ubicación
            </p>
            {location && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                <p className="text-sm text-green-700 font-medium">
                  ✅ Ubicación seleccionada:{" "}
                  <span className="text-gray-800">{location.address}</span>
                </p>
              </div>
            )}
          </div>

          {/* Foto de Perfil */}
          <div className="space-y-2">
            <label htmlFor="profilePicture" className="block text-sm font-semibold text-gray-700">
              Foto de Perfil (Opcional)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="profilePicture"
                className="flex-1 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer transition-colors duration-200"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />
              {profilePicture && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ {profilePicture.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mostrar Errores */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4" role="alert">
              <div className="flex items-center space-x-2 text-red-800 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <strong className="font-semibold">Por favor corrige los siguientes errores:</strong>
              </div>
              <ul className="space-y-1">
                {errors.map((msg, index) => (
                  <li key={index} className="text-sm text-red-700 flex items-center space-x-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{msg}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sección de Términos y Condiciones - MOVIDA ARRIBA DEL BOTÓN */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-800 mb-2">
                  Antes de registrarte, es importante que conozcas:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-amber-100">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-amber-700">Términos y Condiciones</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-amber-100">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-amber-700">Política de Privacidad</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <Link 
                    to="/terms" 
                    className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Leer Términos
                  </Link>
                  <Link 
                    to="/privacy" 
                    className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Leer Política
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Checkbox de Aceptación */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                required
                className="mt-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <label htmlFor="acceptTerms" className="text-sm text-blue-800 cursor-pointer">
                He leído y acepto los{" "}
                <Link to="/terms" className="font-semibold text-blue-600 hover:text-blue-800 underline">
                  Términos y Condiciones
                </Link>{" "}
                y la{" "}
                <Link to="/privacy" className="font-semibold text-blue-600 hover:text-blue-800 underline">
                  Política de Privacidad
                </Link>{" "}
                de CampoBit
              </label>
            </div>
          </div>

          {/* Botón de Registro */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando tu cuenta...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Crear mi cuenta
                </>
              )}
            </button>
          </div>

          {/* Enlace a Login */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="font-semibold text-green-600 hover:text-green-700 transition-colors duration-200 underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>

        {/* Componente reCAPTCHA invisible */}
        <ReCaptcha 
          onTokenChange={setRecaptchaToken} 
          action="register"
        />
      </div>
    </div>
  );
}

export default RegisterPage;