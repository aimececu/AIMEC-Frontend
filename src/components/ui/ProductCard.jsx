import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import ImageWithFallback from "./ImageWithFallback";
import { useCart } from "../../context/CartContext";
import clsx from "clsx";

const ProductCard = ({
  product,
  className = "",
  showActions = true,
  viewMode = "grid", // 'grid' o 'list'
  showSpecs = false, // Mostrar especificaciones técnicas
  ...props
}) => {
  const {
    name,
    description,
    price,
    main_image,
    category,
    brand,
    stock_quantity,
    potencia_kw,
    voltaje,
    frame_size,
    corriente,
    comunicacion,
    alimentacion,
  } = product;
  const { addToCart, isInCart } = useCart();

  const handleAddToQuotation = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Vista de lista
  if (viewMode === "list") {
    return (
      <div
        className={clsx(
          "bg-white dark:bg-secondary-800 rounded-lg shadow-md border border-secondary-200 dark:border-secondary-700 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group cursor-pointer",
          className
        )}
        {...props}
      >
        <Link to={`/producto/${product.id}`} className="flex">
          {/* Product Image - Adaptable en vista lista */}
          <div className="relative w-40 aspect-square flex-shrink-0 bg-secondary-100 dark:bg-secondary-700 overflow-hidden">
            <ImageWithFallback
              src={main_image}
              alt={name}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Product Info - Expandido en vista lista */}
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              {/* Brand and Category */}
              <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-secondary-400 dark:text-secondary-400 bg-secondary-200 dark:bg-secondary-800 px-2 py-1 rounded-full">
                    {brand?.name || "Sin marca"}
                  </span>
                  <span className="text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                    {category?.name || "Sin categoría"}
                  </span>
                </div>
              </div>

              {/* Product Name */}
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 truncate mb-2">
                {name}
              </h3>

              {/* Description - Más espacio en vista lista */}
              <p className="text-sm text-secondary-600 dark:text-secondary-300 line-clamp-2 mb-2">
                {description}
              </p>

              {/* Technical Specifications */}
              {showSpecs && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {potencia_kw && (
                    <div className="text-xs">
                      <span className="text-secondary-500 dark:text-secondary-400">Potencia:</span>
                      <span className="ml-1 font-medium text-secondary-700 dark:text-secondary-300">
                        {potencia_kw} kW
                      </span>
                    </div>
                  )}
                  {voltaje && (
                    <div className="text-xs">
                      <span className="text-secondary-500 dark:text-secondary-400">Voltaje:</span>
                      <span className="ml-1 font-medium text-secondary-700 dark:text-secondary-300">
                        {voltaje}
                      </span>
                    </div>
                  )}
                  {frame_size && (
                    <div className="text-xs">
                      <span className="text-secondary-500 dark:text-secondary-400">Frame:</span>
                      <span className="ml-1 font-medium text-secondary-700 dark:text-secondary-300">
                        {frame_size}
                      </span>
                    </div>
                  )}
                  {corriente && (
                    <div className="text-xs">
                      <span className="text-secondary-500 dark:text-secondary-400">Corriente:</span>
                      <span className="ml-1 font-medium text-secondary-700 dark:text-secondary-300">
                        {corriente} A
                      </span>
                    </div>
                  )}
                  {comunicacion && (
                    <div className="text-xs">
                      <span className="text-secondary-500 dark:text-secondary-400">Comunicación:</span>
                      <span className="ml-1 font-medium text-secondary-700 dark:text-secondary-300">
                        {comunicacion}
                      </span>
                    </div>
                  )}
                  {alimentacion && (
                    <div className="text-xs">
                      <span className="text-secondary-500 dark:text-secondary-400">Alimentación:</span>
                      <span className="ml-1 font-medium text-secondary-700 dark:text-secondary-300">
                        {alimentacion}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  ${(parseFloat(price) || 0).toFixed(2)}
                </span>
              </div>

              {showActions && (
                <button
                  onClick={handleAddToQuotation}
                  className={clsx(
                    "px-4 py-2 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2 whitespace-nowrap flex-shrink-0",
                    isInCart(product.id)
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-primary-600 hover:bg-primary-700"
                  )}
                >
                  <Icon
                    name={isInCart(product.id) ? "FiCheck" : "FiShoppingCart"}
                    size="sm"
                  />
                  {isInCart(product.id)
                    ? "En Cotización"
                    : "Agregar a Cotización"}
                </button>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Vista de grid (por defecto)
  return (
    <div
      className={clsx(
        "bg-white dark:bg-secondary-800 rounded-lg shadow-md border border-secondary-200 dark:border-secondary-700 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group cursor-pointer",
        className
      )}
      {...props}
    >
      <Link to={`/producto/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square bg-secondary-100 dark:bg-secondary-700">
          <ImageWithFallback
            src={main_image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 min-w-0">
          {/* Category, Brand and Series */}
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-secondary-400 dark:text-secondary-400 bg-secondary-200 dark:bg-secondary-800 px-2 py-1 rounded-full">
                {brand?.name || "Sin marca"}
              </span>
              <span className="text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                {category?.name || "Sin categoría"}
              </span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2 min-h-[2.5rem] mb-2">
            {name}
          </h3>

          {/* Description */}
          <p className="text-xs text-secondary-600 dark:text-secondary-300 mb-3 line-clamp-2 min-h-[2rem]">
            {description}
          </p>

          {/* Technical Specifications */}
          {showSpecs && (
            <div className="grid grid-cols-1 gap-1 mb-3">
              {potencia_kw && (
                <div className="text-xs">
                  <span className="text-secondary-500 dark:text-secondary-400">Potencia:</span>
                  <span className="ml-1 font-medium text-secondary-700 dark:text-secondary-300">
                    {potencia_kw} kW
                  </span>
                </div>
              )}
              {voltaje && (
                <div className="text-xs">
                  <span className="text-secondary-500 dark:text-secondary-400">Voltaje:</span>
                  <span className="ml-1 font-medium text-secondary-700 dark:text-secondary-300">
                    {voltaje}
                  </span>
                </div>
              )}
              {frame_size && (
                <div className="text-xs">
                  <span className="text-secondary-500 dark:text-secondary-400">Frame:</span>
                  <span className="ml-1 font-medium text-secondary-700 dark:text-secondary-300">
                    {frame_size}
                  </span>
                </div>
              )}
              {corriente && (
                <div className="text-xs">
                  <span className="text-secondary-500 dark:text-secondary-400">Corriente:</span>
                  <span className="ml-1 font-medium text-secondary-700 dark:text-secondary-300">
                    {corriente} A
                  </span>
                </div>
              )}
              {comunicacion && (
                <div className="text-xs">
                  <span className="text-secondary-500 dark:text-secondary-400">Comunicación:</span>
                  <span className="ml-1 font-medium text-secondary-700 dark:text-secondary-300">
                    {comunicacion}
                  </span>
                </div>
              )}
              {alimentacion && (
                <div className="text-xs">
                  <span className="text-secondary-500 dark:text-secondary-400">Alimentación:</span>
                  <span className="ml-1 font-medium text-secondary-700 dark:text-secondary-300">
                    {alimentacion}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Stock Status */}
          {/* <div className="flex items-center gap-2 mb-3">
            <span
              className={clsx(
                "text-xs px-2 py-1 rounded-full whitespace-nowrap",
                stock_quantity > 10
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : stock_quantity > 0
                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                  : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
              )}
            >
              {stock_quantity > 0 ? `${stock_quantity} en stock` : "Sin stock"}
            </span>
          </div> */}

          {/* Price and Actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col items-baseline gap-0 flex-shrink-0">
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                ${price || "0.00"}
              </span>
            </div>

            {showActions && (
              <button
                onClick={handleAddToQuotation}
                className={clsx(
                  "px-3 py-1.5 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center gap-1 whitespace-nowrap flex-shrink-0",
                  isInCart(product.id)
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-primary-600 hover:bg-primary-700"
                )}
              >
                <Icon
                  name={isInCart(product.id) ? "FiCheck" : "FiShoppingCart"}
                  size="xs"
                />
                {isInCart(product.id) ? "Agregado" : "Cotizar"}
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
