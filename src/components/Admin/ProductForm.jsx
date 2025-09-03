import React, { useEffect, useState, useRef } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import ProductFeaturesManager from "./ProductFeaturesManager";
import ProductApplicationsManager from "./ProductApplicationsManager";
import AccessoriesManager from "./ProductAccessoriesManager";
import ProductRelatedManager from "./ProductRelatedManager";

const ProductForm = ({
  productForm,
  setProductForm,
  categories,
  brands,
  subcategories, // Agregar subcategories como prop
  onSubmit,
  onCancel,
  editingProduct,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const accessoriesManagerRef = useRef(null);

  const handleFormChange = (field, value) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Limpiar subcategoría cuando cambie la categoría (solo si no es la carga inicial)
  const prevCategoryIdRef = useRef();
  
  useEffect(() => {
    // Si es la primera vez que se carga, solo guardar la referencia
    if (prevCategoryIdRef.current === undefined) {
      prevCategoryIdRef.current = productForm.category_id;
      return;
    }
    
    // Solo limpiar subcategoría si el usuario cambia manualmente la categoría
    if (prevCategoryIdRef.current !== productForm.category_id) {
      setProductForm((prev) => ({
        ...prev,
        subcategory_id: "",
      }));
      prevCategoryIdRef.current = productForm.category_id;
    }
  }, [productForm.category_id, setProductForm]);

  const handleSaveAccessories = async () => {
    if (accessoriesManagerRef.current && accessoriesManagerRef.current.handleSaveAccessories) {
      await accessoriesManagerRef.current.handleSaveAccessories();
    }
  };

  const modalTitle = editingProduct
    ? `Editar Producto: ${editingProduct.name}`
    : "Agregar Nuevo Producto";

  const modalFooter = (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      
      {/* Botón dinámico según la pestaña activa */}
      {activeTab === "general" && (
        <Button type="submit" form="product-form">
          {editingProduct ? "Actualizar Producto" : "Crear Producto"}
        </Button>
      )}
      
      {activeTab === "accessories" && editingProduct && (
        <Button 
          type="button" 
          onClick={handleSaveAccessories}
          className="bg-primary-600 hover:bg-primary-700"
        >
          Guardar Accesorios
        </Button>
      )}
      
      {/* En features y applications no hay botones de acción */}
    </div>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={modalTitle}
      footer={modalFooter}
      size="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Pestañas */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "general"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Información General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("features")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "features"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Características
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("applications")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "applications"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Aplicaciones
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("accessories")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "accessories"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Accesorios
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("related")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "related"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Productos Relacionados
            </button>
          </nav>
        </div>

        {/* Contenido de las pestañas */}
        {activeTab === "general" && (
          <form id="product-form" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SKU */}
              <Input
                label="SKU"
                value={productForm.sku}
                onChange={(value) => handleFormChange("sku", value)}
                placeholder="Código SKU"
                required
              />

              {/* SKU EC */}
              <Input
                label="SKU EC"
                value={productForm.sku_ec}
                onChange={(value) => handleFormChange("sku_ec", value)}
                placeholder="Código alternativo"
                required
              />

              {/* Nombre */}
              <Input
                label="Nombre"
                value={productForm.name}
                onChange={(value) => handleFormChange("name", value)}
                placeholder="Nombre del producto"
                required
              />

              {/* Precio */}
              <Input
                label="Precio"
                value={productForm.price}
                onChange={(value) => handleFormChange("price", value)}
                placeholder="262.50, 1,250.00, etc."
                required
              />

              {/* Stock */}
              <Input
                label="Stock"
                value={productForm.stock_quantity}
                onChange={(value) => handleFormChange("stock_quantity", value)}
                placeholder="10, 0, Disponible, etc."
                required
              />

              {/* Nivel mínimo de stock */}
              <Input
                label="Nivel Mínimo de Stock"
                value={productForm.min_stock_level}
                onChange={(value) => handleFormChange("min_stock_level", value)}
                placeholder="5, 0, etc."
              />

              {/* Peso */}
              <Input
                label="Peso"
                value={productForm.weight}
                onChange={(value) => handleFormChange("weight", value)}
                placeholder="0.5 kg, 1.2 lbs, etc."
              />

              {/* Potencia */}
              <Input
                label="Potencia"
                value={productForm.potencia_kw}
                onChange={(value) => handleFormChange("potencia_kw", value)}
                placeholder="0.37 kW, 1.5 HP, etc."
              />

              {/* Voltaje */}
              <Input
                label="Voltaje"
                value={productForm.voltaje}
                onChange={(value) => handleFormChange("voltaje", value)}
                placeholder="1AC 200-400 V"
              />

              {/* Frame Size */}
              <Input
                label="Frame Size"
                value={productForm.frame_size}
                onChange={(value) => handleFormChange("frame_size", value)}
                placeholder="FSAA"
              />

              {/* Corriente */}
              <Input
                label="Corriente"
                value={productForm.corriente}
                onChange={(value) => handleFormChange("corriente", value)}
                placeholder="0.37 A, 1.5-2.2 A, etc."
              />

              {/* Comunicación */}
              <Input
                label="Comunicación"
                value={productForm.comunicacion}
                onChange={(value) => handleFormChange("comunicacion", value)}
                placeholder="Modbus/USS/BACnet, etc."
              />

              {/* Alimentación */}
              <Input
                label="Alimentación"
                value={productForm.alimentacion}
                onChange={(value) => handleFormChange("alimentacion", value)}
                placeholder="3AC, etc."
              />

              {/* Dimensiones */}
              <Input
                label="Dimensiones"
                value={productForm.dimensions}
                onChange={(value) => handleFormChange("dimensions", value)}
                placeholder="Largo x Ancho x Alto"
              />

              {/* Marca */}
              <Select
                label="Marca"
                value={productForm.brand_id}
                onChange={(value) => handleFormChange("brand_id", value)}
                required
                options={brands.map((brand) => ({
                  label: brand.name,
                  value: brand.id,
                }))}
              />

              {/* Categoría */}
              <Select
                label="Categoría"
                value={productForm.category_id}
                onChange={(value) => handleFormChange("category_id", value)}
                required
                options={categories.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
              />

              {console.log(subcategories)}
              {console.log(productForm)}

              {/* Subcategoría */}
              <Select
                label="Subcategoría"
                value={productForm.subcategory_id || ""}
                onChange={(value) => handleFormChange("subcategory_id", value)}
                options={[
                  { label: "Sin subcategoría", value: "" },
                  ...(
                    subcategories
                      .filter(subcat => subcat.category_id === productForm.category_id)
                      .map((subcat) => ({
                        label: subcat.name,
                        value: subcat.id,
                      }))
                  ),
                ]}
              />

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Estado
                </label>
                <Select
                  value={productForm.is_active ? "true" : "false"}
                  onChange={(value) =>
                    handleFormChange("is_active", value === "true")
                  }
                  options={[
                    { label: "Activo", value: "true" },
                    { label: "Inactivo", value: "false" },
                  ]}
                />
              </div>
            </div>

            {/* Descripción */}
            <TextArea
              label="Descripción"
              value={productForm.description}
              onChange={(value) => handleFormChange("description", value)}
              placeholder="Descripción detallada del producto..."
              rows={4}
              required
            />

            {/* Imagen Principal */}
            <Input
              label="Imagen Principal"
              value={productForm.main_image}
              onChange={(value) => handleFormChange("main_image", value)}
              placeholder="URL de la imagen principal"
            />
          </form>
        )}

        {/* Pestaña de Características */}
        {activeTab === "features" && editingProduct && (
          <div className="py-4">
            <ProductFeaturesManager
              productId={editingProduct.id}
              productName={editingProduct.name}
              isInsideForm={true}
            />
          </div>
        )}

        {/* Pestaña de Aplicaciones */}
        {activeTab === "applications" && editingProduct && (
          <div className="py-4">
            <ProductApplicationsManager
              productId={editingProduct.id}
              productName={editingProduct.name}
              isInsideForm={true}
            />
          </div>
        )}

        {/* Pestaña de Accesorios */}
        {activeTab === "accessories" && editingProduct && (
          <div 
            className="py-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <AccessoriesManager
              ref={accessoriesManagerRef}
              productId={editingProduct.id}
              productName={editingProduct.name}
            />
          </div>
        )}

        {/* Pestaña de Productos Relacionados */}
        {activeTab === "related" && editingProduct && (
          <div className="py-4">
            <ProductRelatedManager
              productId={editingProduct.id}
              productName={editingProduct.name}
            />
          </div>
        )}

        {/* Mensaje cuando no hay producto seleccionado */}
        {(activeTab === "features" || activeTab === "applications" || activeTab === "accessories" || activeTab === "related") &&
          !editingProduct && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Guarda el producto primero para poder gestionar sus
                características, aplicaciones, accesorios y productos relacionados
              </p>
            </div>
          )}
      </div>
    </Modal>
  );
};

export default ProductForm;
