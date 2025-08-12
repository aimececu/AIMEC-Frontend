import { apiRequest } from '../client';
import { ENDPOINTS } from '../../config/api';

export const infoEndpoints = {
  // Obtener estadísticas del sistema
  async getSystemStats() {
    try {
      const response = await apiRequest(ENDPOINTS.INFO.STATS, {
        method: 'GET'
      });
      
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas del sistema:', error);
      throw error;
    }
  }
};
