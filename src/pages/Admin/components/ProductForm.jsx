import React, { useState } from 'react';
import { Card, Input, Select, TextArea, Button, Heading } from '../../../components/ui/components';

const ProductForm = ({ 
  productForm, 
  setProductForm, 
  categories, 
  brands, 
  onSubmit, 
  onCancel, 
  editingProduct 
}) => {
  const [activeFormTab, setActiveFormTab] = useState('basic');

  const handleFormChange = (field, value) => {
    setProductForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-secondary-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3}>
              {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </Heading>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-secondary-500 hover:text-secondary-700"
            >
              ✕
            </Button>
          </div>

          {/* Tabs del formulario */}
          <div className="flex space-x-1 mb-6 p-1 bg-secondary-100 dark:bg-secondary-700 rounded-lg">
            {[
              { id: 'basic', label: 'Básico', icon: 'FiFileText' },
              { id: 'technical', label: 'Técnico', icon: 'FiSettings' },
              { id: 'media', label: 'Multimedia', icon: 'FiImage' },
              { id: 'seo', label: 'SEO', icon: 'FiSearch' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFormTab(tab.id)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeFormTab === tab.id
                    ? 'bg-white dark:bg-secondary-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit}>
            {activeFormTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SKU */}
                  <Input
                    label="SKU"
                    value={productForm.sku}
                    onChange={(e) => handleFormChange('sku', e.target.value)}
                    placeholder="Código SKU"
                    required
                  />

                  {/* Nombre */}
                  <Input
                    label="Nombre"
                    value={productForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Nombre del producto"
                    required
                  />

                  {/* Precio */}
                  <Input
                    label="Precio"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => handleFormChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />

                  {/* Stock */}
                  <Input
                    label="Stock"
                    type="number"
                    value={productForm.stock_quantity}
                    onChange={(e) => handleFormChange('stock_quantity', e.target.value)}
                    placeholder="0"
                    required
                  />

                  {/* Marca */}
                  <Select
                    label="Marca"
                    value={productForm.brand}
                    onChange={(e) => handleFormChange('brand', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar marca</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.name}>{brand.name}</option>
                    ))}
                  </Select>

                  {/* Categoría */}
                  <Select
                    label="Categoría"
                    value={productForm.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </Select>

                  {/* Subcategoría */}
                  <Input
                    label="Subcategoría"
                    value={productForm.subcategory}
                    onChange={(e) => handleFormChange('subcategory', e.target.value)}
                    placeholder="Subcategoría"
                  />

                  {/* Serie */}
                  <Input
                    label="Serie"
                    value={productForm.series}
                    onChange={(e) => handleFormChange('series', e.target.value)}
                    placeholder="Serie del producto"
                  />

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Estado
                    </label>
                    <Select
                      value={productForm.is_active ? 'true' : 'false'}
                      onChange={(e) => handleFormChange('is_active', e.target.value === 'true')}
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </Select>
                  </div>
                </div>

                {/* Descripción */}
                <TextArea
                  label="Descripción"
                  value={productForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Descripción detallada del producto..."
                  rows={4}
                />
              </div>
            )}

            {activeFormTab === 'technical' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Peso */}
                  <Input
                    label="Peso (kg)"
                    type="number"
                    step="0.01"
                    value={productForm.weight}
                    onChange={(e) => handleFormChange('weight', e.target.value)}
                    placeholder="0.00"
                  />

                  {/* Dimensiones */}
                  <Input
                    label="Dimensiones"
                    value={productForm.dimensions}
                    onChange={(e) => handleFormChange('dimensions', e.target.value)}
                    placeholder="Largo x Ancho x Alto"
                  />

                  {/* Voltaje */}
                  <Input
                    label="Voltaje (V)"
                    type="number"
                    step="0.1"
                    value={productForm.voltage}
                    onChange={(e) => handleFormChange('voltage', e.target.value)}
                    placeholder="0.0"
                  />

                  {/* Potencia */}
                  <Input
                    label="Potencia (W)"
                    type="number"
                    step="0.1"
                    value={productForm.power}
                    onChange={(e) => handleFormChange('power', e.target.value)}
                    placeholder="0.0"
                  />

                  {/* Rango de temperatura */}
                  <Input
                    label="Rango de Temperatura"
                    value={productForm.temperature_range}
                    onChange={(e) => handleFormChange('temperature_range', e.target.value)}
                    placeholder="Ej: -10°C a +50°C"
                  />

                  {/* IP Rating */}
                  <Input
                    label="IP Rating"
                    value={productForm.ip_rating}
                    onChange={(e) => handleFormChange('ip_rating', e.target.value)}
                    placeholder="Ej: IP65"
                  />

                  {/* Material */}
                  <Input
                    label="Material"
                    value={productForm.material}
                    onChange={(e) => handleFormChange('material', e.target.value)}
                    placeholder="Material del producto"
                  />

                  {/* Color */}
                  <Input
                    label="Color"
                    value={productForm.color}
                    onChange={(e) => handleFormChange('color', e.target.value)}
                    placeholder="Color del producto"
                  />
                </div>
              </div>
            )}

            {activeFormTab === 'media' && (
              <div className="space-y-6">
                <Input
                  label="Imagen Principal"
                  value={productForm.main_image}
                  onChange={(e) => handleFormChange('main_image', e.target.value)}
                  placeholder="URL de la imagen principal"
                />

                <TextArea
                  label="Imágenes Adicionales (URLs separadas por comas)"
                  value={productForm.additional_images?.join(', ') || ''}
                  onChange={(e) => handleFormChange('additional_images', e.target.value.split(',').map(url => url.trim()))}
                  placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                  rows={3}
                />
              </div>
            )}

            {activeFormTab === 'seo' && (
              <div className="space-y-6">
                <Input
                  label="Meta Title"
                  value={productForm.meta_title}
                  onChange={(e) => handleFormChange('meta_title', e.target.value)}
                  placeholder="Título para SEO"
                />

                <TextArea
                  label="Meta Description"
                  value={productForm.meta_description}
                  onChange={(e) => handleFormChange('meta_description', e.target.value)}
                  placeholder="Descripción para SEO"
                  rows={3}
                />

                <Input
                  label="Meta Keywords"
                  value={productForm.meta_keywords}
                  onChange={(e) => handleFormChange('meta_keywords', e.target.value)}
                  placeholder="Palabras clave separadas por comas"
                />
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-secondary-200 dark:border-secondary-700">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm; 