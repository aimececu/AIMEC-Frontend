import { useState, useEffect, useCallback } from 'react';
import { relatedProductsEndpoints } from '../api/endpoints/relatedProducts';
import { useToast } from '../context/ToastContext';

/**
 * Hook personalizado para gestionar productos relacionados
 * @param {number} productId - ID del producto principal
 * @returns {Object} - Estado y funciones para gestionar productos relacionados
 */
export const useRelatedProducts = (productId) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainProduct, setMainProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  /**
   * Carga los productos relacionados para un producto específico
   */
  const loadRelatedProducts = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await relatedProductsEndpoints.getByProduct(productId);
      
      if (response.success) {
        setMainProduct(response.data.mainProduct);
        setRelatedProducts(response.data.relatedProducts || []);
      } else {
        setError('Error al cargar productos relacionados');
      }
    } catch (err) {
      setError('Error al cargar productos relacionados');
    } finally {
      setLoading(false);
    }
  }, [productId]);



  /**
   * Agrega un nuevo producto relacionado
   * @param {Object} data - Datos del producto relacionado
   * @returns {Promise<boolean>} - true si se agregó correctamente
   */
  const addRelatedProduct = async (data) => {
    try {
      const response = await relatedProductsEndpoints.create({
        product_id: productId,
        ...data
      });

      if (response.success) {
        showToast('Producto relacionado agregado exitosamente', 'success');
        await loadRelatedProducts(); // Recargar la lista
        return true;
      } else {
        showToast(response.message || 'Error al agregar producto relacionado', 'error');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al agregar producto relacionado';
      showToast(errorMessage, 'error');
      return false;
    }
  };

  /**
   * Agrega múltiples productos relacionados con el mismo tipo de relación
   * @param {Object} data - Datos de la operación
   * @param {string} data.relationship_type - Tipo de relación
   * @param {Array<number>} data.products - Array de IDs de productos

   * @returns {Promise<boolean>} - true si se agregaron correctamente
   */
  const addMultipleRelatedProducts = async (data) => {
    try {
      const response = await relatedProductsEndpoints.createMultiple({
        product_id: productId,
        ...data
      });

      if (response.success) {
        const { created, skipped, errors } = response.data;
        let message = `${created} producto${created !== 1 ? 's' : ''} relacionado${created !== 1 ? 's' : ''} agregado${created !== 1 ? 's' : ''} exitosamente`;
        
        if (skipped > 0) {
          message += `. ${skipped} producto${skipped !== 1 ? 's' : ''} omitido${skipped !== 1 ? 's' : ''} (ya existían)`;
        }
        
        if (errors.length > 0) {
          message += `. ${errors.length} error${errors.length !== 1 ? 'es' : ''} encontrado${errors.length !== 1 ? 's' : ''}`;
        }
        
        showToast(message, 'success');
        await loadRelatedProducts(); // Recargar la lista
        return true;
      } else {
        showToast(response.message || 'Error al agregar productos relacionados', 'error');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al agregar productos relacionados';
      showToast(errorMessage, 'error');
      return false;
    }
  };

  /**
   * Actualiza un producto relacionado existente
   * @param {number} id - ID de la relación
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<boolean>} - true si se actualizó correctamente
   */
  const updateRelatedProduct = async (id, data) => {
    try {
      const response = await relatedProductsEndpoints.update(id, data);

      if (response.success) {
        showToast('Producto relacionado actualizado exitosamente', 'success');
        await loadRelatedProducts(); // Recargar la lista
        return true;
      } else {
        showToast(response.message || 'Error al actualizar producto relacionado', 'error');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar producto relacionado';
      showToast(errorMessage, 'error');
      return false;
    }
  };

  /**
   * Elimina un producto relacionado
   * @param {number} id - ID de la relación a eliminar
   * @returns {Promise<boolean>} - true si se eliminó correctamente
   */
  const removeRelatedProduct = async (id) => {
    try {
      const response = await relatedProductsEndpoints.delete(id);

      if (response.success) {
        showToast('Producto relacionado eliminado exitosamente', 'success');
        await loadRelatedProducts(); // Recargar la lista
        return true;
      } else {
        showToast(response.message || 'Error al eliminar producto relacionado', 'error');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar producto relacionado';
      showToast(errorMessage, 'error');
      return false;
    }
  };



  // Cargar datos cuando cambie el productId
  useEffect(() => {
    loadRelatedProducts();
  }, [loadRelatedProducts]);

  return {
    // Estado
    relatedProducts,
    mainProduct,
    loading,
    error,
    
    // Funciones
    loadRelatedProducts,
    addRelatedProduct,
    addMultipleRelatedProducts,
    updateRelatedProduct,
    removeRelatedProduct,
    
    // Utilidades
    hasRelatedProducts: relatedProducts.length > 0,
    relatedProductsCount: relatedProducts.length
  };
};

export default useRelatedProducts;
