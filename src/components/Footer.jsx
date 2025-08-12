// components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CodeBracketIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
  HeartIcon
} from '@heroicons/react/outline';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-green-800 to-green-900 text-white border-t border-amber-100/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Sección de Contacto y Soporte */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BuildingOffice2Icon className="h-6 w-6 text-amber-200" />
              <span>CONTACTO Y SOPORTE</span>
            </h3>
            <div className="h-px bg-amber-100/20 w-full"></div>
            
            <p className="text-amber-100/90">
              ¿Necesitas ayuda? Estamos aquí para responder tus preguntas y escuchar tus sugerencias.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <EnvelopeIcon className="h-5 w-5 mt-1 text-amber-200/80" />
                <div>
                  <h4 className="font-semibold text-amber-200">Correo Electrónico</h4>
                  <a 
                    href="mailto:soporte@agronet.com" 
                    className="text-amber-100/80 hover:text-amber-300 transition-colors"
                  >
                    soporte@agronet.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <PhoneIcon className="h-5 w-5 mt-1 text-amber-200/80" />
                <div>
                  <h4 className="font-semibold text-amber-200">Teléfono</h4>
                  <a 
                    href="tel:+573108950792" 
                    className="text-amber-100/80 hover:text-amber-300 transition-colors"
                  >
                    +57 310 895 07 92
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 mt-1 text-amber-200/80" />
                <div>
                  <h4 className="font-semibold text-amber-200">Ubicación</h4>
                  <p className="text-amber-100/80">Medellin, Colombia</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sección del Desarrollador */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CodeBracketIcon className="h-6 w-6 text-amber-200" />
              <span>DESARROLLADO POR</span>
            </h3>
            <div className="h-px bg-amber-100/20 w-full"></div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-700/30 p-2 rounded-full">
                <ShieldCheckIcon className="h-8 w-8 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Juan Esteban Garcia</h4>
                <p className="text-amber-100/80">Desarrollador Full Stack</p>
              </div>
            </div>
            
            <p className="text-amber-100/90">
              Especializado en soluciones digitales para el sector agrícola, amplio conocimiento en Backend, Frontend y Bases de datos.
              Manejo exponencial de herramientas digitales y de la productividad.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="https://www.instagram.com/juanes_00.2/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-700/40 hover:bg-green-700/60 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <span>Instagram</span>
              </a>
              
              <a 
                href="https://github.com/Juanes-crypto/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-700/40 hover:bg-green-700/60 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <span>GitHub</span>
              </a>
              
              {/* <a 
                href="https://tusitio.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-amber-600/80 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <span>Portafolio</span>
              </a> */}
              <span>Correo: juanesgarciaarboleda06@gmail.com</span>
              <span>Contacto: 3108950792</span>
            </div>
          </div>
        </div>
        
        {/* Derechos de autor */}
        <div className="border-t border-amber-100/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-amber-100/70">
            <HeartIcon className="h-5 w-5 text-amber-300/70" />
            <span>© {new Date().getFullYear()} AgroNet. Todos los derechos reservados.</span>
          </div>
          
          <div className="flex gap-6">
            <Link to="/terms" className="text-amber-100/70 hover:text-amber-300 transition-colors text-sm">
              Términos y condiciones
            </Link>
            <Link to="/privacy" className="text-amber-100/70 hover:text-amber-300 transition-colors text-sm">
              Política de privacidad
            </Link>
            <Link to="/cookies" className="text-amber-100/70 hover:text-amber-300 transition-colors text-sm">
              Política de cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;