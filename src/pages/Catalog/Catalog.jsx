import React, { useState, useEffect } from "react";
import Icon from "../../components/ui/Icon";
import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import ProductCard from "../../components/ui/ProductCard";
import Loader from "../../components/ui/Loader";
import { productEndpoints } from "../../api/endpoints/products.js";
import { categoryEndpoints } from "../../api/endpoints/categories.js";
import { brandEndpoints } from "../../api/endpoints/brands.js";
import clsx from "clsx";

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [selectedSeries, setSelectedSeries] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' o 'list'
  const [sortOption, setSortOption] = useState("default");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde la base de datos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
        productEndpoints.getProducts(),
        categoryEndpoints.getCategories(),
        brandEndpoints.getBrands()
      ]);

      console.log({productsResponse, categoriesResponse, brandsResponse});
      
      // Usar directamente los datos del backend sin transformaciones
      if (productsResponse.success) {
        const productsData = productsResponse.data.products || productsResponse.data || [];
        console.log('Productos recibidos:', productsData);
        console.log('Primer producto:', productsData[0]);
        console.log('Subcategoría del primer producto:', productsData[0]?.subcategory);
        setProducts(productsData);
        
        // Extraer series únicas de los productos (si existen)
        const uniqueSeries = [...new Set(productsData.map(product => product.series).filter(Boolean))];
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
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener subcategorías de la categoría seleccionada
  const getSubcategories = () => {
    if (selectedCategory === "all") return [];
    const category = categories.find(cat => cat.id === parseInt(selectedCategory));
    // Las subcategorías vienen directamente del backend, no anidadas
    return category ? (category.subcategories || []) : [];
  };

  // Obtener series de la categoría seleccionada
  const getSeries = () => {
    if (selectedCategory === "all") return series;
    // Las series no están anidadas por categoría en el modelo del backend
    return series;
  };

  const subcategories = getSubcategories();
  const availableSeries = getSeries();

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.series && product.series.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || product.category_id === parseInt(selectedCategory);
      const matchesSubcategory = selectedSubcategory === "all" || product.subcategory_id === parseInt(selectedSubcategory);
      const matchesSeries = selectedSeries === "all" || product.series === selectedSeries;
      const matchesBrand = selectedBrand === "all" || product.brand_id === parseInt(selectedBrand);
      
      return matchesSearch && matchesCategory && matchesSubcategory && matchesSeries && matchesBrand;
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
               Soluciones de automatización industrial de alta calidad de las mejores marcas
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
                    onChange={(value) => setSearchTerm(value)}
                    placeholder="Nombre, descripción..."
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
                       ...brands.map(brand => ({
                         value: brand.id,
                         label: brand.name
                       }))
                     ]}
                     value={selectedBrand}
                     onChange={setSelectedBrand}
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
                       ...categories.map(cat => ({
                         value: cat.id,
                         label: cat.name
                       }))
                     ]}
                     value={selectedCategory}
                     onChange={setSelectedCategory}
                   />
                 </div>

                {/* Subcategory Filter */}
                {subcategories.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Subcategoría
                    </label>
                    <Select
                      options={[
                        { value: "all", label: "Todas las subcategorías" },
                        ...subcategories.map(sub => ({
                          value: sub.id,
                          label: sub.name
                        }))
                      ]}
                      value={selectedSubcategory}
                      onChange={setSelectedSubcategory}
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
                        ...series.map(s => ({
                          value: s.id,
                          label: s.name
                        }))
                      ]}
                      value={selectedSeries}
                      onChange={setSelectedSeries}
                    />
                  </div>
                )}

                                 {/* Clear Filters */}
                 {(selectedCategory !== "all" || selectedSubcategory !== "all" || selectedSeries !== "all" || selectedBrand !== "all" || searchTerm) && (
                                     <Button
                     variant="outline"
                     size="sm"
                     fullWidth
                     onClick={() => {
                       setSelectedCategory("all");
                       setSelectedSubcategory("all");
                       setSelectedSeries("all");
                       setSelectedBrand("all");
                       setSearchTerm("");
                     }}
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
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex-1 text-secondary-600 dark:text-secondary-300 text-sm">
                    Mostrando {filteredProducts.length} productos
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort */}
                    <Select
                      options={[
                        { value: "default", label: "Ordenar por" },
                        { value: "name", label: "Nombre A-Z" },
                        { value: "price-low", label: "Precio: Menor a Mayor" },
                        { value: "price-high", label: "Precio: Mayor a Menor" },
                        { value: "rating", label: "Mejor Valorados" },
                        { value: "stock", label: "Más Stock" }
                      ]}
                      value={sortOption}
                      onChange={setSortOption}
                      className="w-48"
                    />

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-secondary-100 dark:bg-secondary-700 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
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
                        onClick={() => setViewMode("list")}
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
                                     <Button
                     variant="outline"
                     onClick={() => {
                       setSelectedCategory("all");
                       setSelectedSubcategory("all");
                       setSelectedSeries("all");
                       setSelectedBrand("all");
                       setSearchTerm("");
                     }}
                   >
                     <Icon name="FiRefreshCw" size="sm" className="mr-2" />
                     Limpiar Filtros
                   </Button>
                </Card>
              ) : (
                <div
                  className={clsx(
                    "grid gap-6",
                    viewMode === "grid" // Ajuste para 4 columnas en 2xl
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                      : "grid-cols-1"
                  )}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                      showSpecs={viewMode === 'list'}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Catalog;
