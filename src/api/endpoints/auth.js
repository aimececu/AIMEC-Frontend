// =====================================================
// ENDPOINTS DE AUTENTICACIÓN
// =====================================================

import { apiRequest, authUtils } from '../client';

export const authEndpoints = {
  // Login
  async login(email, password) {
    const response = await apiRequest('/auth/login', {
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
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Error en logout:', error);
    } finally {
      authUtils.clearAuth();
    }
  },

  // Verificar autenticación
  async verifyAuth() {
    try {
      const response = await apiRequest('/auth/verify');
      return response.success;
    } catch (error) {
      return false;
    }
  },

  // Obtener perfil
  async getProfile() {
    return await apiRequest('/auth/profile');
  },

  // Actualizar perfil
  async updateProfile(profileData) {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Registrar usuario (solo admin)
  async register(userData) {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
};

export default authEndpoints; 