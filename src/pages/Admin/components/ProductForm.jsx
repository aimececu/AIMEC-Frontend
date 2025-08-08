import React, { useState } from "react";
import {
  Card,
  Input,
  Select,
  TextArea,
  Button,
  Heading,
  Icon,
} from "../../../components/ui/components";

const ProductForm = ({
  productForm,
  setProductForm,
  categories,
  brands,
  onSubmit,
  onCancel,
  editingProduct,
}) => {
  const [activeFormTab, setActiveFormTab] = useState("basic");

  const handleFormChange = (field, value) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-secondary-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3}>
              {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
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
              { id: "basic", label: "Básico", icon: "FiFileText" },
              { id: "technical", label: "Técnico", icon: "FiSettings" },
              {
                id: "specifications",
                label: "Especificaciones",
                icon: "FiList",
              },
              { id: "media", label: "Multimedia", icon: "FiImage" },
              { id: "seo", label: "SEO", icon: "FiSearch" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFormTab(tab.id)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeFormTab === tab.id
                    ? "bg-white dark:bg-secondary-600 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit}>
            {activeFormTab === "basic" && (
              <div className="space-y-6">
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
                    onChange={(value) =>
                      handleFormChange("stock_quantity", value)
                    }
                    placeholder="0"
                    required
                  />

                  {/* Precio Original */}
                  <Input
                    label="Precio Original"
                    type="number"
                    step="0.01"
                    value={productForm.original_price}
                    onChange={(value) => handleFormChange("original_price", value)}
                    placeholder="0.00"
                  />
                  {/* Marca */}
                  <Select
                    label="Marca"
                    value={productForm.brand}
                    onChange={(value) => handleFormChange("brand", value)}
                    required
                    options={brands.map((brand) => ({
                      label: brand.name,
                      value: brand.id,
                    }))}
                  />

                  {/* Categoría */}
                  <Select
                    label="Categoría"
                    value={productForm.category}
                    onChange={(value) => handleFormChange("category", value)}
                    required
                    options={categories.map((cat) => ({
                      label: cat.name,
                      value: cat.id,
                    }))}
                  />

                  {/* Subcategoría */}
                  <Input
                    label="Subcategoría"
                    value={productForm.subcategory}
                    onChange={(value) => handleFormChange("subcategory", value)}
                    placeholder="Subcategoría"
                  />

                  {/* Serie */}
                  <Input
                    label="Serie"
                    value={productForm.series}
                    onChange={(value) => handleFormChange("series", value)}
                    placeholder="Serie del producto"
                  />

                  {/* Garantía (meses) */}
                  <Input
                    label="Garantía (meses)"
                    type="number"
                    value={productForm.warranty_months}
                    onChange={(value) => handleFormChange("warranty_months", value)}
                    placeholder="0"
                  />

                  {/* Tiempo de Entrega (días) */}
                  <Input
                    label="Tiempo de Entrega (días)"
                    type="number"
                    value={productForm.lead_time_days}
                    onChange={(value) => handleFormChange("lead_time_days", value)}
                    placeholder="0"
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

                  {/* Destacado */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Destacado
                    </label>
                    <Select
                      value={productForm.is_featured ? "true" : "false"}
                      onChange={(value) =>
                        handleFormChange("is_featured", value === "true")
                      }
                      options={[
                        { label: "Sí", value: "true" },
                        { label: "No", value: "false" },
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
                  />

                  {/* Descripción Corta */}
                  <TextArea
                    label="Descripción Corta"
                    value={productForm.short_description}
                    onChange={(value) => handleFormChange("short_description", value)}
                    placeholder="Descripción breve del producto..."
                    rows={2}
                  />
              </div>
            )}

            {activeFormTab === "technical" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  {/* Voltaje */}
                  <Input
                    label="Voltaje (V)"
                    type="number"
                    step="0.1"
                    value={productForm.voltage}
                    onChange={(value) => handleFormChange("voltage", value)}
                    placeholder="0.0"
                  />

                  {/* Potencia */}
                  <Input
                    label="Potencia (W)"
                    type="number"
                    step="0.1"
                    value={productForm.power}
                    onChange={(value) => handleFormChange("power", value)}
                    placeholder="0.0"
                  />

                  {/* Rango de temperatura */}
                  <Input
                    label="Rango de Temperatura"
                    value={productForm.temperature_range}
                    onChange={(value) =>
                      handleFormChange("temperature_range", value)
                    }
                    placeholder="Ej: -10°C a +50°C"
                  />

                  {/* IP Rating */}
                  <Input
                    label="IP Rating"
                    value={productForm.ip_rating}
                    onChange={(value) => handleFormChange("ip_rating", value)}
                    placeholder="Ej: IP65"
                  />

                  {/* Material */}
                  <Input
                    label="Material"
                    value={productForm.material}
                    onChange={(value) => handleFormChange("material", value)}
                    placeholder="Material del producto"
                  />

                  {/* Color */}
                  <Input
                    label="Color"
                    value={productForm.color}
                    onChange={(value) => handleFormChange("color", value)}
                    placeholder="Color del producto"
                  />

                  {/* País de Origen */}
                  <Input
                    label="País de Origen"
                    value={productForm.country_of_origin}
                    onChange={(value) => handleFormChange("country_of_origin", value)}
                    placeholder="País de origen"
                  />

                  {/* Cumplimiento */}
                  <TextArea
                    label="Cumplimiento y Certificaciones"
                    value={productForm.compliance}
                    onChange={(value) => handleFormChange("compliance", value)}
                    placeholder="Certificaciones y cumplimiento..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {activeFormTab === "specifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                    Especificaciones del Producto
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                                          onClick={() => {
                        const newSpecs = [
                          ...(Array.isArray(productForm.specifications) ? productForm.specifications : []),
                          { name: "", value: "" },
                        ];
                        handleFormChange("specifications", newSpecs);
                      }}
                    className="flex items-center gap-2"
                  >
                    <Icon name="FiPlus" size="sm" />
                    Agregar Especificación
                  </Button>
                </div>

                <div className="space-y-4">
                  {(Array.isArray(productForm.specifications) ? productForm.specifications : []).map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <Input
                          label="Nombre"
                          value={spec.name}
                          onChange={(value) => {
                            const newSpecs = [
                              ...(Array.isArray(productForm.specifications) ? productForm.specifications : []),
                            ];
                            newSpecs[index] = { ...spec, name: value };
                            handleFormChange("specifications", newSpecs);
                          }}
                          placeholder="Ej: Potencia, Voltaje, Dimensiones..."
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          label="Valor"
                          value={spec.value}
                          onChange={(value) => {
                            const newSpecs = [
                              ...(Array.isArray(productForm.specifications) ? productForm.specifications : []),
                            ];
                            newSpecs[index] = { ...spec, value: value };
                            handleFormChange("specifications", newSpecs);
                          }}
                          placeholder="Ej: 100W, 220V, 10x5x2cm..."
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSpecs = (
                            Array.isArray(productForm.specifications) ? productForm.specifications : []
                          ).filter((_, i) => i !== index);
                          handleFormChange("specifications", newSpecs);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Icon name="FiTrash2" size="sm" />
                      </Button>
                    </div>
                  ))}

                  {(Array.isArray(productForm.specifications) ? productForm.specifications : []).length === 0 && (
                    <div className="text-center py-8 text-secondary-500 dark:text-secondary-400">
                      <Icon name="FiList" className="text-4xl mx-auto mb-4" />
                      <p>No hay especificaciones configuradas</p>
                      <p className="text-sm">
                        Haz clic en "Agregar Especificación" para comenzar
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeFormTab === "media" && (
              <div className="space-y-6">
                <Input
                  label="Imagen Principal"
                  value={productForm.main_image}
                  onChange={(value) => handleFormChange("main_image", value)}
                  placeholder="URL de la imagen principal"
                />

                <TextArea
                  label="Imágenes Adicionales (URLs separadas por comas)"
                  value={productForm.additional_images?.join(", ") || ""}
                  onChange={(value) =>
                    handleFormChange(
                      "additional_images",
                      value.split(",").map((url) => url.trim())
                    )
                  }
                  placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                  rows={3}
                />

                <Input
                  label="URL del Manual"
                  value={productForm.manual_url}
                  onChange={(value) => handleFormChange("manual_url", value)}
                  placeholder="URL del manual de usuario"
                />

                <Input
                  label="URL de la Hoja de Datos"
                  value={productForm.datasheet_url}
                  onChange={(value) => handleFormChange("datasheet_url", value)}
                  placeholder="URL de la hoja de datos técnica"
                />
              </div>
            )}

            {activeFormTab === "seo" && (
              <div className="space-y-6">
                <Input
                  label="Meta Title"
                  value={productForm.meta_title}
                  onChange={(value) => handleFormChange("meta_title", value)}
                  placeholder="Título para SEO"
                />

                <TextArea
                  label="Meta Description"
                  value={productForm.meta_description}
                  onChange={(value) =>
                    handleFormChange("meta_description", value)
                  }
                  placeholder="Descripción para SEO"
                  rows={3}
                />

                <Input
                  label="Meta Keywords"
                  value={productForm.meta_keywords}
                  onChange={(value) => handleFormChange("meta_keywords", value)}
                  placeholder="Palabras clave separadas por comas"
                />
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-secondary-200 dark:border-secondary-700">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingProduct ? "Actualizar Producto" : "Crear Producto"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;
