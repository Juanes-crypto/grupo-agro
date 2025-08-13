import React from 'react';
import { FaHandshake, FaLightbulb, FaShieldAlt, FaUsers, FaLeaf, FaChartLine } from 'react-icons/fa';

const values = [
  { icon: <FaHandshake />, title: "Comercio justo", description: "Garantizamos precios transparentes y beneficios equitativos" },
  { icon: <FaLightbulb />, title: "Innovación", description: "Usamos tecnología para modernizar el comercio rural" },
  { icon: <FaChartLine />, title: "Transparencia", description: "Procesos claros y seguros en todas las transacciones" },
  { icon: <FaUsers />, title: "Compromiso social", description: "Apoyo constante al desarrollo rural y sus comunidades" },
  { icon: <FaLeaf />, title: "Sostenibilidad", description: "Promoción de prácticas responsables con el medio ambiente" },
  { icon: <FaShieldAlt />, title: "Seguridad", description: "Protección de datos y confianza en cada operación" }
];

export default function Values() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
      <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Nuestros Valores</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <div key={index} className="bg-green-50 rounded-xl p-6 hover:bg-green-100 transition duration-300">
            <div className="text-green-600 text-3xl mb-3">{value.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
            <p className="text-gray-600">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}