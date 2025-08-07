// =====================================================
// CLIENTE HTTP BASE PARA LA API
// =====================================================

import { API_CONFIG, AUTH_CONFIG, ERROR_MESSAGES } from '../config/api';

// Clase para manejar errores de la API
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Función para hacer peticiones HTTP
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Configuración por defecto
  const config = {
    headers: {
      ...options.headers
    },
    ...options
  };

  // Solo agregar Content-Type si no es FormData
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  // Agregar sessionID si existe
  const sessionId = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
  if (sessionId) {
    config.headers['X-Session-ID'] = sessionId;
  }

  try {
    const response = await fetch(url, config);
    
    // Parsear respuesta JSON
    let data;
    try {
      data = await response.json();
    } catch (error) {
      throw new ApiError('Error al parsear respuesta', response.status);
    }

    // Manejar errores HTTP
    if (!response.ok) {
      throw new ApiError(
        data.error || `Error ${response.status}: ${response.statusText}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Error de red: ${error.message}`, 0);
  }
};

// Utilidades para manejo de autenticación
export const authUtils = {
  // Obtener sessionID actual
  getSessionId() {
    return localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
  },

  // Verificar si hay sesión activa
  hasSession() {
    return !!localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
  },

  // Limpiar datos de autenticación
  clearAuth() {
    localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
  },

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Guardar datos de autenticación
  saveAuth(sessionId, user) {
    localStorage.setItem(AUTH_CONFIG.SESSION_KEY, sessionId);
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
  }
};

// Función helper para construir query strings
export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
};

// Función helper para construir endpoints con parámetros
export const buildEndpoint = (baseEndpoint, params = {}) => {
  const queryString = buildQueryString(params);
  return queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;
};

export default apiRequest; 