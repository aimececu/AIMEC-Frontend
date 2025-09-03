import React, { useState, useEffect } from "react";
import { useRelatedProducts } from "../../hooks/useRelatedProducts";
import { useProducts } from "../../hooks/useProducts";
import { Link } from "react-router-dom";
import ImageWithFallback from "../ui/ImageWithFallback";
import Loader from "../ui/Loader";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import ProductCarousel from "../ui/ProductCarousel";
import { useCart } from "../../context/CartContext";
import clsx from "clsx";

const RelatedProductsSection = ({ productId }) => {
  const { relatedProducts, loading, error } = useRelatedProducts(productId);
  const { products, loadProducts } = useProducts();
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Cargar productos cuando el componente se monte
  useEffect(() => {
    if (products.length === 0) {
      loadProducts();
    }
  }, [products.length, loadProducts]);

  // Agrupa los productos relacionados por tipo de relación
  const groupedRelatedProducts = relatedProducts.reduce((groups, product) => {
    const type = product.relationshipType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(product);
    return groups;
  }, {});

  const handleAddToCart = (product) => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader size="lg" />
        <span className="ml-3 text-secondary-600 dark:text-secondary-400">
          Cargando productos relacionados...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Icon
          name="FiAlertCircle"
          className="mx-auto text-4xl text-secondary-400 mb-4"
        />
        <p className="text-secondary-600 dark:text-secondary-400">
          Error al cargar productos relacionados: {error}
        </p>
      </div>
    );
  }

  if (Object.keys(groupedRelatedProducts).length === 0) {
    return (
      <div className="text-center py-8">
        <Icon
          name="FiLink"
          className="mx-auto text-4xl text-secondary-400 mb-4"
        />
        <p className="text-secondary-600 dark:text-secondary-400">
          No hay productos relacionados disponibles para este producto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header principal */}
      <div className="flex items-center gap-3 mb-6">
        <Icon 
          name="FiLink" 
          className="text-primary-600 dark:text-primary-400 text-2xl" 
        />
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Productos Relacionados
        </h2>
        <span className="text-sm text-secondary-500 dark:text-secondary-400">
          ({relatedProducts.length} producto{relatedProducts.length !== 1 ? 's' : ''} en {Object.keys(groupedRelatedProducts).length} categoría{Object.keys(groupedRelatedProducts).length !== 1 ? 's' : ''})
        </span>
      </div>

      {/* Grupos de productos relacionados */}
      {Object.entries(groupedRelatedProducts).map(([relationshipType, products]) => (
        <div key={relationshipType} className="space-y-4">
          {/* Header del grupo */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
              {relationshipType.charAt(0).toUpperCase() + relationshipType.slice(1)}
            </span>
            <span className="text-secondary-600 dark:text-secondary-400 text-sm">
              {products.length} producto{products.length !== 1 ? "s" : ""} relacionado{products.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Carrusel de productos del grupo */}
          <ProductCarousel
            itemsPerView={4}
            showNavigation={products.length > 4}
          >
            {products.map((relatedProduct) => {
              const product = relatedProduct.relatedProduct;

              return (
                <div
                  key={relatedProduct.id}
                  className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col"
                >
                  {/* Imagen del producto */}
                  <div className="aspect-square bg-secondary-100 dark:bg-secondary-700 overflow-hidden">
                    <Link to={`/producto/${product.id}`}>
                      <ImageWithFallback
                        src={product.main_image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </Link>
                  </div>

                  {/* Información del producto */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    {/* Nombre del producto */}
                    <Link to={`/producto/${product.id}`}>
                      <h3 className="font-medium text-secondary-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* SKU */}
                    <span className="text-xs text-secondary-500 dark:text-secondary-400 font-mono">
                      SKU: {product.sku}
                    </span>

                    {/* Precio */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        ${(parseFloat(product.price) || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Botones en la parte inferior */}
                    <div className="mt-auto space-y-2">
                      {/* Botón de agregar al carrito */}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        fullWidth
                        size="sm"
                        disabled={product.stock_quantity === 0}
                        className={clsx(
                          isInCart(product.id) && "bg-green-600 hover:bg-green-700"
                        )}
                      >
                        <Icon
                          name={isInCart(product.id) ? "FiCheck" : "FiShoppingCart"}
                          className="mr-2"
                          size="sm"
                        />
                        {isInCart(product.id)
                          ? "Agregado a Cotización"
                          : "Agregar a Cotización"}
                      </Button>

                      {/* Botón de ver detalles */}
                      <Button
                        as={Link}
                        to={`/producto/${product.id}`}
                        variant="outline"
                        fullWidth
                        size="sm"
                      >
                        <Icon name="FiEye" className="mr-2" size="sm" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </ProductCarousel>
        </div>
      ))}
    </div>
  );
};

export default RelatedProductsSection;
