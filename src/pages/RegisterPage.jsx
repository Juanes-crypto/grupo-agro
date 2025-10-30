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
  const [activeStep, setActiveStep] = useState(1);

  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleLocationSelected = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  // Función para obtener token de reCAPTCHA
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

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Elementos de fondo futuristas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
        
        {/* Patrón de hexágonos */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 transform rotate-12 scale-150">
            {[...Array(60)].map((_, i) => (
              <div key={i} className="w-4 h-4 border border-green-300 rounded-lg transform rotate-45"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenedor principal con diseño de "terminal agrícola" */}
      <div className="max-w-4xl w-full space-y-8 p-6 sm:p-8 bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-green-500/30 shadow-2xl transition-all duration-500 relative overflow-hidden">
        
        {/* Efecto de borde luminoso */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl pointer-events-none"></div>
        
        {/* Header con diseño de HUD */}
        <div className="text-center relative z-10">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <div className="relative">
              <img
                className="h-20 w-44 sm:h-24 sm:w-48 filter drop-shadow-lg"
                src="/images/CampoBit-logo.png"
                alt="CampoBit Logo"
              />
              <div className="absolute inset-0 bg-green-500/20 rounded-lg blur-sm"></div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 leading-tight drop-shadow-lg">
                INICIO DE SESIÓN
              </h2>
              <p className="text-sm sm:text-base text-green-300/80 font-mono mt-2 tracking-wider">
                {">"} SISTEMA_AGRICOLA_DIGITAL_V2.0
              </p>
            </div>
          </div>
          
          {/* Indicadores de estado */}
          <div className="flex justify-center space-x-6 text-xs font-mono text-green-400/70">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              CONEXIÓN_ACTIVA
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              SEGURO_SSL
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              ENCRYPTED
            </span>
          </div>
        </div>

        {/* Navegación por pasos */}
        <div className="flex justify-center space-x-4 mb-8 relative z-10">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-mono font-bold text-sm ${
                step === activeStep 
                  ? 'bg-green-500 border-green-400 text-gray-900 shadow-lg shadow-green-500/50' 
                  : step < activeStep
                  ? 'bg-emerald-400 border-emerald-300 text-gray-900'
                  : 'bg-gray-700 border-green-700 text-green-300'
              }`}>
                {step < activeStep ? '✓' : step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  step < activeStep ? 'bg-emerald-400' : 'bg-gray-600'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
          {/* Paso 1: Información Básica */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Nombre Completo */}
                <div className="space-y-3">
                  <label htmlFor="name" className="block text-sm font-bold text-green-400 font-mono uppercase tracking-wider">
                    [NOMBRE_COMPLETO] *
                  </label>
                  <div className="relative group">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="w-full px-6 py-4 bg-gray-800/80 border-2 border-green-700/50 rounded-2xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/20 text-white placeholder-green-300/40 font-mono transition-all duration-300 group-hover:border-green-500/70"
                      placeholder="Ej: Juan Esteban García"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <span className="text-green-500/60">✓</span>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label htmlFor="email-address" className="block text-sm font-bold text-green-400 font-mono uppercase tracking-wider">
                    [EMAIL_PRINCIPAL] *
                  </label>
                  <div className="relative group">
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full px-6 py-4 bg-gray-800/80 border-2 border-green-700/50 rounded-2xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/20 text-white placeholder-green-300/40 font-mono transition-all duration-300 group-hover:border-green-500/70"
                      placeholder="usuario@dominio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <span className="text-green-500/60">@</span>
                    </div>
                  </div>
                </div>

                {/* Contraseña */}
                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-bold text-green-400 font-mono uppercase tracking-wider">
                    [CONTRASEÑA_SEGURA] *
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="w-full px-6 py-4 bg-gray-800/80 border-2 border-green-700/50 rounded-2xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/20 text-white placeholder-green-300/40 font-mono transition-all duration-300 group-hover:border-green-500/70"
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <span className="text-green-500/60">🔒</span>
                    </div>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-3">
                  <label htmlFor="confirm-password" className="block text-sm font-bold text-green-400 font-mono uppercase tracking-wider">
                    [CONFIRMAR_CONTRASEÑA] *
                  </label>
                  <div className="relative group">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="w-full px-6 py-4 bg-gray-800/80 border-2 border-green-700/50 rounded-2xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/20 text-white placeholder-green-300/40 font-mono transition-all duration-300 group-hover:border-green-500/70"
                      placeholder="••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <span className="text-green-500/60">🔐</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón siguiente */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-mono font-bold rounded-2xl border-2 border-green-400/50 hover:border-green-300 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/30"
                >
                  SIGUIENTE [→]
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Contacto y Ubicación */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              {/* WhatsApp */}
              <div className="space-y-3">
                <label htmlFor="phoneNumber" className="block text-sm font-bold text-green-400 font-mono uppercase tracking-wider">
                  [WHATSAPP_OPCIONAL]
                </label>
                <div className="relative group">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    className="w-full px-6 py-4 bg-gray-800/80 border-2 border-green-700/50 rounded-2xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/20 text-white placeholder-green-300/40 font-mono transition-all duration-300 group-hover:border-green-500/70"
                    placeholder="Ej: 3001234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <span className="text-green-500/60">📱</span>
                  </div>
                </div>
                <p className="text-xs text-green-300/60 font-mono">
                  {">"} OPCIONAL: Para comunicación directa en servicios agrícolas
                </p>
              </div>

              {/* Checkbox de Compartir WhatsApp */}
              <div className="bg-gray-800/60 rounded-2xl p-6 border-2 border-green-700/30">
                <div className="flex items-start space-x-4">
                  <input
                    id="showPhoneNumber"
                    name="showPhoneNumber"
                    type="checkbox"
                    className="mt-1 focus:ring-green-500 h-5 w-5 text-green-600 bg-gray-700 border-green-600 rounded-lg"
                    checked={showPhoneNumber}
                    onChange={(e) => setShowPhoneNumber(e.target.checked)}
                  />
                  <div>
                    <label htmlFor="showPhoneNumber" className="block text-sm font-bold text-green-300 font-mono cursor-pointer">
                      [COMPARTIR_WHATSAPP_PUBLICAMENTE]
                    </label>
                    <p className="text-sm text-green-300/60 font-mono mt-1">
                      {">"} RECOMENDADO: Facilita comunicación en trueques y servicios locales
                    </p>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-green-400 font-mono uppercase tracking-wider">
                  [UBICACIÓN_PRINCIPAL] *
                </label>
                <LocationInput onLocationSelected={handleLocationSelected} />
                <p className="text-xs text-green-300/60 font-mono">
                  {">"} CRÍTICO: Para conectar con agricultores y productos de tu zona
                </p>
                {location && (
                  <div className="bg-green-900/40 border-2 border-green-500/50 rounded-2xl p-4 mt-3">
                    <p className="text-sm text-green-300 font-mono font-bold">
                      ✅ UBICACIÓN_CONFIRMADA:{" "}
                      <span className="text-white">{location.address}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Navegación entre pasos */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-green-300 font-mono font-bold rounded-2xl border-2 border-green-700/50 hover:border-green-600 transition-all duration-300 transform hover:scale-105"
                >
                  [←] ANTERIOR
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-mono font-bold rounded-2xl border-2 border-green-400/50 hover:border-green-300 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/30"
                >
                  SIGUIENTE [→]
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Finalización */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Foto de Perfil */}
              <div className="space-y-3">
                <label htmlFor="profilePicture" className="block text-sm font-bold text-green-400 font-mono uppercase tracking-wider">
                  [FOTO_PERFIL_OPCIONAL]
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="profilePicture"
                    className="flex-1 text-sm text-green-300 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-bold file:bg-green-600 file:text-white hover:file:bg-green-500 cursor-pointer transition-colors duration-200 font-mono bg-gray-800/80 rounded-2xl"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                  />
                  {profilePicture && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-green-600 text-white font-mono">
                        ✅ {profilePicture.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Términos y Condiciones */}
              <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border-2 border-amber-600/30 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center">
                      <span className="text-white font-mono text-lg">!</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-amber-400 font-mono mb-3">
                      [ATENCIÓN_LEGAL_REQUERIDA]
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-3 p-3 bg-amber-900/20 rounded-2xl border border-amber-600/30">
                        <span className="text-amber-400 text-lg">⚖️</span>
                        <span className="text-sm font-bold text-amber-300 font-mono">TÉRMINOS_CONDICIONES</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-amber-900/20 rounded-2xl border border-amber-600/30">
                        <span className="text-amber-400 text-lg">🔒</span>
                        <span className="text-sm font-bold text-amber-300 font-mono">POLÍTICA_PRIVACIDAD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkbox de Aceptación */}
              <div className="bg-blue-900/30 border-2 border-blue-600/30 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    required
                    className="mt-1 focus:ring-blue-500 h-5 w-5 text-blue-600 bg-gray-700 border-blue-600 rounded-lg"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-blue-300 font-mono cursor-pointer">
                    CONFIRMO_LECTURA_Y_ACEPTO_LOS{" "}
                    <Link to="/terms" className="font-black text-blue-400 hover:text-blue-300 underline">
                      TÉRMINOS_CONDICIONES
                    </Link>{" "}
                    Y_LA{" "}
                    <Link to="/privacy" className="font-black text-blue-400 hover:text-blue-300 underline">
                      POLÍTICA_PRIVACIDAD
                    </Link>
                  </label>
                </div>
              </div>

              {/* Mostrar Errores */}
              {errors.length > 0 && (
                <div className="bg-red-900/50 border-2 border-red-600/50 rounded-2xl p-6" role="alert">
                  <div className="flex items-center space-x-3 text-red-400 mb-3">
                    <span className="text-lg">⚠️</span>
                    <strong className="font-mono font-bold text-sm">ERROR_DE_SISTEMA:</strong>
                  </div>
                  <ul className="space-y-2">
                    {errors.map((msg, index) => (
                      <li key={index} className="text-sm text-red-300 font-mono flex items-center space-x-3">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span>{msg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navegación final */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-green-300 font-mono font-bold rounded-2xl border-2 border-green-700/50 hover:border-green-600 transition-all duration-300 transform hover:scale-105"
                >
                  [←] ANTERIOR
                </button>
                <button
                  type="submit"
                  className="px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-mono font-black rounded-2xl border-2 border-green-400/50 hover:border-green-300 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-3">⟳</span>
                      PROCESANDO_REGISTRO...
                    </span>
                  ) : (
                    "🚀 ACTIVAR_CUENTA_NOW"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Enlace a Login */}
        <div className="text-center pt-6 border-t border-green-700/30 relative z-10">
          <p className="text-sm text-green-300/70 font-mono">
            ¿TIENES_UNA_CUENTA?{" "}
            <Link
              to="/login"
              className="font-black text-green-400 hover:text-green-300 transition-colors duration-200 underline"
            >
              INICIAR_SESION_AQUI
            </Link>
          </p>
        </div>

        {/* Componente reCAPTCHA invisible */}
        <ReCaptcha 
          onTokenChange={setRecaptchaToken} 
          action="register"
        />
      </div>

      {/* Efectos de partículas (simuladas) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default RegisterPage;