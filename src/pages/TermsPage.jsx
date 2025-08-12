import React, { useEffect } from 'react';
import { 
  ShieldCheckIcon,
  ExclamationCircleIcon,
  UserIcon,
  MapIcon
} from '@heroicons/react/24/outline';

const TermsPage = () => {
  useEffect(() => {
    document.title = "Términos y Condiciones | AgroNet";
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
          <ShieldCheckIcon className="h-5 w-5" />
          <span className="font-medium">Legal</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Términos y Condiciones</h1>
        <p className="text-gray-600">Última actualización: {new Date().toLocaleDateString('es-CO')}</p>
      </div>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-green-800">
            <MapIcon className="h-5 w-5" />
            1. Alcance Geográfico
          </h2>
          <p className="text-gray-700">
            AgroNet opera <strong>exclusivamente en Colombia</strong>. Al registrarte, confirmas que resides o operas en territorio colombiano.
          </p>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-green-800">
            <UserIcon className="h-5 w-5" />
            2. Requisitos de Usuario
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Proporcionar <strong>WhatsApp válido</strong> y <strong>email real</strong>.</li>
            <li>Ser mayor de 18 años o contar con autorización parental.</li>
            <li>No usar AgroNet para actividades ilegales según las leyes colombianas.</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-green-800">
            <ExclamationCircleIcon className="h-5 w-5" />
            3. Prohibiciones
          </h2>
          <p className="text-gray-700 mb-3"><strong>Queda estrictamente prohibido:</strong></p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Vender productos agrícolas no autorizados por el ICA.</li>
            <li>Publicar información falsa sobre productos o servicios.</li>
            <li>Suplantar a otros usuarios o empresas.</li>
          </ul>
        </section>

        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
          <h3 className="font-semibold text-amber-800 mb-2">Contacto Legal</h3>
          <p className="text-gray-700">
            Para reportar violaciones a estos términos: <br />
            📧 <a href="mailto:soporte@agronet.com" className="text-green-600 hover:underline">soporte@agronet.com</a> <br />
            📞 <a href="tel:+573108950792" className="text-green-600 hover:underline">310 895 0792</a> (Horario: L-V 8am-5pm)
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;