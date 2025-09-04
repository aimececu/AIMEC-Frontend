import { apiRequest } from '../client';
import { ENDPOINTS } from '../../config/api';

/**
 * Enviar cotización por email
 * @param {Object} quotationData - Datos de la cotización a enviar
 * @param {Object} quotationData.customerInfo - Información del cliente
 * @param {string} quotationData.customerInfo.name - Nombre del cliente
 * @param {string} quotationData.customerInfo.email - Email del cliente
 * @param {string} quotationData.customerInfo.phone - Teléfono del cliente
 * @param {string} quotationData.customerInfo.company - Empresa del cliente
 * @param {Array} quotationData.items - Items de la cotización
 * @param {number} quotationData.total - Total de la cotización
 * @param {string} quotationData.notes - Notas adicionales
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const sendQuotation = async (quotationData) => {
  try {
    const response = await apiRequest(ENDPOINTS.QUOTATIONS.SEND, {
      method: 'POST',
      body: quotationData
    });
    return response;
  } catch (error) {
    console.error('Error enviando cotización:', error);
    throw error;
  }
};
