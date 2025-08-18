import React, { useState, useEffect } from "react";
import { productApplicationEndpoints } from "../../api/endpoints/productApplications";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Modal from "../ui/Modal";
import Icon from "../ui/Icon";
import Toast from "../ui/Toast";

const ProductApplicationsManager = ({
  productId,
  productName,
  isInsideForm = false,
}) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [formData, setFormData] = useState({
    application_text: "",
    sort_order: 0,
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (productId) {
      loadApplications();
    }
  }, [productId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await productApplicationEndpoints.getApplications({
        product_id: productId,
      });
      if (response.success) {
        setApplications(response.data);
      }
    } catch (error) {
      showToast("Error al cargar aplicaciones", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = {
        product_id: productId,
        ...formData,
      };

      if (editingApplication) {
        await productApplicationEndpoints.updateApplication(
          editingApplication.id,
          data
        );
        showToast("Aplicación actualizada correctamente");
      } else {
        await productApplicationEndpoints.createApplication(data);
        showToast("Aplicación creada correctamente");
      }

      setShowModal(false);
      resetForm();
      loadApplications();
    } catch (error) {
      showToast("Error al guardar aplicación", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (application) => {
    setEditingApplication(application);
    setFormData({
      application_text: application.application_text,
      sort_order: application.sort_order,
    });
    setShowModal(true);
  };

  const handleDelete = async (applicationId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta aplicación?")
    ) {
      try {
        setLoading(true);
        await productApplicationEndpoints.deleteApplication(applicationId);
        showToast("Aplicación eliminada correctamente");
        loadApplications();
      } catch (error) {
        showToast("Error al eliminar aplicación", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setEditingApplication(null);
    setFormData({
      application_text: "",
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
          Aplicaciones del Producto
        </h3>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openCreateModal();
          }}
          className="bg-green-600 hover:bg-green-700"
          icon={<Icon name="FiPlus" />}
        >
          Agregar Aplicación
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      ) : applications.length === 0 ? (
        <Card className="p-8 text-center">
          <Icon
            name="FiTarget"
            className="text-4xl text-gray-400 mx-auto mb-4"
          />
          <p className="text-gray-500 dark:text-gray-400">
            No hay aplicaciones definidas para este producto
          </p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openCreateModal();
            }}
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            Agregar Primera Aplicación
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <Card key={application.id} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="text-gray-900 dark:text-white">
                    {application.sort_order}. {application.application_text}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEdit(application);
                    }}
                    icon={<Icon name="FiEdit" />}
                    iconOnly
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  />
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(application.id);
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

      {/* Modal para crear/editar aplicaciones */}
      <Modal
        isOpen={showModal}
        onClose={(e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          setShowModal(false);
        }}
        title={editingApplication ? "Editar Aplicación" : "Nueva Aplicación"}
      >
        <div className="space-y-4">
          <div>
            <TextArea
              label="Aplicación"
              value={formData.application_text}
              onChange={(value) =>
                setFormData({ ...formData, application_text: value })
              }
              placeholder="Describe la aplicación del producto..."
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
              disabled={loading || !formData.application_text.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading
                ? "Guardando..."
                : editingApplication
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

export default ProductApplicationsManager;
