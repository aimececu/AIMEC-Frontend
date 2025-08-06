import { useState } from 'react';
import { productEndpoints } from '../api/endpoints/products.js';

export const useProducts = (loadInitialData) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
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
    additional_images: [],
    is_active: true,
    weight: '',
    dimensions: '',
    voltage: '',
    power: '',
    temperature_range: '',
    ip_rating: '',
    material: '',
    color: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });

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
      resetProductForm();
      
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert(error.message);
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
      price: product.price?.toString() || '',
      stock_quantity: product.stock?.toString() || '',
      brand: getBrandId(product.brand),
      category: getCategoryId(product.category),
      subcategory: product.subcategory || '',
      series: product.series || '',
      main_image: product.image || product.main_image || '',
      additional_images: product.additional_images || [],
      is_active: product.is_active !== false,
      weight: product.weight?.toString() || '',
      dimensions: product.dimensions || '',
      voltage: product.voltage?.toString() || '',
      power: product.power?.toString() || '',
      temperature_range: product.temperature_range || '',
      ip_rating: product.ip_rating || '',
      material: product.material || '',
      color: product.color || '',
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
      price: '',
      stock_quantity: '',
      brand: '',
      category: '',
      subcategory: '',
      series: '',
      main_image: '',
      additional_images: [],
      is_active: true,
      weight: '',
      dimensions: '',
      voltage: '',
      power: '',
      temperature_range: '',
      ip_rating: '',
      material: '',
      color: '',
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
    handleCancelForm
  };
}; 