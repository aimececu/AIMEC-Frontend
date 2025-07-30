import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold">AIMEC</span>
            </div>
            <p className="text-secondary-300 mb-4 max-w-md">
              Especialistas en instalación y programación de componentes industriales. 
              Soluciones tecnológicas avanzadas para el sector industrial.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-400 hover:text-white transition-colors duration-200">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors duration-200">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors duration-200">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors duration-200">
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Administración
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-secondary-400" />
                <span className="text-secondary-300">info@aimec.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-secondary-400" />
                <span className="text-secondary-300">+1 234 567 890</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiMapPin className="w-5 h-5 text-secondary-400" />
                <span className="text-secondary-300">Ciudad Industrial, País</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 mt-8 pt-8 text-center">
          <p className="text-secondary-400">
            © 2024 AIMEC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 