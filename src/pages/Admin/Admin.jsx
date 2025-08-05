import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Icon,
  Container,
  Heading,
  Card,
  Button,
  Input,
  Select,
  TextArea,
  ImageWithFallback
} from "../../components/ui/components";
import { useAuth } from "../../context/AuthContext";
import { productEndpoints } from "../../api/endpoints/products.js";
import { categoryEndpoints } from "../../api/endpoints/categories.js";
import { brandEndpoints } from "../../api/endpoints/brands.js";
import { transformProductsList, transformCategoriesList, transformBrandsList } from "../../services/dataTransform.js";
import { productImportService, defaultTemplates } from "../../services/importService";
import clsx from "clsx";

const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Estados principales
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  // Estados para formularios
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('basic');

  // Estados para formulario de producto
  const [productForm, setProductForm] = useState({
    sku: '',
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    brand: '',
    category: '',
    subcategory: '',
    series: '',
    main_image: '',
    images: [],
    is_active: true,
    specifications: {},
    accessories: [],
    related_products: [],
    features: [],
    applications: [],
    certifications: [],
    warranty: '',
    lead_time: '',
    weight: '',
    dimensions: '',
    voltage: '',
    power: '',
    temperature_range: '',
    ip_rating: '',
    material: '',
    color: '',
    country_of_origin: '',
    compliance: '',
    manual_url: '',
    datasheet_url: ''
  });

  // Estados para importación
  const [selectedFile, setSelectedFile] = useState(null);
  const [importTemplate, setImportTemplate] = useState(null);
  const [importProgress, setImportProgress] = useState(null);
  const [importResults, setImportResults] = useState(null);

  // Estados para filtros
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    inStock: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse, brandsResponse, statsResponse] = await Promise.all([
        productEndpoints.getProducts(),
        categoryEndpoints.getCategories(),
        brandEndpoints.getBrands(),
        productEndpoints.getProductStats()
      ]);

      // Transformar productos
      const transformedProducts = transformProductsList(productsResponse);
      setProducts(transformedProducts.products);

      // Transformar categorías
      const transformedCategories = transformCategoriesList(categoriesResponse);
      setCategories(transformedCategories);

      // Transformar marcas
      const transformedBrands = transformBrandsList(brandsResponse);
      setBrands(transformedBrands);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = !filters.search || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesStock = filters.inStock === '' || 
      (filters.inStock === 'true' && product.stock > 0) ||
      (filters.inStock === 'false' && product.stock === 0);

    return matchesSearch && matchesCategory && matchesBrand && matchesStock;
  });

  // Manejar logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Manejar formulario de producto
  const handleProductFormChange = (field, value) => {
    setProductForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price) || 0,
        stock_quantity: parseInt(productForm.stock_quantity) || 0,
        weight: parseFloat(productForm.weight) || 0,
        voltage: parseFloat(productForm.voltage) || 0,
        power: parseFloat(productForm.power) || 0
      };

      if (editingProduct) {
        const response = await productEndpoints.updateProduct(editingProduct.id, productData);
        if (!response.success) {
          throw new Error(response.error || 'Error al actualizar el producto');
        }
      } else {
        const response = await productEndpoints.createProduct(productData);
        if (!response.success) {
          throw new Error(response.error || 'Error al crear el producto');
        }
      }

      // Recargar productos
      await loadInitialData();
      
      // Limpiar formulario
      setProductForm({
        sku: '',
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        brand: '',
        category: '',
        subcategory: '',
        series: '',
        main_image: '',
        images: [],
        is_active: true,
        specifications: {},
        accessories: [],
        related_products: [],
        features: [],
        applications: [],
        certifications: [],
        warranty: '',
        lead_time: '',
        weight: '',
        dimensions: '',
        voltage: '',
        power: '',
        temperature_range: '',
        ip_rating: '',
        material: '',
        color: '',
        country_of_origin: '',
        compliance: '',
        manual_url: '',
        datasheet_url: ''
      });
      setEditingProduct(null);
      setShowProductForm(false);
      
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      sku: product.sku || '',
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      stock_quantity: product.stock?.toString() || '',
      brand: product.brand || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      series: product.series || '',
      main_image: product.image || product.main_image || '',
      images: product.images || [],
      is_active: product.is_active !== false,
      specifications: product.specifications || {},
      accessories: product.accessories || [],
      related_products: product.related_products || [],
      features: product.features || [],
      applications: product.applications || [],
      certifications: product.certifications || [],
      warranty: product.warranty || '',
      lead_time: product.lead_time || '',
      weight: product.weight?.toString() || '',
      dimensions: product.dimensions || '',
      voltage: product.voltage?.toString() || '',
      power: product.power?.toString() || '',
      temperature_range: product.temperature_range || '',
      ip_rating: product.ip_rating || '',
      material: product.material || '',
      color: product.color || '',
      country_of_origin: product.country_of_origin || '',
      compliance: product.compliance || '',
      manual_url: product.manual_url || '',
      datasheet_url: product.datasheet_url || ''
    });
    setShowProductForm(true);
  };

  // Manejar eliminación de producto
  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const response = await productEndpoints.deleteProduct(id);
        if (response.success) {
          setProducts(products.filter(p => p.id !== id));
        } else {
          throw new Error(response.error || 'Error al eliminar el producto');
        }
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  // Manejar importación de archivo
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validation = productImportService.validateFile(file);
      if (validation.isValid) {
        setSelectedFile(file);
      } else {
        alert(`Error en archivo: ${validation.errors.join(', ')}`);
      }
    }
  };

  // Procesar importación
  const handleImport = async () => {
    if (!selectedFile || !importTemplate) {
      alert('Por favor selecciona un archivo y una plantilla');
      return;
    }

    try {
      setImportProgress({ status: 'processing', message: 'Procesando archivo...' });
      
      const result = await productImportService.processImport(
        selectedFile, 
        importTemplate.id, 
        user.id
      );

      setImportResults(result);
      setImportProgress({ status: 'completed', message: 'Importación completada' });
      
      // Recargar productos
      await loadInitialData();
      
    } catch (error) {
      setImportProgress({ status: 'error', message: error.message });
      console.error('Error en importación:', error);
    }
  };

  // Descargar plantilla
  const handleDownloadTemplate = (templateType) => {
    const template = defaultTemplates[templateType];
    if (!template) return;

    const csvContent = productImportService.exportTemplateAsCSV(template);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantilla-${templateType}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Renderizar dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Productos</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.total_products || 0}
              </p>
            </div>
            <Icon name="FiPackage" className="text-3xl text-primary-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">En Stock</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.in_stock || 0}
              </p>
            </div>
            <Icon name="FiCheckCircle" className="text-3xl text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Sin Stock</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.out_of_stock || 0}
              </p>
            </div>
            <Icon name="FiAlertCircle" className="text-3xl text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Stock Bajo</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.low_stock || 0}
              </p>
            </div>
            <Icon name="FiAlertTriangle" className="text-3xl text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Card className="p-6">
        <Heading level={3} className="mb-4">Acciones Rápidas</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => setShowProductForm(true)}
            className="flex items-center gap-2"
          >
            <Icon name="FiPlus" />
            Agregar Producto
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setShowImportForm(true)}
            className="flex items-center gap-2"
          >
            <Icon name="FiUpload" />
            Importar Productos
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setActiveTab('specifications')}
            className="flex items-center gap-2"
          >
            <Icon name="FiSettings" />
            Gestionar Especificaciones
          </Button>
        </div>
      </Card>
    </div>
  );

  // Renderizar lista de productos
  const renderProductsList = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
          
          <Select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </Select>
          
          <Select
            value={filters.brand}
            onChange={(e) => setFilters({...filters, brand: e.target.value})}
          >
            <option value="">Todas las marcas</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.name}>{brand.name}</option>
            ))}
          </Select>
          
          <Select
            value={filters.inStock}
            onChange={(e) => setFilters({...filters, inStock: e.target.value})}
          >
            <option value="">Todo el stock</option>
            <option value="true">En stock</option>
            <option value="false">Sin stock</option>
          </Select>
        </div>
      </Card>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square bg-secondary-100 dark:bg-secondary-700">
              <ImageWithFallback
                src={product.image || product.main_image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs text-secondary-500 dark:text-secondary-400">
                  {product.brand}
                </span>
              </div>
              
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-sm text-secondary-600 dark:text-secondary-300 mb-3 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  ${product.price.toFixed(2)}
                </span>
                <span className={clsx(
                  "text-xs px-2 py-1 rounded-full",
                  product.stock > 10 
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : product.stock > 0
                    ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                )}>
                  {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditProduct(product)}
                  className="flex-1"
                >
                  <Icon name="FiEdit" size="sm" className="mr-1" />
                  Editar
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Icon name="FiTrash2" size="sm" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Renderizar formulario de importación
  const renderImportForm = () => (
    <Card className="p-6">
      <Heading level={3} className="mb-4">Importar Productos</Heading>
      
      <div className="space-y-6">
        {/* Selección de archivo */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Seleccionar Archivo
          </label>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="block w-full text-sm text-secondary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          {selectedFile && (
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-2">
              Archivo seleccionado: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Selección de plantilla */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Plantilla de Importación
          </label>
          <Select
            value={importTemplate?.id || ''}
            onChange={(e) => {
              const template = Object.values(defaultTemplates).find(t => t.name === e.target.value);
              setImportTemplate(template);
            }}
          >
            <option value="">Seleccionar plantilla...</option>
            {Object.entries(defaultTemplates).map(([key, template]) => (
              <option key={key} value={template.name}>{template.name}</option>
            ))}
          </Select>
        </div>

        {/* Descargar plantillas */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Descargar Plantillas
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownloadTemplate('basic')}
            >
              Plantilla Básica
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownloadTemplate('industrial')}
            >
              Plantilla Industrial
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownloadTemplate('sensors')}
            >
              Plantilla Sensores
            </Button>
          </div>
        </div>

        {/* Progreso de importación */}
        {importProgress && (
          <div className={clsx(
            "p-4 rounded-lg",
            importProgress.status === 'processing' && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800",
            importProgress.status === 'completed' && "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800",
            importProgress.status === 'error' && "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          )}>
            <p className="text-sm font-medium">
              {importProgress.message}
            </p>
          </div>
        )}

        {/* Resultados de importación */}
        {importResults && (
          <div className="bg-secondary-50 dark:bg-secondary-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Resultados de Importación</h4>
            <div className="text-sm space-y-1">
              <p>Total procesados: {importResults.results.total}</p>
              <p className="text-green-600">Exitosos: {importResults.results.successful.length}</p>
              <p className="text-red-600">Fallidos: {importResults.results.failed.length}</p>
            </div>
            
            {importResults.results.failed.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium">Ver errores</summary>
                <div className="mt-2 text-xs space-y-1">
                  {importResults.results.failed.slice(0, 5).map((error, index) => (
                    <div key={index} className="text-red-600">
                      Fila {error.row}: {error.errors.join(', ')}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-4">
          <Button
            onClick={handleImport}
            disabled={!selectedFile || !importTemplate || importProgress?.status === 'processing'}
            loading={importProgress?.status === 'processing'}
            className="flex-1"
          >
            {importProgress?.status === 'processing' ? 'Importando...' : 'Iniciar Importación'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              setShowImportForm(false);
              setSelectedFile(null);
              setImportTemplate(null);
              setImportProgress(null);
              setImportResults(null);
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
        <Container>
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600 dark:text-secondary-300">
              Cargando panel de administración...
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Container>
        <div className="py-8">
          {/* Header con información del usuario */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <Heading level={1} className="mb-2">
                  Panel de Administración
                </Heading>
                <p className="text-secondary-600 dark:text-secondary-300">
                  Gestiona los productos del catálogo
                </p>
              </div>
              
              {/* User info and logout */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    {user?.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  <Icon name="FiLogOut" size="sm" className="mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs de navegación */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'FiHome' },
                { id: 'products', label: 'Productos', icon: 'FiPackage' },
                { id: 'import', label: 'Importar', icon: 'FiUpload' },
                { id: 'specifications', label: 'Especificaciones', icon: 'FiSettings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300"
                  )}
                >
                  <Icon name={tab.icon} size="sm" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido de tabs */}
          <div className="space-y-6">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'products' && renderProductsList()}
            {activeTab === 'import' && renderImportForm()}
            {activeTab === 'specifications' && (
              <Card className="p-6">
                <Heading level={3} className="mb-4">Gestión de Especificaciones</Heading>
                <p className="text-secondary-600 dark:text-secondary-300">
                  Aquí podrás gestionar los tipos de especificaciones dinámicas para los productos.
                </p>
                {/* Implementar gestión de especificaciones */}
              </Card>
            )}
          </div>

          {/* Formulario de producto (modal) */}
          {showProductForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-secondary-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Heading level={3}>
                      {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                    </Heading>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        setProductForm({
                          sku: '',
                          name: '',
                          description: '',
                          price: '',
                          stock_quantity: '',
                          brand: '',
                          category: '',
                          main_image: '',
                          is_active: true
                        });
                      }}
                    >
                      <Icon name="FiX" size="sm" />
                    </Button>
                  </div>

                                     <form onSubmit={handleProductFormSubmit} className="space-y-6">
                     {/* Pestañas del formulario */}
                     <div className="border-b border-secondary-200 dark:border-secondary-700">
                       <nav className="-mb-px flex space-x-8">
                         {[
                           { id: 'basic', label: 'Información Básica', icon: 'FiInfo' },
                           { id: 'technical', label: 'Especificaciones Técnicas', icon: 'FiSettings' },
                           { id: 'details', label: 'Detalles Adicionales', icon: 'FiFileText' },
                           { id: 'media', label: 'Medios y Documentos', icon: 'FiImage' }
                         ].map((tab) => (
                           <button
                             key={tab.id}
                             type="button"
                             onClick={() => setActiveFormTab(tab.id)}
                             className={clsx(
                               "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                               activeFormTab === tab.id
                                 ? "border-primary-500 text-primary-600 dark:text-primary-400"
                                 : "border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300"
                             )}
                           >
                             <Icon name={tab.icon} size="sm" />
                             {tab.label}
                           </button>
                         ))}
                       </nav>
                     </div>

                     {/* Contenido de las pestañas */}
                     {activeFormTab === 'basic' && (
                       <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {/* SKU */}
                           <Input
                             label="SKU"
                             value={productForm.sku}
                             onChange={(e) => handleProductFormChange('sku', e.target.value)}
                             placeholder="PROD-001"
                             required
                           />

                           {/* Nombre */}
                           <Input
                             label="Nombre del Producto"
                             value={productForm.name}
                             onChange={(e) => handleProductFormChange('name', e.target.value)}
                             placeholder="Nombre del producto"
                             required
                           />

                           {/* Precio */}
                           <Input
                             label="Precio"
                             type="number"
                             step="0.01"
                             value={productForm.price}
                             onChange={(e) => handleProductFormChange('price', e.target.value)}
                             placeholder="0.00"
                             required
                           />

                           {/* Stock */}
                           <Input
                             label="Stock"
                             type="number"
                             value={productForm.stock_quantity}
                             onChange={(e) => handleProductFormChange('stock_quantity', e.target.value)}
                             placeholder="0"
                             required
                           />

                           {/* Marca */}
                           <Select
                             label="Marca"
                             value={productForm.brand}
                             onChange={(e) => handleProductFormChange('brand', e.target.value)}
                             required
                           >
                             <option value="">Seleccionar marca</option>
                             {brands.map(brand => (
                               <option key={brand.id} value={brand.name}>{brand.name}</option>
                             ))}
                           </Select>

                           {/* Categoría */}
                           <Select
                             label="Categoría"
                             value={productForm.category}
                             onChange={(e) => handleProductFormChange('category', e.target.value)}
                             required
                           >
                             <option value="">Seleccionar categoría</option>
                             {categories.map(cat => (
                               <option key={cat.id} value={cat.name}>{cat.name}</option>
                             ))}
                           </Select>

                           {/* Subcategoría */}
                           <Input
                             label="Subcategoría"
                             value={productForm.subcategory}
                             onChange={(e) => handleProductFormChange('subcategory', e.target.value)}
                             placeholder="Subcategoría"
                           />

                           {/* Serie */}
                           <Input
                             label="Serie"
                             value={productForm.series}
                             onChange={(e) => handleProductFormChange('series', e.target.value)}
                             placeholder="Serie del producto"
                           />

                           {/* Estado */}
                           <div>
                             <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                               Estado
                             </label>
                             <Select
                               value={productForm.is_active ? 'true' : 'false'}
                               onChange={(e) => handleProductFormChange('is_active', e.target.value === 'true')}
                             >
                               <option value="true">Activo</option>
                               <option value="false">Inactivo</option>
                             </Select>
                           </div>
                         </div>

                         {/* Descripción */}
                         <TextArea
                           label="Descripción"
                           value={productForm.description}
                           onChange={(e) => handleProductFormChange('description', e.target.value)}
                           placeholder="Descripción detallada del producto..."
                           rows={4}
                         />
                       </div>
                     )}

                     {activeFormTab === 'technical' && (
                       <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {/* Peso */}
                           <Input
                             label="Peso (kg)"
                             type="number"
                             step="0.01"
                             value={productForm.weight}
                             onChange={(e) => handleProductFormChange('weight', e.target.value)}
                             placeholder="0.00"
                           />

                           {/* Dimensiones */}
                           <Input
                             label="Dimensiones"
                             value={productForm.dimensions}
                             onChange={(e) => handleProductFormChange('dimensions', e.target.value)}
                             placeholder="Largo x Ancho x Alto"
                           />

                           {/* Voltaje */}
                           <Input
                             label="Voltaje (V)"
                             type="number"
                             step="0.1"
                             value={productForm.voltage}
                             onChange={(e) => handleProductFormChange('voltage', e.target.value)}
                             placeholder="220"
                           />

                           {/* Potencia */}
                           <Input
                             label="Potencia (W)"
                             type="number"
                             step="0.1"
                             value={productForm.power}
                             onChange={(e) => handleProductFormChange('power', e.target.value)}
                             placeholder="1000"
                           />

                           {/* Rango de temperatura */}
                           <Input
                             label="Rango de Temperatura"
                             value={productForm.temperature_range}
                             onChange={(e) => handleProductFormChange('temperature_range', e.target.value)}
                             placeholder="-40°C a +85°C"
                           />

                           {/* IP Rating */}
                           <Input
                             label="IP Rating"
                             value={productForm.ip_rating}
                             onChange={(e) => handleProductFormChange('ip_rating', e.target.value)}
                             placeholder="IP65"
                           />

                           {/* Material */}
                           <Input
                             label="Material"
                             value={productForm.material}
                             onChange={(e) => handleProductFormChange('material', e.target.value)}
                             placeholder="Acero inoxidable"
                           />

                           {/* Color */}
                           <Input
                             label="Color"
                             value={productForm.color}
                             onChange={(e) => handleProductFormChange('color', e.target.value)}
                             placeholder="Negro"
                           />
                         </div>

                         {/* Garantía */}
                         <Input
                           label="Garantía"
                           value={productForm.warranty}
                           onChange={(e) => handleProductFormChange('warranty', e.target.value)}
                           placeholder="2 años"
                         />

                         {/* Tiempo de entrega */}
                         <Input
                           label="Tiempo de Entrega"
                           value={productForm.lead_time}
                           onChange={(e) => handleProductFormChange('lead_time', e.target.value)}
                           placeholder="5-7 días hábiles"
                         />
                       </div>
                     )}

                     {activeFormTab === 'details' && (
                       <div className="space-y-6">
                         {/* País de origen */}
                         <Input
                           label="País de Origen"
                           value={productForm.country_of_origin}
                           onChange={(e) => handleProductFormChange('country_of_origin', e.target.value)}
                           placeholder="Alemania"
                         />

                         {/* Cumplimiento */}
                         <Input
                           label="Cumplimiento"
                           value={productForm.compliance}
                           onChange={(e) => handleProductFormChange('compliance', e.target.value)}
                           placeholder="CE, UL, RoHS"
                         />

                         {/* Características */}
                         <div>
                           <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                             Características (una por línea)
                           </label>
                           <TextArea
                             value={productForm.features.join('\n')}
                             onChange={(e) => handleProductFormChange('features', e.target.value.split('\n').filter(f => f.trim()))}
                             placeholder="Característica 1&#10;Característica 2&#10;Característica 3"
                             rows={4}
                           />
                         </div>

                         {/* Aplicaciones */}
                         <div>
                           <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                             Aplicaciones (una por línea)
                           </label>
                           <TextArea
                             value={productForm.applications.join('\n')}
                             onChange={(e) => handleProductFormChange('applications', e.target.value.split('\n').filter(a => a.trim()))}
                             placeholder="Aplicación 1&#10;Aplicación 2&#10;Aplicación 3"
                             rows={4}
                           />
                         </div>

                         {/* Certificaciones */}
                         <div>
                           <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                             Certificaciones (una por línea)
                           </label>
                           <TextArea
                             value={productForm.certifications.join('\n')}
                             onChange={(e) => handleProductFormChange('certifications', e.target.value.split('\n').filter(c => c.trim()))}
                             placeholder="ISO 9001&#10;CE&#10;UL"
                             rows={4}
                           />
                         </div>
                       </div>
                     )}

                     {activeFormTab === 'media' && (
                       <div className="space-y-6">
                         {/* Imagen principal */}
                         <Input
                           label="URL de Imagen Principal"
                           value={productForm.main_image}
                           onChange={(e) => handleProductFormChange('main_image', e.target.value)}
                           placeholder="https://ejemplo.com/imagen.jpg"
                         />

                         {/* Imágenes adicionales */}
                         <div>
                           <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                             URLs de Imágenes Adicionales (una por línea)
                           </label>
                           <TextArea
                             value={productForm.images.join('\n')}
                             onChange={(e) => handleProductFormChange('images', e.target.value.split('\n').filter(img => img.trim()))}
                             placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg"
                             rows={4}
                           />
                         </div>

                         {/* Manual */}
                         <Input
                           label="URL del Manual"
                           value={productForm.manual_url}
                           onChange={(e) => handleProductFormChange('manual_url', e.target.value)}
                           placeholder="https://ejemplo.com/manual.pdf"
                         />

                         {/* Hoja de datos */}
                         <Input
                           label="URL de la Hoja de Datos"
                           value={productForm.datasheet_url}
                           onChange={(e) => handleProductFormChange('datasheet_url', e.target.value)}
                           placeholder="https://ejemplo.com/datasheet.pdf"
                         />
                       </div>
                     )}

                     {/* Botones */}
                     <div className="flex gap-4 pt-6 border-t border-secondary-200 dark:border-secondary-700">
                       <Button
                         type="submit"
                         className="flex-1"
                       >
                         {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                       </Button>
                       
                       <Button
                         type="button"
                         variant="outline"
                         onClick={() => {
                           setShowProductForm(false);
                           setEditingProduct(null);
                           setProductForm({
                             sku: '',
                             name: '',
                             description: '',
                             price: '',
                             stock_quantity: '',
                             brand: '',
                             category: '',
                             subcategory: '',
                             series: '',
                             main_image: '',
                             images: [],
                             is_active: true,
                             specifications: {},
                             accessories: [],
                             related_products: [],
                             features: [],
                             applications: [],
                             certifications: [],
                             warranty: '',
                             lead_time: '',
                             weight: '',
                             dimensions: '',
                             voltage: '',
                             power: '',
                             temperature_range: '',
                             ip_rating: '',
                             material: '',
                             color: '',
                             country_of_origin: '',
                             compliance: '',
                             manual_url: '',
                             datasheet_url: ''
                           });
                         }}
                       >
                         Cancelar
                       </Button>
                     </div>
                   </form>
                </Card>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Admin;
