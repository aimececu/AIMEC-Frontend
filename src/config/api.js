// =====================================================
// CONFIGURACIÓN DE LA API
// =====================================================

// URL base de la API
export const API_CONFIG = {
  // URL base de la API (puede ser configurada por variables de entorno)
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3750/api',
  
  // Timeout para las peticiones (en milisegundos)
  TIMEOUT: 30000, // Aumentado el timeout
  
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
    CHECK_SESSION: '/auth/check-session',
    PROFILE: '/auth/profile',
    REGISTER: '/auth/register',
    REGISTER_INITIAL: '/auth/register-initial'
  },
  
  // Productos
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    STATS: '/products/stats',
    SEARCH: '/products/search',
    FEATURED: '/products/featured',
    BY_CATEGORY: (categoryId) => `/products/category/${categoryId}`,
    BY_BRAND: (brandId) => `/products/brand/${brandId}`,
    BY_SLUG: (slug) => `/products/${slug}/slug`,
    // Product Applications
    APPLICATIONS: (productId) => `/products/${productId}/applications`,
    // Product Features
    FEATURES: (productId) => `/products/${productId}/features`,
    // Product Related
    RELATED: (productId) => `/products/${productId}/related`
  },
  
  // Categorías
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`,
    SUBCATEGORIES: (categoryId) => `/categories/${categoryId}/subcategories`
  },

  // Subcategorías
  SUBCATEGORIES: {
    LIST: '/subcategories',
    DETAIL: (id) => `/subcategories/${id}`,
    CREATE: '/subcategories',
    UPDATE: (id) => `/subcategories/${id}`,
    DELETE: (id) => `/subcategories/${id}`,
    BY_CATEGORY: (categoryId) => `/subcategories?category_id=${categoryId}`
  },
  
  // Marcas
  BRANDS: {
    LIST: '/brands',
    DETAIL: (id) => `/brands/${id}`,
    CREATE: '/brands',
    UPDATE: (id) => `/brands/${id}`,
    DELETE: (id) => `/brands/${id}`
  },
  
  // Información del sistema
  INFO: {
    STATS: '/info/stats'
  },
  
  // Importación de datos
  IMPORT: {
    PREVIEW: '/import/preview',
    SYSTEM: '/import/system'
  },
  
  // Aplicaciones
  APPLICATIONS: {
    LIST: '/applications',
    DETAIL: (id) => `/applications/${id}`,
    CREATE: '/applications',
    UPDATE: (id) => `/applications/${id}`,
    DELETE: (id) => `/applications/${id}`
  },
  
  // Archivos
  FILES: {
    UPLOAD: '/files/upload',
    DELETE: (key) => `/files/${key}`,
    SIGNED_URL: (key) => `/files/${key}/url`
  },
  
  // Sistema
  SYSTEM: {
    HEALTH: '/health',
    INFO: '/'
  },

  // Características de productos
  PRODUCT_FEATURES: {
    LIST: '/productFeatures',
    DETAIL: (id) => `/productFeatures/${id}`,
    CREATE: '/productFeatures',
    UPDATE: (id) => `/productFeatures/${id}`,
    DELETE: (id) => `/productFeatures/${id}`,
    BY_PRODUCT: (productId) => `/productFeatures?product_id=${productId}`
  },

  // Aplicaciones de productos
  PRODUCT_APPLICATIONS: {
    LIST: '/productApplications',
    DETAIL: (id) => `/productApplications/${id}`,
    CREATE: '/productApplications',
    UPDATE: (id) => `/productApplications/${id}`,
    DELETE: (id) => `/productApplications/${id}`,
    BY_PRODUCT: (productId) => `/productApplications?product_id=${productId}`
  },

  // Productos relacionados
  RELATED_PRODUCTS: {
    LIST: '/relatedProducts',
    DETAIL: (id) => `/relatedProducts/${id}`,
    CREATE: '/relatedProducts',
    CREATE_MULTIPLE: '/relatedProducts/multiple',
    UPDATE: (id) => `/relatedProducts/${id}`,
    DELETE: (id) => `/relatedProducts/${id}`,
    BY_PRODUCT: (productId) => `/relatedProducts/product/${productId}`
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