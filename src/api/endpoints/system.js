// =====================================================
// ENDPOINTS DEL SISTEMA
// =====================================================

import { apiRequest } from '../client';
import { ENDPOINTS } from '../../config/api';

export const systemEndpoints = {
  // Health check
  async healthCheck() {
    return await apiRequest(ENDPOINTS.SYSTEM.HEALTH);
  },

  // Información de la API
  async getApiInfo() {
    return await apiRequest(ENDPOINTS.SYSTEM.INFO);
  },

  // Test CORS
  async testCors() {
    return await apiRequest('/test-cors');
  }
};

export default systemEndpoints; 