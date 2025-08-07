// =====================================================
// ENDPOINTS DE CATEGORÍAS
// =====================================================

import { apiRequest } from '../client';
import { ENDPOINTS } from '../../config/api';

export const categoryEndpoints = {
  // Obtener todas las categorías
  async getCategories() {
    return await apiRequest(ENDPOINTS.CATEGORIES.LIST);
  },

  // Obtener categoría por ID
  async getCategoryById(id) {
    return await apiRequest(ENDPOINTS.CATEGORIES.DETAIL(id));
  },

  // Crear categoría
  async createCategory(categoryData) {
    return await apiRequest(ENDPOINTS.CATEGORIES.CREATE, {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  },

  // Actualizar categoría
  async updateCategory(id, categoryData) {
    return await apiRequest(ENDPOINTS.CATEGORIES.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  },

  // Eliminar categoría
  async deleteCategory(id) {
    return await apiRequest(ENDPOINTS.CATEGORIES.DELETE(id), {
      method: 'DELETE'
    });
  },

  // Obtener subcategorías de una categoría
  async getSubcategories(categoryId) {
    return await apiRequest(`/categories/${categoryId}/subcategories`);
  },

  // Obtener categorías principales (sin padre)
  async getMainCategories() {
    return await apiRequest('/categories/main');
  },

  // Obtener árbol de categorías
  async getCategoryTree() {
    return await apiRequest('/categories/tree');
  },

  // Buscar categorías por nombre
  async searchCategories(searchTerm) {
    return await apiRequest(`/categories/search?q=${encodeURIComponent(searchTerm)}`);
  }
};

export default categoryEndpoints; 