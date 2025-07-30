import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiTruck, FiUsers, FiAward, FiTool } from 'react-icons/fi';
import clsx from 'clsx';

const Home = () => {
  const features = [
    {
      icon: <FiTool className="w-8 h-8" />,
      title: 'Instalación Profesional',
      description: 'Equipo técnico especializado en instalación de componentes industriales con años de experiencia.'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Soporte Técnico',
      description: 'Asistencia técnica 24/7 para resolver cualquier problema con nuestros productos y servicios.'
    },
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: 'Entrega Rápida',
      description: 'Envío rápido y seguro a cualquier parte del país con seguimiento en tiempo real.'
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: 'Calidad Garantizada',
      description: 'Todos nuestros productos cuentan con garantía y certificaciones de calidad internacional.'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Rodríguez',
      company: 'Industrias ABC',
      rating: 5,
      comment: 'Excelente servicio técnico y productos de alta calidad. Muy recomendados.'
    },
    {
      name: 'María González',
      company: 'Fábrica XYZ',
      rating: 5,
      comment: 'La instalación fue perfecta y el soporte post-venta es excepcional.'
    },
    {
      name: 'Juan Pérez',
      company: 'Manufactura 123',
      rating: 5,
      comment: 'Productos confiables y equipo técnico muy profesional.'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar 
        key={i} 
        className={clsx(
          'w-4 h-4',
          i < rating ? 'text-yellow-400 fill-current' : 'text-secondary-300'
        )} 
      />
    ));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Componentes Industriales
            <span className="block text-primary-200">de Alta Calidad</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            Especialistas en instalación y programación de componentes industriales. 
            Soluciones tecnológicas avanzadas para el sector industrial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/catalogo"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200"
            >
              Ver Catálogo
            </Link>
            <Link 
              to="/admin"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              Administración
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-secondary-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
              Ofrecemos soluciones integrales con la más alta calidad y servicio técnico especializado.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-lg bg-secondary-50 dark:bg-secondary-800 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-secondary-50 dark:bg-secondary-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300">
              Testimonios de empresas que confían en nuestros servicios
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-secondary-700 p-6 rounded-lg shadow-md"
              >
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-secondary-600 dark:text-secondary-300 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div>
                  <p className="font-semibold text-secondary-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Descubre nuestra amplia gama de componentes industriales y servicios técnicos especializados.
          </p>
          <Link 
            to="/catalogo"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 inline-block"
          >
            Explorar Productos
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 