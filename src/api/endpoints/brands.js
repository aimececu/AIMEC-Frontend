// ENDPOINTS DE MARCAS
import { apiRequest } from '../client';
import { ENDPOINTS } from '../../config/api';

export const brandEndpoints = {
  async getBrands() {
    return await apiRequest(ENDPOINTS.BRANDS.LIST);
  },

  async getBrandById(id) {
    return await apiRequest(ENDPOINTS.BRANDS.DETAIL(id));
  },

  async createBrand(brandData) {
    return await apiRequest(ENDPOINTS.BRANDS.CREATE, {
      method: 'POST',
      body: brandData
    });
  },

  async updateBrand(id, brandData) {
    return await apiRequest(ENDPOINTS.BRANDS.UPDATE(id), {
      method: 'PUT',
      body: brandData
    });
  },

  async deleteBrand(id) {
    return await apiRequest(ENDPOINTS.BRANDS.DELETE(id), {
      method: 'DELETE'
    });
  }
};

export default brandEndpoints; 