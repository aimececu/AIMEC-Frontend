import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiEye } from 'react-icons/fi';
import clsx from 'clsx';

const ProductCard = ({ 
  product, 
  className = '', 
  showActions = true,
  ...props 
}) => {
  const { name, description, price, image, rating, category, brand } = product;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar key="half" className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FiStar key={`empty-${i}`} className="w-4 h-4 text-secondary-300" />
      );
    }

    return stars;
  };

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
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Producto';
          }}
        />
        {showActions && (
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button className="p-2 bg-white dark:bg-secondary-800 rounded-full shadow-md hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200">
              <FiEye className="w-4 h-4 text-secondary-600 dark:text-secondary-300" />
            </button>
            <button className="p-2 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-colors duration-200">
              <FiShoppingCart className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category and Brand */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
            {category}
          </span>
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
            <button className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-md hover:bg-primary-700 transition-colors duration-200 flex items-center gap-1">
              <FiShoppingCart className="w-3 h-3" />
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 