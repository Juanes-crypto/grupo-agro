import React, { useEffect } from 'react';
import { 
  ShieldCheckIcon,
  ExclamationCircleIcon,
  UserIcon,
  MapIcon,
  DocumentTextIcon,
  BanknotesIcon,
  TruckIcon,
  HomeIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const TermsPage = () => {
  useEffect(() => {
    document.title = "Términos y Condiciones | CampoBit";
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-6 py-3 rounded-full mb-6 shadow-sm">
          <ExclamationTriangleIcon className="h-6 w-6" />
          <span className="font-semibold text-lg">CONTRATO LEGAL IMPORTANTE</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Términos y Condiciones</h1>
        <p className="text-xl text-gray-600 mb-2">CampoBit - Plataforma Agropecuaria</p>
        <p className="text-lg text-gray-500">Al usar CampoBit, aceptas TODAS estas condiciones</p>
      </div>

      {/* ADVERTENCIA CRÍTICA */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="h-7 w-7 text-red-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-800 text-xl mb-3">¡LEE ESTO ANTES DE USAR CAMPOBIT!</h3>
            <p className="text-red-700 text-lg leading-relaxed">
              <strong>CampoBit es SOLO una plataforma de contacto.</strong> NO somos dueños de los productos, 
              NO manejamos pagos, NO entregamos mercancías y <strong>NO nos hacemos responsables</strong> por acuerdos 
              entre usuarios. TÚ eres responsable de tus negocios.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Sección 1: Qué Somos y Qué NO Somos */}
        <section className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-blue-700">
            <DocumentTextIcon className="h-6 w-6" />
            1. ¿QUÉ ES CAMPOBIT Y QUÉ NO ES?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <CheckBadgeIcon className="h-5 w-5" />
                LO QUE SÍ SOMOS:
              </h3>
              <ul className="list-disc pl-5 space-y-3 text-green-800">
                <li><strong>Plataforma de contacto</strong> entre compradores y vendedores</li>
                <li><strong>Catálogo virtual</strong> de productos y servicios agrícolas</li>
                <li><strong>Herramienta</strong> para que campesinos se conecten</li>
                <li><strong>Intermediario digital</strong> sin intervención en negocios</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                <XCircleIcon className="h-5 w-5" />
                LO QUE NO SOMOS:
              </h3>
              <ul className="list-disc pl-5 space-y-3 text-red-800">
                <li><strong>NO somos</strong> dueños de productos</li>
                <li><strong>NO manejamos</strong> dinero ni pagos</li>
                <li><strong>NO entregamos</strong> mercancías</li>
                <li><strong>NO garantizamos</strong> calidad de productos</li>
                <li><strong>NO somos</strong> responsables de acuerdos</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sección 2: Alcance Geográfico */}
        <section className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-green-700">
            <MapIcon className="h-6 w-6" />
            2. ALCANCE GEOGRÁFICO - SOLO COLOMBIA
          </h2>
          
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-4">
            <p className="text-yellow-800 text-lg font-semibold">
              ✅ CampoBit opera <strong>EXCLUSIVAMENTE en territorio colombiano</strong>
            </p>
          </div>

          <div className="space-y-4 text-gray-700 text-lg">
            <p>
              Al registrarte en CampoBit, confirmas bajo gravedad de juramento que:
            </p>
            <ul className="list-disc pl-8 space-y-3">
              <li>Resides o operas comercialmente <strong>dentro de Colombia</strong></li>
              <li>Tus productos/services se encuentran <strong>físicamente en Colombia</strong></li>
              <li>Cumples con todas las <strong>leyes y regulaciones colombianas</strong></li>
              <li>Tu negocio está registrado ante las autoridades colombianas si aplica</li>
            </ul>
          </div>
        </section>

        {/* Sección 3: Requisitos del Usuario */}
        <section className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-purple-700">
            <UserIcon className="h-6 w-6" />
            3. REQUISITOS OBLIGATORIOS PARA USAR CAMPOBIT
          </h2>
          
          <div className="space-y-6">
            <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-800 mb-3">INFORMACIÓN VERDADERA Y ACTUALIZADA</h3>
              <ul className="list-disc pl-6 space-y-2 text-purple-900">
                <li><strong>WhatsApp válido y activo</strong> - Para contacto entre usuarios</li>
                <li><strong>Correo electrónico real</strong> - Para notificaciones importantes</li>
                <li><strong>Información verídica</strong> sobre productos y servicios</li>
                <li><strong>Actualización inmediata</strong> si cambia tu información</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3">EDAD Y CAPACIDAD LEGAL</h3>
              <ul className="list-disc pl-6 space-y-2 text-blue-900">
                <li>Debes ser <strong>mayor de 18 años</strong></li>
                <li>Tener <strong>capacidad legal</strong> para realizar contratos</li>
                <li>Si eres empresa, tener <strong>representación legal válida</strong></li>
                <li>Contar con <strong>autorización parental</strong> si eres menor de edad</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sección 4: LIMITACIÓN DE RESPONSABILIDAD - CRÍTICA */}
        <section className="bg-white p-8 rounded-xl shadow-md border border-red-300">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-red-700">
            <ShieldCheckIcon className="h-6 w-6" />
            4. LIMITACIÓN DE RESPONSABILIDAD - LEE CON CUIDADO
          </h2>
          
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
            <p className="text-red-800 text-lg font-bold text-center">
              🚨 CAMPOBIT NO SE HACE RESPONSABLE POR PÉRDIDAS, DAÑOS O PROBLEMAS ENTRE USUARIOS 🚨
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-red-500 pl-4 bg-red-50 py-3">
              <h3 className="font-bold text-red-800 mb-2">ROBOS, PÉRDIDAS O DAÑOS DE MERCANCÍA</h3>
              <p className="text-red-700">
                <strong>CampoBit NO responde por:</strong> Robos durante transporte, pérdida de productos, 
                daños por mal manejo, hurto de equipos, pérdidas por demoras, etc. El riesgo es 100% del usuario.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 py-3">
              <h3 className="font-bold text-orange-800 mb-2">PROBLEMAS CON PAGOS Y TRANSACCIONES</h3>
              <p className="text-orange-700">
                <strong>CampoBit NO interviene en:</strong> Pagos no recibidos, cheques sin fondos, 
                transferencias fallidas, estafas financieras, problemas con precios, etc.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 py-3">
              <h3 className="font-bold text-purple-800 mb-2">CALIDAD DE PRODUCTOS Y SERVICIOS</h3>
              <p className="text-purple-700"/>
                <strong>CampoBit NO garantiza:</strong> Calidad de productos, estado de equipos, 
                cumplimiento de especificaciones, resultados de servicios, etc.
              </div>

            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 py-3">
              <h3 className="font-bold text-blue-800 mb-2">PROBLEMAS ENTRE USUARIOS</h3>
              <p className="text-blue-700">
                <strong>CampoBit NO media en:</strong> Disputas comerciales, incumplimiento de contratos, 
                desacuerdos entre partes, problemas de comunicación, etc.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-700 text-sm">
              <strong>Nota:</strong> CampoBit actúa como un "centro comercial virtual". Así como el centro comercial 
              no responde por lo que venden las tiendas, CampoBit no responde por lo que negocian sus usuarios.
            </p>
          </div>
        </section>

        {/* Sección 5: Prohibiciones Absolutas */}
        <section className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-red-700">
            <NoSymbolIcon className="h-6 w-6" />
            5. PROHIBICIONES ABSOLUTAS - CAUSALES DE BLOQUEO INMEDIATO
          </h2>
          
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-bold text-red-800 mb-2">🚫 ACTIVIDADES ILEGALES SEGÚN LEY COLOMBIANA</h3>
              <ul className="list-disc pl-6 space-y-2 text-red-700">
                <li>Venta de productos agrícolas <strong>no autorizados por el ICA</strong></li>
                <li>Comercialización de <strong>semillas ilegales o transgénicos no autorizados</strong></li>
                <li>Productos <strong>vencidos o en mal estado</strong></li>
                <li>Servicios de <strong>transporte sin licencia</strong></li>
                <li><strong>Blanqueo de capitales</strong> o actividades financieras ilegales</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-orange-800 mb-2">🚫 INFRACCIONES COMERCIALES</h3>
              <ul className="list-disc pl-6 space-y-2 text-orange-700">
                <li><strong>Publicar información falsa</strong> sobre productos o servicios</li>
                <li><strong>Suplantar</strong> a otros usuarios, empresas o marcas</li>
                <li><strong>Engañar</strong> sobre precios, calidades o disponibilidad</li>
                <li>Usar <strong>fotos que no son de tus productos reales</strong></li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-800 mb-2">🚫 MAL USO DE LA PLATAFORMA</h3>
              <ul className="list-disc pl-6 space-y-2 text-purple-700">
                <li><strong>Spam</strong> o contacto masivo no solicitado</li>
                <li><strong>Acoso</strong> a otros usuarios</li>
                <li>Publicar <strong>contenido ofensivo o discriminatorio</strong></li>
                <li>Intentar <strong>hackear</strong> la plataforma</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sección 6: Tipos de Contenido Permitido */}
        <section className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-green-700">
            <CheckBadgeIcon className="h-6 w-6" />
            6. ¿QUÉ SÍ PUEDES HACER EN CAMPOBIT?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-5 rounded-lg text-center">
              <BanknotesIcon className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-green-800 mb-2">PRODUCTOS AGRÍCOLAS</h3>
              <p className="text-green-700 text-sm">
                Café, plátano, maíz, frutas, verduras, granos, etc. (con registros ICA)
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg text-center">
              <TruckIcon className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-blue-800 mb-2">SERVICIOS AGRARIOS</h3>
              <p className="text-blue-700 text-sm">
                Transporte, cosecha, siembra, fumigación, mantenimiento, etc.
              </p>
            </div>

            <div className="bg-purple-50 p-5 rounded-lg text-center">
              <HomeIcon className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold text-purple-800 mb-2">ALQUILERES</h3>
              <p className="text-purple-700 text-sm">
                Equipos, maquinaria, fincas, bodegas, espacios agrícolas
              </p>
            </div>
          </div>
        </section>

        {/* Sección 7: Sanciones */}
        <section className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-red-700">
            <ExclamationCircleIcon className="h-6 w-6" />
            7. SANCIONES POR INCUMPLIMIENTO
          </h2>
          
          <div className="space-y-4 text-gray-700 text-lg">
            <p>
              Si violas estos términos y condiciones, CampoBit puede aplicar:
            </p>
            <ul className="list-disc pl-8 space-y-3">
              <li><strong>Bloqueo inmediato</strong> de tu cuenta</li>
              <li><strong>Eliminación permanente</strong> de todos tus anuncios</li>
              <li><strong>Reporte a autoridades</strong> si hay actividades ilegales</li>
              <li><strong>Prohibición vitalicia</strong> de usar CampoBit</li>
              <li><strong>Acciones legales</strong> si causas daños a la plataforma</li>
            </ul>
          </div>
        </section>

        {/* Contacto Legal */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 p-8 rounded-xl text-white text-center">
          <h3 className="text-2xl font-bold mb-4">¿PROBLEMAS O DENUNCIAS?</h3>
          <p className="text-lg mb-4 opacity-90">
            Reporta usuarios que violen estos términos o actividades sospechosas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:campobitsuport@gmail.com"
              className="bg-white text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              📧 Reportar por Email
            </a>
            <a 
              href="tel:+573108950792"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-700 transition duration-200"
            >
              📞 Llamar: 310 895 0792
            </a>
          </div>
          <p className="mt-4 text-sm opacity-80">
            Horario de atención: Lunes a Viernes 8:00 am - 5:00 pm
          </p>
        </div>

        {/* Aceptación Final */}
        <div className="bg-gray-100 p-6 rounded-xl border border-gray-300">
          <h3 className="font-bold text-gray-800 text-center mb-4 text-lg">
            AL REGISTRARTE EN CAMPOBIT, CONFIRMAS QUE:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 text-center">
            <li>Has leído <strong>COMPLETAMENTE</strong> estos términos y condiciones</li>
            <li>Entiendes que <strong>CAMPOBIT NO ES RESPONSABLE</strong> por tus negocios</li>
            <li>Aceptas <strong>TODAS</strong> las condiciones aquí establecidas</li>
            <li>Te comprometes a cumplir con las <strong>leyes colombianas</strong></li>
          </ul>
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

export default TermsPage;