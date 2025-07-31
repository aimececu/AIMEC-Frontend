import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiFilter, FiGrid, FiList, FiStar } from "react-icons/fi";
import ProductCard from "../../components/ui/ProductCard";
import clsx from "clsx";

const Catalog = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Datos de ejemplo
  const categories = [
    { id: "electronics", name: "Electrónicos", count: 45 },
    { id: "mechanical", name: "Mecánicos", count: 32 },
    { id: "automation", name: "Automatización", count: 28 },
    { id: "sensors", name: "Sensores", count: 56 },
    { id: "controllers", name: "Controladores", count: 23 },
    { id: "actuators", name: "Actuadores", count: 19 },
  ];

  const brands = [
    { id: "siemens", name: "Siemens", count: 15 },
    { id: "allen-bradley", name: "Allen-Bradley", count: 12 },
    { id: "schneider", name: "Schneider Electric", count: 18 },
    { id: "omron", name: "Omron", count: 8 },
    { id: "mitsubishi", name: "Mitsubishi", count: 10 },
  ];

  const products = [
    {
      id: 1,
      name: "Controlador PLC Siemens S7-1200",
      description:
        "Controlador lógico programable de alta precisión para automatización industrial",
      price: 1299.99,
      originalPrice: 1499.99,
      image: "https://via.placeholder.com/300x300?text=PLC+S7-1200",
      category: "controllers",
      brand: "siemens",
      rating: 4.8,
      inStock: true,
    },
    {
      id: 2,
      name: "Sensor de Temperatura RTD PT100",
      description:
        "Sensor de resistencia térmica de alta precisión para medición de temperatura",
      price: 89.99,
      image: "https://via.placeholder.com/300x300?text=RTD+PT100",
      category: "sensors",
      brand: "omron",
      rating: 4.6,
      inStock: true,
    },
    {
      id: 3,
      name: 'HMI Touch Screen 7"',
      description:
        "Panel de operador táctil resistivo con interfaz gráfica avanzada",
      price: 599.99,
      image: "https://via.placeholder.com/300x300?text=HMI+7inch",
      category: "automation",
      brand: "allen-bradley",
      rating: 4.5,
      inStock: true,
    },
    {
      id: 4,
      name: "Servomotor AC 1kW",
      description:
        "Motor servo de corriente alterna de alta precisión y torque",
      price: 899.99,
      image: "https://via.placeholder.com/300x300?text=Servo+1kW",
      category: "mechanical",
      brand: "mitsubishi",
      rating: 4.7,
      inStock: false,
    },
    {
      id: 5,
      name: "Válvula Solenoide 3/2",
      description: "Válvula neumática de tres vías y dos posiciones",
      price: 45.99,
      image: "https://via.placeholder.com/300x300?text=Valve+3-2",
      category: "actuators",
      brand: "schneider",
      rating: 4.3,
      inStock: true,
    },
    {
      id: 6,
      name: "Convertidor de Frecuencia 5.5kW",
      description: "Inversor de frecuencia para control de motores AC",
      price: 749.99,
      image: "https://via.placeholder.com/300x300?text=VFD+5.5kW",
      category: "electronics",
      brand: "siemens",
      rating: 4.9,
      inStock: true,
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 ">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-2">
            Catálogo de Productos
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Descubre nuestra amplia gama de componentes industriales
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
                <FiFilter className="w-5 h-5" />
                Filtros
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Categorías
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-secondary-700 dark:text-secondary-300">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Marcas
                </label>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="brand"
                          value={brand.id}
                          checked={selectedBrand === brand.id}
                          onChange={(e) => setSelectedBrand(e.target.value)}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-secondary-700 dark:text-secondary-300">
                          {brand.name}
                        </span>
                      </div>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                        {brand.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Rango de Precio
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-secondary-500 dark:text-secondary-400">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedBrand("");
                  setPriceRange([0, 10000]);
                }}
                className="w-full px-4 py-2 bg-secondary-200 dark:bg-secondary-700 text-secondary-800 dark:text-white rounded-lg hover:bg-secondary-300 dark:hover:bg-secondary-600 transition-colors duration-200"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-secondary-600 dark:text-secondary-300">
                  {filteredProducts.length} productos encontrados
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-600 dark:text-secondary-300">
                    Vista:
                  </span>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={clsx(
                      "p-2 rounded-lg transition-colors duration-200",
                      viewMode === "grid"
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                        : "bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600"
                    )}
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={clsx(
                      "p-2 rounded-lg transition-colors duration-200",
                      viewMode === "list"
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                        : "bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600"
                    )}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div
                className={clsx(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-secondary-400 dark:text-secondary-500 text-6xl mb-4">
                  🔍
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
