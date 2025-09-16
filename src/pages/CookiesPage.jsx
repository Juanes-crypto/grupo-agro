import React, { useEffect } from 'react';
import { 
  DocumentTextIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';

const CookiesPage = () => {
  useEffect(() => {
    document.title = "Política de Cookies | CampoBit";
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full mb-4">
          <DocumentTextIcon className="h-5 w-5" />
          <span className="font-medium">Cookies</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Política de Cookies</h1>
        <p className="text-gray-600">Uso de tecnologías de almacenamiento local</p>
      </div>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <NoSymbolIcon className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">CampoBit NO usa cookies de terceros</h2>
              <p className="text-gray-700">
                No utilizamos herramientas de análisis externas como Google Analytics.
              </p>
            </div>
          </div>

          <h3 className="font-medium text-gray-900 mb-3">Cookies Técnicas</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li><strong>Sesión de usuario:</strong> Para mantenerte autenticado.</li>
            <li><strong>Preferencias:</strong> Recordar configuración básica.</li>
          </ul>
        </section>

        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <h3 className="font-semibold text-green-800 mb-2">Control de Cookies</h3>
          <p className="text-gray-700">
            Puedes gestionarlas desde la configuración de tu navegador, pero algunas funciones podrían no estar disponibles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;