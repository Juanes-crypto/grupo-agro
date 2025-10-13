import React, { useEffect } from 'react';
import { 
  LockClosedIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const PrivacyPage = () => {
  useEffect(() => {
    document.title = "Política de Privacidad | CampoBit";
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full mb-6 shadow-sm">
          <ShieldCheckIcon className="h-6 w-6" />
          <span className="font-semibold text-lg">Protección de Tus Datos Personales</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidad</h1>
        <p className="text-xl text-gray-600 mb-2">CampoBit - Plataforma Agropecuaria</p>
        <p className="text-lg text-gray-500">Cumplimiento con la Ley 1581 de 2012 de Colombia</p>
      </div>

      {/* Advertencia Importante */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-yellow-800 text-lg mb-2">¡ATENCIÓN! ESTO ES MUY IMPORTANTE</h3>
            <p className="text-yellow-700">
              Esta política explica <strong>QUÉ hacemos con tu información personal</strong>, 
              <strong>CÓMO la protegemos</strong> y <strong>QUÉ derechos tienes</strong> según la ley colombiana. 
              Por favor léela completa y con cuidado.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Sección 1: Quiénes Somos */}
        <section className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-green-700">
            <UserIcon className="h-6 w-6" />
            1. ¿QUIÉNES SOMOS Y QUÉ HACEMOS?
          </h2>
          <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
            <p>
              <strong>CampoBit</strong> es una plataforma digital donde puedes:
            </p>
            <ul className="list-disc pl-8 space-y-3">
              <li><strong>VENDER</strong> tus productos agrícolas (café, plátano, maíz, etc.)</li>
              <li><strong>COMPRAR</strong> productos de otros agricultores</li>
              <li><strong>OFERTAR SERVICIOS</strong> como transporte, cosecha, siembra</li>
              <li><strong>ALQUILAR</strong> equipos o fincas a otros campesinos</li>
            </ul>
            <p className="bg-green-50 p-4 rounded-lg border border-green-200">
              <strong>Importante:</strong> Para que todo funcione, necesitamos algunos de tus datos personales. 
              <strong> JAMÁS</strong> los venderemos ni compartiremos sin tu permiso.
            </p>
          </div>
        </section>

        {/* Sección 2: Datos que Recopilamos */}
        <section className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-blue-700">
            <DevicePhoneMobileIcon className="h-6 w-6" />
            2. ¿QUÉ DATOS PERSONALES GUARDAMOS DE TI?
          </h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <PhoneIcon className="h-5 w-5" />
                NÚMERO DE WHATSAPP (OBLIGATORIO)
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-blue-900">
                <li><strong>PARA QUÉ lo usamos:</strong> Para que compradores y vendedores puedan contactarse directamente</li>
                <li><strong>QUIÉN lo ve:</strong> Solo los usuarios interesados en tus productos/servicios</li>
                <li><strong>CÓMO lo protegemos:</strong> No se muestra públicamente, solo a usuarios registrados</li>
              </ul>
            </div>

            <div className="bg-green-50 p-5 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5" />
                CORREO ELECTRÓNICO (OBLIGATORIO)
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-green-900">
                <li><strong>PARA QUÉ lo usamos:</strong> Para recuperar tu cuenta si olvidas la contraseña</li>
                <li><strong>QUIÉN lo ve:</strong> Solo la plataforma CampoBit (NO otros usuarios)</li>
                <li><strong>CÓMO lo protegemos:</strong> Está encriptado y seguro en nuestra base de datos</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                UBICACIÓN (OBLIGATORIO)
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-purple-900">
                <li><strong>QUÉ guardaremos:</strong> Solo tu municipio y departamento (NO dirección exacta)</li>
                <li><strong>PARA QUÉ servirá:</strong> Para mostrar productos y servicios cercanos a tu zona</li>
                <li><strong>EJEMPLO:</strong> "Productos disponibles en Antioquia" sin mostrar tu finca exacta</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sección 3: Tus Derechos */}
        <section className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-purple-700">
            <DocumentTextIcon className="h-6 w-6" />
            3. TUS DERECHOS SEGÚN LA LEY COLOMBIANA
          </h2>
          
          <div className="bg-purple-50 p-6 rounded-lg mb-6">
            <p className="text-purple-800 text-lg font-semibold mb-4">
              La Ley 1581 de 2012 te da estos derechos sobre tus datos personales:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                DERECHO A SABER
              </h3>
              <p className="text-gray-700">
                Puedes preguntarnos <strong>QUÉ datos tenemos de ti</strong> y <strong>CÓMO los estamos usando</strong>.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                DERECHO A CORREGIR
              </h3>
              <p className="text-gray-700">
                Si tu información está <strong>equivocada o desactualizada</strong>, puedes pedir que la corrijamos.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                DERECHO A ELIMINAR
              </h3>
              <p className="text-gray-700">
                Puedes solicitar que <strong>BORREMOS toda tu información</strong> de nuestra plataforma.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                DERECHO A RECLAMAR
              </h3>
              <p className="text-gray-700">
                Si no atendemos tu solicitud, puedes reclamar ante la <strong>Superintendencia de Industria y Comercio</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Sección 4: Cómo Ejercer Tus Derechos */}
        <section className="bg-green-50 p-8 rounded-xl border border-green-200">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-green-800">
            <EnvelopeIcon className="h-6 w-6" />
            4. ¿CÓMO EJERCER TUS DERECHOS?
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">PASO A PASO:</h3>
              <ol className="list-decimal pl-6 space-y-4 text-gray-700 text-lg">
                <li>
                  <strong>Escribe un correo electrónico</strong> a:{' '}
                  <a href="mailto:campobitsuport@gmail.com" className="text-green-600 hover:underline font-semibold">
                    campobitsuport@gmail.com
                  </a>
                </li>
                <li>
                  <strong>Incluye esta información obligatoria:</strong>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Tu nombre completo</li>
                    <li>Número de WhatsApp que registraste</li>
                    <li>Tu solicitud específica (qué quieres saber, corregir o eliminar)</li>
                  </ul>
                </li>
                <li>
                  <strong>Te responderemos máximo en 10 días hábiles</strong> según la ley colombiana
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">EJEMPLO DE SOLICITUD:</h4>
              <p className="text-yellow-700 text-sm">
                "Buenos días, soy María González, mi WhatsApp es 3101234567. 
                Quiero saber qué datos tienen guardados de mí en CampoBit."
              </p>
            </div>
          </div>
        </section>

        {/* Sección 5: Seguridad */}
        <section className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-blue-700">
            <LockClosedIcon className="h-6 w-6" />
            5. SEGURIDAD DE TUS DATOS
          </h2>
          
          <div className="space-y-4 text-gray-700 text-lg">
            <p>
              <strong>Tomamos muy en serio la seguridad de tu información:</strong>
            </p>
            <ul className="list-disc pl-8 space-y-3">
              <li>Tus datos están protegidos con <strong>encriptación</strong></li>
              <li>Acceso <strong>restringido</strong> solo a personal autorizado</li>
              <li><strong>No compartimos</strong> tu información con terceros sin tu permiso</li>
              <li>Implementamos <strong>medidas técnicas</strong> contra hackers y accesos no autorizados</li>
            </ul>
          </div>
        </section>

        {/* Contacto Final */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-8 rounded-xl text-white text-center">
          <h3 className="text-2xl font-bold mb-4">¿TIENES DUDAS O PREGUNTAS?</h3>
          <p className="text-lg mb-4 opacity-90">
            Estamos aquí para ayudarte y aclarar todas tus inquietudes sobre tu privacidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:campobitsuport@gmail.com"
              className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              📧 Escríbenos por Email
            </a>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition duration-200">
              📞 Próximamente: Línea de Atención
            </button>
          </div>
        </div>
      </div>

      {/* Fecha de Actualización */}
      <div className="text-center mt-12 pt-6 border-t border-gray-300">
        <p className="text-gray-600">
          <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-CO', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;