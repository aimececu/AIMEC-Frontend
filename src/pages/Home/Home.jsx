import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Container, 
  Heading, 
  Icon,
  Input, 
  Section, 
  TextArea 
} from '../../components/ui/components';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    // Resetear formulario
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    });
    alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hola, me interesa conocer más sobre sus servicios de componentes industriales.');
    const phone = '1234567890'; // Reemplaza con tu número de WhatsApp
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const features = [
    {
      icon: <Icon name="FiTool" size="xl" />,
      title: 'Instalación Profesional',
      description: 'Equipo técnico especializado en instalación de componentes industriales con años de experiencia.'
    },
    {
      icon: <Icon name="FiUsers" size="xl" />,
      title: 'Soporte Técnico',
      description: 'Asistencia técnica 24/7 para resolver cualquier problema con nuestros productos y servicios.'
    },
    {
      icon: <Icon name="FiTruck" size="xl" />,
      title: 'Entrega Rápida',
      description: 'Envío rápido y seguro a cualquier parte del país con seguimiento en tiempo real.'
    },
    {
      icon: <Icon name="FiAward" size="xl" />,
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
      <Icon 
        key={i} 
        name="FiStar"
        size="sm"
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-secondary-300'}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section 
        background="primary" 
        padding="xl"
        className="bg-gradient-to-r from-primary-600 to-primary-700"
      >
        <Container>
          <div className="text-center">
            <Heading level={1} className="mb-6 text-white">
              Componentes Industriales
              <span className="block text-primary-200">de Alta Calidad</span>
            </Heading>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Especialistas en instalación y programación de componentes industriales. 
              Soluciones tecnológicas avanzadas para el sector industrial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="white" size="lg" as={Link} to="/catalogo">
                Ver Catálogo
              </Button>
              <Button variant="outline" size="lg" as={Link} to="/admin" className="border-white text-white hover:bg-white hover:text-primary-600">
                Administración
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section background="default">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              ¿Por qué elegirnos?
            </Heading>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
              Ofrecemos soluciones integrales con la más alta calidad y servicio técnico especializado.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                variant="light"
                padding="lg"
                hover
                className="text-center"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <Heading level={3} className="mb-2">
                  {feature.title}
                </Heading>
                <p className="text-secondary-600 dark:text-secondary-300">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Testimonials Section */}
      <Section background="light">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              Lo que dicen nuestros clientes
            </Heading>
            <p className="text-lg text-secondary-600 dark:text-secondary-300">
              Testimonios de empresas que confían en nuestros servicios
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} padding="lg">
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
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="primary">
        <Container>
          <div className="text-center">
            <Heading level={2} className="mb-4 text-white">
              ¿Listo para comenzar?
            </Heading>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Descubre nuestra amplia gama de componentes industriales y servicios técnicos especializados.
            </p>
            <Button 
              variant="white" 
              size="lg" 
              as={Link} 
              to="/catalogo"
            >
              Explorar Productos
            </Button>
          </div>
        </Container>
      </Section>

      {/* Contact Section */}
      <Section background="default">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              Contáctanos
            </Heading>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
              ¿Tienes alguna pregunta? Estamos aquí para ayudarte. Envíanos un mensaje o contáctanos directamente.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card variant="light" padding="xl">
              <Heading level={3} className="mb-6">
                Envíanos un mensaje
              </Heading>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre completo *"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Tu nombre"
                  />
                  <Input
                    label="Correo electrónico *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Teléfono"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 890"
                  />
                  <Input
                    label="Empresa"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Nombre de tu empresa"
                  />
                </div>
                <TextArea
                  label="Mensaje *"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Cuéntanos sobre tu proyecto o consulta..."
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Icon name="FiSend" />}
                >
                  Enviar mensaje
                </Button>
              </form>
            </Card>

            {/* Contact Info & WhatsApp */}
            <div className="space-y-8">
              {/* Contact Information */}
              <Card variant="light" padding="xl" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <Heading level={3} className="mb-6 text-blue-900 dark:text-blue-100">
                  Información de contacto
                </Heading>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="FiMail" className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Email</p>
                      <p className="text-blue-700 dark:text-blue-300">info@aimec.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="FiPhone" className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Teléfono</p>
                      <p className="text-blue-700 dark:text-blue-300">+1 234 567 890</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="FiMapPin" className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Dirección</p>
                      <p className="text-blue-700 dark:text-blue-300">
                        Ciudad Industrial, País<br />
                        Zona Industrial Norte
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* WhatsApp Button */}
              <Card variant="success" padding="xl">
                <Heading level={3} className="mb-4 text-green-800 dark:text-green-200">
                  ¿Necesitas respuesta rápida?
                </Heading>
                <p className="text-green-700 dark:text-green-300 mb-6">
                  Contáctanos por WhatsApp para obtener una respuesta inmediata a tus consultas.
                </p>
                <Button
                  variant="whatsapp"
                  size="xl"
                  fullWidth
                  icon={<Icon name="FiMessageCircle" size="lg" />}
                  onClick={handleWhatsApp}
                >
                  Chatear por WhatsApp
                </Button>
                <p className="text-sm text-green-600 dark:text-green-400 mt-3 text-center">
                  Respuesta en menos de 5 minutos
                </p>
              </Card>

              {/* Business Hours */}
              <Card variant="light" padding="lg">
                <Heading level={4} className="mb-4">
                  Horarios de atención
                </Heading>
                <div className="space-y-2 text-sm text-secondary-600 dark:text-secondary-300">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes:</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados:</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingos:</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Home; 