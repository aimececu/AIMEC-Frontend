import { useState, useEffect } from 'react';
import { productEndpoints } from '../api/endpoints/products.js';
import { categoryEndpoints } from '../api/endpoints/categories.js';
import { brandEndpoints } from '../api/endpoints/brands.js';
import { transformProductsList, transformCategoriesList, transformBrandsList } from '../services/dataTransform.js';

export const useAdminData = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Iniciando carga de datos...');
      
      const [productsResponse, categoriesResponse, brandsResponse, statsResponse] = await Promise.all([
        productEndpoints.getProducts(),
        categoryEndpoints.getCategories(),
        brandEndpoints.getBrands(),
        productEndpoints.getProductStats()
      ]);

      console.log('✅ Respuestas recibidas:', {
        productsSuccess: productsResponse,
        categoriesSuccess: categoriesResponse,
        brandsSuccess: brandsResponse,
        statsSuccess: statsResponse
      });

      // Transformar productos
      const transformedProducts = transformProductsList(productsResponse);
      setProducts(transformedProducts.products);
      console.log('📦 Productos transformados:', transformedProducts.products.length);

      // Transformar categorías
      const transformedCategories = transformCategoriesList(categoriesResponse);
      setCategories(transformedCategories);
      console.log('📂 Categorías transformadas:', transformedCategories.length);

      // Transformar marcas
      const transformedBrands = transformBrandsList(brandsResponse);
      setBrands(transformedBrands);
      console.log('🏷️ Marcas transformadas:', transformedBrands.length);

      if (statsResponse.success) {
        setStats(statsResponse.data);
        console.log('📊 Estadísticas cargadas:', statsResponse.data);
      }
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setLoading(false);
      console.log('✅ Carga de datos completada');
    }
  };

  // Log para verificar el estado de los datos
  console.log('🔍 Estado actual:', {
    productsCount: products.length,
    categoriesCount: categories.length,
    brandsCount: brands.length,
    stats: stats
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  return {
    products,
    categories,
    brands,
    loading,
    stats,
    loadInitialData
  };
}; 