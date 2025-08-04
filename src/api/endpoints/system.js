// =====================================================
// ENDPOINTS DEL SISTEMA
// =====================================================

import { apiRequest } from '../client';

export const systemEndpoints = {
  // Health check
  async healthCheck() {
    return await apiRequest('/health');
  },

  // Información de la API
  async getApiInfo() {
    return await apiRequest('/');
  },

  // Obtener estadísticas del sistema
  async getSystemStats() {
    return await apiRequest('/system/stats');
  },

  // Obtener configuración del sistema
  async getSystemConfig() {
    return await apiRequest('/system/config');
  },

  // Verificar estado de la base de datos
  async checkDatabaseStatus() {
    return await apiRequest('/system/database/status');
  },

  // Obtener logs del sistema (solo admin)
  async getSystemLogs(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/system/logs?${queryString}` : '/system/logs';
    return await apiRequest(endpoint);
  },

  // Limpiar logs del sistema (solo admin)
  async clearSystemLogs() {
    return await apiRequest('/system/logs', {
      method: 'DELETE'
    });
  },

  // Obtener información de versiones
  async getVersionInfo() {
    return await apiRequest('/system/version');
  },

  // Ping del servidor
  async ping() {
    return await apiRequest('/system/ping');
  }
};

export default systemEndpoints; 