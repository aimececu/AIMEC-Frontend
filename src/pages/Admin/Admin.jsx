import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import Loader from "../../components/ui/Loader";
import Toast from "../../components/ui/Toast";
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "../../components/Admin/AdminDashboard";
import ProductsList from "../../components/Admin/ProductsList";
import ProductForm from "../../components/Admin/ProductForm";
import AdminManager from "../../components/Admin/AdminManager";
import ImportData from "../../components/Admin/ImportData";
import { useAdminData } from "../../hooks/useAdminData";
import { useProducts } from "../../hooks/useProducts";
import clsx from "clsx";

const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Estados principales
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    inStock: "",
  });

  // Hooks personalizados
  const {
    products,
    categories,
    brands,
    subcategories,
    loading,
    stats,
    loadInitialData,
    refreshData,
  } = useAdminData();
  const {
    editingProduct,
    showProductForm,
    productForm,
    setProductForm,
    handleProductFormSubmit,
    handleEditProduct,
    handleDeleteProduct,
    handleAddProduct,
    handleCancelForm,
    toast,
    hideToast,
  } = useProducts(refreshData);

  // Función para cambiar a la pestaña de importación
  const handleImportClick = () => {
    setActiveTab("import");
  };

  // Función para navegar entre pestañas
  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  // Manejar logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
        <Container>
          <div className="py-16 text-center">
            <Loader
              size="xl"
              variant="spinner"
              text="Cargando panel de administración..."
              className="mb-4"
            />
            <p className="text-secondary-600 dark:text-secondary-300">
              Obteniendo datos del sistema...
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Container>
        <div className="py-4 lg:py-8 px-4 lg:px-0">
          {/* Header con información del usuario */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col gap-4">
              <div>
                <Heading level={1} className="mb-2 text-xl lg:text-3xl">
                  Panel de Administración
                </Heading>
                <p className="text-secondary-600 dark:text-secondary-300 text-sm lg:text-base">
                  Gestiona los productos del catálogo
                </p>
              </div>

              {/* User info and logout */}
              <div className="flex items-center justify-between bg-white dark:bg-secondary-800 p-3 rounded-lg border border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <Icon name="FiUser" size="sm" className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Icon name="FiLogOut" size="sm" className="mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                  <span className="sm:hidden">Salir</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs de navegación */}
          <div className="mb-6">
            <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto pb-2">
              {[
                { id: "dashboard", label: "Dashboard", icon: "FiHome", shortLabel: "Dash" },
                {
                  id: "administration",
                  label: "Administración",
                  icon: "FiSettings",
                  shortLabel: "Admin"
                },
                { id: "products", label: "Productos", icon: "FiPackage", shortLabel: "Prod" },
                { id: "import", label: "Importar", icon: "FiUpload", shortLabel: "Imp" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-1 sm:gap-2 py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap",
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300"
                  )}
                >
                  <Icon name={tab.icon} size="sm" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido de tabs */}
          <div className="space-y-6">
            {activeTab === "dashboard" && (
              <AdminDashboard
                stats={stats}
                onImportClick={handleImportClick}
                onNavigate={handleNavigate}
                loading={loading}
              />
            )}

            {activeTab === "administration" && (
              <AdminManager
                categories={categories}
                subcategories={subcategories}
                brands={brands}
                onRefresh={refreshData}
              />
            )}

            {activeTab === "products" && (
              <ProductsList
                products={products}
                categories={categories}
                brands={brands}
                filters={filters}
                setFilters={setFilters}
                onEditProduct={(product) =>
                  handleEditProduct(product)
                }
                onDeleteProduct={handleDeleteProduct}
                onAddProduct={handleAddProduct}
              />
            )}

            {activeTab === "import" && (
              <ImportData onRefresh={refreshData} />
            )}
          </div>

          {/* Formulario de producto (modal) */}
          {showProductForm && (
            <ProductForm
              productForm={productForm}
              setProductForm={setProductForm}
              categories={categories}
              brands={brands}
              subcategories={subcategories}
              onSubmit={handleProductFormSubmit}
              onCancel={handleCancelForm}
              editingProduct={editingProduct}
            />
          )}

          {/* Toast de notificaciones */}
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={hideToast}
          />
        </div>
      </Container>
    </div>
  );
};

export default Admin;
