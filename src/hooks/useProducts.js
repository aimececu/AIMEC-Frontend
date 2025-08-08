import { useState } from 'react';
import { productEndpoints } from '../api/endpoints/products.js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useProducts = (loadInitialData) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [productForm, setProductForm] = useState({
    sku: '',
    name: '',
    description: '',
    short_description: '',
    price: '',
    original_price: '',
    cost_price: '',
    stock_quantity: '',
    min_stock_level: '',
    brand: '',
    category: '',
    subcategory: '',
    series: '',
    main_image: '',
    additional_images: [],
    specifications: [],
    is_active: true,
    is_featured: false,
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
    warranty_months: '',
    lead_time_days: '',
    manual_url: '',
    datasheet_url: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ isVisible: false, message: '', type: 'success' });
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar autenticación
    if (!isAuthenticated) {
      showToast('Sesión expirada. Por favor, inicia sesión nuevamente.', 'error');
      logout();
      navigate('/login');
      return;
    }
    
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price) || 0,
        stock_quantity: parseInt(productForm.stock_quantity) || 0,
        weight: parseFloat(productForm.weight) || 0,
        voltage: parseFloat(productForm.voltage) || 0,
        power: parseFloat(productForm.power) || 0,
        original_price: parseFloat(productForm.original_price) || null,
        warranty_months: parseInt(productForm.warranty_months) || null,
        lead_time_days: parseInt(productForm.lead_time_days) || null,
        specifications: productForm.specifications || []
      };

      if (editingProduct) {
        const response = await productEndpoints.updateProduct(editingProduct.id, productData);
        if (!response.success) {
          throw new Error(response.error || 'Error al actualizar el producto');
        }
        // Mostrar mensaje de éxito sin cerrar el formulario
        showToast('Producto actualizado exitosamente', 'success');
      } else {
        const response = await productEndpoints.createProduct(productData);
        if (!response.success) {
          throw new Error(response.error || 'Error al crear el producto');
        }
        // Para productos nuevos, sí cerrar el formulario y recargar
        await loadInitialData();
        resetProductForm();
        setShowProductForm(false);
        setEditingProduct(null);
        showToast('Producto creado exitosamente', 'success');
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
      
      // Manejar error de autenticación
      if (error.status === 401) {
        showToast('Sesión expirada. Por favor, inicia sesión nuevamente.', 'error');
        logout();
        navigate('/login');
        return;
      }
      
      showToast(error.message, 'error');
    }
  };

  const handleEditProduct = (product, categories = [], brands = []) => {
    setEditingProduct(product);
    
    // Función para mapear nombre a ID
    const getCategoryId = (categoryName) => {
      const category = categories.find(cat => cat.name === categoryName);
      return category ? category.id : '';
    };

    const getBrandId = (brandName) => {
      const brand = brands.find(b => b.name === brandName);
      return brand ? brand.id : '';
    };

    setProductForm({
      sku: product.sku || '',
      name: product.name || '',
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price?.toString() || '',
      original_price: product.original_price?.toString() || '',
      cost_price: product.cost_price?.toString() || '',
      stock_quantity: product.stock_quantity?.toString() || product.stock?.toString() || '',
      min_stock_level: product.min_stock_level?.toString() || '',
      brand: getBrandId(product.brand),
      category: getCategoryId(product.category),
      subcategory: product.subcategory || '',
      series: product.series || '',
      main_image: product.main_image || '',
      additional_images: product.additional_images || [],
      specifications: Array.isArray(product.productSpecifications) 
        ? product.productSpecifications.map(spec => ({
            name: spec.specificationType?.name || spec.name,
            value: spec.value_text || spec.value_number || spec.value_boolean || spec.value_json || spec.value,
            unit: spec.specificationType?.unit || spec.unit
          }))
        : [],
      is_active: product.is_active !== false,
      is_featured: product.is_featured || false,
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
      warranty_months: product.warranty_months?.toString() || '',
      lead_time_days: product.lead_time_days?.toString() || '',
      manual_url: product.manual_url || '',
      datasheet_url: product.datasheet_url || '',
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
      meta_keywords: product.meta_keywords || ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const response = await productEndpoints.deleteProduct(id);
        if (response.success) {
          await loadInitialData();
        } else {
          throw new Error(response.error || 'Error al eliminar el producto');
        }
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert(error.message);
      }
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    resetProductForm();
    setShowProductForm(true);
  };

  const handleCancelForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const resetProductForm = () => {
    setProductForm({
      sku: '',
      name: '',
      description: '',
      short_description: '',
      price: '',
      original_price: '',
      cost_price: '',
      stock_quantity: '',
      min_stock_level: '',
      brand: '',
      category: '',
      subcategory: '',
      series: '',
      main_image: '',
      additional_images: [],
      specifications: [],
      is_active: true,
      is_featured: false,
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
      warranty_months: '',
      lead_time_days: '',
      manual_url: '',
      datasheet_url: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: ''
    });
  };

  return {
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
    showToast,
    hideToast
  };
}; 