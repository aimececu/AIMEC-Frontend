import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, ImageWithFallback } from './components';
import { useCart } from '../../context/CartContext';
import clsx from 'clsx';

const ProductCard = ({ 
  product, 
  className = '', 
  showActions = true,
  viewMode = 'grid', // 'grid' o 'list'
  showSpecs = false, // Mostrar especificaciones técnicas
  ...props 
}) => {
  const { name, description, price, image, rating, category, brand, series, stock, specifications, accessories, relatedProducts } = product;
  const { addToCart, isInCart } = useCart();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="FiStar" size="sm" className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="FiStar" size="sm" className="text-yellow-400 fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="FiStar" size="sm" className="text-secondary-300" />
      );
    }

    return stars;
  };

  const handleAddToQuotation = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Vista de lista
  if (viewMode === 'list') {
    return (
      <div 
        className={clsx(
          'bg-white dark:bg-secondary-800 rounded-lg shadow-md border border-secondary-200 dark:border-secondary-700 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
          className
        )}
        {...props}
      >
        <div className="flex">
          {/* Product Image - Más pequeña en vista lista */}
          <div className="relative w-32 h-32 flex-shrink-0 bg-secondary-100 dark:bg-secondary-700">
            <ImageWithFallback
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
            {showActions && (
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <Link
                  to={`/producto/${product.id}`}
                  className="p-1.5 bg-white dark:bg-secondary-800 rounded-full shadow-md hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                >
                  <Icon name="FiEye" size="xs" className="text-secondary-600 dark:text-secondary-300" />
                </Link>
                <button
                  onClick={handleAddToQuotation}
                  className={clsx(
                    "p-1.5 rounded-full shadow-md transition-colors duration-200",
                    isInCart(product.id)
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  )}
                >
                  <Icon 
                    name={isInCart(product.id) ? "FiCheck" : "FiShoppingCart"} 
                    size="xs" 
                  />
                </button>
              </div>
            )}
          </div>

          {/* Product Info - Expandido en vista lista */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              {/* Category, Brand and Series */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                    {category}
                  </span>
                  {series && (
                    <span className="text-xs text-secondary-500 dark:text-secondary-400 bg-primary-100 dark:bg-primary-900 px-2 py-1 rounded-full">
                      {series}
                    </span>
                  )}
                </div>
                <span className="text-xs text-secondary-500 dark:text-secondary-400">
                  {brand}
                </span>
              </div>

              {/* Product Name */}
              <Link 
                to={`/producto/${product.id}`}
                className="block mb-2"
              >
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                  {name}
                </h3>
              </Link>

              {/* Rating */}
              {rating && (
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(rating)}
                  <span className="text-sm text-secondary-500 dark:text-secondary-400 ml-1">
                    ({rating})
                  </span>
                </div>
              )}

              {/* Description - Más espacio en vista lista */}
              <p className="text-sm text-secondary-600 dark:text-secondary-300 line-clamp-2">
                {description}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mt-2">
                <span className={clsx(
                  "text-xs px-2 py-1 rounded-full",
                  stock > 10 
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : stock > 0
                    ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                )}>
                  {stock > 0 ? `${stock} en stock` : 'Sin stock'}
                </span>
              </div>

              {/* Quick Specs (if available) */}
              {showSpecs && specifications && Object.keys(specifications).length > 0 && (
                <div className="mt-2 text-xs text-secondary-500 dark:text-secondary-400">
                  {specifications.voltage && <div>Voltaje: {specifications.voltage}</div>}
                  {specifications.current && <div>Corriente: {specifications.current}</div>}
                  {specifications.power && <div>Potencia: {specifications.power}</div>}
                  {specifications.temperature && <div>Temperatura: {specifications.temperature}</div>}
                </div>
              )}
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  ${price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > price && (
                  <span className="text-base text-secondary-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {showActions && (
                <button
                  onClick={handleAddToQuotation}
                  className={clsx(
                    "px-4 py-2 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2",
                    isInCart(product.id)
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-primary-600 hover:bg-primary-700"
                  )}
                >
                  <Icon 
                    name={isInCart(product.id) ? "FiCheck" : "FiShoppingCart"} 
                    size="sm" 
                  />
                  {isInCart(product.id) ? "En Cotización" : "Agregar a Cotización"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de grid (por defecto)
  return (
    <div 
      className={clsx(
        'bg-white dark:bg-secondary-800 rounded-lg shadow-md border border-secondary-200 dark:border-secondary-700 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-secondary-100 dark:bg-secondary-700">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {showActions && (
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Link
              to={`/producto/${product.id}`}
              className="p-2 bg-white dark:bg-secondary-800 rounded-full shadow-md hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
            >
              <Icon name="FiEye" size="sm" className="text-secondary-600 dark:text-secondary-300" />
            </Link>
            <button
              onClick={handleAddToQuotation}
              className={clsx(
                "p-2 rounded-full shadow-md transition-colors duration-200",
                isInCart(product.id)
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              )}
            >
              <Icon 
                name={isInCart(product.id) ? "FiCheck" : "FiShoppingCart"} 
                size="sm" 
              />
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category, Brand and Series */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
              {category}
            </span>
            {series && (
              <span className="text-xs text-secondary-500 dark:text-secondary-400 bg-primary-100 dark:bg-primary-900 px-2 py-1 rounded-full">
                {series}
              </span>
            )}
          </div>
          <span className="text-xs text-secondary-500 dark:text-secondary-400">
            {brand}
          </span>
        </div>

        {/* Product Name */}
        <Link 
          to={`/producto/${product.id}`}
          className="block mb-2"
        >
          <h3 className="text-sm font-semibold text-secondary-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            {renderStars(rating)}
            <span className="text-xs text-secondary-500 dark:text-secondary-400 ml-1">
              ({rating})
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-secondary-600 dark:text-secondary-300 mb-3 line-clamp-2">
          {description}
        </p>

        {/* Stock Status */}
        <div className="flex items-center gap-2 mb-3">
          <span className={clsx(
            "text-xs px-2 py-1 rounded-full",
            stock > 10 
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : stock > 0
              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
          )}>
            {stock > 0 ? `${stock} en stock` : 'Sin stock'}
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              ${price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > price && (
              <span className="text-sm text-secondary-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {showActions && (
            <button
              onClick={handleAddToQuotation}
              className={clsx(
                "px-3 py-1.5 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center gap-1",
                isInCart(product.id)
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary-600 hover:bg-primary-700"
              )}
            >
              <Icon name={isInCart(product.id) ? "FiCheck" : "FiShoppingCart"} size="xs" />
              {isInCart(product.id) ? "Agregado" : "Cotizar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 