import React, { useState, useEffect } from "react";
import { useRelatedProducts } from "../../hooks/useRelatedProducts";
import { useProducts } from "../../hooks/useProducts";
import { useToast } from "../../context/ToastContext";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Container from "../ui/Container";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Modal from "../ui/Modal";
import ConfirmDialog from "../ui/ConfirmDialog";
import Loader from "../ui/Loader";
import Icon from "../ui/Icon";
import ImageWithFallback from "../ui/ImageWithFallback";
import Checkbox from "../ui/Checkbox";

/**
 * Componente para gestionar productos relacionados de un producto
 * @param {Object} props - Propiedades del componente
 * @param {number} props.productId - ID del producto principal
 * @param {string} props.productName - Nombre del producto principal
 */
const ProductRelatedManager = ({ productId, productName }) => {
  const {
    relatedProducts,
    loading,
    error,
    addRelatedProduct,
    addMultipleRelatedProducts,
    updateRelatedProduct,
    removeRelatedProduct,
  } = useRelatedProducts(productId);

  const { products, loading: productsLoading, loadProducts } = useProducts();
  const { showToast } = useToast();

  // Estados locales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRelatedProduct, setSelectedRelatedProduct] = useState(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [selectedRelationshipType, setSelectedRelationshipType] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [showNewRelationshipInput, setShowNewRelationshipInput] = useState(false);
  const [newRelationshipType, setNewRelationshipType] = useState("");

  const [editingGroupData, setEditingGroupData] = useState({
    relationshipType: "",
    products: [],
    newRelationshipType: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGroupSearchTerm, setEditingGroupSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    relationship_type: "",
  });
  const [showChangeNameInput, setShowChangeNameInput] = useState(false);

  // Cargar productos cuando el componente se monte
  useEffect(() => {
    if (products.length === 0) {
      loadProducts();
    }
  }, [products.length, loadProducts]);

     // Limpiar estados cuando se cierre la sección de agregar
   useEffect(() => {
     if (!showAddSection) {
       setSelectedRelationshipType("");
       setSelectedProductIds([]);
       setSearchTerm("");
       setShowNewRelationshipInput(false);
       setNewRelationshipType("");
     }
   }, [showAddSection]);

  // Limpiar estados cuando se cierre el modal de editar grupo
  useEffect(() => {
    if (!showEditGroupModal) {
      setEditingGroupData({
        relationshipType: "",
        products: [],
        newRelationshipType: "",
      });
      setEditingGroupSearchTerm("");
      setShowChangeNameInput(false);
    }
  }, [showEditGroupModal]);

  // Tipos de relación únicos de productos existentes (solo los que están en la base)
  const relationshipTypes = relatedProducts
    .map((rp) => rp.relationshipType)
    .filter((type, index, arr) => arr.indexOf(type) === index);

  /**
   * Abre la sección para agregar productos relacionados
   */
  const handleAddClick = () => {
    setShowAddSection(true);
    setSelectedRelationshipType("");
    setSelectedProductIds([]);
  };

  /**
   * Abre el modal para editar un producto relacionado
   */
  const handleEditClick = (relatedProduct) => {
    setSelectedRelatedProduct(relatedProduct);
    setFormData({
      relationship_type: relatedProduct.relationshipType,
    });
    setShowEditModal(true);
  };

  /**
   * Abre el diálogo de confirmación para eliminar
   */
  const handleDeleteClick = (relatedProduct) => {
    setSelectedRelatedProduct(relatedProduct);
    setShowDeleteDialog(true);
  };

  /**
   * Abre el modal para editar un grupo completo
   */
  const handleEditGroupClick = (relationshipType, products) => {
    setEditingGroupData({
      relationshipType,
      products,
      newRelationshipType: relationshipType,
    });
    setShowEditGroupModal(true);
    setShowChangeNameInput(false);
  };

  /**
   * Maneja la selección/deselección de productos
   */
  const handleProductSelection = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  /**
   * Maneja el cambio del tipo de relación
   */
  const handleRelationshipTypeChange = (value) => {
    if (value === "new") {
      setShowNewRelationshipInput(true);
      setSelectedRelationshipType("");
      setNewRelationshipType("");
    } else {
      setShowNewRelationshipInput(false);
      setSelectedRelationshipType(value);
      setNewRelationshipType("");
    }
  };

  /**
   * Guarda los productos seleccionados con el tipo de relación
   */
  const handleSaveSelected = async () => {
    const relationshipType = showNewRelationshipInput ? newRelationshipType : selectedRelationshipType;
    
    if (!relationshipType || selectedProductIds.length === 0) {
      showToast(
        "Selecciona un tipo de relación y al menos un producto",
        "error"
      );
      return;
    }

    try {
      const success = await addMultipleRelatedProducts({
        relationship_type: relationshipType,
        products: selectedProductIds,
      });

      if (success) {
        // Limpiar selección y cerrar sección
        setSelectedProductIds([]);
        setSelectedRelationshipType("");
        setShowNewRelationshipInput(false);
        setSelectedRelationshipType("");
        setShowAddSection(false);
      }
    } catch (error) {
      showToast("Error al guardar los productos relacionados", "error");
    }
  };

  /**
   * Maneja el envío del formulario para editar
   */
  const handleEditSubmit = async () => {
    if (!formData.relationship_type) {
      showToast("El tipo de relación es requerido", "error");
      return;
    }

    const success = await updateRelatedProduct(
      selectedRelatedProduct.id,
      formData
    );
    if (success) {
      setShowEditModal(false);
      setSelectedRelatedProduct(null);
      setFormData({
        related_product_id: "",
        relationship_type: "",
      });
    }
  };

  /**
   * Maneja la eliminación de un producto relacionado
   */
  const handleDeleteConfirm = async () => {
    if (selectedRelatedProduct) {
      await removeRelatedProduct(selectedRelatedProduct.id);
      setShowDeleteDialog(false);
      setSelectedRelatedProduct(null);
    }
  };

  /**
   * Remueve un producto del grupo de edición
   */
  const handleRemoveFromGroup = (productId) => {
    setEditingGroupData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  /**
   * Alterna la vista del campo de cambio de nombre
   */
  const toggleChangeNameInput = () => {
    setShowChangeNameInput(!showChangeNameInput);
    if (!showChangeNameInput) {
      setEditingGroupData((prev) => ({
        ...prev,
        newRelationshipType: prev.relationshipType,
      }));
    }
  };

  /**
   * Maneja la actualización de un grupo completo
   */
  const handleEditGroupSubmit = async () => {
    // Solo validar nuevo tipo si se está cambiando el nombre
    if (showChangeNameInput && !editingGroupData.newRelationshipType) {
      showToast("El nuevo tipo de relación es requerido", "error");
      return;
    }

    try {
      let successCount = 0;
      let totalOperations = 0;

      // Obtener los productos originales del grupo para comparar
      const originalProducts = relatedProducts.filter(
        (rp) => rp.relationshipType === editingGroupData.relationshipType
      );

      // Productos que fueron eliminados del grupo
      const removedProducts = originalProducts.filter(
        (original) => !editingGroupData.products.some(
          (current) => current.id === original.id
        )
      );

      // Productos que permanecen en el grupo (para actualizar tipo si es necesario)
      const remainingProducts = editingGroupData.products.filter(
        (current) => originalProducts.some(
          (original) => original.id === current.id
        )
      );

      // Productos nuevos que se agregaron al grupo
      const newProducts = editingGroupData.products.filter(
        (current) => !originalProducts.some(
          (original) => original.id === current.id
        )
      );

      const operations = [];

      // 1. Eliminar productos removidos del grupo
      if (removedProducts.length > 0) {
        const removePromises = removedProducts.map((product) =>
          removeRelatedProduct(product.id)
        );
        operations.push(...removePromises);
        totalOperations += removedProducts.length;
      }

      // 2. Actualizar tipo de relación de productos existentes si cambió
      if (showChangeNameInput && remainingProducts.length > 0) {
        const updatePromises = remainingProducts.map((product) =>
          updateRelatedProduct(product.id, {
            relationship_type: editingGroupData.newRelationshipType,
          })
        );
        operations.push(...updatePromises);
        totalOperations += remainingProducts.length;
      }

      // 3. Agregar nuevos productos al grupo
      if (newProducts.length > 0) {
        const addPromises = newProducts.map((product) =>
          addRelatedProduct({
            relationship_type: showChangeNameInput 
              ? editingGroupData.newRelationshipType 
              : editingGroupData.relationshipType,
            related_product_id: product.relatedProduct.id,
          })
        );
        operations.push(...addPromises);
        totalOperations += newProducts.length;
      }

      // Ejecutar todas las operaciones
      if (operations.length > 0) {
        const results = await Promise.all(operations);
        successCount = results.filter(Boolean).length;
      }

      if (successCount === totalOperations || totalOperations === 0) {
        const message = showChangeNameInput
          ? `Grupo actualizado exitosamente. ${successCount} operaciones completadas.`
          : `Grupo actualizado exitosamente. ${successCount} operaciones completadas.`;

        showToast(message, "success");
        setShowEditGroupModal(false);
        setEditingGroupData({
          relationshipType: "",
          products: [],
          newRelationshipType: "",
        });
      } else {
        showToast(
          `Se completaron ${successCount} de ${totalOperations} operaciones.`,
          "warning"
        );
      }
    } catch (error) {
      console.error("Error al actualizar el grupo:", error);
      showToast("Error al actualizar el grupo", "error");
    }
  };

  /**
   * Obtiene el nombre del producto por ID
   */
  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : `Producto ${productId}`;
  };

  /**
   * Obtiene la imagen del producto por ID
   */
  const getProductImage = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.main_image : null;
  };

  /**
   * Agrupa los productos relacionados por tipo de relación
   */
  const groupedRelatedProducts = relatedProducts.reduce((groups, product) => {
    const type = product.relationshipType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(product);
    return groups;
  }, {});

  /**
   * Verifica si hay cambios en el grupo actual
   */
  const hasGroupChanges = () => {
    if (!editingGroupData.relationshipType) return false;
    
    const originalProducts = relatedProducts.filter(
      (rp) => rp.relationshipType === editingGroupData.relationshipType
    );

    // Verificar si se eliminaron productos
    const hasRemovedProducts = originalProducts.some(
      (original) => !editingGroupData.products.some(
        (current) => current.id === original.id
      )
    );

    // Verificar si se agregaron productos
    const hasNewProducts = editingGroupData.products.some(
      (current) => !originalProducts.some(
        (original) => original.id === current.id
      )
    );

    return hasRemovedProducts || hasNewProducts;
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center py-8">
          <Loader size="lg" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex justify-between items-center flex-row">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Productos Relacionados
            </h3>
            <p className="text-gray-600">
              Gestiona los productos relacionados con "{productName}"
            </p>
          </div>
          {/* Botón para agregar */}
          <div className="mb-6">
            <Button
              onClick={handleAddClick}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Icon name="FiPlus" />
              Agregar Productos Relacionados
            </Button>
          </div>
        </div>
      </div>

      {/* Modal para agregar productos relacionados */}
      <Modal
        isOpen={showAddSection}
        onClose={() => setShowAddSection(false)}
        title="Agregar Productos Relacionados"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddSection(false)}>
              Cancelar
            </Button>
                         <Button
               onClick={handleSaveSelected}
               disabled={
                 (!selectedRelationshipType && !newRelationshipType) || selectedProductIds.length === 0
               }
               className="bg-blue-600 hover:bg-blue-700 text-white"
             >
               <Icon name="FiSave" />
               Guardar Productos Seleccionados ({selectedProductIds.length})
             </Button>
          </div>
        }
      >
        <div className="space-y-6">
                     {/* Tipo de relación */}
           <div>
             {!showNewRelationshipInput ? (
               <Select
                 value={selectedRelationshipType}
                 onChange={(e) => handleRelationshipTypeChange(e.target.value)}
                 label="Tipo de Relación"
                 helperText="Selecciona un tipo existente o crea uno nuevo"
                 className="w-full max-w-md"
                 required
               >
                 <option value="">Selecciona un tipo de relación</option>
                 {relationshipTypes.map((type) => (
                   <option key={type} value={type}>
                     {type.charAt(0).toUpperCase() + type.slice(1)}
                   </option>
                 ))}
                 <option value="new">➕ Crear nuevo tipo</option>
               </Select>
             ) : (
               <div className="space-y-2">
                 <Input
                   type="text"
                   value={newRelationshipType}
                   onChange={(value) => setNewRelationshipType(value)}
                   label="Nuevo Tipo de Relación"
                   helperText="Escribe el nombre del nuevo tipo de relación"
                   placeholder="Ej: complementario, alternativo, etc."
                   className="w-full max-w-md"
                   required
                 />
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => {
                     setShowNewRelationshipInput(false);
                     setNewRelationshipType("");
                     setSelectedRelationshipType("");
                   }}
                   className="text-gray-600 hover:text-gray-800"
                 >
                   <Icon name="FiX" size="sm" />
                   Cancelar nuevo tipo
                 </Button>
               </div>
             )}
           </div>

          {/* Lista de productos disponibles con checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-md font-medium text-gray-700 dark:text-gray-200">
                Seleccionar Productos ({selectedProductIds.length}{" "}
                seleccionados)
              </h5>
              <div className="flex-1 max-w-xs ml-4">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(value) => setSearchTerm(value)}
                  placeholder="Buscar productos..."
                  className="w-full"
                />
              </div>
            </div>

            {productsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size="lg" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  Cargando productos...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                {products
                  .filter((p) => p.id !== productId && p.is_active)
                  .filter(
                    (p) =>
                      searchTerm === "" ||
                      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((product) => (
                    <Checkbox
                      key={product.id}
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() => handleProductSelection(product.id)}
                      card={true}
                      size="md"
                      variant="primary"
                      align="center"
                      label={
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <ImageWithFallback
                            src={product.main_image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SKU: {product.sku}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              ${product.price}
                            </p>
                          </div>
                        </div>
                      }
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal para editar grupo de productos relacionados */}
      <Modal
        isOpen={showEditGroupModal}
        onClose={() => setShowEditGroupModal(false)}
        title="Editar Grupo de Productos Relacionados"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowEditGroupModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditGroupSubmit}
              disabled={
                (showChangeNameInput && !editingGroupData.newRelationshipType) ||
                (!showChangeNameInput && !hasGroupChanges())
              }
            >
              <Icon name="FiSave" />
              {showChangeNameInput ? "Actualizar Grupo" : "Guardar Cambios"}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Tipo de relación actual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Relación Actual
            </label>
            <p className="text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              {editingGroupData.relationshipType}
            </p>
          </div>

          {/* Nuevo tipo de relación - Solo se muestra cuando se hace clic en cambiar nombre */}
          {showChangeNameInput && (
            <div>
              <Input
                type="text"
                value={editingGroupData.newRelationshipType}
                onChange={(value) =>
                  setEditingGroupData((prev) => ({
                    ...prev,
                    newRelationshipType: value,
                  }))
                }
                label="Nuevo Tipo de Relación"
                helperText="Escribe el nuevo tipo de relación para todo el grupo"
                placeholder="Escribe el nuevo tipo de relación"
                className="w-full max-w-md"
                required
              />
            </div>
          )}

          {/* Lista de productos del grupo */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-md font-medium text-gray-700 dark:text-gray-200">
                Productos en este grupo ({editingGroupData.products.length})
              </h5>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleChangeNameInput}
                >
                  <Icon
                    name={showChangeNameInput ? "FiX" : "FiEdit"}
                    size="sm"
                  />
                  {showChangeNameInput ? "Cancelar Cambio" : "Cambiar Nombre"}
                </Button>
              </div>
            </div>
            {/* Contenedor principal con layout horizontal */}
            <div className="flex flex-row gap-6">
              {/* Lista de productos del grupo - Columna izquierda */}
              <div className="w-1/2">
                <div className="flex items-center justify-between mb-3">
                  <h6 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Productos en el Grupo ({editingGroupData.products.length})
                  </h6>
                  <div className="flex-1 max-w-xs ml-4">
                    <Input
                      type="text"
                      value={editingGroupSearchTerm}
                      onChange={(value) => setEditingGroupSearchTerm(value)}
                      placeholder="Buscar en el grupo..."
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="h-full overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                  {editingGroupData.products
                    .filter(
                      (product) =>
                        editingGroupSearchTerm === "" ||
                        product.relatedProduct.name
                          .toLowerCase()
                          .includes(editingGroupSearchTerm.toLowerCase()) ||
                        product.relatedProduct.sku
                          .toLowerCase()
                          .includes(editingGroupSearchTerm.toLowerCase())
                    )
                    .map((product, index) => (
                      <div
                        key={product.id}
                        className="flex items-start gap-2 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 mb-2 last:mb-0"
                      >
                        <ImageWithFallback
                          src={getProductImage(product.relatedProduct.id)}
                          alt={product.relatedProduct.name}
                          className="w-8 h-8 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white break-words leading-tight">
                            {product.relatedProduct.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            SKU: {product.relatedProduct.sku}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFromGroup(product.id)}
                          mainColor="#ef4444"
                          textColor="#f5f5f5"
                          className="p-1 flex-shrink-0"
                        >
                          <Icon name="FiX" size="sm" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Lista de productos disponibles para agregar - Columna derecha */}
              <div className="w-1/2">
                <div className="flex items-center justify-between mb-3">
                  <h6 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Agregar Productos al Grupo
                  </h6>
                  <div className="flex-1 max-w-xs ml-4">
                    <Input
                      type="text"
                      value={editingGroupSearchTerm}
                      onChange={(value) => setEditingGroupSearchTerm(value)}
                      placeholder="Buscar productos..."
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="h-full overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                  {products
                    .filter((p) => p.id !== productId && p.is_active)
                    .filter(
                      (p) =>
                        editingGroupSearchTerm === "" ||
                        p.name
                          .toLowerCase()
                          .includes(editingGroupSearchTerm.toLowerCase()) ||
                        p.sku
                          .toLowerCase()
                          .includes(editingGroupSearchTerm.toLowerCase())
                    )
                    .filter(
                      (p) =>
                        !editingGroupData.products.some(
                          (gp) => gp.relatedProduct.id === p.id
                        )
                    )
                    .map((product) => (
                      <div
                        key={product.id}
                        className="flex items-start gap-2 p-2 rounded border text-xs bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 mb-2 last:mb-0"
                      >
                        <ImageWithFallback
                          src={product.main_image}
                          alt={product.name}
                          className="w-6 h-6 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white break-words leading-tight">
                            {product.name}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            SKU: {product.sku}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Agregar al grupo
                            const newGroupProduct = {
                              id: Date.now(), // ID temporal
                              relationshipType:
                                editingGroupData.relationshipType,
                              relatedProduct: product,
                            };
                            setEditingGroupData((prev) => ({
                              ...prev,
                              products: [...prev.products, newGroupProduct],
                            }));
                          }}
                          mainColor="#10b981"
                          textColor="#f5f5f5"
                          className="p-1 text-xs flex-shrink-0"
                        >
                          <Icon name="FiPlus" size="sm" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Lista de productos relacionados agrupados por tipo */}
      {Object.keys(groupedRelatedProducts).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedRelatedProducts).map(
            ([relationshipType, products]) => (
              <div
                key={relationshipType}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm dark:shadow-gray-900/20"
              >
                {/* Header del grupo */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 dark:bg-blue-500 text-white shadow-sm">
                        {relationshipType.charAt(0).toUpperCase() +
                          relationshipType.slice(1)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                        {products.length} producto
                        {products.length !== 1 ? "s" : ""} relacionado
                        {products.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleEditGroupClick(relationshipType, products)
                        }
                        className="flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                      >
                        <Icon name="FiEdit" size="sm" />
                        Editar Grupo
                      </Button>
                      <div className="text-xs text-gray-500 dark:text-gray-400"></div>
                    </div>
                  </div>
                </div>

                {/* Lista de productos del grupo */}
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                    {products.map((relatedProduct, index) => (
                      <div
                        key={relatedProduct.id}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex flex-col items-center text-center">
                          {/* Imagen del producto */}
                          <div className="mb-2">
                            <ImageWithFallback
                              src={getProductImage(
                                relatedProduct.relatedProduct.id
                              )}
                              alt={relatedProduct.relatedProduct.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          </div>

                          {/* Información básica del producto */}
                          <div className="w-full">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate text-xs mb-1">
                              {relatedProduct.relatedProduct.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              SKU: {relatedProduct.relatedProduct.sku}
                            </p>
                            {/* <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                              ${relatedProduct.relatedProduct.price}
                            </p> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <Card className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600">
          <Icon
            name="FiLink"
            className="mx-auto mb-6 text-gray-400 dark:text-gray-500"
            size="4xl"
          />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            No hay productos relacionados configurados
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Comienza agregando productos relacionados para mejorar la
            experiencia de tus clientes
          </p>
          <Button
            onClick={handleAddClick}
            variant="outline"
            className="border-blue-300 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-400"
          >
            <Icon name="FiPlus" className="mr-2" />
            Agregar el primer producto relacionado
          </Button>
        </Card>
      )}

      {/* Modal para editar producto relacionado */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Producto Relacionado"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleEditSubmit}
              disabled={!formData.relationship_type}
            >
              Actualizar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto
            </label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded border">
              {selectedRelatedProduct?.relatedProduct?.name}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Relación
            </label>
            <Select
              value={formData.relationship_type}
              onChange={(e) =>
                setFormData({ ...formData, relationship_type: e.target.value })
              }
              required
            >
              {relationshipTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Producto Relacionado"
        message={`¿Estás seguro de que quieres eliminar "${selectedRelatedProduct?.relatedProduct?.name}" de los productos relacionados?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default ProductRelatedManager;
