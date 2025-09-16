import React from 'react';
import Card from '../ui/Card';
import Heading from '../ui/Heading';
import Icon from '../ui/Icon';

const AdminDashboard = ({ stats, onImportClick, onNavigate, loading = false }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Total Productos</p>
              <p className="text-lg sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                {loading ? '...' : (stats.total_products || 0)}
              </p>
            </div>
            <Icon name="FiPackage" className="text-xl sm:text-3xl text-primary-500" />
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Total Marcas</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.total_brands || 0}
              </p>
            </div>
            <Icon name="FiTag" className="text-xl sm:text-3xl text-blue-500" />
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Total Categorías</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.total_categories || 0}
              </p>
            </div>
            <Icon name="FiGrid" className="text-xl sm:text-3xl text-green-500" />
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Total Subcategorías</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.total_subcategories || 0}
              </p>
            </div>
            <Icon name="FiLayers" className="text-xl sm:text-3xl text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Card className="p-4 sm:p-6">
        <Heading level={3} className="mb-3 sm:mb-4 text-lg sm:text-xl">Acciones Rápidas</Heading>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button 
            onClick={() => onNavigate('products')}
            className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 hover:shadow-lg"
          >
            <Icon name="FiPlus" className="text-xl sm:text-2xl" />
            <span className="text-xs sm:text-sm font-medium text-center">Agregar Producto</span>
          </button>
          
          <button 
            onClick={() => onNavigate('administration')}
            className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
          >
            <Icon name="FiSettings" className="text-xl sm:text-2xl" />
            <span className="text-xs sm:text-sm font-medium text-center">Gestionar Datos</span>
          </button>

          <button 
            onClick={() => onNavigate('products')}
            className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 hover:shadow-lg"
          >
            <Icon name="FiList" className="text-xl sm:text-2xl" />
            <span className="text-xs sm:text-sm font-medium text-center">Ver Productos</span>
          </button>
          
          <button 
            onClick={onImportClick}
            className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:shadow-lg"
          >
            <Icon name="FiUpload" className="text-xl sm:text-2xl" />
            <span className="text-xs sm:text-sm font-medium text-center">Importar Productos</span>
          </button>
        </div>
      </Card>

      {/* Resumen del Sistema */}
      <Card className="p-4 sm:p-6">
        <Heading level={3} className="mb-3 sm:mb-4 text-lg sm:text-xl">Resumen del Sistema</Heading>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-medium text-secondary-900 dark:text-white text-sm sm:text-base">Estado del Sistema</h4>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Sistema operativo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Base de datos conectada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">API funcionando</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-medium text-secondary-900 dark:text-white text-sm sm:text-base">Última Actualización</h4>
            <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">
              {new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard; 