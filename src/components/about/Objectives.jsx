import React from 'react';
import { FaBullseye, FaCheckCircle, FaGlobeAmericas } from 'react-icons/fa';

export default function Objectives() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Nuestros Objetivos</h2>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FaBullseye className="text-blue-500 text-xl mr-3" />
          <h3 className="text-xl font-semibold text-gray-800">Objetivo General</h3>
        </div>
        <p className="text-gray-700 pl-9">
          Desarrollar y consolidar una plataforma de comercio electrónico especializada en el sector agropecuario 
          que facilite la conexión directa entre productores y compradores, fortaleciendo la economía rural 
          y garantizando un servicio seguro y eficiente.
        </p>
      </div>

      <div>
        <div className="flex items-center mb-4">
          <FaCheckCircle className="text-green-500 text-xl mr-3" />
          <h3 className="text-xl font-semibold text-gray-800">Objetivos Específicos</h3>
        </div>
        <ul className="space-y-3 pl-9">
          <li className="flex items-start">
            <FaGlobeAmericas className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span>Implementar una plataforma digital fácil de usar para distintos niveles de experiencia tecnológica</span>
          </li><hr />
          <li className="flex items-start">
            <FaGlobeAmericas className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span>Ofrecer soluciones de pago y logística adaptadas a las necesidades del sector agropecuario.</span>
          </li><hr />
          <li className="flex items-start">
            <FaGlobeAmericas className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span>Atraer y fidelizar a productores mediante capacitación, soporte y oportunidades de visibilidad.</span>
          </li><hr />
          <li className="flex items-start">
            <FaGlobeAmericas className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span>Garantizar transacciones seguras mediante tecnología y protocolos de ciberseguridad avanzados.</span>
          </li><hr />
          <li className="flex items-start">
            <FaGlobeAmericas className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span>Expandir la cobertura de la plataforma a nivel nacional y posteriormente regional.</span>
          </li><hr />
          <li className="flex items-start">
            <FaGlobeAmericas className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span>Promover el consumo de productos locales, apoyando la sostenibilidad y el desarrollo económico del campo.</span>
          </li><hr />
        </ul>
      </div>
    </div>
  );
}