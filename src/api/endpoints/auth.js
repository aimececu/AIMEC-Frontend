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
      body: { email, password }
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
      // Si es un error 401 (no autenticado), simplemente retornar false
      if (error.status === 401) {
        return false;
      }
      // Para otros errores, también retornar false pero loguear el error
      console.warn('Error verificando autenticación:', error);
      return false;
    }
  },

  // Verificar estado de sesión (público)
  async checkSession() {
    try {
      const response = await apiRequest(ENDPOINTS.AUTH.CHECK_SESSION);
      return response;
    } catch (error) {
      console.warn('Error verificando estado de sesión:', error);
      return {
        success: false,
        hasValidSession: false,
        message: 'Error verificando sesión'
      };
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
      body: profileData
    });
  },

  // Registrar usuario (solo admin)
  async register(userData) {
    return await apiRequest(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: userData
    });
  },

  // Registrar primer administrador
  async registerInitial(userData) {
    return await apiRequest(ENDPOINTS.AUTH.REGISTER_INITIAL, {
      method: 'POST',
      body: userData
    });
  }
};

export default authEndpoints; 