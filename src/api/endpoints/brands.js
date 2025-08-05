// =====================================================
// ENDPOINTS DE MARCAS
// =====================================================

import { apiRequest } from '../client';

export const brandEndpoints = {
  // Obtener todas las marcas
  async getBrands() {
    return await apiRequest('/categories/brands');
  },

  // Obtener marca por ID
  async getBrandById(id) {
    return await apiRequest(`/categories/brands/${id}`);
  },

  // Crear marca
  async createBrand(brandData) {
    return await apiRequest('/categories/brands', {
      method: 'POST',
      body: JSON.stringify(brandData)
    });
  },

  // Actualizar marca
  async updateBrand(id, brandData) {
    return await apiRequest(`/categories/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brandData)
    });
  },

  // Eliminar marca
  async deleteBrand(id) {
    return await apiRequest(`/categories/brands/${id}`, {
      method: 'DELETE'
    });
  },

  // Obtener productos por marca
  async getProductsByBrand(brandId) {
    return await apiRequest(`/categories/brands/${brandId}/products`);
  }
};

export default brandEndpoints; 