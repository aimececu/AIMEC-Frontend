// =====================================================
// ENDPOINTS DE APLICACIONES
// =====================================================

import { apiRequest, buildEndpoint } from '../client';
import { ENDPOINTS } from '../../config/api';

export const applicationEndpoints = {
  // Obtener todas las aplicaciones
  async getApplications(filters = {}) {
    const endpoint = buildEndpoint(ENDPOINTS.APPLICATIONS.LIST, filters);
    return await apiRequest(endpoint);
  },

  // Obtener aplicación por ID
  async getApplicationById(id) {
    return await apiRequest(ENDPOINTS.APPLICATIONS.DETAIL(id));
  },

  // Crear aplicación
  async createApplication(applicationData) {
    return await apiRequest(ENDPOINTS.APPLICATIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  },

  // Actualizar aplicación
  async updateApplication(id, applicationData) {
    return await apiRequest(ENDPOINTS.APPLICATIONS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(applicationData)
    });
  },

  // Eliminar aplicación
  async deleteApplication(id) {
    return await apiRequest(ENDPOINTS.APPLICATIONS.DELETE(id), {
      method: 'DELETE'
    });
  }
};

export default applicationEndpoints;
