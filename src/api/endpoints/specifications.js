// =====================================================
// ENDPOINTS DE ESPECIFICACIONES
// =====================================================

import { apiRequest, buildEndpoint } from '../client';
import { ENDPOINTS } from '../../config/api';

export const specificationEndpoints = {
  // Obtener todas las especificaciones
  async getSpecifications(filters = {}) {
    const endpoint = buildEndpoint(ENDPOINTS.SPECIFICATIONS.LIST, filters);
    return await apiRequest(endpoint);
  },

  // Obtener especificación por ID
  async getSpecificationById(id) {
    return await apiRequest(ENDPOINTS.SPECIFICATIONS.DETAIL(id));
  },

  // Crear especificación
  async createSpecification(specData) {
    return await apiRequest(ENDPOINTS.SPECIFICATIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(specData)
    });
  },

  // Actualizar especificación
  async updateSpecification(id, specData) {
    return await apiRequest(ENDPOINTS.SPECIFICATIONS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(specData)
    });
  },

  // Eliminar especificación
  async deleteSpecification(id) {
    return await apiRequest(ENDPOINTS.SPECIFICATIONS.DELETE(id), {
      method: 'DELETE'
    });
  },

  // Obtener especificaciones por producto
  async getSpecificationsByProduct(productId) {
    return await apiRequest(`/specifications/product/${productId}`);
  },

  // Obtener especificaciones por categoría
  async getSpecificationsByCategory(categoryId) {
    return await apiRequest(`/specifications/category/${categoryId}`);
  },

  // Obtener tipos de especificaciones
  async getSpecificationTypes(categoryId = null) {
    const endpoint = categoryId 
      ? `/specifications/types?category=${categoryId}`
      : '/specifications/types';
    return await apiRequest(endpoint);
  },

  // Crear tipo de especificación
  async createSpecificationType(typeData) {
    return await apiRequest('/specifications/types', {
      method: 'POST',
      body: JSON.stringify(typeData)
    });
  },

  // Buscar especificaciones
  async searchSpecifications(searchTerm, filters = {}) {
    const searchFilters = { ...filters, search: searchTerm };
    const endpoint = buildEndpoint('/specifications', searchFilters);
    return await apiRequest(endpoint);
  }
};

export default specificationEndpoints; 