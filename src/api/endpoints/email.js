import { apiRequest } from '../client';
import { ENDPOINTS } from '../../config/api';

/**
 * Enviar correo de contacto
 * @param {Object} contactData - Datos del formulario de contacto
 * @param {string} contactData.name - Nombre completo
 * @param {string} contactData.email - Email del contacto
 * @param {string} contactData.phone - Teléfono (opcional)
 * @param {string} contactData.company - Empresa (opcional)
 * @param {string} contactData.message - Mensaje
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const sendContactEmail = async (contactData) => {
  try {
    const response = await apiRequest(ENDPOINTS.EMAIL.CONTACT, {
      method: 'POST',
      body: contactData
    });
    return response;
  } catch (error) {
    console.error('Error enviando correo de contacto:', error);
    throw error;
  }
};

/**
 * Enviar correo de prueba (solo en desarrollo)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const sendTestEmail = async () => {
  try {
    const response = await apiRequest(ENDPOINTS.EMAIL.TEST, {
      method: 'POST'
    });
    return response;
  } catch (error) {
    console.error('Error enviando correo de prueba:', error);
    throw error;
  }
};

/**
 * Verificar estado de configuración de correo
 * @returns {Promise<Object>} Estado de configuración
 */
export const getEmailStatus = async () => {
  try {
    const response = await apiRequest(ENDPOINTS.EMAIL.STATUS, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Error verificando estado de correo:', error);
    throw error;
  }
};
