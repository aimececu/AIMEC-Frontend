// =====================================================
// ENDPOINTS DE CATEGORÍAS
// =====================================================

import { apiRequest } from '../client';

export const categoryEndpoints = {
  // Obtener todas las categorías
  async getCategories() {
    return await apiRequest('/categories');
  },

  // Obtener categoría por ID
  async getCategoryById(id) {
    return await apiRequest(`/categories/${id}`);
  },

  // Crear categoría
  async createCategory(categoryData) {
    return await apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  },

  // Actualizar categoría
  async updateCategory(id, categoryData) {
    return await apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  },

  // Eliminar categoría
  async deleteCategory(id) {
    return await apiRequest(`/categories/${id}`, {
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