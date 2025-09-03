import React, { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Icon from "../ui/Icon";
import Loader from "../ui/Loader";
import Select from "../ui/Select";
import { categoryEndpoints } from "../../api/endpoints/categories";
import { brandEndpoints } from "../../api/endpoints/brands";
import { useToast } from "../../context/ToastContext";

const AdminManager = ({
  categories,
  subcategories,
  brands,
  onRefresh,
  onCategoriesUpdate,
  onSubcategoriesUpdate,
  onBrandsUpdate,
}) => {
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState("categories");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const subTabs = [
    { id: "categories", label: "Categorías", icon: "FiFolder" },
    { id: "subcategories", label: "Subcategorías", icon: "FiFolderPlus" },
    { id: "brands", label: "Marcas", icon: "FiTag" },
  ];

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (editingItem) {
        // Actualizar
        if (activeSubTab === "categories") {
          response = await categoryEndpoints.updateCategory(
            editingItem.id,
            formData
          );
          if (response && response.success) {
            // Actualizar solo el item en el estado local
            const updatedCategories = categories.map((cat) =>
              cat.id === editingItem.id ? { ...cat, ...formData } : cat
            );
            if (onCategoriesUpdate) {
              onCategoriesUpdate(updatedCategories);
            } else {
              onRefresh(); // Fallback si no hay callback
            }
          }
        } else if (activeSubTab === "subcategories") {
          response = await categoryEndpoints.updateSubcategory(
            editingItem.id,
            formData
          );
          if (response && response.success) {
            const updatedSubcategories = subcategories.map((sub) =>
              sub.id === editingItem.id ? { ...sub, ...formData } : sub
            );
            if (onSubcategoriesUpdate) {
              onSubcategoriesUpdate(updatedSubcategories);
            } else {
              onRefresh(); // Fallback si no hay callback
            }
          }
        } else if (activeSubTab === "brands") {
          response = await brandEndpoints.updateBrand(editingItem.id, formData);
          if (response && response.success) {
            const updatedBrands = brands.map((brand) =>
              brand.id === editingItem.id ? { ...brand, ...formData } : brand
            );
            if (onBrandsUpdate) {
              onBrandsUpdate(updatedBrands);
            } else {
              onRefresh(); // Fallback si no hay callback
            }
          }
        }
      } else {
        // Crear
        if (activeSubTab === "categories") {
          response = await categoryEndpoints.createCategory(formData);
          if (response && response.success) {
            // Agregar solo el nuevo item al estado local
            const newCategory = { ...response.data, ...formData };
            if (onCategoriesUpdate) {
              onCategoriesUpdate([...categories, newCategory]);
            } else {
              onRefresh(); // Fallback si no hay callback
            }
          }
        } else if (activeSubTab === "subcategories") {
          response = await categoryEndpoints.createSubcategory(formData);
          if (response && response.success) {
            const newSubcategory = { ...response.data, ...formData };
            if (onSubcategoriesUpdate) {
              onSubcategoriesUpdate([...subcategories, newSubcategory]);
            } else {
              onRefresh(); // Fallback si no hay callback
            }
          }
        } else if (activeSubTab === "brands") {
          response = await brandEndpoints.createBrand(formData);
          if (response && response.success) {
            const newBrand = { ...response.data, ...formData };
            if (onBrandsUpdate) {
              onBrandsUpdate([...brands, newBrand]);
            } else {
              onRefresh(); // Fallback si no hay callback
            }
          }
        }
      }

      if (response && response.success) {
        resetForm();
      } else {
        console.error("Error al guardar:", response?.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      let response;
      let itemName = "";

      if (activeSubTab === "categories") {
        const item = categories.find(cat => cat.id === itemToDelete);
        itemName = item?.name || "categoría";
        response = await categoryEndpoints.deleteCategory(itemToDelete);
        if (response && response.success) {
          const updatedCategories = categories.filter((cat) => cat.id !== itemToDelete);
          if (onCategoriesUpdate) {
            onCategoriesUpdate(updatedCategories);
          } else {
            onRefresh(); // Fallback si no hay callback
          }
          showToast("Categoría eliminada correctamente", "success");
        }
      } else if (activeSubTab === "subcategories") {
        const item = subcategories.find(sub => sub.id === itemToDelete);
        itemName = item?.name || "subcategoría";
        response = await categoryEndpoints.deleteSubcategory(itemToDelete);
        if (response && response.success) {
          const updatedSubcategories = subcategories.filter(
            (sub) => sub.id !== itemToDelete
          );
          if (onSubcategoriesUpdate) {
            onSubcategoriesUpdate(updatedSubcategories);
          } else {
            onRefresh(); // Fallback si no hay callback
          }
          showToast("Subcategoría eliminada correctamente", "success");
        }
      } else if (activeSubTab === "brands") {
        const item = brands.find(brand => brand.id === itemToDelete);
        itemName = item?.name || "marca";
        response = await brandEndpoints.deleteBrand(itemToDelete);
        if (response && response.success) {
          const updatedBrands = brands.filter((brand) => brand.id !== itemToDelete);
          if (onBrandsUpdate) {
            onBrandsUpdate(updatedBrands);
          } else {
            onRefresh(); // Fallback si no hay callback
          }
          showToast("Marca eliminada correctamente", "success");
        }
      }

      if (!response || !response.success) {
        console.error("Error al eliminar:", response?.error);
        showToast(`Error al eliminar ${itemName}: ${response?.error || 'Error desconocido'}`, "error");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      showToast(`Error al eliminar: ${error.message || 'Error desconocido'}`, "error");
    } finally {
      setShowConfirmDialog(false);
      setItemToDelete(null);
    }
  };

  const handleNew = () => {
    setEditingItem(null);
    setFormData({});
    setShowForm(true);
  };

  const renderForm = () => {
    if (activeSubTab === "categories") {
      return (
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={formData.name || ""}
            onChange={(value) => handleFormChange("name", value)}
            required
          />
          <TextArea
            label="Descripción"
            value={formData.description || ""}
            onChange={(value) => handleFormChange("description", value)}
            required
          />
          <Input
            label="Icono (FontAwesome)"
            value={formData.icon || ""}
            onChange={(value) => handleFormChange("icon", value)}
            placeholder="fas fa-plug"
          />
          <Input
            label="Color"
            type="color"
            value={formData.color || "#3B82F6"}
            onChange={(value) => handleFormChange("color", value)}
            required
          />
        </div>
      );
    } else if (activeSubTab === "subcategories") {
      return (
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={formData.name || ""}
            onChange={(value) => handleFormChange("name", value)}
            required
          />
          <TextArea
            label="Descripción"
            value={formData.description || ""}
            onChange={(value) => handleFormChange("description", value)}
            required
          />
          <Select
            label="Categoría"
            value={formData.category_id || ""}
            onChange={(value) =>
              handleFormChange("category_id", parseInt(value))
            }
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            required
          />
        </div>
      );
    } else if (activeSubTab === "brands") {
      return (
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={formData.name || ""}
            onChange={(value) => handleFormChange("name", value)}
            required
          />
          <TextArea
            label="Descripción"
            value={formData.description || ""}
            onChange={(value) => handleFormChange("description", value)}
            required
          />
          <Input
            label="URL del Logo"
            value={formData.logo_url || ""}
            onChange={(value) => handleFormChange("logo_url", value)}
            placeholder="https://example.com/logo.png"
          />
          <Input
            label="Sitio Web"
            value={formData.website || ""}
            onChange={(value) => handleFormChange("website", value)}
            placeholder="https://www.example.com"
          />
        </div>
      );
    }
  };

  const renderTable = () => {
    let data = [];
    let columns = [];

    if (activeSubTab === "categories") {
      data = categories;
      columns = [
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "icon", label: "Icono" },
        { key: "color", label: "Color" },
      ];
    } else if (activeSubTab === "subcategories") {
      data = subcategories;
      columns = [
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
        {
          key: "category",
          label: "Categoría",
          render: (item) => item.category?.name || "N/A",
        },
      ];
    } else if (activeSubTab === "brands") {
      data = brands;
      columns = [
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "logo_url", label: "Logo" },
        { key: "website", label: "Sitio Web" },
      ];
    }

    return (
      <div className="w-full max-h-[450px] overflow-y-auto">
        <table className="min-w-full bg-white dark:bg-secondary-800 rounded-lg overflow-hidden">
          <thead className="bg-secondary-100 dark:bg-secondary-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-secondary-50 dark:hover:bg-secondary-700"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-secondary-900 dark:text-white break-words"
                  >
                    {col.render ? (
                      col.render(item)
                    ) : (
                      <span className="break-words">
                        {item[col.key] || "-"}
                      </span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="border-b border-secondary-200 dark:border-secondary-700">
        <nav className="-mb-px flex space-x-8">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                console.log(tab.id);
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSubTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400 dark:hover:text-secondary-300"
              }`}
            >
              <Icon name={tab.icon} className="inline-block w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {subTabs.find((tab) => tab.id === activeSubTab)?.label}
        </h2>
        <Button onClick={handleNew} variant="primary">
          <Icon name="FiPlus" className="w-4 h-4 mr-2" />
          Nuevo{" "}
          {activeSubTab === "categories"
            ? "Categoría"
            : activeSubTab === "subcategories"
            ? "Subcategoría"
            : "Marca"}
        </Button>
      </div>

      {/* Table */}
      {renderTable()}

      {/* Modal Form */}
      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={`${editingItem ? "Editar" : "Crear"} ${
          activeSubTab === "categories"
            ? "Categoría"
            : activeSubTab === "subcategories"
            ? "Subcategoría"
            : "Marca"
        }`}
        footer={
          <div className="flex justify-end space-x-3">
            <Button onClick={resetForm} variant="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="primary" disabled={loading}>
              {loading ? <Loader className="w-4 h-4" /> : "Guardar"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>{renderForm()}</form>
      </Modal>

      {/* Modal de Confirmación */}
      <Modal
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setItemToDelete(null);
        }}
        title="Confirmar eliminación"
        footer={
          <div className="flex justify-end space-x-3">
            <Button 
              onClick={() => {
                setShowConfirmDialog(false);
                setItemToDelete(null);
              }} 
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button onClick={confirmDelete} variant="danger">
              Eliminar
            </Button>
          </div>
        }
      >
        <div className="text-center">
          <Icon name="FiAlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            ¿Estás seguro de que quieres eliminar este elemento?
          </p>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Esta acción no se puede deshacer.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AdminManager;
