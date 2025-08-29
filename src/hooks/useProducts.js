import { useState, useEffect } from 'react';
import { productEndpoints } from '../api/endpoints/products.js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { categoryEndpoints } from '../api/endpoints/categories.js';

export const useProducts = (loadInitialData) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [productForm, setProductForm] = useState({
    sku: '',
    sku_ec: '',
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    min_stock_level: '',
    brand_id: '',
    category_id: '',
    subcategory_id: '',
    weight: '',
    potencia_kw: '',
    voltaje: '',
    frame_size: '',
    dimensions: '',
    main_image: '',
    is_active: true
  });
  const [subcategories, setSubcategories] = useState([]);

  // Cargar productos al inicializar
  useEffect(() => {
    loadProducts();
  }, []);

  // Cargar subcategorías cuando cambie la categoría
  useEffect(() => {
    if (productForm.category_id) {
      loadSubcategories(productForm.category_id);
    } else {
      setSubcategories([]);
    }
  }, [productForm.category_id]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productEndpoints.getProducts();
      if (response.success) {
        setProducts(response.data || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategories = async (categoryId) => {
    try {
      const response = await categoryEndpoints.getSubcategoriesByCategory(categoryId);
      if (response.success) {
        setSubcategories(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando subcategorías:', error);
      setSubcategories([]);
    }
  };

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
        potencia_kw: parseFloat(productForm.potencia_kw) || null,
        voltaje: productForm.voltaje || null,
        frame_size: productForm.frame_size || null
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

  const handleEditProduct = (product) => {

    console.log(product);
    
    setEditingProduct(product);
    
    // Usar directamente los datos del backend sin transformaciones
    setProductForm({
      sku: product.sku || '',
      sku_ec: product.sku_ec || '',
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      min_stock_level: product.min_stock_level?.toString() || '',
      brand_id: product.brand_id || '',
      category_id: product.category_id || '',
      subcategory_id: product.subcategory_id || '',
      weight: product.weight?.toString() || '',
      potencia_kw: product.potencia_kw?.toString() || '',
      voltaje: product.voltaje || '',
      frame_size: product.frame_size || '',
      dimensions: product.dimensions || '',
      main_image: product.main_image || '',
      is_active: product.is_active !== false
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
      sku_ec: '',
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      min_stock_level: '',
      brand_id: '',
      category_id: '',
      subcategory_id: '',
      weight: '',
      potencia_kw: '',
      voltaje: '',
      frame_size: '',
      dimensions: '',
      main_image: '',
      is_active: true
    });
  };

  return {
    // Estado de productos
    products,
    loading,
    
    // Estado del formulario
    editingProduct,
    showProductForm,
    productForm,
    setProductForm,
    
    // Funciones
    handleProductFormSubmit,
    handleEditProduct,
    handleDeleteProduct,
    handleAddProduct,
    handleCancelForm,
    loadProducts,
    
    // Toast
    toast,
    showToast,
    hideToast,
    
    // Subcategorías
    subcategories,
    setSubcategories
  };
}; 