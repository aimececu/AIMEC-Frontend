import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../../components/ui/Icon";
import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import ProductCard from "../../components/ui/ProductCard";
import Loader from "../../components/ui/Loader";
import Pagination from "../../components/ui/Pagination";
import { productEndpoints } from "../../api/endpoints/products.js";
import { categoryEndpoints } from "../../api/endpoints/categories.js";
import { brandEndpoints } from "../../api/endpoints/brands.js";
import clsx from "clsx";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados de datos
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener valores de la URL con valores por defecto
  const searchTerm = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedSubcategory = searchParams.get("subcategory") || "all";
  const selectedSeries = searchParams.get("series") || "all";
  const selectedBrand = searchParams.get("brand") || "all";
  const viewMode = searchParams.get("view") || "grid";
  const sortOption = searchParams.get("sort") || "default";
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const itemsPerPage = parseInt(searchParams.get("perPage")) || 12;

  // Filtros técnicos
  const selectedPotencia = searchParams.get("potencia") || "all";
  const selectedVoltaje = searchParams.get("voltaje") || "all";
  const selectedFrameSize = searchParams.get("frame_size") || "all";
  const selectedCorriente = searchParams.get("corriente") || "all";
  const selectedComunicacion = searchParams.get("comunicacion") || "all";
  const selectedAlimentacion = searchParams.get("alimentacion") || "all";
  const [showTechnicalFilters, setShowTechnicalFilters] = useState(false);

  // Funciones para actualizar la URL
  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "all" ||
        value === "default"
      ) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });

    setSearchParams(newParams);
  };

  // Handlers para los controles
  const handleSearchChange = (value) => {
    updateSearchParams({ search: value, page: 1 });
  };

  const handleCategoryChange = (value) => {
    updateSearchParams({
      category: value,
      subcategory: "all",
      potencia: "all",
      voltaje: "all",
      frame_size: "all",
      corriente: "all",
      comunicacion: "all",
      alimentacion: "all",
      page: 1,
    });
  };

  const handleSubcategoryChange = (value) => {
    updateSearchParams({
      subcategory: value,
      potencia: "all",
      voltaje: "all",
      frame_size: "all",
      corriente: "all",
      comunicacion: "all",
      alimentacion: "all",
      page: 1,
    });
  };

  const handleSeriesChange = (value) => {
    updateSearchParams({ series: value, page: 1 });
  };

  const handleBrandChange = (value) => {
    updateSearchParams({
      brand: value,
      potencia: "all",
      voltaje: "all",
      frame_size: "all",
      corriente: "all",
      comunicacion: "all",
      alimentacion: "all",
      page: 1,
    });
  };

  const handleViewModeChange = (value) => {
    updateSearchParams({ view: value });
  };

  const handleSortChange = (value) => {
    updateSearchParams({ sort: value, page: 1 });
  };

  const handlePageChange = (page) => {
    updateSearchParams({ page });
  };

  const handleItemsPerPageChange = (perPage) => {
    updateSearchParams({ perPage, page: 1 });
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Handlers para filtros técnicos
  const handlePotenciaChange = (value) => {
    updateSearchParams({ potencia: value, page: 1 });
  };

  const handleVoltajeChange = (value) => {
    updateSearchParams({ voltaje: value, page: 1 });
  };

  const handleFrameSizeChange = (value) => {
    updateSearchParams({ frame_size: value, page: 1 });
  };

  const handleCorrienteChange = (value) => {
    updateSearchParams({ corriente: value, page: 1 });
  };

  const handleComunicacionChange = (value) => {
    updateSearchParams({ comunicacion: value, page: 1 });
  };

  const handleAlimentacionChange = (value) => {
    updateSearchParams({ alimentacion: value, page: 1 });
  };

  // Cargar datos desde la base de datos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse, brandsResponse] =
        await Promise.all([
          productEndpoints.getProducts(),
          categoryEndpoints.getCategories(),
          brandEndpoints.getBrands(),
        ]);

      // Usar directamente los datos del backend sin transformaciones
      if (productsResponse.success) {
        const productsData =
          productsResponse.data.products || productsResponse.data || [];
        setProducts(productsData);

        // Extraer series únicas de los productos (si existen)
        const uniqueSeries = [
          ...new Set(
            productsData.map((product) => product.series).filter(Boolean)
          ),
        ];
        setSeries(uniqueSeries);
      }

      if (categoriesResponse.success) {
        const categoriesData = categoriesResponse.data || [];
        setCategories(categoriesData);
      }

      if (brandsResponse.success) {
        const brandsData = brandsResponse.data || [];
        setBrands(brandsData);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener subcategorías de la categoría seleccionada
  const getSubcategories = () => {
    if (selectedCategory === "all") return [];
    const category = categories.find(
      (cat) => cat.id === parseInt(selectedCategory)
    );
    // Las subcategorías vienen directamente del backend, no anidadas
    return category ? category.subcategories || [] : [];
  };

  // Obtener series de la categoría seleccionada
  const getSeries = () => {
    if (selectedCategory === "all") return series;
    // Las series no están anidadas por categoría en el modelo del backend
    return series;
  };

  const subcategories = getSubcategories();
  const availableSeries = getSeries();

  // Generar filtros basados en productos disponibles
  const availableCategories = useMemo(() => {
    const categoryIds = [
      ...new Set(
        products.map((product) => product.category_id).filter(Boolean)
      ),
    ];
    return categories.filter((cat) => categoryIds.includes(cat.id));
  }, [products, categories]);

  const availableBrands = useMemo(() => {
    const brandIds = [
      ...new Set(products.map((product) => product.brand_id).filter(Boolean)),
    ];
    return brands.filter((brand) => brandIds.includes(brand.id));
  }, [products, brands]);

  const availableSubcategories = useMemo(() => {
    if (selectedCategory === "all") return [];
    const subcategoryIds = [
      ...new Set(
        products
          .filter(
            (product) => product.category_id === parseInt(selectedCategory)
          )
          .map((product) => product.subcategory_id)
          .filter(Boolean)
      ),
    ];
    return subcategories.filter((sub) => subcategoryIds.includes(sub.id));
  }, [products, subcategories, selectedCategory]);

  // Función auxiliar para obtener productos filtrados por todos los criterios
  const getFilteredProducts = useCallback(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku &&
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.sku_ec &&
          product.sku_ec.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.series &&
          product.series.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" ||
        product.category_id === parseInt(selectedCategory);
      const matchesSubcategory =
        selectedSubcategory === "all" ||
        product.subcategory_id === parseInt(selectedSubcategory);
      const matchesSeries =
        selectedSeries === "all" || product.series === selectedSeries;
      const matchesBrand =
        selectedBrand === "all" || product.brand_id === parseInt(selectedBrand);

      // Filtros técnicos
      const matchesPotencia =
        selectedPotencia === "all" || product.potencia_kw === selectedPotencia;
      const matchesVoltaje =
        selectedVoltaje === "all" || product.voltaje === selectedVoltaje;
      const matchesFrameSize =
        selectedFrameSize === "all" || product.frame_size === selectedFrameSize;
      const matchesCorriente =
        selectedCorriente === "all" || product.corriente === selectedCorriente;
      const matchesComunicacion =
        selectedComunicacion === "all" ||
        product.comunicacion === selectedComunicacion;
      const matchesAlimentacion =
        selectedAlimentacion === "all" ||
        product.alimentacion === selectedAlimentacion;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesSeries &&
        matchesBrand &&
        matchesPotencia &&
        matchesVoltaje &&
        matchesFrameSize &&
        matchesCorriente &&
        matchesComunicacion &&
        matchesAlimentacion
      );
    });
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedSeries,
    selectedBrand,
    selectedPotencia,
    selectedVoltaje,
    selectedFrameSize,
    selectedCorriente,
    selectedComunicacion,
    selectedAlimentacion,
  ]);

  // Generar opciones de filtros técnicos basadas en productos filtrados por otros criterios
  const availablePotenciaOptions = useMemo(() => {
    // Filtrar productos según otros filtros aplicados (excluyendo potencia)
    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku &&
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.sku_ec &&
          product.sku_ec.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.series &&
          product.series.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" ||
        product.category_id === parseInt(selectedCategory);
      const matchesSubcategory =
        selectedSubcategory === "all" ||
        product.subcategory_id === parseInt(selectedSubcategory);
      const matchesSeries =
        selectedSeries === "all" || product.series === selectedSeries;
      const matchesBrand =
        selectedBrand === "all" || product.brand_id === parseInt(selectedBrand);

      // Filtros técnicos (excluyendo potencia)
      const matchesVoltaje =
        selectedVoltaje === "all" || product.voltaje === selectedVoltaje;
      const matchesFrameSize =
        selectedFrameSize === "all" || product.frame_size === selectedFrameSize;
      const matchesCorriente =
        selectedCorriente === "all" || product.corriente === selectedCorriente;
      const matchesComunicacion =
        selectedComunicacion === "all" ||
        product.comunicacion === selectedComunicacion;
      const matchesAlimentacion =
        selectedAlimentacion === "all" ||
        product.alimentacion === selectedAlimentacion;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesSeries &&
        matchesBrand &&
        matchesVoltaje &&
        matchesFrameSize &&
        matchesCorriente &&
        matchesComunicacion &&
        matchesAlimentacion
      );
    });

    const potencias = [
      ...new Set(
        filteredProducts.map((product) => product.potencia_kw).filter(Boolean)
      ),
    ];
    return potencias.sort();
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedSeries,
    selectedBrand,
    selectedVoltaje,
    selectedFrameSize,
    selectedCorriente,
    selectedComunicacion,
    selectedAlimentacion,
  ]);

  const availableVoltajeOptions = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku &&
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.sku_ec &&
          product.sku_ec.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.series &&
          product.series.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" ||
        product.category_id === parseInt(selectedCategory);
      const matchesSubcategory =
        selectedSubcategory === "all" ||
        product.subcategory_id === parseInt(selectedSubcategory);
      const matchesSeries =
        selectedSeries === "all" || product.series === selectedSeries;
      const matchesBrand =
        selectedBrand === "all" || product.brand_id === parseInt(selectedBrand);

      // Filtros técnicos (excluyendo voltaje)
      const matchesPotencia =
        selectedPotencia === "all" || product.potencia_kw === selectedPotencia;
      const matchesFrameSize =
        selectedFrameSize === "all" || product.frame_size === selectedFrameSize;
      const matchesCorriente =
        selectedCorriente === "all" || product.corriente === selectedCorriente;
      const matchesComunicacion =
        selectedComunicacion === "all" ||
        product.comunicacion === selectedComunicacion;
      const matchesAlimentacion =
        selectedAlimentacion === "all" ||
        product.alimentacion === selectedAlimentacion;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesSeries &&
        matchesBrand &&
        matchesPotencia &&
        matchesFrameSize &&
        matchesCorriente &&
        matchesComunicacion &&
        matchesAlimentacion
      );
    });

    const voltajes = [
      ...new Set(
        filteredProducts.map((product) => product.voltaje).filter(Boolean)
      ),
    ];
    return voltajes.sort();
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedSeries,
    selectedBrand,
    selectedPotencia,
    selectedFrameSize,
    selectedCorriente,
    selectedComunicacion,
    selectedAlimentacion,
  ]);

  const availableFrameSizeOptions = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku &&
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.sku_ec &&
          product.sku_ec.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.series &&
          product.series.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" ||
        product.category_id === parseInt(selectedCategory);
      const matchesSubcategory =
        selectedSubcategory === "all" ||
        product.subcategory_id === parseInt(selectedSubcategory);
      const matchesSeries =
        selectedSeries === "all" || product.series === selectedSeries;
      const matchesBrand =
        selectedBrand === "all" || product.brand_id === parseInt(selectedBrand);

      // Filtros técnicos (excluyendo frame_size)
      const matchesPotencia =
        selectedPotencia === "all" || product.potencia_kw === selectedPotencia;
      const matchesVoltaje =
        selectedVoltaje === "all" || product.voltaje === selectedVoltaje;
      const matchesCorriente =
        selectedCorriente === "all" || product.corriente === selectedCorriente;
      const matchesComunicacion =
        selectedComunicacion === "all" ||
        product.comunicacion === selectedComunicacion;
      const matchesAlimentacion =
        selectedAlimentacion === "all" ||
        product.alimentacion === selectedAlimentacion;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesSeries &&
        matchesBrand &&
        matchesPotencia &&
        matchesVoltaje &&
        matchesCorriente &&
        matchesComunicacion &&
        matchesAlimentacion
      );
    });

    const frameSizes = [
      ...new Set(
        filteredProducts.map((product) => product.frame_size).filter(Boolean)
      ),
    ];
    return frameSizes.sort();
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedSeries,
    selectedBrand,
    selectedPotencia,
    selectedVoltaje,
    selectedCorriente,
    selectedComunicacion,
    selectedAlimentacion,
  ]);

  const availableCorrienteOptions = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku &&
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.sku_ec &&
          product.sku_ec.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.series &&
          product.series.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" ||
        product.category_id === parseInt(selectedCategory);
      const matchesSubcategory =
        selectedSubcategory === "all" ||
        product.subcategory_id === parseInt(selectedSubcategory);
      const matchesSeries =
        selectedSeries === "all" || product.series === selectedSeries;
      const matchesBrand =
        selectedBrand === "all" || product.brand_id === parseInt(selectedBrand);

      // Filtros técnicos (excluyendo corriente)
      const matchesPotencia =
        selectedPotencia === "all" || product.potencia_kw === selectedPotencia;
      const matchesVoltaje =
        selectedVoltaje === "all" || product.voltaje === selectedVoltaje;
      const matchesFrameSize =
        selectedFrameSize === "all" || product.frame_size === selectedFrameSize;
      const matchesComunicacion =
        selectedComunicacion === "all" ||
        product.comunicacion === selectedComunicacion;
      const matchesAlimentacion =
        selectedAlimentacion === "all" ||
        product.alimentacion === selectedAlimentacion;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesSeries &&
        matchesBrand &&
        matchesPotencia &&
        matchesVoltaje &&
        matchesFrameSize &&
        matchesComunicacion &&
        matchesAlimentacion
      );
    });

    const corrientes = [
      ...new Set(
        filteredProducts.map((product) => product.corriente).filter(Boolean)
      ),
    ];
    return corrientes.sort();
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedSeries,
    selectedBrand,
    selectedPotencia,
    selectedVoltaje,
    selectedFrameSize,
    selectedComunicacion,
    selectedAlimentacion,
  ]);

  const availableComunicacionOptions = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku &&
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.sku_ec &&
          product.sku_ec.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.series &&
          product.series.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" ||
        product.category_id === parseInt(selectedCategory);
      const matchesSubcategory =
        selectedSubcategory === "all" ||
        product.subcategory_id === parseInt(selectedSubcategory);
      const matchesSeries =
        selectedSeries === "all" || product.series === selectedSeries;
      const matchesBrand =
        selectedBrand === "all" || product.brand_id === parseInt(selectedBrand);

      // Filtros técnicos (excluyendo comunicacion)
      const matchesPotencia =
        selectedPotencia === "all" || product.potencia_kw === selectedPotencia;
      const matchesVoltaje =
        selectedVoltaje === "all" || product.voltaje === selectedVoltaje;
      const matchesFrameSize =
        selectedFrameSize === "all" || product.frame_size === selectedFrameSize;
      const matchesCorriente =
        selectedCorriente === "all" || product.corriente === selectedCorriente;
      const matchesAlimentacion =
        selectedAlimentacion === "all" ||
        product.alimentacion === selectedAlimentacion;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesSeries &&
        matchesBrand &&
        matchesPotencia &&
        matchesVoltaje &&
        matchesFrameSize &&
        matchesCorriente &&
        matchesAlimentacion
      );
    });

    const comunicaciones = [
      ...new Set(
        filteredProducts.map((product) => product.comunicacion).filter(Boolean)
      ),
    ];
    return comunicaciones.sort();
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedSeries,
    selectedBrand,
    selectedPotencia,
    selectedVoltaje,
    selectedFrameSize,
    selectedCorriente,
    selectedAlimentacion,
  ]);

  const availableAlimentacionOptions = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku &&
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.sku_ec &&
          product.sku_ec.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.series &&
          product.series.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" ||
        product.category_id === parseInt(selectedCategory);
      const matchesSubcategory =
        selectedSubcategory === "all" ||
        product.subcategory_id === parseInt(selectedSubcategory);
      const matchesSeries =
        selectedSeries === "all" || product.series === selectedSeries;
      const matchesBrand =
        selectedBrand === "all" || product.brand_id === parseInt(selectedBrand);

      // Filtros técnicos (excluyendo alimentacion)
      const matchesPotencia =
        selectedPotencia === "all" || product.potencia_kw === selectedPotencia;
      const matchesVoltaje =
        selectedVoltaje === "all" || product.voltaje === selectedVoltaje;
      const matchesFrameSize =
        selectedFrameSize === "all" || product.frame_size === selectedFrameSize;
      const matchesCorriente =
        selectedCorriente === "all" || product.corriente === selectedCorriente;
      const matchesComunicacion =
        selectedComunicacion === "all" ||
        product.comunicacion === selectedComunicacion;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesSeries &&
        matchesBrand &&
        matchesPotencia &&
        matchesVoltaje &&
        matchesFrameSize &&
        matchesCorriente &&
        matchesComunicacion
      );
    });

    const alimentaciones = [
      ...new Set(
        filteredProducts.map((product) => product.alimentacion).filter(Boolean)
      ),
    ];
    return alimentaciones.sort();
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedSeries,
    selectedBrand,
    selectedPotencia,
    selectedVoltaje,
    selectedFrameSize,
    selectedCorriente,
    selectedComunicacion,
  ]);

  // Resetear filtros si la selección actual no tiene productos
  useEffect(() => {
    if (selectedCategory !== "all" && availableCategories.length > 0) {
      const categoryExists = availableCategories.some(
        (cat) => cat.id.toString() === selectedCategory
      );
      if (!categoryExists) {
        updateSearchParams({ category: "all", subcategory: "all" });
      }
    }
  }, [selectedCategory, availableCategories]);

  useEffect(() => {
    if (selectedBrand !== "all" && availableBrands.length > 0) {
      const brandExists = availableBrands.some(
        (brand) => brand.id.toString() === selectedBrand
      );
      if (!brandExists) {
        updateSearchParams({ brand: "all" });
      }
    }
  }, [selectedBrand, availableBrands]);

  useEffect(() => {
    if (selectedSubcategory !== "all" && availableSubcategories.length > 0) {
      const subcategoryExists = availableSubcategories.some(
        (sub) => sub.id.toString() === selectedSubcategory
      );
      if (!subcategoryExists) {
        updateSearchParams({ subcategory: "all" });
      }
    }
  }, [selectedSubcategory, availableSubcategories]);

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    const filtered = products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (product.sku &&
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.sku_ec &&
            product.sku_ec.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.series &&
            product.series.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory =
          selectedCategory === "all" ||
          product.category_id === parseInt(selectedCategory);
        const matchesSubcategory =
          selectedSubcategory === "all" ||
          product.subcategory_id === parseInt(selectedSubcategory);
        const matchesSeries =
          selectedSeries === "all" || product.series === selectedSeries;
        const matchesBrand =
          selectedBrand === "all" ||
          product.brand_id === parseInt(selectedBrand);

        // Filtros técnicos
        const matchesPotencia =
          selectedPotencia === "all" ||
          product.potencia_kw === selectedPotencia;
        const matchesVoltaje =
          selectedVoltaje === "all" || product.voltaje === selectedVoltaje;
        const matchesFrameSize =
          selectedFrameSize === "all" ||
          product.frame_size === selectedFrameSize;
        const matchesCorriente =
          selectedCorriente === "all" ||
          product.corriente === selectedCorriente;
        const matchesComunicacion =
          selectedComunicacion === "all" ||
          product.comunicacion === selectedComunicacion;
        const matchesAlimentacion =
          selectedAlimentacion === "all" ||
          product.alimentacion === selectedAlimentacion;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesSubcategory &&
          matchesSeries &&
          matchesBrand &&
          matchesPotencia &&
          matchesVoltaje &&
          matchesFrameSize &&
          matchesCorriente &&
          matchesComunicacion &&
          matchesAlimentacion
        );
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "price-low":
            return parseFloat(a.price) - parseFloat(b.price);
          case "price-high":
            return parseFloat(b.price) - parseFloat(a.price);
          case "name":
            return a.name.localeCompare(b.name);
          case "rating":
            // Rating no existe en el modelo del backend, usar stock como alternativa
            return (b.stock_quantity || 0) - (a.stock_quantity || 0);
          case "stock":
            return (b.stock_quantity || 0) - (a.stock_quantity || 0);
          default:
            return 0;
        }
      });

    return filtered;
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedSeries,
    selectedBrand,
    selectedPotencia,
    selectedVoltaje,
    selectedFrameSize,
    selectedCorriente,
    selectedComunicacion,
    selectedAlimentacion,
    sortOption,
  ]);

  // Calcular productos paginados
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Container size="xl">
        <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <Heading level={1} className="mb-2">
              Productos Industriales
            </Heading>
            <p className="text-secondary-600 dark:text-secondary-300">
              Soluciones de automatización industrial de alta calidad de las
              mejores marcas
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Sidebar Filters - Más compacto */}
            <div className="xl:w-72 flex-shrink-0">
              <Card padding="lg" className="sticky top-4">
                <Heading level={3} className="mb-4 flex items-center gap-2">
                  <Icon name="FiFilter" />
                  Filtros
                </Heading>

                {/* Search */}
                <div className="mb-6">
                  <Input
                    label="Buscar productos"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Nombre, descripción, SKU..."
                    icon={<Icon name="FiSearch" size="sm" />}
                  />
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Marca
                  </label>
                  <Select
                    options={[
                      { value: "all", label: "Todas las marcas" },
                      ...availableBrands.map((brand) => ({
                        value: brand.id.toString(),
                        label: brand.name,
                      })),
                    ]}
                    value={selectedBrand}
                    onChange={handleBrandChange}
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Categoría
                  </label>
                  <Select
                    options={[
                      { value: "all", label: "Todas las categorías" },
                      ...availableCategories.map((cat) => ({
                        value: cat.id.toString(),
                        label: cat.name,
                      })),
                    ]}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  />
                </div>

                {/* Subcategory Filter */}
                {availableSubcategories.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Subcategoría
                    </label>
                    <Select
                      options={[
                        { value: "all", label: "Todas las subcategorías" },
                        ...availableSubcategories.map((sub) => ({
                          value: sub.id.toString(),
                          label: sub.name,
                        })),
                      ]}
                      value={selectedSubcategory}
                      onChange={handleSubcategoryChange}
                    />
                  </div>
                )}

                {/* Series Filter */}
                {series.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Serie
                    </label>
                    <Select
                      options={[
                        { value: "all", label: "Todas las series" },
                        ...series.map((s) => ({
                          value: s.toString(),
                          label: s,
                        })),
                      ]}
                      value={selectedSeries}
                      onChange={handleSeriesChange}
                    />
                  </div>
                )}

                {/* Filtros Técnicos */}
                <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      <Icon name="FiSettings" size="sm" />
                      Filtros Técnicos
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowTechnicalFilters(!showTechnicalFilters)
                      }
                      className="text-xs"
                    >
                      <Icon
                        name={
                          showTechnicalFilters ? "FiChevronUp" : "FiChevronDown"
                        }
                        size="sm"
                      />
                    </Button>
                  </div>

                  {showTechnicalFilters && (
                    <div className="space-y-4">
                      {/* Potencia */}
                      {availablePotenciaOptions.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Potencia (kW)
                          </label>
                          <Select
                            options={[
                              { value: "all", label: "Todas las potencias" },
                              ...availablePotenciaOptions.map((potencia) => ({
                                value: potencia,
                                label: potencia,
                              })),
                            ]}
                            value={selectedPotencia}
                            onChange={handlePotenciaChange}
                          />
                        </div>
                      )}

                      {/* Voltaje */}
                      {availableVoltajeOptions.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Voltaje
                          </label>
                          <Select
                            options={[
                              { value: "all", label: "Todos los voltajes" },
                              ...availableVoltajeOptions.map((voltaje) => ({
                                value: voltaje,
                                label: voltaje,
                              })),
                            ]}
                            value={selectedVoltaje}
                            onChange={handleVoltajeChange}
                          />
                        </div>
                      )}

                      {/* Frame Size */}
                      {availableFrameSizeOptions.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Frame Size
                          </label>
                          <Select
                            options={[
                              { value: "all", label: "Todos los tamaños" },
                              ...availableFrameSizeOptions.map((frameSize) => ({
                                value: frameSize,
                                label: frameSize,
                              })),
                            ]}
                            value={selectedFrameSize}
                            onChange={handleFrameSizeChange}
                          />
                        </div>
                      )}

                      {/* Corriente */}
                      {availableCorrienteOptions.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Corriente
                          </label>
                          <Select
                            options={[
                              { value: "all", label: "Todas las corrientes" },
                              ...availableCorrienteOptions.map((corriente) => ({
                                value: corriente,
                                label: corriente,
                              })),
                            ]}
                            value={selectedCorriente}
                            onChange={handleCorrienteChange}
                          />
                        </div>
                      )}

                      {/* Comunicación */}
                      {availableComunicacionOptions.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Comunicación
                          </label>
                          <Select
                            options={[
                              {
                                value: "all",
                                label: "Todas las comunicaciones",
                              },
                              ...availableComunicacionOptions.map(
                                (comunicacion) => ({
                                  value: comunicacion,
                                  label: comunicacion,
                                })
                              ),
                            ]}
                            value={selectedComunicacion}
                            onChange={handleComunicacionChange}
                          />
                        </div>
                      )}

                      {/* Alimentación */}
                      {availableAlimentacionOptions.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Alimentación
                          </label>
                          <Select
                            options={[
                              {
                                value: "all",
                                label: "Todas las alimentaciones",
                              },
                              ...availableAlimentacionOptions.map(
                                (alimentacion) => ({
                                  value: alimentacion,
                                  label: alimentacion,
                                })
                              ),
                            ]}
                            value={selectedAlimentacion}
                            onChange={handleAlimentacionChange}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Clear Filters */}
                {(selectedCategory !== "all" ||
                  selectedSubcategory !== "all" ||
                  selectedSeries !== "all" ||
                  selectedBrand !== "all" ||
                  selectedPotencia !== "all" ||
                  selectedVoltaje !== "all" ||
                  selectedFrameSize !== "all" ||
                  selectedCorriente !== "all" ||
                  selectedComunicacion !== "all" ||
                  selectedAlimentacion !== "all" ||
                  searchTerm) && (
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    className="mt-4"
                    onClick={clearFilters}
                  >
                    <Icon name="FiX" size="sm" className="mr-2" />
                    Limpiar Filtros
                  </Button>
                )}
              </Card>
            </div>

            {/* Products Section */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <Card padding="md" className="mb-6">
                <div className="space-y-4">
                  {/* Top row: Product count and View toggle */}
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600 dark:text-secondary-300 text-sm">
                      {filteredProducts.length} productos encontrados
                    </span>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-secondary-100 dark:bg-secondary-700 rounded-lg p-1">
                      <button
                        onClick={() => handleViewModeChange("grid")}
                        className={clsx(
                          "p-2 rounded-md transition-colors duration-200",
                          viewMode === "grid"
                            ? "bg-white dark:bg-secondary-600 text-primary-600 dark:text-primary-400 shadow-sm"
                            : "text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white"
                        )}
                      >
                        <Icon name="FiGrid" size="sm" />
                      </button>
                      <button
                        onClick={() => handleViewModeChange("list")}
                        className={clsx(
                          "p-2 rounded-md transition-colors duration-200",
                          viewMode === "list"
                            ? "bg-white dark:bg-secondary-600 text-primary-600 dark:text-primary-400 shadow-sm"
                            : "text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white"
                        )}
                      >
                        <Icon name="FiList" size="sm" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom row: Filters */}
                  <div className="flex flex-row items-start sm:items-center gap-2 sm:gap-4">
                    {/* Items per page selector */}
                    <Select
                      options={[
                        { value: 6, label: "6 por página" },
                        { value: 12, label: "12 por página" },
                        { value: 24, label: "24 por página" },
                        { value: 48, label: "48 por página" },
                      ]}
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                    />

                    {/* Sort */}
                    <Select
                      options={[
                        { value: "default", label: "Ordenar por" },
                        { value: "name", label: "Nombre A-Z" },
                        { value: "price-low", label: "Precio: Menor a Mayor" },
                        { value: "price-high", label: "Precio: Mayor a Menor" },
                        { value: "rating", label: "Mejor Valorados" },
                        { value: "stock", label: "Más Stock" },
                      ]}
                      value={sortOption}
                      onChange={handleSortChange}
                    />
                  </div>
                </div>
              </Card>

              {/* Products Grid/List */}
              {loading ? (
                <Card padding="lg" className="text-center">
                  <Loader
                    size="lg"
                    variant="spinner"
                    text="Cargando productos..."
                    className="mb-4"
                  />
                  <p className="text-secondary-600 dark:text-secondary-300">
                    Obteniendo información de productos...
                  </p>
                </Card>
              ) : filteredProducts.length === 0 ? (
                <Card padding="lg" className="text-center">
                  <div className="text-secondary-400 dark:text-secondary-500 text-6xl mb-4">
                    🔍
                  </div>
                  <Heading level={3} className="mb-2">
                    No se encontraron productos
                  </Heading>
                  <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                    Intenta ajustar los filtros o términos de búsqueda
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    <Icon name="FiRefreshCw" size="sm" className="mr-2" />
                    Limpiar Filtros
                  </Button>
                </Card>
              ) : (
                <>
                  <div
                    className={clsx(
                      "grid gap-3 sm:gap-4 md:gap-6",
                      viewMode === "grid" // Optimizado para móvil
                        ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                    )}
                  >
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        viewMode={viewMode}
                        showSpecs={viewMode === "list"}
                      />
                    ))}
                  </div>

                  {/* Paginación */}
                  {filteredProducts.length > 0 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredProducts.length}
                        itemsPerPage={itemsPerPage}
                        itemsPerPageOptions={[6, 12, 24, 48]}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        showItemsPerPage={false}
                        showInfo={true}
                        className="justify-center"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Catalog;
