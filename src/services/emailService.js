import { sendContactEmail, sendTestEmail, getEmailStatus } from '../api/endpoints/email';

/**
 * Servicio para manejo de correos electrónicos
 */
class EmailService {
  /**
   * Enviar correo de contacto desde el formulario
   * @param {Object} formData - Datos del formulario
   * @returns {Promise<Object>} Resultado del envío
   */
  async sendContactForm(formData) {
    try {
      // Validar datos requeridos
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Nombre, email y mensaje son requeridos');
      }

      // Validar formato de email básico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Por favor, ingresa un email válido');
      }

      // Validar longitud del mensaje
      if (formData.message.length < 10) {
        throw new Error('El mensaje debe tener al menos 10 caracteres');
      }

      if (formData.message.length > 2000) {
        throw new Error('El mensaje no puede exceder 2000 caracteres');
      }

      // Preparar datos para envío
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone ? formData.phone.trim() : null,
        company: formData.company ? formData.company.trim() : null,
        message: formData.message.trim()
      };

      // Enviar correo
      const result = await sendContactEmail(contactData);

      if (result.success) {
        return {
          success: true,
          message: result.message || 'Mensaje enviado exitosamente. Te contactaremos pronto.'
        };
      } else {
        throw new Error(result.error || 'Error enviando el mensaje');
      }

    } catch (error) {
      console.error('Error en sendContactForm:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        // Error de respuesta del servidor
        const errorMessage = error.response.data?.error || 'Error del servidor';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Error de red
        throw new Error('Error de conexión. Verifica tu conexión a internet e intenta nuevamente.');
      } else {
        // Error de validación u otro
        throw new Error(error.message || 'Error inesperado. Intenta nuevamente.');
      }
    }
  }

  /**
   * Enviar correo de prueba (solo en desarrollo)
   * @returns {Promise<Object>} Resultado del envío
   */
  async sendTest() {
    try {
      const result = await sendTestEmail();
      
      if (result.success) {
        return {
          success: true,
          message: result.message || 'Correo de prueba enviado exitosamente'
        };
      } else {
        throw new Error(result.error || 'Error enviando correo de prueba');
      }

    } catch (error) {
      console.error('Error en sendTest:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.error || 'Error del servidor';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Error de conexión. Verifica tu conexión a internet.');
      } else {
        throw new Error(error.message || 'Error inesperado.');
      }
    }
  }

  /**
   * Verificar estado de configuración de correo
   * @returns {Promise<Object>} Estado de configuración
   */
  async getStatus() {
    try {
      const result = await getEmailStatus();
      return result.data || result;
    } catch (error) {
      console.error('Error en getStatus:', error);
      throw new Error('Error verificando configuración de correo');
    }
  }

  /**
   * Validar datos del formulario de contacto
   * @param {Object} formData - Datos del formulario
   * @returns {Object} Resultado de la validación
   */
  validateContactForm(formData) {
    const errors = {};

    // Validar nombre
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Por favor, ingresa un email válido';
      }
    }

    // Validar mensaje
    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = 'El mensaje debe tener al menos 10 caracteres';
    } else if (formData.message.length > 2000) {
      errors.message = 'El mensaje no puede exceder 2000 caracteres';
    }

    // Validar teléfono (opcional)
    if (formData.phone && formData.phone.length > 20) {
      errors.phone = 'El teléfono no puede exceder 20 caracteres';
    }

    // Validar empresa (opcional)
    if (formData.company && formData.company.length > 100) {
      errors.company = 'El nombre de la empresa no puede exceder 100 caracteres';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// Exportar instancia única del servicio
export default new EmailService();
