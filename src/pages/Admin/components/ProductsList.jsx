import React from 'react';
import { Card, Input, Select, Button, Icon, ImageWithFallback } from '../../../components/ui/components';

const ProductsList = ({ 
  products, 
  categories, 
  brands, 
  filters, 
  setFilters, 
  onEditProduct, 
  onDeleteProduct,
  onAddProduct 
}) => {
  // Debug logs
  console.log('🔍 ProductsList recibió:', {
    productsCount: products.length,
    categoriesCount: categories.length,
    brandsCount: brands.length,
    products: products.slice(0, 2), // Primeros 2 productos
    categories: categories.slice(0, 2), // Primeras 2 categorías
    brands: brands.slice(0, 2) // Primeras 2 marcas
  });

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = !filters.search || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesStock = filters.inStock === '' || 
      (filters.inStock === 'true' && product.stock > 0) ||
      (filters.inStock === 'false' && product.stock === 0);

    return matchesSearch && matchesCategory && matchesBrand && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
          
          <Select
            value={filters.brand}
            onChange={(e) => setFilters({...filters, brand: e.target.value})}
          >
            <option value="">Todas las marcas</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.name}>{brand.name}</option>
            ))}
          </Select>

          <Select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </Select>

          <Select
            value={filters.inStock}
            onChange={(e) => setFilters({...filters, inStock: e.target.value})}
          >
            <option value="">Todo el stock</option>
            <option value="true">En stock</option>
            <option value="false">Sin stock</option>
          </Select>
        </div>
      </Card>

      {/* Botón agregar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Productos ({filteredProducts.length})</h2>
        <Button onClick={onAddProduct} className="flex items-center gap-2">
          <Icon name="FiPlus" />
          Agregar Producto
        </Button>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="p-4">
            <div className="flex items-start gap-4">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
                fallbackSrc="/placeholder-product.jpg"
              />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-secondary-900 dark:text-white truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  SKU: {product.sku}
                </p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {product.brand} • {product.category}
                </p>
                <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                  ${product.price}
                </p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Stock: {product.stock}
                </p>
                
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditProduct(product)}
                    className="flex items-center gap-1"
                  >
                    <Icon name="FiEdit" size="sm" />
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteProduct(product.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Icon name="FiTrash2" size="sm" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="p-8 text-center">
          <Icon name="FiPackage" className="text-4xl text-secondary-400 mx-auto mb-4" />
          <p className="text-secondary-600 dark:text-secondary-400">
            No se encontraron productos que coincidan con los filtros.
          </p>
        </Card>
      )}
    </div>
  );
};

export default ProductsList; 