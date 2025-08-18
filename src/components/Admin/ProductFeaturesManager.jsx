import React, { useState, useEffect } from "react";
import { productFeatureEndpoints } from "../../api/endpoints/productFeatures";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Modal from "../ui/Modal";
import Icon from "../ui/Icon";
import Toast from "../ui/Toast";

const ProductFeaturesManager = ({
  productId,
  productName,
  isInsideForm = false,
}) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [formData, setFormData] = useState({
    feature_text: "",
    sort_order: 0,
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (productId) {
      loadFeatures();
    }
  }, [productId]);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const response = await productFeatureEndpoints.getFeatures({
        product_id: productId,
      });
      if (response.success) {
        setFeatures(response.data);
      }
    } catch (error) {
      showToast("Error al cargar características", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit", formData);
    try {
      setLoading(true);
      const data = {
        product_id: productId,
        ...formData,
      };

      if (editingFeature) {
        await productFeatureEndpoints.updateFeature(editingFeature.id, data);
        showToast("Característica actualizada correctamente");
      } else {
        await productFeatureEndpoints.createFeature(data);
        showToast("Característica creada correctamente");
      }

      setShowModal(false);
      resetForm();
      loadFeatures();
    } catch (error) {
      showToast("Error al guardar característica", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setFormData({
      feature_text: feature.feature_text,
      sort_order: feature.sort_order,
    });
    setShowModal(true);
  };

  const handleDelete = async (featureId) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar esta característica?"
      )
    ) {
      try {
        setLoading(true);
        await productFeatureEndpoints.deleteFeature(featureId);
        showToast("Característica eliminada correctamente");
        loadFeatures();
      } catch (error) {
        showToast("Error al eliminar característica", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setEditingFeature(null);
    setFormData({
      feature_text: "",
      sort_order: 0,
    });
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Características del Producto
        </h3>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openCreateModal();
          }}
          className="bg-primary-600 hover:bg-primary-700"
          icon={<Icon name="FiPlus" />}
        >
          Agregar Característica
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      ) : features.length === 0 ? (
        <Card className="p-8 text-center">
          <Icon name="FiList" className="text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No hay características definidas para este producto
          </p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openCreateModal();
            }}
            className="mt-4 bg-primary-600 hover:bg-primary-700"
          >
            Agregar Primera Característica
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {features.map((feature) => (
            <Card key={feature.id} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="text-gray-900 dark:text-white">
                    {feature.sort_order}. {feature.feature_text}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEdit(feature);
                    }}
                    size="sm"
                    icon={<Icon name="FiEdit" />}
                    iconOnly
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  />
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(feature.id);
                    }}
                    icon={<Icon name="FiTrash2" />}
                    iconOnly
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para crear/editar características */}
      <Modal
        isOpen={showModal}
        onClose={(e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          setShowModal(false);
        }}
        title={
          editingFeature ? "Editar Característica" : "Nueva Característica"
        }
      >
        <div className="space-y-4">
          <div>
            <TextArea
              label="Característica"
              value={formData.feature_text}
              onChange={(value) =>
                setFormData({ ...formData, feature_text: value })
              }
              placeholder="Describe la característica del producto..."
              required
              rows={3}
            />
          </div>

          <div>
            <Input
              label="Orden de Visualización"
              type="number"
              value={formData.sort_order}
              onChange={(value) =>
                setFormData({ ...formData, sort_order: parseInt(value) || 0 })
              }
              placeholder="0"
              min="0"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowModal(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }}
              disabled={loading || !formData.feature_text.trim()}
              className="bg-primary-600 hover:bg-primary-700"
            >
              {loading
                ? "Guardando..."
                : editingFeature
                ? "Actualizar"
                : "Crear"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast de notificaciones */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: "", type: "success" })}
      />
    </div>
  );
};

export default ProductFeaturesManager;
