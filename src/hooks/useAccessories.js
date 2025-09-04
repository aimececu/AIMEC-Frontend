import { useState, useEffect, useCallback } from 'react';
import { 
  getAccessoriesByProduct, 
  createAccessory, 
  deleteAccessory 
} from '../api/endpoints/accessories';
import { useToast } from '../context/ToastContext';

export const useAccessories = (productId) => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  // Obtener accesorios del producto
  const fetchAccessories = useCallback(async () => {
    if (!productId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAccessoriesByProduct(productId);
      
      if (response.success) {
        // Asegurar que siempre tengamos un array, incluso si está vacío
        const accessoriesData = response.data?.accessories || [];
        
        setAccessories(Array.isArray(accessoriesData) ? accessoriesData : []);
      } else {
        setError(response.message || 'Error al obtener accesorios');
      }
    } catch (err) {
      // Si es un error 500, probablemente la tabla no existe o hay un problema de BD
      if (err.status === 500) {
        setError('Servicio de accesorios no disponible temporalmente');
        console.error('Backend error (500) - possible DB issue:', err);
      } else {
        setError('Error al cargar accesorios');
        console.error('Error fetching accessories:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Agregar nuevo accesorio (ahora puede ser uno o varios)
  const addAccessory = async (accessoryProductIds) => {
    if (!productId || !accessoryProductIds) {
      showToast('Datos incompletos para agregar accesorio', 'error');
      return false;
    }

    // Convertir a array si es un solo ID
    const ids = Array.isArray(accessoryProductIds) ? accessoryProductIds : [accessoryProductIds];
    
    if (ids.length === 0) {
      showToast('Selecciona al menos un producto para agregar como accesorio', 'error');
      return false;
    }

    setLoading(true);
    try {
      // Crear todos los accesorios en paralelo
      const promises = ids.map(accessoryProductId => 
        createAccessory({
          main_product_id: productId,
          accessory_product_id: accessoryProductId
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.length - successCount;

      if (successCount > 0) {
        if (successCount === 1) {
          showToast('Accesorio agregado exitosamente', 'success');
        } else {
          showToast(`${successCount} accesorios agregados exitosamente`, 'success');
        }
        
        if (errorCount > 0) {
          showToast(`${errorCount} accesorios no se pudieron agregar`, 'warning');
        }
        
        await fetchAccessories(); // Recargar lista
        return true;
      } else {
        showToast('No se pudo agregar ningún accesorio', 'error');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al agregar accesorios';
      showToast(errorMessage, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar accesorio
  const removeAccessory = async (accessoryId) => {
    setLoading(true);
    try {
      const response = await deleteAccessory(accessoryId);
      
      if (response.success) {
        showToast('Accesorio eliminado exitosamente', 'success');
        await fetchAccessories(); // Recargar lista
        return true;
      } else {
        showToast(response.message || 'Error al eliminar accesorio', 'error');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar accesorio';
      showToast(errorMessage, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar accesorios al montar el componente o cambiar productId
  useEffect(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  return {
    accessories,
    loading,
    error,
    addAccessory,
    removeAccessory,
    refreshAccessories: fetchAccessories
  };
};
