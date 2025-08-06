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
    } finally {
      setLoading(false);
    }
  };

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