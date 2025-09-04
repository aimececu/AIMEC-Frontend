import { sendQuotation } from '../api/endpoints/quotations';

/**
 * Servicio para manejo de cotizaciones
 */
class QuotationService {
  /**
   * Enviar cotización por email
   * @param {Object} quotationData - Datos de la cotización
   * @returns {Promise<Object>} Resultado del envío
   */
  async sendQuotation(quotationData) {
    try {
      // Validar datos requeridos
      if (!quotationData.customerInfo || !quotationData.items || quotationData.items.length === 0) {
        throw new Error('Información del cliente e items son requeridos');
      }

      const { customerInfo, items, total, notes } = quotationData;

      // Validar información del cliente
      if (!customerInfo.name || !customerInfo.email) {
        throw new Error('Nombre y email del cliente son requeridos');
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerInfo.email)) {
        throw new Error('Por favor, ingresa un email válido');
      }

      // Validar items
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Debe incluir al menos un item en la cotización');
      }

      // Validar que cada item tenga los datos requeridos
      for (const item of items) {
        if ((!item.productId && !item.id) || !item.quantity || !item.price) {
          throw new Error('Cada item debe tener producto, cantidad y precio');
        }
      }

      // Preparar datos para envío usando el método de formateo
      const quotationPayload = this.formatQuotationData({
        customerInfo,
        items,
        notes,
        total
      });

      // Enviar cotización
      const result = await sendQuotation(quotationPayload);

      if (result.success) {
        return {
          success: true,
          message: result.message || 'Cotización enviada exitosamente'
        };
      } else {
        throw new Error(result.error || 'Error enviando la cotización');
      }

    } catch (error) {
      console.error('Error en sendQuotation:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        const errorMessage = error.response.data?.error || 'Error del servidor';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Error de conexión. Verifica tu conexión a internet e intenta nuevamente.');
      } else {
        throw new Error(error.message || 'Error inesperado. Intenta nuevamente.');
      }
    }
  }


  /**
   * Validar datos de cotización
   * @param {Object} quotationData - Datos de la cotización
   * @returns {Object} Resultado de la validación
   */
  validateQuotationData(quotationData) {
    const errors = {};

    // Validar información del cliente
    if (!quotationData.customerInfo) {
      errors.customerInfo = 'Información del cliente es requerida';
    } else {
      const { customerInfo } = quotationData;
      
      if (!customerInfo.name || customerInfo.name.trim().length < 2) {
        errors.customerName = 'El nombre debe tener al menos 2 caracteres';
      }

      if (!customerInfo.email) {
        errors.customerEmail = 'El email es requerido';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerInfo.email)) {
          errors.customerEmail = 'Por favor, ingresa un email válido';
        }
      }

      if (customerInfo.phone && customerInfo.phone.length > 20) {
        errors.customerPhone = 'El teléfono no puede exceder 20 caracteres';
      }

      if (customerInfo.company && customerInfo.company.length > 100) {
        errors.customerCompany = 'El nombre de la empresa no puede exceder 100 caracteres';
      }
    }

    // Validar items
    if (!quotationData.items || !Array.isArray(quotationData.items) || quotationData.items.length === 0) {
      errors.items = 'Debe incluir al menos un item en la cotización';
    } else {
      quotationData.items.forEach((item, index) => {
        // Aceptar tanto productId como id (para compatibilidad con carrito)
        if (!item.productId && !item.id) {
          errors[`item_${index}_product`] = 'Producto es requerido';
        }
        if (!item.quantity || item.quantity <= 0) {
          errors[`item_${index}_quantity`] = 'Cantidad debe ser mayor a 0';
        }
        if (!item.price || item.price <= 0) {
          errors[`item_${index}_price`] = 'Precio debe ser mayor a 0';
        }
      });
    }

    // Validar total
    if (!quotationData.total || quotationData.total <= 0) {
      errors.total = 'El total debe ser mayor a 0';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Calcular total de la cotización
   * @param {Array} items - Items de la cotización
   * @returns {number} Total calculado
   */
  calculateTotal(items) {
    if (!Array.isArray(items)) return 0;
    
    return items.reduce((total, item) => {
      const itemTotal = (item.quantity || 0) * (item.price || 0);
      return total + itemTotal;
    }, 0);
  }

  /**
   * Formatear datos de cotización para envío
   * @param {Object} quotationData - Datos de la cotización
   * @returns {Object} Datos formateados
   */
  formatQuotationData(quotationData) {
    const { customerInfo, items, notes } = quotationData;
    
    return {
      customerInfo: {
        name: customerInfo.name?.trim() || '',
        email: customerInfo.email?.trim().toLowerCase() || '',
        phone: customerInfo.phone?.trim() || null,
        company: customerInfo.company?.trim() || null
      },
      items: items.map(item => ({
        productId: item.productId || item.id, // Usar productId o id
        productName: item.productName || item.name || '',
        quantity: parseInt(item.quantity) || 0,
        price: parseFloat(item.price) || 0,
        total: parseFloat(item.total) || (parseInt(item.quantity) * parseFloat(item.price))
      })),
      total: this.calculateTotal(items),
      notes: notes?.trim() || null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  }
}

// Exportar instancia única del servicio
export default new QuotationService();
