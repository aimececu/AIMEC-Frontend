import React, { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import TextArea from "../../../components/ui/TextArea";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import ProductFeaturesManager from "./ProductFeaturesManager";
import ProductApplicationsManager from "./ProductApplicationsManager";
import AccessoriesManager from "../../../components/Admin/AccessoriesManager";

const ProductForm = ({
  productForm,
  setProductForm,
  categories,
  brands,
  onSubmit,
  onCancel,
  editingProduct,
}) => {
  const [activeTab, setActiveTab] = useState("general");

  const handleFormChange = (field, value) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Limpiar subcategoría cuando cambie la categoría
  useEffect(() => {
    if (productForm.category_id !== undefined) {
      setProductForm((prev) => ({
        ...prev,
        subcategory_id: "",
      }));
    }
  }, [productForm.category_id, setProductForm]);

  const modalTitle = editingProduct
    ? "Editar Producto"
    : "Agregar Nuevo Producto";

  const modalFooter = (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" form="product-form">
        {editingProduct ? "Actualizar Producto" : "Crear Producto"}
      </Button>
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
      <form id="product-form" onSubmit={onSubmit} className="space-y-6">
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
          </nav>
        </div>

        {/* Contenido de las pestañas */}
        {activeTab === "general" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SKU */}
              <Input
                label="SKU"
                value={productForm.sku}
                onChange={(value) => handleFormChange("sku", value)}
                placeholder="Código SKU"
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
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(value) => handleFormChange("price", value)}
                placeholder="0.00"
                required
              />

              {/* Stock */}
              <Input
                label="Stock"
                type="number"
                value={productForm.stock_quantity}
                onChange={(value) => handleFormChange("stock_quantity", value)}
                placeholder="0"
                required
              />

              {/* Nivel mínimo de stock */}
              <Input
                label="Nivel Mínimo de Stock"
                type="number"
                value={productForm.min_stock_level}
                onChange={(value) => handleFormChange("min_stock_level", value)}
                placeholder="0"
              />

              {/* Peso */}
              <Input
                label="Peso (kg)"
                type="number"
                step="0.01"
                value={productForm.weight}
                onChange={(value) => handleFormChange("weight", value)}
                placeholder="0.00"
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

              {/* Subcategoría */}
              <Select
                label="Subcategoría"
                value={productForm.subcategory_id || ""}
                onChange={(value) => handleFormChange("subcategory_id", value)}
                options={[
                  { label: "Sin subcategoría", value: "" },
                  ...(
                    categories.find((cat) => cat.id === productForm.category_id)
                      ?.subcategories || []
                  ).map((subcat) => ({
                    label: subcat.name,
                    value: subcat.id,
                  })),
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
          </>
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
              productId={editingProduct.id}
              productName={editingProduct.name}
            />
          </div>
        )}

        {/* Mensaje cuando no hay producto seleccionado */}
        {(activeTab === "features" || activeTab === "applications" || activeTab === "accessories") &&
          !editingProduct && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Guarda el producto primero para poder gestionar sus
                características, aplicaciones y accesorios
              </p>
            </div>
          )}
      </form>
    </Modal>
  );
};

export default ProductForm;
