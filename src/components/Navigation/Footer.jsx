import React from "react";
import { Link } from "react-router-dom";
import { Container, Heading, Icon } from "../ui/components";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto border-t-4 border-primary-600">
      <Container>
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-lg font-bold text-white">AIMEC</span>
              </div>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed max-w-lg">
                Especialistas en instalación y programación de componentes
                industriales. Soluciones tecnológicas avanzadas para el sector
                industrial con años de experiencia.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600 transition-all duration-200 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Icon name="FiFacebook" size="sm" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600 transition-all duration-200 hover:scale-110"
                  aria-label="Twitter"
                >
                  <Icon name="FiTwitter" size="sm" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600 transition-all duration-200 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Icon name="FiInstagram" size="sm" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600 transition-all duration-200 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Icon name="FiLinkedin" size="sm" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <Heading level={4} className="mb-4 text-white">
                Enlaces Rápidos
              </Heading>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalogo"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                  >
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                  >
                    Administración
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <Heading level={4} className="mb-4 text-white">Contacto</Heading>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="FiMail" size="xs" className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">info@aimec.com</p>
                    <p className="text-gray-400 text-xs">Email</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="FiPhone" size="xs" className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">+1 234 567 890</p>
                    <p className="text-gray-400 text-xs">Teléfono</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="FiMapPin" size="xs" className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      Ciudad Industrial, País
                    </p>
                    <p className="text-gray-400 text-xs">Dirección</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <p className="text-gray-400 text-center md:text-left text-xs">
                © 2024 AIMEC. Todos los derechos reservados.
              </p>
              <div className="flex space-x-4 text-xs">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Política de Privacidad
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Términos de Servicio
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
