import React from 'react';
import { useAccessories } from '../../hooks/useAccessories';
import ProductCard from '../ui/ProductCard';
import Loader from '../ui/Loader';
import Icon from '../ui/Icon';
import Card from '../ui/Card';

const AccessoriesSection = ({ productId, isAdmin = false }) => {
  const { accessories, loading, error } = useAccessories(productId);

  // Debug: ver qué estamos recibiendo
  console.log('🔍 AccessoriesSection - productId:', productId);
  console.log('🔍 AccessoriesSection - accessories:', accessories);
  console.log('🔍 AccessoriesSection - loading:', loading);
  console.log('🔍 AccessoriesSection - error:', error);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando accesorios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <Icon name="FiAlertCircle" className="text-4xl text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Error al cargar accesorios: {error}
        </p>
      </Card>
    );
  }

  if (!accessories || accessories.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Icon name="FiPackage" className="text-4xl text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          No hay accesorios disponibles para este producto
        </p>
        {isAdmin && (
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
            Puedes agregar accesorios desde el panel de administración
          </p>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Accesorios Compatibles ({accessories.length})
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Productos que complementan perfectamente este artículo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {accessories.map((accessory) => (
          <ProductCard
            key={accessory.id}
            product={accessory.accessoryProduct}
            showActions={false}
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
};

export default AccessoriesSection;
