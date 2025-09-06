import React, { useEffect } from 'react';
import { 
  LockClosedIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const PrivacyPage = () => {
  useEffect(() => {
    document.title = "Política de Privacidad | AgroNet";
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
          <LockClosedIcon className="h-5 w-5" />
          <span className="font-medium">Privacidad</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Política de Privacidad</h1>
        <p className="text-gray-600">Cumplimiento con la Ley 1581 de 2012 (Protección de Datos Colombia)</p>
      </div>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-blue-800">
            <DevicePhoneMobileIcon className="h-5 w-5" />
            Datos que Recopilamos
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li><strong>WhatsApp:</strong> Para contacto entre compradores/vendedores.</li>
            <li><strong>Email:</strong> Para notificaciones y recuperación de cuenta.</li>
            <li><strong>Ubicación (próximamente):</strong> Solo municipio/departamento.</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-blue-800">
            <EnvelopeIcon className="h-5 w-5" />
            Tus Derechos
          </h2>
          <p className="text-gray-700">
            Según la ley colombiana, puedes:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-700">
            <li>Solicitar acceso, corrección o eliminación de tus datos.</li>
            <li>Revocar tu consentimiento en cualquier momento.</li>
            <li>Presentar reclamos ante la Superintendencia de Industria y Comercio.</li>
          </ul>
        </section>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-2">Ejercer tus Derechos</h3>
          <p className="text-gray-700">
            Envía un email a <a href="mailto:campobitsuport@gmail.com " className="text-blue-600 hover:underline">campobitsuport@gmail.com </a> con:
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-700">
            <li>Tu nombre completo</li>
            <li>Número de WhatsApp registrado</li>
            <li>Solicitud específica</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;