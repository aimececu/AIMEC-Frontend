// =====================================================
// SERVICIO DE BASE DE DATOS TEMPORAL
// =====================================================
// Esta es una versión temporal que usa datos locales
// hasta que se configure PostgreSQL

import { siemensProducts, siemensCategories, siemensSeries } from '../data/siemensProducts';

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para probar la conexión
export const testConnection = async () => {
  try {
    await delay(500); // Simular delay de red
    return { 
      success: true, 
      timestamp: new Date().toISOString(),
      message: 'Usando datos locales (modo temporal)'
    };
  } catch (error) {
    console.error('Error en conexión:', error);
    return { success: false, error: error.message };
  }
};

// =====================================================
// SERVICIOS DE PRODUCTOS
// =====================================================

export const productService = {
  // Obtener todos los productos con filtros
  async getProducts(filters = {}) {
    try {
      await delay(300); // Simular delay de red
      
      let filteredProducts = [...siemensProducts];

      // Aplicar filtros
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }

      if (filters.subcategory) {
        filteredProducts = filteredProducts.filter(p => p.subcategory === filters.subcategory);
      }

      if (filters.brand) {
        filteredProducts = filteredProducts.filter(p => p.brand === filters.brand);
      }

      if (filters.series) {
        filteredProducts = filteredProducts.filter(p => p.series === filters.series);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.series?.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
      }

      if (filters.inStock !== undefined) {
        if (filters.inStock) {
          filteredProducts = filteredProducts.filter(p => p.stock > 0);
        } else {
          filteredProducts = filteredProducts.filter(p => p.stock === 0);
        }
      }

      // Ordenamiento
      const { sortBy = 'name', sortOrder = 'ASC' } = filters;
      filteredProducts.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortOrder.toUpperCase() === 'DESC') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });

      // Paginación
      const { limit = 50, offset = 0 } = filters;
      return filteredProducts.slice(offset, offset + limit);
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  },

  // Obtener un producto por ID con todas sus relaciones
  async getProductById(id) {
    try {
      await delay(200);
      const product = siemensProducts.find(p => p.id === id);
      
      if (!product) {
        return null;
      }

      // Encontrar productos relacionados
      const relatedProducts = product.relatedProducts 
        ? siemensProducts.filter(p => product.relatedProducts.includes(p.id))
        : [];

      return {
        ...product,
        relatedProducts: relatedProducts.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          main_image: p.image,
          slug: p.id
        }))
      };
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw error;
    }
  },

  // Crear un nuevo producto (simulado)
  async createProduct(productData) {
    try {
      await delay(1000);
      const newId = `product-${Date.now()}`;
      console.log('Producto creado (simulado):', { id: newId, ...productData });
      return newId;
    } catch (error) {
      console.error('Error creando producto:', error);
      throw error;
    }
  },

  // Actualizar un producto (simulado)
  async updateProduct(id, productData) {
    try {
      await delay(1000);
      console.log('Producto actualizado (simulado):', { id, ...productData });
      return true;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  },

  // Eliminar un producto (simulado)
  async deleteProduct(id) {
    try {
      await delay(500);
      console.log('Producto eliminado (simulado):', id);
      return true;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  },

  // Obtener estadísticas de productos
  async getProductStats() {
    try {
      await delay(200);
      const total = siemensProducts.length;
      const inStock = siemensProducts.filter(p => p.stock > 0).length;
      const outOfStock = siemensProducts.filter(p => p.stock === 0).length;
      const lowStock = siemensProducts.filter(p => p.stock <= 5 && p.stock > 0).length;
      const avgPrice = siemensProducts.reduce((sum, p) => sum + p.price, 0) / total;
      const totalStock = siemensProducts.reduce((sum, p) => sum + p.stock, 0);

      return {
        total_products: total,
        in_stock: inStock,
        out_of_stock: outOfStock,
        low_stock: lowStock,
        avg_price: avgPrice,
        total_stock: totalStock
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};

// =====================================================
// SERVICIOS DE CATEGORÍAS Y MARCAS
// =====================================================

export const categoryService = {
  async getCategories() {
    try {
      await delay(200);
      return siemensCategories.map(cat => ({
        ...cat,
        subcategory_count: cat.subcategories?.length || 0,
        product_count: siemensProducts.filter(p => p.category === cat.id).length
      }));
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
  },

  async getSubcategories(categoryId = null) {
    try {
      await delay(200);
      let subcategories = [];
      
      if (categoryId) {
        const category = siemensCategories.find(cat => cat.id === categoryId);
        subcategories = category?.subcategories || [];
      } else {
        subcategories = siemensCategories.flatMap(cat => 
          cat.subcategories?.map(sub => ({ ...sub, category_name: cat.name })) || []
        );
      }

      return subcategories;
    } catch (error) {
      console.error('Error obteniendo subcategorías:', error);
      throw error;
    }
  }
};

export const brandService = {
  async getBrands() {
    try {
      await delay(200);
      const brands = [...new Set(siemensProducts.map(p => p.brand))];
      return brands.map(brand => ({
        id: brand,
        name: brand,
        description: `Productos de ${brand}`,
        product_count: siemensProducts.filter(p => p.brand === brand).length
      }));
    } catch (error) {
      console.error('Error obteniendo marcas:', error);
      throw error;
    }
  }
};

// =====================================================
// SERVICIOS DE ESPECIFICACIONES
// =====================================================

export const specificationService = {
  async getSpecificationTypes(categoryId = null) {
    try {
      await delay(200);
      // Simular tipos de especificaciones
      const specTypes = [
        { id: 1, name: 'cpu', display_name: 'CPU', data_type: 'text', unit: null, category_id: 1, sort_order: 1 },
        { id: 2, name: 'memory', display_name: 'Memoria', data_type: 'text', unit: null, category_id: 1, sort_order: 2 },
        { id: 3, name: 'power', display_name: 'Potencia', data_type: 'text', unit: 'kW', category_id: 3, sort_order: 1 },
        { id: 4, name: 'voltage', display_name: 'Voltaje', data_type: 'text', unit: 'V', category_id: 3, sort_order: 2 },
        { id: 5, name: 'range', display_name: 'Rango', data_type: 'text', unit: 'mm', category_id: 4, sort_order: 1 },
        { id: 6, name: 'accuracy', display_name: 'Precisión', data_type: 'text', unit: '%', category_id: 4, sort_order: 2 }
      ];

      if (categoryId) {
        return specTypes.filter(spec => spec.category_id === categoryId);
      }

      return specTypes;
    } catch (error) {
      console.error('Error obteniendo tipos de especificaciones:', error);
      throw error;
    }
  },

  async createSpecificationType(specData) {
    try {
      await delay(500);
      console.log('Tipo de especificación creado (simulado):', specData);
      return { id: Date.now(), ...specData };
    } catch (error) {
      console.error('Error creando tipo de especificación:', error);
      throw error;
    }
  }
};

// =====================================================
// SERVICIOS DE IMPORTACIÓN
// =====================================================

export const importService = {
  async createImportTemplate(templateData) {
    try {
      await delay(500);
      console.log('Plantilla de importación creada (simulada):', templateData);
      return { id: Date.now(), ...templateData };
    } catch (error) {
      console.error('Error creando plantilla de importación:', error);
      throw error;
    }
  },

  async getImportTemplates() {
    try {
      await delay(200);
      return [
        {
          id: 1,
          name: 'Plantilla Básica',
          description: 'Plantilla para productos con información básica',
          category_id: null,
          template_config: { requiredFields: ['sku', 'name', 'price'] }
        },
        {
          id: 2,
          name: 'Plantilla Industrial',
          description: 'Plantilla completa para productos industriales',
          category_id: 1,
          template_config: { 
            requiredFields: ['sku', 'name', 'price', 'category', 'brand'],
            specificationFields: [
              { name: 'cpu', display_name: 'CPU', data_type: 'text' },
              { name: 'memory', display_name: 'Memoria', data_type: 'text' }
            ]
          }
        }
      ];
    } catch (error) {
      console.error('Error obteniendo plantillas de importación:', error);
      throw error;
    }
  },

  async createImportHistory(importData) {
    try {
      await delay(300);
      console.log('Historial de importación creado (simulado):', importData);
      return { id: Date.now(), ...importData };
    } catch (error) {
      console.error('Error creando historial de importación:', error);
      throw error;
    }
  },

  async updateImportHistory(id, updateData) {
    try {
      await delay(300);
      console.log('Historial de importación actualizado (simulado):', { id, ...updateData });
      return { id, ...updateData };
    } catch (error) {
      console.error('Error actualizando historial de importación:', error);
      throw error;
    }
  }
};

export default {
  testConnection,
  productService,
  categoryService,
  brandService,
  specificationService,
  importService
}; 