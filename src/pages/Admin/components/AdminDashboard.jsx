import React from 'react';
import Card from '../../../components/ui/Card';
import Heading from '../../../components/ui/Heading';
import Icon from '../../../components/ui/Icon';

const AdminDashboard = ({ stats, onImportClick }) => {
  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Marcas</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.total_brands || 0}
              </p>
            </div>
            <Icon name="FiTag" className="text-3xl text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Categorías</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.total_categories || 0}
              </p>
            </div>
            <Icon name="FiGrid" className="text-3xl text-green-500" />
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
            onClick={() => window.location.href = '/admin/administration'}
            className="flex items-center gap-2 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <Icon name="FiSettings" />
            Gestionar Datos
          </button>
          
          <button 
            onClick={onImportClick}
            className="flex items-center gap-2 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <Icon name="FiUpload" />
            Importar Productos
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard; 