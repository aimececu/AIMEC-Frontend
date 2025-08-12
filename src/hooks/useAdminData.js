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

      const [
        productsResponse,
        categoriesResponse,
        brandsResponse,
        subcategoriesResponse,
        statsResponse,
      ] = await Promise.all([
        productEndpoints.getProducts(),
        categoryEndpoints.getCategories(),
        brandEndpoints.getBrands(),
        categoryEndpoints.getAllSubcategories(),
        infoEndpoints.getSystemStats(),
      ]);

      console.log("productStats", statsResponse);

      // Usar directamente los datos del backend sin transformaciones
      if (productsResponse.success) {
        setProducts(
          productsResponse.data.products || productsResponse.data || []
        );
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data || []);
      }

      if (brandsResponse.success) {
        setBrands(brandsResponse.data || []);
      }

      if (subcategoriesResponse.success) {
        setSubcategories(subcategoriesResponse.data || []);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data || {});
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
