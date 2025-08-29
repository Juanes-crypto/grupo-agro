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

  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleLocationSelected = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  // Función para obtener token de reCAPTCHA - CORREGIDA para Vite
  const handleGetRecaptchaToken = useCallback(async () => {
    if (window.grecaptcha) {
      try {
        // Usar import.meta.env en lugar de process.env para Vite
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
      formData.append("recaptchaToken", token); // Añadir token reCAPTCHA
      
      // Ubicación
      formData.append("locationCity", location.city || "");
      formData.append("locationAddress", location.address || "");
      formData.append("locationLongitude", location.coordinates[0]?.toString() || "");
      formData.append("locationLatitude", location.coordinates[1]?.toString() || "");
      
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      // Usar import.meta.env para Vite - CORREGIDO
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE}/api/users/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores de reCAPTCHA específicos
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl border border-green-100 transition-all duration-300 transform hover:scale-[1.01]">
        <div className="text-center">
          <img
            className="mx-auto h-20 w-auto"
            src="/images/AgroNet-logo.png"
            alt="AgroNet Logo"
          />
          <h2 className="mt-6 text-center text-4xl font-extrabold text-green-800">
            ¡Únete a la comunidad AgroNet!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Crea tu cuenta para empezar a vender o comprar productos agrícolas.
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
            {/* Campos del formulario (sin cambios) */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Nombre Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                placeholder="Ej: Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                placeholder="email@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Confirmar Contraseña
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Número de WhatsApp
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                placeholder="Ej: 3001234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Este número podría ser visible para otros usuarios si decides
                compartirlo.
              </p>
            </div>
          </div>

          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="showPhoneNumber"
                name="showPhoneNumber"
                type="checkbox"
                className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                checked={showPhoneNumber}
                onChange={(e) => setShowPhoneNumber(e.target.checked)}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="showPhoneNumber"
                className="font-medium text-gray-700 cursor-pointer"
              >
                Compartir mi número de WhatsApp (Recomendado para servicios y
                rentas)
              </label>
              <p className="text-gray-500">
                Permite que otros usuarios vean tu número de WhatsApp en tu
                perfil.
              </p>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tu Ubicación Principal
            </label>
            <LocationInput onLocationSelected={handleLocationSelected} />
            <p className="mt-1 text-xs text-gray-500">
              Esto nos ayudará a mostrarte productos cercanos a ti.
            </p>
            {location && (
              <p className="mt-2 text-sm text-green-600 font-semibold">
                Ubicación seleccionada:{" "}
                <span className="text-gray-900">{location.address}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="profilePicture"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Foto de Perfil (Opcional)
            </label>
            <input
              type="file"
              id="profilePicture"
              className="block w-full text-sm text-gray-700
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-green-50 file:text-green-700
                                hover:file:bg-green-100 cursor-pointer transition-colors duration-200"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
            {profilePicture && (
              <p className="mt-2 text-sm text-gray-500">
                Archivo seleccionado:{" "}
                <span className="font-semibold">{profilePicture.name}</span>
              </p>
            )}
          </div>

          {errors.length > 0 && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-4 shadow-sm"
              role="alert"
            >
              <strong className="font-bold">¡Errores de registro!</strong>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {errors.map((msg, index) => (
                  <li key={index} className="text-sm">
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                "Registrarse"
              )}
            </button>
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