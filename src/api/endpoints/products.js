// =====================================================
// ENDPOINTS DE PRODUCTOS
// =====================================================

import { apiRequest, buildEndpoint } from '../client';

export const productEndpoints = {
  // Obtener todos los productos
  async getProducts(filters = {}) {
    const endpoint = buildEndpoint('/products', filters);
    return await apiRequest(endpoint);
  },

  // Obtener producto por ID
  async getProductById(id) {
    return await apiRequest(`/products/${id}`);
  },

  // Crear producto
  async createProduct(productData) {
    return await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  // Actualizar producto
  async updateProduct(id, productData) {
    return await apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  // Eliminar producto
  async deleteProduct(id) {
    return await apiRequest(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Obtener estadísticas de productos
  async getProductStats() {
    return await apiRequest('/products/stats');
  },

  // Buscar productos por término
  async searchProducts(searchTerm, filters = {}) {
    const searchFilters = { ...filters, search: searchTerm };
    const endpoint = buildEndpoint('/products', searchFilters);
    return await apiRequest(endpoint);
  },

  // Obtener productos por categoría
  async getProductsByCategory(categoryId, filters = {}) {
    const categoryFilters = { ...filters, category: categoryId };
    const endpoint = buildEndpoint('/products', categoryFilters);
    return await apiRequest(endpoint);
  },

  // Obtener productos destacados
  async getFeaturedProducts(limit = 10) {
    const endpoint = buildEndpoint('/products', { featured: true, limit });
    return await apiRequest(endpoint);
  },

  // Obtener productos en oferta
  async getProductsOnSale(filters = {}) {
    const saleFilters = { ...filters, onSale: true };
    const endpoint = buildEndpoint('/products', saleFilters);
    return await apiRequest(endpoint);
  }
};

export default productEndpoints; 