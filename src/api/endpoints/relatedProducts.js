import { apiRequest, buildEndpoint } from '../client';
import { ENDPOINTS } from '../../config/api';

/**
 * Endpoints para la gestión de productos relacionados
 */
export const relatedProductsEndpoints = {
  /**
   * Obtiene todos los productos relacionados para un producto específico
   * @param {number} productId - ID del producto principal
   * @returns {Promise<Object>} - Respuesta con productos relacionados
   */
  async getByProduct(productId) {
    return await apiRequest(ENDPOINTS.RELATED_PRODUCTS.BY_PRODUCT(productId));
  },

  /**
   * Crea una nueva relación de producto relacionado
   * @param {Object} data - Datos de la relación
   * @param {number} data.product_id - ID del producto principal
   * @param {number} data.related_product_id - ID del producto relacionado
   * @param {string} data.relationship_type - Tipo de relación

   * @returns {Promise<Object>} - Respuesta con el producto relacionado creado
   */
  async create(data) {
    return await apiRequest(ENDPOINTS.RELATED_PRODUCTS.CREATE, {
      method: 'POST',
      body: data
    });
  },

  /**
   * Crea múltiples productos relacionados con el mismo tipo de relación
   * @param {Object} data - Datos de la operación
   * @param {number} data.product_id - ID del producto principal
   * @param {string} data.relationship_type - Tipo de relación para todos los productos
   * @param {Array<number>} data.products - Array de IDs de productos a relacionar
 inicial
   * @returns {Promise<Object>} - Respuesta con el resultado de la operación
   */
  async createMultiple(data) {
    return await apiRequest(ENDPOINTS.RELATED_PRODUCTS.CREATE_MULTIPLE, {
      method: 'POST',
      body: data
    });
  },

  /**
   * Actualiza una relación de producto relacionado
   * @param {number} id - ID de la relación
   * @param {Object} data - Datos a actualizar
   * @param {string} [data.relationship_type] - Nuevo tipo de relación

   * @returns {Promise<Object>} - Respuesta con el producto relacionado actualizado
   */
  async update(id, data) {
    return await apiRequest(ENDPOINTS.RELATED_PRODUCTS.UPDATE(id), {
      method: 'PUT',
      body: data
    });
  },

  /**
   * Elimina una relación de producto relacionado
   * @param {number} id - ID de la relación a eliminar
   * @returns {Promise<Object>} - Respuesta de confirmación
   */
  async delete(id) {
    return await apiRequest(ENDPOINTS.RELATED_PRODUCTS.DELETE(id), {
      method: 'DELETE'
    });
  },


};

export default relatedProductsEndpoints;
