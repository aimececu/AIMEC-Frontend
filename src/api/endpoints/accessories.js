import { apiRequest } from '../client';

/**
 * Obtiene los accesorios compatibles para un producto
 * @param {number} productId - ID del producto principal
 * @returns {Promise<Object>} Lista de accesorios
 */
export const getAccessoriesByProduct = async (productId) => {
  try {
    const response = await apiRequest(`/accessories/product/${productId}`);
    return response;
  } catch (error) {
    console.error('Error al obtener accesorios:', error);
    throw error;
  }
};

/**
 * Crea una nueva relación de accesorio
 * @param {Object} accessoryData - Datos del accesorio
 * @param {number} accessoryData.main_product_id - ID del producto principal
 * @param {number} accessoryData.accessory_product_id - ID del producto accesorio
 * @returns {Promise<Object>} Accesorio creado
 */
export const createAccessory = async (accessoryData) => {
  try {
    const response = await apiRequest('/accessories', {
      method: 'POST',
      body: accessoryData
    });
    return response;
  } catch (error) {
    console.error('Error al crear accesorio:', error);
    throw error;
  }
};

/**
 * Elimina una relación de accesorio
 * @param {number} accessoryId - ID de la relación de accesorio
 * @returns {Promise<Object>} Respuesta de eliminación
 */
export const deleteAccessory = async (accessoryId) => {
  try {
    const response = await apiRequest(`/accessories/${accessoryId}`, {
      method: 'DELETE'
    });
    return response;
  } catch (error) {
    console.error('Error al eliminar accesorio:', error);
    throw error;
  }
};
