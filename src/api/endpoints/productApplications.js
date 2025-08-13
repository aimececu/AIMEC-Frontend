import { apiRequest } from '../client';
import { ENDPOINTS } from '../../config/api';

export const productApplicationEndpoints = {
  // Obtener todas las aplicaciones
  async getApplications(filters = {}) {
    const endpoint = buildEndpoint(ENDPOINTS.PRODUCT_APPLICATIONS.LIST, filters);
    return await apiRequest(endpoint);
  },

  // Obtener aplicaciones por producto
  async getApplicationsByProduct(productId) {
    const endpoint = ENDPOINTS.PRODUCT_APPLICATIONS.BY_PRODUCT(productId);
    return await apiRequest(endpoint);
  },

  // Obtener aplicación por ID
  async getApplicationById(id) {
    const endpoint = ENDPOINTS.PRODUCT_APPLICATIONS.DETAIL(id);
    return await apiRequest(endpoint);
  },

  // Crear nueva aplicación
  async createApplication(data) {
    const endpoint = ENDPOINTS.PRODUCT_APPLICATIONS.CREATE;
    return await apiRequest(endpoint, {
      method: 'POST',
      body: data
    });
  },

  // Actualizar aplicación
  async updateApplication(id, data) {
    const endpoint = ENDPOINTS.PRODUCT_APPLICATIONS.UPDATE(id);
    return await apiRequest(endpoint, {
      method: 'PUT',
      body: data
    });
  },

  // Eliminar aplicación
  async deleteApplication(id) {
    const endpoint = ENDPOINTS.PRODUCT_APPLICATIONS.DELETE(id);
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
