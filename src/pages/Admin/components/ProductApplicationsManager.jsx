import React, { useState, useEffect } from "react";
import { productApplicationEndpoints } from "../../../api/endpoints/productApplications";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import TextArea from "../../../components/ui/TextArea";
import Modal from "../../../components/ui/Modal";
import Icon from "../../../components/ui/Icon";
import Toast from "../../../components/ui/Toast";

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
      const response =
        await productApplicationEndpoints.getApplicationsByProduct(productId);
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
          onClick={openCreateModal}
          className="bg-green-600 hover:bg-green-700"
        >
          <Icon name="FiPlus" className="mr-2" />
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
            onClick={openCreateModal}
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            Agregar Primera Aplicación
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <Card key={application.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Orden: {application.sort_order}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {application.application_text}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(application)}
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Icon name="FiEdit" className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(application.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Icon name="FiTrash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para crear/editar aplicaciones */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
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
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
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
