// =====================================================
// ENDPOINTS DE AUTENTICACIÓN
// =====================================================

import { apiRequest, authUtils } from '../client';
import { ENDPOINTS } from '../../config/api';

export const authEndpoints = {
  // Login
  async login(email, password) {
    const response = await apiRequest(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.success && response.data.sessionId) {
      authUtils.saveAuth(response.data.sessionId, response.data.user);
    }

    return response;
  },

  // Logout
  async logout() {
    try {
      await apiRequest(ENDPOINTS.AUTH.LOGOUT, { method: 'POST' });
    } catch (error) {
      console.warn('Error en logout:', error);
    } finally {
      authUtils.clearAuth();
    }
  },

  // Verificar autenticación
  async verifyAuth() {
    try {
      const response = await apiRequest(ENDPOINTS.AUTH.VERIFY);
      return response.success;
    } catch (error) {
      return false;
    }
  },

  // Obtener perfil
  async getProfile() {
    return await apiRequest(ENDPOINTS.AUTH.PROFILE);
  },

  // Actualizar perfil
  async updateProfile(profileData) {
    return await apiRequest(ENDPOINTS.AUTH.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Registrar usuario (solo admin)
  async register(userData) {
    return await apiRequest(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Registrar primer administrador
  async registerInitial(userData) {
    return await apiRequest(ENDPOINTS.AUTH.REGISTER_INITIAL, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
};

export default authEndpoints; 