import { apiRequest } from '../client';
import { ENDPOINTS } from '../../config/api';

export const productFeatureEndpoints = {
  // Obtener todas las características
  async getFeatures(filters = {}) {
    const endpoint = buildEndpoint(ENDPOINTS.PRODUCT_FEATURES.LIST, filters);
    return await apiRequest(endpoint);
  },

  // Obtener características por producto
  async getFeaturesByProduct(productId) {
    const endpoint = ENDPOINTS.PRODUCT_FEATURES.BY_PRODUCT(productId);
    return await apiRequest(endpoint);
  },

  // Obtener característica por ID
  async getFeatureById(id) {
    const endpoint = ENDPOINTS.PRODUCT_FEATURES.DETAIL(id);
    return await apiRequest(endpoint);
  },

  // Crear nueva característica
  async createFeature(data) {
    const endpoint = ENDPOINTS.PRODUCT_FEATURES.CREATE;
    return await apiRequest(endpoint, {
      method: 'POST',
      body: data
    });
  },

  // Actualizar característica
  async updateFeature(id, data) {
    const endpoint = ENDPOINTS.PRODUCT_FEATURES.UPDATE(id);
    return await apiRequest(endpoint, {
      method: 'PUT',
      body: data
    });
  },

  // Eliminar característica
  async deleteFeature(id) {
    const endpoint = ENDPOINTS.PRODUCT_FEATURES.DELETE(id);
    return await apiRequest(endpoint, {
      method: 'DELETE'
    });
  }
};

// Función auxiliar para construir endpoints con filtros
function buildEndpoint(baseEndpoint, filters = {}) {
  if (Object.keys(filters).length === 0) {
    return baseEndpoint;
  }
  
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;
}
