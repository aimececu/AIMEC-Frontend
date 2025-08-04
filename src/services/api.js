// =====================================================
// SERVICIO API - REDIRECCIÓN A NUEVA ESTRUCTURA
// =====================================================
// 
// Este archivo se mantiene por compatibilidad hacia atrás.
// Se recomienda usar la nueva estructura en src/api/

// Importar directamente desde los archivos
import { authEndpoints } from '../api/endpoints/auth.js';
import { productEndpoints } from '../api/endpoints/products.js';
import { categoryEndpoints } from '../api/endpoints/categories.js';
import { specificationEndpoints } from '../api/endpoints/specifications.js';
import { systemEndpoints } from '../api/endpoints/system.js';
import { authUtils, apiRequest, ApiError, buildQueryString, buildEndpoint } from '../api/client.js';

// Re-exportar todo
export {
  authEndpoints,
  productEndpoints,
  categoryEndpoints,
  specificationEndpoints,
  systemEndpoints,
  authUtils,
  apiRequest,
  ApiError,
  buildQueryString,
  buildEndpoint
};

// Mantener las exportaciones originales para compatibilidad
export { 
  authEndpoints as authService,
  productEndpoints as productService,
  categoryEndpoints as categoryService,
  specificationEndpoints as specificationService,
  systemEndpoints as systemService,
  authUtils as apiUtils
};

// Exportar la API completa
export const api = {
  auth: authEndpoints,
  products: productEndpoints,
  categories: categoryEndpoints,
  specifications: specificationEndpoints,
  system: systemEndpoints
};

export default api; 