import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { useAccessories } from "../../hooks/useAccessories";
import { productEndpoints } from "../../api/endpoints/products";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Loader from "../ui/Loader";
import Icon from "../ui/Icon";
import Checkbox from "../ui/Checkbox";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const AccessoriesManager = forwardRef(({ productId, productName }, ref) => {
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { accessories, loading, addAccessory, removeAccessory } =
    useAccessories(productId);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Filtrar productos que no son el producto principal y no son ya accesorios
  const availableProducts = (products || []).filter((product) => {
    const isNotMainProduct = product.id !== productId;
    const isNotAlreadyAccessory = !accessories.some(
      (acc) => acc.accessoryProduct.id === product.id
    );

    return isNotMainProduct && isNotAlreadyAccessory;
  });

  const handleSaveAccessories = async () => {
    console.log(
      "🔵 Handler handleSaveAccessories ejecutado - Click en botón Guardar Accesorios"
    );

    // Verificar autenticación
    if (!isAuthenticated || !user) {
      showToast("Debes estar autenticado para gestionar accesorios", "error");
      return false;
    }

    // Obtener los IDs de accesorios que se van a agregar (nuevos)
    const newAccessoryIds = selectedAccessoryIds.filter(
      (id) => !accessories.some((acc) => acc.accessoryProduct.id === id)
    );

    // Obtener los IDs de accesorios que se van a eliminar (deseleccionados)
    const removedAccessoryIds = accessories
      .filter((acc) => !selectedAccessoryIds.includes(acc.accessoryProduct.id))
      .map((acc) => acc.id);

    try {
      // Eliminar accesorios deseleccionados
      if (removedAccessoryIds.length > 0) {
        for (const accessoryId of removedAccessoryIds) {
          await removeAccessory(accessoryId);
        }
      }

      // Agregar nuevos accesorios
      if (newAccessoryIds.length > 0) {
        const success = await addAccessory(newAccessoryIds);
        if (!success) {
          showToast("Error al agregar algunos accesorios", "error");
          return false;
        }
      }

      showToast("Lista de accesorios actualizada exitosamente", "success");
      setSelectedAccessoryIds([]);
      return true;
    } catch (error) {
      console.error("Error al actualizar accesorios:", error);
      showToast("Error al actualizar la lista de accesorios", "error");
      return false;
    }
  };

  // Exponer funciones al componente padre
  useImperativeHandle(ref, () => ({
    handleSaveAccessories
  }));

  const getProductById = (id) => {
    return (products || []).find((p) => p.id === id);
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
        console.error("Error cargando productos:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Inicializar el estado de selección cuando se carguen los accesorios
  useEffect(() => {
    if (accessories.length > 0 && selectedAccessoryIds.length === 0) {
      const currentAccessoryIds = accessories.map((acc) => acc.accessoryProduct.id);
      setSelectedAccessoryIds(currentAccessoryIds);
    }
  }, [accessories, selectedAccessoryIds.length]);

  return (
    <div
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
      </div>

      {/* Contenido principal de gestión de accesorios */}
      <div className="space-y-6">
        {productsLoading ? (
          <div className="text-center py-6">
            <Loader />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Cargando productos...
            </p>
          </div>
        ) : (
          <div>
            {/* Barra de búsqueda */}
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Buscar productos por nombre o SKU..."
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                className="w-full"
                icon={<Icon name="FiSearch" />}
              />
            </div>

            {/* Botones de selección masiva */}
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const allProductIds = [
                    ...accessories.map(acc => acc.accessoryProduct.id),
                    ...availableProducts.map(p => p.id)
                  ];
                  setSelectedAccessoryIds(allProductIds);
                }}
                className="text-xs"
              >
                Seleccionar Todos
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedAccessoryIds([])}
                className="text-xs"
              >
                Deseleccionar Todos
              </Button>
            </div>

            {/* Lista de productos con checkboxes */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Productos Disponibles:
              </div>
              
              {/* Mostrar productos ya asignados como accesorios */}
              {accessories
                .filter(
                  (accessory) =>
                    accessory.accessoryProduct.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    (accessory.accessoryProduct.sku &&
                      accessory.accessoryProduct.sku
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
                )
                .map((accessory) => (
                  <Checkbox
                    key={`current-${accessory.id}`}
                    checked={selectedAccessoryIds.includes(accessory.accessoryProduct.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAccessoryIds([
                          ...selectedAccessoryIds,
                          accessory.accessoryProduct.id,
                        ]);
                      } else {
                        setSelectedAccessoryIds(
                          selectedAccessoryIds.filter(
                            (id) => id !== accessory.accessoryProduct.id
                          )
                        );
                      }
                    }}
                    label={accessory.accessoryProduct.name}
                    description={
                      <>
                        {accessory.accessoryProduct.sku && `SKU: ${accessory.accessoryProduct.sku}`}
                        {accessory.accessoryProduct.sku && accessory.accessoryProduct.brand && " • "}
                        {accessory.accessoryProduct.brand && `Marca: ${accessory.accessoryProduct.brand.name}`}
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          ✓ Ya asignado
                        </span>
                      </>
                    }
                    variant="success"
                    size="md"
                    card={true}
                    align="center"
                  />
                ))}

              {/* Mostrar productos disponibles para agregar */}
              {availableProducts
                .filter(
                  (product) =>
                    product.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    (product.sku &&
                      product.sku
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
                )
                .map((product) => (
                  <Checkbox
                    key={`available-${product.id}`}
                    checked={selectedAccessoryIds.includes(product.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAccessoryIds([
                          ...selectedAccessoryIds,
                          product.id,
                        ]);
                      } else {
                        setSelectedAccessoryIds(
                          selectedAccessoryIds.filter(
                            (id) => id !== product.id
                          )
                        );
                      }
                    }}
                    label={product.name}
                    description={
                      <>
                        {product.sku && `SKU: ${product.sku}`}
                        {product.sku && product.brand && " • "}
                        {product.brand && `Marca: ${product.brand.name}`}
                      </>
                    }
                    variant="primary"
                    size="md"
                    card={true}
                    align="center"
                  />
                ))}
            </div>

            {/* Contador de seleccionados */}
            {selectedAccessoryIds.length > 0 && (
              <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                <p className="text-sm text-primary-800 dark:text-primary-200">
                  ✅ {selectedAccessoryIds.length} producto
                  {selectedAccessoryIds.length !== 1 ? "s" : ""}{" "}
                  seleccionado{selectedAccessoryIds.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        )}

        {availableProducts.length === 0 && accessories.length === 0 && !productsLoading && (
          <div className="text-center py-6 text-gray-500">
            <Icon
              name="FiPackage"
              className="w-12 h-12 mx-auto mb-4 text-gray-400"
            />
            <p className="text-gray-500 dark:text-gray-400">
              No hay productos disponibles para agregar como accesorios
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              No hay otros productos en el sistema además de este producto principal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

AccessoriesManager.displayName = "AccessoriesManager";

export default AccessoriesManager;
