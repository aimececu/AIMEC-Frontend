import React, { useState, useRef, useEffect } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Icon from "../../components/ui/Icon";
import Input from "../../components/ui/Input";
import Section from "../../components/ui/Section";
import TextArea from "../../components/ui/TextArea";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import emailService from "../../services/emailService";

const Services = () => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const formRef = useRef(null);
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);

  // Efecto para animaciones de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.getAttribute('data-card-id');
            setVisibleCards(prev => [...prev, cardId]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('[data-card-id]');
    cards.forEach(card => observer.observe(card));

    return () => {
      cards.forEach(card => observer.unobserve(card));
    };
  }, []);

  const services = [
    {
      id: "presentacion-corporativa",
      title:
        "Servicios de Ingeniería Mecatrónica, Automatización y Control Industrial",
      description:
        "Programación y automatización de procesos productivos, integración de sistemas de control, levantamiento y diseño de planos eléctricos, construcción de tableros eléctricos y suministro de equipos industriales.",
      icon: "FiCpu",
      color: "blue",
    },
    {
      id: "automatizacion-industrial",
      title: "Automatización Industrial",
      description:
        "Programación de PLCs, HMIs e IPCs. Integración de redes industriales (PROFIBUS, PROFINET, Gateways) e instrumentación. Programación de equipos de seguridad industrial.",
      icon: "FiSettings",
      color: "green",
    },
    {
      id: "productos-industriales",
      title: "Equipos y Soluciones Industriales",
      description:
        "Venta de PLCs, variadores de frecuencia, sensores, breakers, cajas moldeadas, luminarias y equipos industriales, abarcando todo lo referente a automatización y control. Trabajamos con marcas reconocidas como Siemens, Beckhoff, ABB, Delta, Chint y más.",
      icon: "FiPackage",
      color: "purple",
    },
    {
      id: "tableros-electricos",
      title: "Diseño, Construcción y Montaje de Tableros Eléctricos",
      description:
        "Diseño, construcción y montaje de tableros eléctricos de potencia y control, con cableado normado bajo estándares internacionales IEC e ISO. Garantizamos seguridad, eficiencia y confiabilidad en cada proyecto.",
      icon: "FiZap",
      color: "orange",
    },
    {
      id: "planos-electricos",
      title: "Levantamiento y Diseño de Planos Eléctricos",
      description:
        "Levantamiento de instalaciones y elaboración de planos eléctricos en EPLAN y CAD, cumpliendo normativas internacionales y adaptados a cada necesidad industrial.",
      icon: "FiFileText",
      color: "red",
    },
  ];

  const handleServiceClick = (serviceId, serviceTitle) => {
    setSelectedService(serviceId);
    setFormData((prev) => ({
      ...prev,
      service: serviceTitle,
    }));

    // Scroll al formulario con un pequeño delay para asegurar que el estado se actualice
    setTimeout(() => {
      if (formRef.current) {
        const element = formRef.current;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 80; // 80px de offset para el navbar

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 150);
  };

  const handleInputChange = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    const validation = emailService.validateServiceForm(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      showToast(firstError, "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await emailService.sendServiceForm(formData);

      if (result.success) {
        showToast(result.message, "success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          message: "",
        });
        setSelectedService("");
      }
    } catch (error) {
      showToast(error.message, "error");
      console.error("Error enviando formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-white dark:bg-secondary-800",
        border: "border-secondary-200 dark:border-secondary-700",
        text: "text-secondary-900 dark:text-white",
        icon: "text-primary-600 dark:text-primary-400",
        button: "bg-primary-600 hover:bg-primary-700",
      },
      green: {
        bg: "bg-white dark:bg-secondary-800",
        border: "border-secondary-200 dark:border-secondary-700",
        text: "text-secondary-900 dark:text-white",
        icon: "text-primary-600 dark:text-primary-400",
        button: "bg-primary-600 hover:bg-primary-700",
      },
      purple: {
        bg: "bg-white dark:bg-secondary-800",
        border: "border-secondary-200 dark:border-secondary-700",
        text: "text-secondary-900 dark:text-white",
        icon: "text-primary-600 dark:text-primary-400",
        button: "bg-primary-600 hover:bg-primary-700",
      },
      orange: {
        bg: "bg-white dark:bg-secondary-800",
        border: "border-secondary-200 dark:border-secondary-700",
        text: "text-secondary-900 dark:text-white",
        icon: "text-primary-600 dark:text-primary-400",
        button: "bg-primary-600 hover:bg-primary-700",
      },
      red: {
        bg: "bg-white dark:bg-secondary-800",
        border: "border-secondary-200 dark:border-secondary-700",
        text: "text-secondary-900 dark:text-white",
        icon: "text-primary-600 dark:text-primary-400",
        button: "bg-primary-600 hover:bg-primary-700",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section background="primary" padding="xl">
        <Container>
          <div className="text-center">
            <Heading level={1} className="mb-6 text-white">
              Nuestros Servicios
            </Heading>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Soluciones integrales en ingeniería mecatrónica, automatización y
              control industrial. Especialistas en tecnología de vanguardia para
              el sector industrial.
            </p>
          </div>
        </Container>
      </Section>

      {/* Services List */}
      <Section background="default" padding="xl">
        <Container>
          <div className="space-y-8">
            {services.map((service, index) => {
              const colorClasses = getColorClasses(service.color);
              const isEven = index % 2 === 0;
              const isVisible = visibleCards.includes(service.id);

              return (
                <Card
                  key={service.id}
                  data-card-id={service.id}
                  variant="light"
                  padding="xl"
                  hover
                  className={`${colorClasses.bg} ${colorClasses.border} border-2 transition-all duration-500 hover:shadow-xl transform ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <div
                    className={`flex flex-col ${
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    } items-center gap-8`}
                  >
                    {/* Icon/Image Section */}
                    <div className="flex-shrink-0 w-full lg:w-1/3">
                      <div
                        className={`w-32 h-32 mx-auto lg:mx-0 rounded-2xl ${colorClasses.bg} flex items-center justify-center shadow-lg`}
                      >
                        <Icon
                          name={service.icon}
                          size="xl"
                          className={`${colorClasses.icon} text-4xl`}
                        />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 text-center lg:text-left">
                      <Heading
                        level={3}
                        className={`mb-4 ${colorClasses.text}`}
                      >
                        {service.title}
                      </Heading>
                      <p className="text-secondary-600 dark:text-secondary-300 mb-6 leading-relaxed text-lg">
                        {service.description}
                      </p>
                      <Button
                        variant="primary"
                        size="lg"
                        className={`${colorClasses.button} w-full sm:w-auto`}
                        onClick={() =>
                          handleServiceClick(service.id, service.title)
                        }
                        icon={<Icon name="FiMail" />}
                      >
                        Solicitar Información
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Contact Form Section */}
      <div ref={formRef} className="animate-fade-in-up">
        <Section background="light" padding="xl">
          <Container>
            <div className="text-center mb-12">
              <Heading level={2} className="mb-4">
                Solicita Información sobre Nuestros Servicios
              </Heading>
              <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
                {selectedService
                  ? `Completa el formulario para obtener más información sobre: ${formData.service}`
                  : "Selecciona un servicio arriba o completa el formulario para contactarnos"}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card variant="light" padding="xl">
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <Input
                    label="Servicio de interés"
                    name="service"
                    value={formData.service}
                    onChange={(value) => handleInputChange(value, "service")}
                    placeholder="Selecciona un servicio o escribe el que te interesa"
                    disabled={!!selectedService}
                  />

                  <TextArea
                    label="Mensaje *"
                    name="message"
                    value={formData.message}
                    onChange={(value) => handleInputChange(value, "message")}
                    required
                    rows="4"
                    placeholder="Cuéntanos sobre tu proyecto o consulta específica..."
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
                    {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                  </Button>
                </form>
              </Card>
            </div>
          </Container>
        </Section>
      </div>

    </div>
  );
};

export default Services;
