import React from "react";
import {
  Card,
  Input,
  Select,
  Button,
  Icon,
  ImageWithFallback,
} from "../../../components/ui/components";
import clsx from "clsx";

const ProductsList = ({
  products,
  categories,
  brands,
  filters,
  setFilters,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
}) => {
  // Debug logs
  // console.log("🔍 ProductsList recibió:", {
  //   productsCount: products.length,
  //   categoriesCount: categories.length,
  //   brandsCount: brands.length,
  //   filters,
  //   products: products.slice(0, 2), // Primeros 2 productos
  //   categories: categories.slice(0, 2), // Primeras 2 categorías
  //   brands: brands.slice(0, 2), // Primeras 2 marcas
  // });

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !filters.search ||
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(filters.search.toLowerCase());

    // Buscar la categoría por ID o nombre
    const matchesCategory =
      !filters.category ||
      product.category_id === parseInt(filters.category) ||
      product.category === filters.category;

    // Buscar la marca por ID o nombre
    const matchesBrand =
      !filters.brand ||
      product.brand_id === parseInt(filters.brand) ||
      product.brand === filters.brand;

    const matchesStock =
      filters.inStock === "" ||
      (filters.inStock === "true" && product.stock > 0) ||
      (filters.inStock === "false" && product.stock === 0);

    return matchesSearch && matchesCategory && matchesBrand && matchesStock;
  });

  // Debug log para filtros
  // console.log("🔍 Filtros aplicados:", {
  //   filters,
  //   filteredProductsCount: filteredProducts.length,
  //   originalProductsCount: products.length,
  // });

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(value) => setFilters({ ...filters, search: value })}
          />

          <Select
            value={filters.brand}
            onChange={(value) => setFilters({ ...filters, brand: value })}
            options={[
              { label: "Todas las marcas", value: "" },
              ...brands.map((brand) => ({
                label: brand.name,
                value: brand.id,
              })),
            ]}
          />

          <Select
            value={filters.category}
            onChange={(value) => setFilters({ ...filters, category: value })}
            options={[
              { label: "Todas las categorías", value: "" },
              ...categories.map((cat) => ({
                label: cat.name,
                value: cat.id,
              })),
            ]}
          />

          <Select
            value={filters.inStock}
            onChange={(value) => setFilters({ ...filters, inStock: value })}
            options={[
              { label: "Todo el stock", value: "" },
              { label: "En stock", value: "true" },
              { label: "Sin stock", value: "false" },
            ]}
          />
        </div>
      </Card>

      {/* Botón agregar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Productos ({filteredProducts.length})
        </h2>
        <Button onClick={onAddProduct} className="flex items-center gap-2">
          <Icon name="FiPlus" />
          Agregar Producto
        </Button>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col h-full"
          >
            {/* Contenido principal */}
            <div className="flex-1">
              {/* Header con imagen y acciones */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative flex-shrink-0">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg border border-secondary-200 dark:border-secondary-700"
                    fallbackSrc="/placeholder-product.jpg"
                  />
                  {/* Badge de stock */}
                  <div className="absolute -top-2 -right-2">
                    <span
                      className={clsx(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        product.stock > 10
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : product.stock > 0
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      )}
                    >
                      {product.stock > 0
                        ? `${product.stock} en stock`
                        : "Sin stock"}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-secondary-900 dark:text-white text-lg mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                    SKU: {product.sku}
                  </p>

                  {/* Tags de categoría y marca */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    <span className="text-xs text-secondary-500 dark:text-secondary-400 bg-primary-100 dark:bg-primary-900 px-2 py-1 rounded-full">
                      {product.brand}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de precio */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ${product.price?.toFixed(2) || "0.00"}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="text-lg text-secondary-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
              </div>

              {/* Descripción */}
              {product.description && (
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>

            {/* Acciones - siempre en la parte inferior */}
            <div className="flex items-center gap-2 pt-4 border-t border-secondary-200 dark:border-secondary-700 mt-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditProduct(product)}
                className="flex items-center gap-2 flex-1"
              >
                <Icon name="FiEdit" size="sm" />
                Editar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteProduct(product.id)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Icon name="FiTrash2" size="sm" />
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="p-12 text-center">
          <Icon
            name="FiPackage"
            className="text-6xl text-secondary-400 mx-auto mb-6"
          />
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            No se encontraron productos
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            No se encontraron productos que coincidan con los filtros aplicados.
          </p>
          <Button
            onClick={() =>
              setFilters({ search: "", brand: "", category: "", inStock: "" })
            }
            variant="outline"
          >
            Limpiar filtros
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ProductsList;
