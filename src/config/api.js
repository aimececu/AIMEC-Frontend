// =====================================================
// CONFIGURACIÓN DE LA API
// =====================================================

// URL base de la API
export const API_CONFIG = {
  // URL base de la API (puede ser configurada por variables de entorno)
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  
  // Timeout para las peticiones (en milisegundos)
  TIMEOUT: 10000,
  
  // Configuración de reintentos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Configuración de endpoints
export const ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile'
  },
  
  // Productos
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    STATS: '/products/stats'
  },
  
  // Categorías
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`
  },
  
  // Especificaciones
  SPECIFICATIONS: {
    LIST: '/specifications',
    DETAIL: (id) => `/specifications/${id}`,
    CREATE: '/specifications',
    UPDATE: (id) => `/specifications/${id}`,
    DELETE: (id) => `/specifications/${id}`
  },
  
  // Sistema
  SYSTEM: {
    HEALTH: '/health',
    INFO: '/'
  }
};

// Configuración de errores
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  TIMEOUT_ERROR: 'La petición tardó demasiado. Intenta nuevamente.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  FORBIDDEN: 'Acceso denegado.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error interno del servidor. Intenta más tarde.',
  VALIDATION_ERROR: 'Los datos proporcionados no son válidos.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado.'
};

// Configuración de autenticación
export const AUTH_CONFIG = {
  // Nombre de la clave del sessionID en localStorage
  SESSION_KEY: 'sessionId',
  
  // Nombre de la clave del usuario en localStorage
  USER_KEY: 'user',
  
  // Tiempo de expiración de la sesión (en milisegundos)
  SESSION_EXPIRY: 24 * 60 * 60 * 1000, // 24 horas
  
  // Header de sesión
  SESSION_HEADER: 'X-Session-ID'
};

export default API_CONFIG; 