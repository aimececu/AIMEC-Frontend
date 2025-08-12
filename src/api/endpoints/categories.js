// ENDPOINTS DE CATEGORÍAS
import { apiRequest } from '../client';
import { ENDPOINTS } from '../../config/api';

export const categoryEndpoints = {
  // Categorías
  async getCategories() {
    return await apiRequest(ENDPOINTS.CATEGORIES.LIST);
  },

  async getCategoryById(id) {
    return await apiRequest(ENDPOINTS.CATEGORIES.DETAIL(id));
  },

  async createCategory(categoryData) {
    return await apiRequest(ENDPOINTS.CATEGORIES.CREATE, {
      method: 'POST',
      body: categoryData
    });
  },

  async updateCategory(id, categoryData) {
    return await apiRequest(ENDPOINTS.CATEGORIES.UPDATE(id), {
      method: 'PUT',
      body: categoryData
    });
  },

  async deleteCategory(id) {
    return await apiRequest(ENDPOINTS.CATEGORIES.DELETE(id), {
      method: 'DELETE'
    });
  },

  // Subcategorías
  // Obtener todas las subcategorías
  getAllSubcategories() {
    return apiRequest(ENDPOINTS.SUBCATEGORIES.LIST, { method: 'GET' });
  },

  // Obtener subcategorías por categoría
  getSubcategoriesByCategory(categoryId) {
    return apiRequest(ENDPOINTS.SUBCATEGORIES.BY_CATEGORY(categoryId), { method: 'GET' });
  },

  // Obtener subcategoría por ID
  getSubcategoryById(id) {
    return apiRequest(ENDPOINTS.SUBCATEGORIES.DETAIL(id), { method: 'GET' });
  },

  // Crear subcategoría
  createSubcategory(data) {
    return apiRequest(ENDPOINTS.SUBCATEGORIES.CREATE, {
      method: 'POST',
      body: data
    });
  },

  // Actualizar subcategoría
  updateSubcategory(id, data) {
    return apiRequest(ENDPOINTS.SUBCATEGORIES.UPDATE(id), {
      method: 'PUT',
      body: data
    });
  },

  // Eliminar subcategoría
  deleteSubcategory(id) {
    return apiRequest(ENDPOINTS.SUBCATEGORIES.DELETE(id), { method: 'DELETE' });
  }
};

export default categoryEndpoints; 