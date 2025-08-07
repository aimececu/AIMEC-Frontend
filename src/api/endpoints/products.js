// =====================================================
// ENDPOINTS DE PRODUCTOS
// =====================================================

import { apiRequest, buildEndpoint } from '../client';
import { ENDPOINTS } from '../../config/api';

export const productEndpoints = {
  // Obtener todos los productos
  async getProducts(filters = {}) {
    const endpoint = buildEndpoint(ENDPOINTS.PRODUCTS.LIST, filters);
    return await apiRequest(endpoint);
  },

  // Obtener producto por ID
  async getProductById(id) {
    return await apiRequest(ENDPOINTS.PRODUCTS.DETAIL(id));
  },

  // Crear producto
  async createProduct(productData) {
    return await apiRequest(ENDPOINTS.PRODUCTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  // Actualizar producto
  async updateProduct(id, productData) {
    return await apiRequest(ENDPOINTS.PRODUCTS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  // Eliminar producto
  async deleteProduct(id) {
    return await apiRequest(ENDPOINTS.PRODUCTS.DELETE(id), {
      method: 'DELETE'
    });
  },

  // Obtener estadísticas de productos
  async getProductStats() {
    return await apiRequest(ENDPOINTS.PRODUCTS.STATS);
  },

  // Buscar productos
  async searchProducts(searchTerm, filters = {}) {
    const searchFilters = { ...filters, q: searchTerm };
    const endpoint = buildEndpoint(ENDPOINTS.PRODUCTS.SEARCH, searchFilters);
    return await apiRequest(endpoint);
  },

  // Obtener productos por categoría
  async getProductsByCategory(categoryId, filters = {}) {
    const endpoint = buildEndpoint(ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId), filters);
    return await apiRequest(endpoint);
  },

  // Obtener productos por marca
  async getProductsByBrand(brandId, filters = {}) {
    const endpoint = buildEndpoint(ENDPOINTS.PRODUCTS.BY_BRAND(brandId), filters);
    return await apiRequest(endpoint);
  },

  // Obtener productos destacados
  async getFeaturedProducts(limit = 10) {
    return await apiRequest(ENDPOINTS.PRODUCTS.FEATURED);
  },

  // Obtener producto por slug
  async getProductBySlug(slug) {
    return await apiRequest(ENDPOINTS.PRODUCTS.BY_SLUG(slug));
  },

  // =====================================================
  // PRODUCT APPLICATIONS
  // =====================================================

  // Obtener aplicaciones de un producto
  async getProductApplications(productId) {
    return await apiRequest(ENDPOINTS.PRODUCTS.APPLICATIONS(productId));
  },

  // Asignar aplicaciones a un producto
  async assignApplicationsToProduct(productId, applicationIds) {
    return await apiRequest(ENDPOINTS.PRODUCTS.APPLICATIONS(productId), {
      method: 'POST',
      body: JSON.stringify({ applicationIds })
    });
  },

  // =====================================================
  // PRODUCT FEATURES
  // =====================================================

  // Obtener características de un producto
  async getProductFeatures(productId) {
    return await apiRequest(ENDPOINTS.PRODUCTS.FEATURES(productId));
  },

  // Agregar característica a un producto
  async addProductFeature(productId, featureData) {
    return await apiRequest(ENDPOINTS.PRODUCTS.FEATURES(productId), {
      method: 'POST',
      body: JSON.stringify(featureData)
    });
  },

  // Actualizar característica de un producto
  async updateProductFeature(productId, featureId, featureData) {
    return await apiRequest(`${ENDPOINTS.PRODUCTS.FEATURES(productId)}/${featureId}`, {
      method: 'PUT',
      body: JSON.stringify(featureData)
    });
  },

  // Eliminar característica de un producto
  async deleteProductFeature(productId, featureId) {
    return await apiRequest(`${ENDPOINTS.PRODUCTS.FEATURES(productId)}/${featureId}`, {
      method: 'DELETE'
    });
  },

  // =====================================================
  // PRODUCT RELATED
  // =====================================================

  // Obtener productos relacionados
  async getProductRelated(productId) {
    return await apiRequest(ENDPOINTS.PRODUCTS.RELATED(productId));
  },

  // Agregar producto relacionado
  async addProductRelated(productId, relatedData) {
    return await apiRequest(ENDPOINTS.PRODUCTS.RELATED(productId), {
      method: 'POST',
      body: JSON.stringify(relatedData)
    });
  },

  // Actualizar producto relacionado
  async updateProductRelated(productId, relatedId, relatedData) {
    return await apiRequest(`${ENDPOINTS.PRODUCTS.RELATED(productId)}/${relatedId}`, {
      method: 'PUT',
      body: JSON.stringify(relatedData)
    });
  },

  // Eliminar producto relacionado
  async deleteProductRelated(productId, relatedId) {
    return await apiRequest(`${ENDPOINTS.PRODUCTS.RELATED(productId)}/${relatedId}`, {
      method: 'DELETE'
    });
  }
};

export default productEndpoints; 