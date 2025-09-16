import React from 'react';
import MissionVision from '../components/about/MissionVision';
import Values from '../components/about/Values';
import Objectives from '../components/about/Objectives';

function AboutUsPage() {
  // Esto establecerá el título cuando el componente se monte
  React.useEffect(() => {
    document.title = "CampoBit | Sobre Nosotros";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Conoce nuestra misión, visión y valores como plataforma agropecuaria líder');
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-800 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Nuestra Esencia</h1>
        <p className="text-xl max-w-3xl mx-auto">
          "El campo conectado con el mundo, un click a la vez"
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <MissionVision />
        <Values />
        <Objectives />
        
        {/* Sección de impacto (opcional) */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Nuestro Impacto</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StatCard number="--" label="Productores conectados" />
            <StatCard number="--" label="Ahorro en intermediarios" />
            <StatCard number="--" label="Transacciones seguras" />
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ number, label }) => (
  <div className="bg-green-50 rounded-xl p-6 text-center transform hover:scale-105 transition duration-300">
    <p className="text-5xl font-bold text-green-700 mb-2">{number}</p>
    <p className="text-lg text-gray-700">{label}</p>
  </div>
);

export default AboutUsPage;