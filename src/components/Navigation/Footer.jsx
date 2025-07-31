import React from "react";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold">AIMEC</span>
            </div>
            <p className="text-secondary-300 mb-6 text-lg leading-relaxed max-w-lg">
              Especialistas en instalación y programación de componentes
              industriales. Soluciones tecnológicas avanzadas para el sector
              industrial con años de experiencia.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center text-secondary-400 hover:text-white hover:bg-primary-600 transition-all duration-200"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center text-secondary-400 hover:text-white hover:bg-primary-600 transition-all duration-200"
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center text-secondary-400 hover:text-white hover:bg-primary-600 transition-all duration-200"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center text-secondary-400 hover:text-white hover:bg-primary-600 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-secondary-300 hover:text-white transition-colors duration-200 text-lg hover:translate-x-1 inline-block"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo"
                  className="text-secondary-300 hover:text-white transition-colors duration-200 text-lg hover:translate-x-1 inline-block"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-secondary-300 hover:text-white transition-colors duration-200 text-lg hover:translate-x-1 inline-block"
                >
                  Administración
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMail className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-secondary-300 text-lg">info@aimec.com</p>
                  <p className="text-secondary-400 text-sm">Email</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiPhone className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-secondary-300 text-lg">+1 234 567 890</p>
                  <p className="text-secondary-400 text-sm">Teléfono</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMapPin className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-secondary-300 text-lg">
                    Ciudad Industrial, País
                  </p>
                  <p className="text-secondary-400 text-sm">Dirección</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-400 text-center md:text-left">
              © 2024 AIMEC. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors duration-200"
              >
                Política de Privacidad
              </a>
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors duration-200"
              >
                Términos de Servicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
