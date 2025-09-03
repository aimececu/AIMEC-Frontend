import React, { useState, useEffect } from "react";
import { useAccessories } from "../../hooks/useAccessories";
import { useProducts } from "../../hooks/useProducts";
import { Link } from "react-router-dom";
import ImageWithFallback from "../ui/ImageWithFallback";
import Loader from "../ui/Loader";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import ProductCarousel from "../ui/ProductCarousel";
import { useCart } from "../../context/CartContext";
import clsx from "clsx";

const AccessoriesSection = ({ productId }) => {
  const { accessories, loading, error } = useAccessories(productId);
  const { products, loadProducts } = useProducts();
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Cargar productos cuando el componente se monte
  useEffect(() => {
    if (products.length === 0) {
      loadProducts();
    }
  }, [products.length, loadProducts]);

  const handleAddToCart = (product) => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader size="lg" />
        <span className="ml-3 text-secondary-600 dark:text-secondary-400">
          Cargando accesorios...
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
          Error al cargar accesorios: {error}
        </p>
      </div>
    );
  }

  if (!accessories || accessories.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon
          name="FiPackage"
          className="mx-auto text-4xl text-secondary-400 mb-4"
        />
        <p className="text-secondary-600 dark:text-secondary-400">
          No hay accesorios disponibles para este producto.
        </p>
      </div>
    );
  }

  return (
    <ProductCarousel
      title="Accesorios Recomendados"
      subtitle={`${accessories.length} disponible${accessories.length !== 1 ? 's' : ''}`}
      icon="FiPackage"
      itemsPerView={4}
    >
      {accessories.map((accessory) => (
        <div
          key={accessory.id}
          className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col"
        >
          {/* Imagen del accesorio */}
          <div className="aspect-square bg-secondary-100 dark:bg-secondary-700 overflow-hidden">
            <Link to={`/producto/${accessory.accessoryProduct.id}`}>
              <ImageWithFallback
                src={accessory.accessoryProduct.main_image}
                alt={accessory.accessoryProduct.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Información del accesorio */}
          <div className="p-4 space-y-3 flex-1 flex flex-col">
            {/* Nombre del accesorio */}
            <Link to={`/producto/${accessory.accessoryProduct.id}`}>
              <h3 className="font-medium text-secondary-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                {accessory.accessoryProduct.name}
              </h3>
            </Link>

            {/* SKU */}
            <p className="text-xs text-secondary-500 dark:text-secondary-400 font-mono">
              SKU: {accessory.accessoryProduct.sku}
            </p>

            {/* Precio */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                ${(parseFloat(accessory.accessoryProduct.price) || 0).toFixed(2)}
              </span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  "text-xs px-2 py-1 rounded-full",
                  accessory.accessoryProduct.stock_quantity > 10
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : accessory.accessoryProduct.stock_quantity > 0
                    ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                )}
              >
                {accessory.accessoryProduct.stock_quantity > 0
                  ? `${accessory.accessoryProduct.stock_quantity} en stock`
                  : "Sin stock"}
              </span>
            </div>

            {/* Botones en la parte inferior */}
            <div className="mt-auto space-y-2">
              {/* Botón de agregar al carrito */}
              <Button
                onClick={() => handleAddToCart(accessory.accessoryProduct)}
                fullWidth
                size="sm"
                disabled={accessory.accessoryProduct.stock_quantity === 0}
                className={clsx(
                  isInCart(accessory.accessoryProduct.id) && "bg-green-600 hover:bg-green-700"
                )}
              >
                <Icon
                  name={isInCart(accessory.accessoryProduct.id) ? "FiCheck" : "FiShoppingCart"}
                  className="mr-2"
                  size="sm"
                />
                {isInCart(accessory.accessoryProduct.id)
                  ? "Agregado a Cotización"
                  : "Agregar a Cotización"}
              </Button>

              {/* Botón de ver detalles */}
              <Button
                as={Link}
                to={`/producto/${accessory.accessoryProduct.id}`}
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
      ))}
    </ProductCarousel>
  );
};

export default AccessoriesSection;
