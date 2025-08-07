// =====================================================
// ENDPOINTS DE ARCHIVOS
// =====================================================

import { apiRequest } from '../client';
import { ENDPOINTS } from '../../config/api';

export const fileEndpoints = {
  // Subir archivo
  async uploadFile(file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Agregar datos adicionales si existen
    if (additionalData.type) {
      formData.append('type', additionalData.type);
    }
    if (additionalData.description) {
      formData.append('description', additionalData.description);
    }

    return await apiRequest(ENDPOINTS.FILES.UPLOAD, {
      method: 'POST',
      headers: {
        // No incluir Content-Type, se establecerá automáticamente para FormData
      },
      body: formData
    });
  },

  // Eliminar archivo
  async deleteFile(key) {
    return await apiRequest(ENDPOINTS.FILES.DELETE(key), {
      method: 'DELETE'
    });
  },

  // Obtener URL firmada
  async getSignedUrl(key, expires = 3600) {
    const endpoint = `${ENDPOINTS.FILES.SIGNED_URL(key)}?expires=${expires}`;
    return await apiRequest(endpoint);
  }
};

export default fileEndpoints;
