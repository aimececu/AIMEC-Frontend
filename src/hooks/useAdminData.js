import { useState, useEffect } from "react";
import { productEndpoints } from "../api/endpoints/products.js";
import { categoryEndpoints } from "../api/endpoints/categories.js";
import { brandEndpoints } from "../api/endpoints/brands.js";
import { infoEndpoints } from "../api/endpoints/info.js";

export const useAdminData = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Cargar datos iniciales
      const [products, categories, brands, subcategories, stats] = await Promise.all([
        productEndpoints.getProducts(),
        categoryEndpoints.getCategories(),
        brandEndpoints.getBrands(),
        categoryEndpoints.getAllSubcategories(),
        infoEndpoints.getSystemStats()
      ]);

      // Usar directamente los datos del backend sin transformaciones
      if (products.success) {
        setProducts(
          products.data.products || products.data || []
        );
      }

      if (categories.success) {
        setCategories(categories.data || []);
      }

      if (brands.success) {
        setBrands(brands.data || []);
      }

      if (subcategories.success) {
        setSubcategories(subcategories.data || []);
      }

      if (stats.success) {
        setStats(stats.data || {});
      }
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
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
    subcategories,
    loading,
    stats,
    loadInitialData,
  };
};
