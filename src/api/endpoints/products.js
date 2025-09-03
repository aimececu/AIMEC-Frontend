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
      body: productData
    });
  },

  // Actualizar producto
  async updateProduct(id, productData) {
    return await apiRequest(ENDPOINTS.PRODUCTS.UPDATE(id), {
      method: 'PUT',
      body: productData
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
    const searchFilters = { ...filters, search: searchTerm };
    const endpoint = buildEndpoint(ENDPOINTS.PRODUCTS.SEARCH, searchFilters);
    return await apiRequest(endpoint);
  },

  // Obtener productos por categoría
  async getProductsByCategory(categoryId, filters = {}) {
    const endpoint = buildEndpoint(ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId), filters);
    return await apiRequest(endpoint);
  },

  // Obtener productos por marca
  async getProductsByBrand(brandId) {
    return await apiRequest(ENDPOINTS.PRODUCTS.BY_BRAND(brandId));
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

  // Crear aplicación para un producto
  async createProductApplication(productId, applicationIds) {
    return await apiRequest(ENDPOINTS.PRODUCTS.APPLICATIONS(productId), {
      method: 'POST',
      body: { applicationIds }
    });
  },

  // =====================================================
  // PRODUCT FEATURES
  // =====================================================

  // Obtener características de un producto
  async getProductFeatures(productId) {
    return await apiRequest(ENDPOINTS.PRODUCTS.FEATURES(productId));
  },

  // Crear característica para un producto
  async createProductFeature(productId, featureData) {
    return await apiRequest(ENDPOINTS.PRODUCTS.FEATURES(productId), {
      method: 'POST',
      body: featureData
    });
  },

  // Actualizar característica de un producto
  async updateProductFeature(productId, featureId, featureData) {
    return await apiRequest(ENDPOINTS.PRODUCTS.FEATURES(productId), {
      method: 'PUT',
      body: featureData
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
  async getRelatedProducts(productId) {
    return await apiRequest(ENDPOINTS.PRODUCTS.RELATED(productId));
  },

  // Crear relación entre productos
  async createProductRelation(productId, relatedData) {
    return await apiRequest(ENDPOINTS.PRODUCTS.RELATED(productId), {
      method: 'POST',
      body: relatedData
    });
  },

  // Actualizar relación entre productos
  async updateProductRelation(productId, relationId, relatedData) {
    return await apiRequest(ENDPOINTS.PRODUCTS.RELATED(productId), {
      method: 'PUT',
      body: relatedData
    });
  },

  // Eliminar producto relacionado
  async deleteProductRelated(productId, relatedId) {
    return await apiRequest(`${ENDPOINTS.PRODUCTS.RELATED(productId)}/${relatedId}`, {
      method: 'DELETE'
    });
  },

  // =====================================================
  // EXPORT
  // =====================================================

  // Exportar productos con todas sus relaciones
  async exportProductsWithRelations() {
    try {
      const response = await apiRequest('/products/export');
      return response;
    } catch (error) {
      console.error('Error al exportar productos con relaciones:', error);
      throw error;
    }
  },

  // Limpiar todos los productos
  async clearAllProducts() {
    try {
      const response = await apiRequest('/products/clear', {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Error al limpiar productos:', error);
      throw error;
    }
  }
};

export default productEndpoints; 