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
  async getSubcategories(categoryId) {
    if (categoryId) {
      return await apiRequest(ENDPOINTS.CATEGORIES.SUBCATEGORIES.BY_CATEGORY(categoryId));
    }
    return await apiRequest(ENDPOINTS.CATEGORIES.SUBCATEGORIES.LIST);
  },

  async getAllSubcategories() {
    return await apiRequest(ENDPOINTS.CATEGORIES.SUBCATEGORIES.LIST);
  },

  async getSubcategoryById(id) {
    return await apiRequest(ENDPOINTS.CATEGORIES.SUBCATEGORIES.DETAIL(id));
  },

  async createSubcategory(subcategoryData) {
    return await apiRequest(ENDPOINTS.CATEGORIES.SUBCATEGORIES.CREATE, {
      method: 'POST',
      body: subcategoryData
    });
  },

  async updateSubcategory(id, subcategoryData) {
    return await apiRequest(ENDPOINTS.CATEGORIES.SUBCATEGORIES.UPDATE(id), {
      method: 'PUT',
      body: subcategoryData
    });
  },

  async deleteSubcategory(id) {
    return await apiRequest(ENDPOINTS.CATEGORIES.SUBCATEGORIES.DELETE(id), {
      method: 'DELETE'
    });
  }
};

export default categoryEndpoints; 