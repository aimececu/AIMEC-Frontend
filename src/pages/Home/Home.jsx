import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import HeroSlider from "../../components/ui/HeroSlider";
import Icon from "../../components/ui/Icon";
import Input from "../../components/ui/Input";
import Section from "../../components/ui/Section";
import TextArea from "../../components/ui/TextArea";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import emailService from "../../services/emailService";

const Home = () => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    const validation = emailService.validateContactForm(formData);
    if (!validation.isValid) {
      // Mostrar el primer error encontrado
      const firstError = Object.values(validation.errors)[0];
      showToast(firstError, "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Enviar correo
      const result = await emailService.sendContactForm(formData);

      if (result.success) {
        // Mostrar mensaje de éxito
        showToast(result.message, "success");

        // Resetear formulario
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
        });
      }
    } catch (error) {
      // Mostrar mensaje de error
      showToast(error.message, "error");
      console.error("Error enviando formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hola, me interesa conocer más sobre sus servicios de componentes industriales."
    );
    const phone = "1234567890"; // Reemplaza con tu número de WhatsApp
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const features = [
    {
      icon: (
        <img
          src="/features/1.svg"
          alt="PLC"
          style={{ height: "55px", filter: "none" }}
          className="svg-primary"
        />
      ),
      title: "Programación PLC y Sistemas SCADA",
      description:
        "Programación de PLC y HMI, sistemas SCADA Siemens y comunicación de equipos industriales.",
    },
    {
      icon: (
        <img
          src="/features/2.svg"
          alt="Planos"
          style={{ height: "55px", filter: "none" }}
          className="svg-primary"
        />
      ),
      title: "Diseño y levantamiento de planos electricos",
      description:
        "Elaboración de planos eléctricos detallados y levantamiento de instalaciones existentes para proyectos industriales.",
    },
    {
      icon: (
        <img
          src="/features/3.svg"
          alt="Tableros"
          style={{ height: "55px", filter: "none" }}
          className="svg-primary"
        />
      ),
      title: "Diseño de Tableros Eléctricos",
      description:
        "Diseño y construcción de tableros eléctricos de control y distribución de energía para instalaciones industriales.",
    },
    {
      icon: (
        <img
          src="/features/4.svg"
          alt="Motor"
          style={{ height: "55px", filter: "none" }}
          className="svg-primary"
        />
      ),
      title: "Control y Arranque de Motores",
      description:
        "Servicio especializado en control de motores eléctricos DC y AC mediante el uso de variadores y drives de distintas gamas y fabricantes.",
    },
  ];

  const heroSlides = [
    {
      title: "Ingeniería mecatrónica",
      subtitle: "Automatización y Control Industrial",
      description:
        "Especialistas en ingeniería mecatrónica. Soluciones tecnológicas avanzadas para el sector industrial.",
      backgroundImage:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      overlay: "bg-gradient-to-r from-primary-600/80 to-primary-700/80",
    },
    {
      title: "Instalación y Programación",
      subtitle: "Especialistas en Componentes",
      description:
        "Instalamos y programamos componentes industriales con precisión técnica. Desde PLCs hasta variadores de frecuencia, garantizamos un funcionamiento óptimo.",
      backgroundImage:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      overlay: "bg-gradient-to-r from-blue-600/80 to-blue-800/80",
      layout: "split", // Layout dividido

      imagePosition: "left", // Imagen a la izquierda
    },
    {
      title: "Siemens",
      subtitle: "Tecnología de Vanguardia",
      description:
        "Distribuidor autorizado de productos Siemens. PLCs, variadores de frecuencia, HMI y más componentes industriales de la más alta calidad.",
      backgroundImage:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      overlay: "bg-gradient-to-r from-blue-600/80 to-blue-800/80",
      layout: "split", // Layout dividido
      internalImage:
        "https://automaq.pe/w_files/img/producto/6sl3225_0be31_5ua0hd_1595563351.jpg",
      imagePosition: "left", // Imagen a la izquierda
      internalImageClassName:
        "max-h-64 md:max-h-96 lg:max-h-[500px] rounded-lg shadow-2xl",
      buttons: [
        {
          text: "Ver Productos Siemens",
          variant: "white",
          size: "lg",
          link: "/productos",
        },
        {
          text: "Solicitar Cotización",
          variant: "outline",
          size: "lg",
          link: "/contacto",
          className:
            "!border-white !text-white hover:!bg-white hover:!text-blue-600",
        },
      ],
    },
  ];

  const brands = [
    {
      name: "Siemens",
      logo: "/siemens-logo.png",
      category: "Automatización Industrial",
    },
    {
      name: "Delta",
      logo: "/delta-logo.webp",
      category: "Control Industrial",
    },
    {
      name: "Allen Bradley",
      logo: "/allen-bradley-logo.png",
      category: "Electrónica Industrial",
    },
    {
      name: "Schneider Electric",
      logo: "/schneider-electric-logo.png",
      category: "Electrónica Industrial",
    },
    {
      name: "LS Electric",
      logo: "/ls-electric-logo.webp",
      category: "Electrónica Industrial",
    },
    {
      name: "ABB",
      logo: "/abb-logo.png",
      category: "Electrónica Industrial",
    },
    {
      name: "Chint",
      logo: "/chint-logo.png",
      category: "Electrónica Industrial",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Slider Section */}
      <Section
        background="primary"
        padding="none"
        className="h-[calc(100vh-4rem)] min-h-[536px]"
      >
        <HeroSlider
          slides={heroSlides}
          autoPlay={true}
          interval={6000}
          showArrows={true}
          showDots={true}
          className="h-full justify-center"
        />
      </Section>

      {/* Features Section */}
      <Section background="default">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              ¿Por qué elegirnos?
            </Heading>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
              Ofrecemos soluciones integrales con la más alta calidad y servicio
              técnico especializado.
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
                <div className="text-primary-600 dark:text-primary-400 mb-2 flex justify-center">
                  {feature.icon}
                </div>
                <Heading level={4} className="mb-2">
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

      {/* Brands Section */}
      <Section background="light">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              Marcas de Confianza
            </Heading>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
              Distribuidores autorizados de las marcas líderes en automatización
              industrial
            </p>
          </div>

          {/* Simple Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="group flex flex-col items-center justify-center p-4 hover:shadow-lg transition-all duration-300 rounded-md"
              >
                <div className="w-16 h-16 mb-3 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <h3 className="font-medium text-secondary-900 dark:text-white text-sm text-center">
                  {brand.name}
                </h3>
              </div>
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
              Descubre nuestra amplia gama de componentes industriales y
              servicios técnicos especializados.
            </p>
            <Button
              variant="primary"
              mainColor={colors.primary[500]}
              textColor={colors.primary[100]}
              size="lg"
              onClick={() => navigate("/productos")}
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
              ¿Tienes alguna pregunta? Estamos aquí para ayudarte. Envíanos un
              mensaje o contáctanos directamente.
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
                    onChange={(value) => handleInputChange(value, "name")}
                    required
                    placeholder="Tu nombre"
                  />
                  <Input
                    label="Correo electrónico *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(value) => handleInputChange(value, "email")}
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
                    onChange={(value) => handleInputChange(value, "phone")}
                    placeholder="+1 234 567 890"
                  />
                  <Input
                    label="Empresa"
                    name="company"
                    value={formData.company}
                    onChange={(value) => handleInputChange(value, "company")}
                    placeholder="Nombre de tu empresa"
                  />
                </div>
                <TextArea
                  label="Mensaje *"
                  name="message"
                  value={formData.message}
                  onChange={(value) => handleInputChange(value, "message")}
                  required
                  rows="4"
                  placeholder="Cuéntanos sobre tu proyecto o consulta..."
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  icon={!isSubmitting ? <Icon name="FiSend" /> : null}
                >
                  {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </form>
            </Card>

            {/* Contact Info & WhatsApp */}
            <div className="space-y-8">
              {/* Contact Information */}
              <Card
                variant="light"
                padding="xl"
                className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              >
                <Heading
                  level={3}
                  className="mb-6 text-blue-900 dark:text-blue-100"
                >
                  Información de contacto
                </Heading>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="FiMail" className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        Email
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        info@aimec-ec.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="FiPhone" className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        Teléfono
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        +1 234 567 890
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="FiMapPin" className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        Dirección
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        Cuenca, Ecuador
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* WhatsApp Button */}
              <Card variant="success" padding="xl">
                <Heading
                  level={3}
                  className="mb-4 text-green-800 dark:text-green-200"
                >
                  ¿Necesitas respuesta rápida?
                </Heading>
                <p className="text-green-700 dark:text-green-300 mb-6">
                  Contáctanos por WhatsApp para obtener una respuesta inmediata
                  a tus consultas.
                </p>
                <Button
                  variant="primary"
                  mainColor={"green"}
                  textColor={"#fff"}
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
