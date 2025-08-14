import React, { useState, useEffect } from 'react';
import { useAccessories } from '../../hooks/useAccessories';
import { productEndpoints } from '../../api/endpoints/products';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import Loader from '../ui/Loader';
import Icon from '../ui/Icon';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const AccessoriesManager = ({ productId, productName }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAccessoryId, setSelectedAccessoryId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { accessories, loading, addAccessory, removeAccessory } = useAccessories(productId);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Filtrar productos que no son el producto principal y no son ya accesorios
  const availableProducts = (products || []).filter(product => {
    const isNotMainProduct = product.id !== productId;
    const isNotAlreadyAccessory = !accessories.some(acc => acc.accessory_product_id === product.id);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return isNotMainProduct && isNotAlreadyAccessory && matchesSearch;
  });

  const handleAddAccessory = async (e) => {
    // Prevenir cualquier comportamiento por defecto
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔵 Handler handleAddAccessory ejecutado - Click en botón Agregar');
    
    // Verificar autenticación
    if (!isAuthenticated || !user) {
      showToast('Debes estar autenticado para agregar accesorios', 'error');
      return;
    }
    
    if (!selectedAccessoryId) {
      showToast('Selecciona un producto para agregar como accesorio', 'error');
      return;
    }

    const success = await addAccessory(parseInt(selectedAccessoryId));
    if (success) {
      setShowAddModal(false);
      setSelectedAccessoryId('');
      setSearchTerm('');
    }
  };

  const handleRemoveAccessory = async (accessoryId, e) => {
    // Prevenir cualquier comportamiento por defecto
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔴 Handler handleRemoveAccessory ejecutado - Click en botón Eliminar');
    
    // Verificar autenticación
    if (!isAuthenticated || !user) {
      showToast('Debes estar autenticado para eliminar accesorios', 'error');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este accesorio?')) {
      await removeAccessory(accessoryId);
    }
  };

  const handleOpenModal = (e) => {
    // Prevenir cualquier comportamiento por defecto
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🟢 Handler handleOpenModal ejecutado - Click en botón Agregar Accesorio');
    setShowAddModal(true);
  };

  const handleCloseModal = (e) => {
    // Prevenir cualquier comportamiento por defecto
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🟡 Handler handleCloseModal ejecutado - Cerrando modal');
    setShowAddModal(false);
    setSelectedAccessoryId('');
    setSearchTerm('');
  };

  const getProductById = (id) => {
    return (products || []).find(p => p.id === id);
  };

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await productEndpoints.getProducts();
        if (response.success) {
          setProducts(response.data.products || response.data || []);
        }
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Limpiar estado cuando se cierre el modal
  useEffect(() => {
    if (!showAddModal) {
      setSelectedAccessoryId('');
      setSearchTerm('');
    }
  }, [showAddModal]);

  // Manejar tecla Escape para cerrar modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showAddModal) {
        handleCloseModal(e);
      }
    };

    if (showAddModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showAddModal]);

  return (
    <div 
      className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gestión de Accesorios
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Producto: {productName}
          </p>
          {!isAuthenticated && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              ⚠️ Debes estar autenticado para gestionar accesorios
            </p>
          )}
        </div>
        <Button
          type="button"
          onClick={handleOpenModal}
          className="bg-green-600 hover:bg-green-700"
          disabled={!isAuthenticated}
        >
          <Icon name="FiPlus" className="w-4 h-4 mr-2" />
          Agregar Accesorio
        </Button>
      </div>

      {/* Lista de accesorios actuales */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          Accesorios Actuales ({accessories.length})
        </h4>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader />
          </div>
        ) : accessories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon name="FiPackage" className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">No hay accesorios configurados para este producto</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessories.map((accessory) => {
              const accessoryProduct = getProductById(accessory.accessory_product_id);
              if (!accessoryProduct) return null;

              return (
                <div
                  key={accessory.id}
                  className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-secondary-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                        {accessoryProduct.name}
                      </h5>
                      {accessoryProduct.sku && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          SKU: {accessoryProduct.sku}
                        </p>
                      )}
                      {accessoryProduct.brand && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Marca: {accessoryProduct.brand.name}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={(e) => handleRemoveAccessory(accessory.id, e)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Icon name="FiTrash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para agregar accesorios */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Agregar Accesorio"
        size="max-w-2xl"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar Producto
            </label>
            <Input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seleccionar Producto
            </label>
            {productsLoading ? (
              <div className="text-center py-6">
                <Loader />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Cargando productos...</p>
              </div>
            ) : (
              <div className="min-h-[200px]">
                <Select
                  value={selectedAccessoryId}
                  onChange={(value) => setSelectedAccessoryId(value)}
                  options={[
                    { label: "Selecciona un producto...", value: "" },
                    ...availableProducts.map((product) => ({
                      label: `${product.name} ${product.sku ? `(${product.sku})` : ''}`,
                      value: product.id,
                    }))
                  ]}
                />
              </div>
            )}
          </div>

          {availableProducts.length === 0 && searchTerm && !productsLoading && (
            <div className="text-center py-6 text-gray-500">
              <Icon name="FiSearch" className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">No se encontraron productos que coincidan con la búsqueda</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Intenta con otros términos de búsqueda</p>
            </div>
          )}

          {availableProducts.length === 0 && !searchTerm && !productsLoading && (
            <div className="text-center py-6 text-gray-500">
              <Icon name="FiPackage" className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">No hay productos disponibles para agregar como accesorios</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Todos los productos ya son accesorios o no hay otros productos en el sistema</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAddAccessory}
              disabled={!selectedAccessoryId}
              className="bg-green-600 hover:bg-green-700"
            >
              Agregar Accesorio
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccessoriesManager;
