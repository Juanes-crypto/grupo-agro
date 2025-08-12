import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Ajusta la ruta según tu estructura
import TopNavbar from '../components/TopNavbar'; // Ajusta la ruta

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">404 - Página no encontrada</h1>
        <p className="text-xl text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
        >
          Volver al Inicio
        </Link>
        <p className="text-xl text-gray-600 mb-8">
          Te pedimos una disculpa de parte el equipo de AgroNet.
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;