import React from 'react';
import { FaBullseye, FaEye } from 'react-icons/fa';

export default function MissionVision() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Misión */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-blue-500">
        <div className="flex items-center mb-4">
          <FaBullseye className="text-blue-500 text-2xl mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Misión</h2>
        </div>
        <blockquote className="text-lg italic text-gray-700 pl-2 border-l-2 border-blue-200">
          "Conectar de manera directa y segura a productores agropecuarios, agricultores y campesinos con compradores, 
          mediante una plataforma digital especializada que promueva el comercio justo, la innovación tecnológica 
          y el desarrollo sostenible del campo."
        </blockquote>
      </div>

      {/* Visión */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-green-500">
        <div className="flex items-center mb-4">
          <FaEye className="text-green-500 text-2xl mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Visión</h2>
        </div>
        <blockquote className="text-lg italic text-gray-700 pl-2 border-l-2 border-green-200">
          "Ser en 2030 el marketplace agropecuario líder en Latinoamérica, reconocido por impulsar el crecimiento 
          económico de los productores rurales, modernizar la comercialización agrícola y fortalecer 
          el vínculo entre el campo y la ciudad."
        </blockquote>
      </div>
    </div>
  );
}