import { apiRequest } from '../client';
import { ENDPOINTS } from '../../config/api';

export const importEndpoints = {
  // Previsualizar datos de importación
  async previewImportData(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiRequest(ENDPOINTS.IMPORT.PREVIEW, {
        method: 'POST',
        body: formData,
        // No incluir Content-Type para que el navegador lo establezca automáticamente con el boundary
        headers: {}
      });
      
      return response;
    } catch (error) {
      console.error('Error previsualizando datos de importación:', error);
      throw error;
    }
  },

  // Importar datos del sistema
  async importSystemData(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiRequest(ENDPOINTS.IMPORT.SYSTEM, {
        method: 'POST',
        body: formData,
        // No incluir Content-Type para que el navegador lo establezca automáticamente con el boundary
        headers: {}
      });
      
      return response;
    } catch (error) {
      console.error('Error importando datos del sistema:', error);
      throw error;
    }
  }
};
