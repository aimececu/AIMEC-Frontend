import React from 'react';
import { Card, Heading, Icon } from '../../../components/ui/components';

const AdminDashboard = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Productos</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.total_products || 0}
              </p>
            </div>
            <Icon name="FiPackage" className="text-3xl text-primary-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">En Stock</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.in_stock || 0}
              </p>
            </div>
            <Icon name="FiCheckCircle" className="text-3xl text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Sin Stock</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.out_of_stock || 0}
              </p>
            </div>
            <Icon name="FiAlertCircle" className="text-3xl text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Stock Bajo</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.low_stock || 0}
              </p>
            </div>
            <Icon name="FiAlertTriangle" className="text-3xl text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Card className="p-6">
        <Heading level={3} className="mb-4">Acciones Rápidas</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/admin/products'}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Icon name="FiPlus" />
            Agregar Producto
          </button>
          
          <button 
            onClick={() => window.location.href = '/admin/import'}
            className="flex items-center gap-2 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <Icon name="FiUpload" />
            Importar Productos
          </button>
          
          <button 
            onClick={() => window.location.href = '/admin/specifications'}
            className="flex items-center gap-2 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <Icon name="FiSettings" />
            Gestionar Especificaciones
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard; 